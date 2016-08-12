import firebase from 'firebase';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';

import { MessageType } from '../types';

const config = {
  apiKey: "AIzaSyDUGgHesSALxeaKYH_qyt-NxPndMgD6MVI",
  authDomain: "friendlychat-d014b.firebaseapp.com",
  databaseURL: "https://friendlychat-d014b.firebaseio.com",
  storageBucket: "friendlychat-d014b.appspot.com",
};

const LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';


export class FirebaseController {
  private auth: firebase.auth.Auth;
  private database: firebase.database.Database;
  private storage: firebase.storage.Storage;
  private messagesRef: firebase.database.Reference;
  private authSubject$: Subject<firebase.User | null>;
  private messages: MessageType[] = [];
  private messagesSubject$: Subject<MessageType[]>;
  private stableInformSubject$: Subject<boolean>;


  constructor() {
    firebase.initializeApp(config);

    this.authSubject$ = new BehaviorSubject<firebase.User | null>(null);
    this.messagesSubject$ = new ReplaySubject<MessageType[]>();
    this.stableInformSubject$ = new ReplaySubject<boolean>();

    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) { // User is signed in!
        this.authSubject$.next(user);
      } else { // User is signed out!
        this.authSubject$.next(null);
      }
    });

    this.messagesRef = this.database.ref('messages');
  }

  signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
  };

  signOut() {
    // Sign out of Firebase.
    this.auth.signOut();
  };

  checkSignedInWithMessage() {
    // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
      return true;
    }
    // Display a message to the user using a Toast.
    var data = {
      message: 'You must sign-in first',
      timeout: 2000
    };
    // this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
  };

  saveMessage(message: string) {
    if (message && this.checkSignedInWithMessage()) {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        // Add a new message entry to the Firebase Database.
        this.messagesRef.push({
          name: currentUser.displayName,
          text: message,
          photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then(() => {
          this.stableInformSubject$.next(true);
        }).catch((error) => {
          console.error('Error writing new message to Firebase Database', error);
        });
      }
    }
  }

  saveImageMessage(event) {
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    // this.imageForm.reset();

    // Check if the file is an image.
    // if (!file.type.match('image.*')) {
    //   var data = {
    //     message: 'You can only share images',
    //     timeout: 2000
    //   };
    //   this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    //   return;
    // }

    // Check if the user is signed-in
    if (this.checkSignedInWithMessage()) {
      // We add a message with a loading icon that will get updated with the shared image.
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        this.messagesRef.push({
          name: currentUser.displayName,
          imageUrl: LOADING_IMAGE_URL,
          photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then((data) => {
          // Upload the image to Firebase Storage.
          const uploadTask = this.storage.ref(currentUser.uid + '/' + Date.now() + '/' + file.name)
            .put(file, { 'contentType': file.type });
          // Listen for upload completion.
          uploadTask.on('state_changed', null, (error) => {
            console.error('There was an error uploading a file to Firebase Storage:', error);
          }, () => {
            // Get the file's Storage URI and update the chat message placeholder.
            var filePath = uploadTask.snapshot.metadata.fullPath;
            data.update({ imageUrl: this.storage.ref(filePath).toString() });
          });
        });
      }
    }
  };

  setImageUrl(imageUrl: string) {
    // If the image is a Firebase Storage URI we fetch the URL.
    // if (imageUri.startsWith('gs://')) {
    //   imgElement.src = LOADING_IMAGE_URL; // Display a loading image first.
    //   this.storage.refFromURL(imageUri).getMetadata().then(function (metadata) {
    //     imgElement.src = metadata.downloadURLs[0];
    //   });
    // } else {
    //   imgElement.src = imageUri;
    // }
    return new Promise<string>((resolve, reject) => {
      this.storage.refFromURL(imageUrl).getMetadata().then((metadata) => {
        resolve(metadata.downloadURLs[0]);
      });
    });
  };


  loadMessages() {
    this.messages = [];
    // Reference to the /messages/ database path.
    // this.messagesRef = this.database.ref('messages');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    this.messagesRef.limitToLast(12).on('child_added', (data: firebase.database.DataSnapshot) => {
      const val = data.val() as MessageType;
      console.log(val);
      this.messages.push(val);
      this.messagesSubject$.next(this.messages);
      this.stableInformSubject$.next(true);
    });
    this.messagesRef.limitToLast(12).on('child_changed', (data: firebase.database.DataSnapshot) => {
      const val = data.val() as MessageType;
      this.messages.push(val);
      this.messagesSubject$.next(this.messages);
      this.stableInformSubject$.next(true);
    });
  };

  get currentUser$() { return this.authSubject$.asObservable(); }
  get messages$() { return this.messagesSubject$.asObservable(); }
  get stableInform$() { return this.stableInformSubject$.asObservable(); }
}
