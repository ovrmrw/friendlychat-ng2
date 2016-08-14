import firebase from 'firebase';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';
import lodash from 'lodash';

import { MessageType } from '../types';

const config = {
  apiKey: 'AIzaSyDUGgHesSALxeaKYH_qyt-NxPndMgD6MVI',
  authDomain: 'friendlychat-d014b.firebaseapp.com',
  databaseURL: 'https://friendlychat-d014b.firebaseio.com',
  storageBucket: 'friendlychat-d014b.appspot.com',
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
  private informStableSubject$: Subject<boolean>;


  constructor() {
    firebase.initializeApp(config);

    this.authSubject$ = new BehaviorSubject<firebase.User | null>(null);
    this.messagesSubject$ = new ReplaySubject<MessageType[]>();
    this.informStableSubject$ = new ReplaySubject<boolean>();

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


  saveMessage(message: string) {
    if (message) {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        // Add a new message entry to the Firebase Database.
        this.messagesRef.push({
          name: currentUser.displayName,
          text: message,
          photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        }).then(() => {
          this.informStableSubject$.next(true);
        }).catch((error) => {
          console.error('Error writing new message to Firebase Database', error);
        });
      }
    }
  }


  saveImageMessage(file: File) {
    if (file) {
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
            // .put(file, { 'contentType': file.type });
            .put(file);
          // Listen for upload completion.
          uploadTask.on('state_changed', null, (error) => {
            console.error('There was an error uploading a file to Firebase Storage:', error);
          }, () => {
            // Get the file's Storage URI and update the chat message placeholder.
            const filePath = uploadTask.snapshot.metadata.fullPath;
            data.update({ imageUrl: this.storage.ref(filePath).toString() });
          });
        });
      }
    }
  };


  setImageUrl(imageUrl: string): Observable<string> {
    // If the image is a Firebase Storage URI we fetch the URL.
    const subject = new BehaviorSubject<string>(imageUrl);

    if (imageUrl.startsWith('gs://')) {
      subject.next(LOADING_IMAGE_URL);
      this.storage.refFromURL(imageUrl).getMetadata().then((metadata) => {
        subject.next(metadata.downloadURLs[0]);
      });
    }

    return subject.asObservable();
  };


  loadMessages() {
    this.messages = [];
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    this.messagesRef.limitToLast(12).on('child_added', (snapshot: firebase.database.DataSnapshot) => {
      const message = lodash.defaultsDeep(snapshot.val(), { key: snapshot.key }) as MessageType;
      this.messages.push(message);
      this.messagesSubject$.next(this.messages);
      this.informStableSubject$.next(true);
    });
    this.messagesRef.limitToLast(12).on('child_changed', (snapshot: firebase.database.DataSnapshot) => {
      const message = lodash.defaultsDeep(snapshot.val(), { key: snapshot.key }) as MessageType;
      this.messages = lodash.reject(this.messages, { key: snapshot.key });
      this.messages.push(message);
      this.messagesSubject$.next(this.messages);
      this.informStableSubject$.next(true);
    });
  };


  get currentUser$() { return this.authSubject$.asObservable(); }
  get messages$() { return this.messagesSubject$.asObservable(); }
  get informStable$() { return this.informStableSubject$.asObservable(); }
}
