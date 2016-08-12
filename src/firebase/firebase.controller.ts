import firebase from 'firebase';
import { Observable, Subject, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';


const config = {
  apiKey: "AIzaSyDUGgHesSALxeaKYH_qyt-NxPndMgD6MVI",
  authDomain: "friendlychat-d014b.firebaseapp.com",
  databaseURL: "https://friendlychat-d014b.firebaseio.com",
  storageBucket: "friendlychat-d014b.appspot.com",
};


export class FirebaseController {
  private auth: firebase.auth.Auth;
  private database: firebase.database.Database;
  private storage: firebase.storage.Storage;
  private messagesRef: firebase.database.Reference;
  private authSubject$: Subject<firebase.User | null>;
  private messagesSubject$: Subject<any>;

  constructor() {
    firebase.initializeApp(config);

    this.authSubject$ = new BehaviorSubject<firebase.User | null>(null);
    this.messagesSubject$ = new ReplaySubject<any>();
    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();

    this.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) { // User is signed in!
        this.authSubject$.next(user);
        console.log('SING-IN');
      } else { // User is signed out!
        this.authSubject$.next(null);
        console.log('SING-OUT');
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
    console.log('saveMessage');
    // e.preventDefault();
    // Check that the user entered a message and is signed in.
    if (message && this.checkSignedInWithMessage()) {
      const currentUser = this.auth.currentUser;
      if (currentUser) {
        // Add a new message entry to the Firebase Database.
        this.messagesRef.push({
          name: currentUser.displayName,
          text: message,
          photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
        })
          .then(function () {
            // Clear message text field and SEND button state.
            // FriendlyChat.resetMaterialTextfield(this.messageInput);
            // this.toggleButton();
          })
          .catch(function (error) {
            console.error('Error writing new message to Firebase Database', error);
          });
      }
    }
  }

  loadMessages() {
    // Reference to the /messages/ database path.
    // this.messagesRef = this.database.ref('messages');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    // Loads the last 12 messages and listen for new ones.
    this.messagesRef.limitToLast(12).on('child_added', (data: firebase.database.DataSnapshot) => {
      const val = data.val();
      console.log(val);
      this.messagesSubject$.next(val);
    });
    this.messagesRef.limitToLast(12).on('child_changed', (data: firebase.database.DataSnapshot) => {
      const val = data.val();
      console.log(val);
      this.messagesSubject$.next(val);
    });
  };

  // setMessage(data: firebase.database.DataSnapshot) {
  //   console.log('setMessage')
  //   const val = data.val();
  //   console.log(val);
  //   this.messagesSubject$.next(val);
  // }


  get currentUser$() { return this.authSubject$.asObservable(); }
  get messages$() { return this.messagesSubject$.asObservable(); }
}