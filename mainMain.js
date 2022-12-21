// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, browserLocalPersistence,
    browserSessionPersistence,
    inMemoryPersistence } from 
"https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set, ref, update } 
from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYX1BCgVLKCy3SMFl88XxXG9ne-t1ub7U",
  authDomain: "absorb-284b3.firebaseapp.com",
  projectId: "absorb-284b3",
  storageBucket: "absorb-284b3.appspot.com",
  messagingSenderId: "180851909476",
  appId: "1:180851909476:web:bb263a466041a8bdbc5071",
  measurementId: "G-2QDJM7BV0H",
  databaseURL: "https://absorb-284b3-default-rtdb.firebaseio.com/"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getDatabase(app);

//current user stuff
var user = auth.currentUser;
auth.onAuthStateChanged(function(user) {
    if (user) {
      var user = auth.currentUser;
      if (currentView = 'firstPagescreen') {
        navigator('landingscreen', 'firstPagescreen');
      }
      
    } else {
      // No user is signed in.
    }
  });
  

//start navigation
var currentView = 'firstPagescreen'
const navigator = (shown, hidden) => {
    document.getElementById(shown).style.display='block';
    document.getElementById(hidden).style.display='none';
    currentView = shown

    
};

//start firstPage --------------------------------------------------------------------------
const firstPage = document.getElementById('firstPagescreen');

//if user is signed in, straight to landing page
if (user) {
    navigator("landingscreen", 'firstPagescreen');
}

const createAccountButton = document.getElementById("CreateAccountButton");
createAccountButton.addEventListener("click", function() {
    navigator('createaccountscreen','firstPagescreen');
});
const logInButton = document.getElementById('LogInButton');
logInButton.addEventListener("click", function() {
    navigator('loginscreen', 'firstPagescreen');
});




//start create account page ----------------------------------------------------------------
const createaccount = document.getElementById("createaccountscreen");
//set it to be invisible
createaccount.style.display='none';
const initCreateAccountPage = () => {
      //add listeners
      const entryForm = document.getElementById("createAccountForm");
      entryForm.addEventListener("submit", (event) => {
          event.preventDefault();
          //Collect user-inputted data
          var email = document.getElementById('newEmail').value;
          var password = document.getElementById("newPassword").value;
          //Register new user in Firebase
          createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
          const user = userCredential.user;
          const userId = user.uid;
          alert("Registration Successful!");
          //setup database
            set(ref(db, 'users/' + userId), {
                email: user.email
            });
          //Log new user in
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                //navigate to landing page
                navigator('landingscreen','createaccountscreen');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                alert(errorMessage);
            });  
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorMessage);
              alert(error);
          });
      });

     

  };

  initCreateAccountPage();

//Start Logging In Page ---------------------------------------------------------------------
const loginscreen = document.getElementById("loginscreen");
//initially set not to be diplayed
loginscreen.style.display="none";
 //Grabbing Log-in Information
 const entryForm = document.getElementById("LogInForm");
        entryForm.addEventListener("submit", (event) => {
            event.preventDefault();
            //Collect user-inputted data
            var email = document.getElementById('inputEmail').value;
            var password = document.getElementById("inputPassword").value;
            
            //send data to firebase auth
        
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user)
                navigator("landingscreen", "loginscreen");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                alert(errorMessage);
            });
        }); 

//Start Landing Page-------------------------------------------------------------------------
const landingpagescreen = document.getElementById("landingscreen");
//initially set not to be displayed
landingpagescreen.style.display="none"
//if user is logged in say 'sup' to them
auth.onAuthStateChanged(function(user) {
    if (user) {
        document.getElementsByClassName("pagetitle")[0].innerText =  "Account: " + user.email ;
    } 
  });
//sign out button
const signOutButton = document.getElementById("signOutButton");
signOutButton.addEventListener("click", function() {
    navigator("firstPagescreen", "landingscreen");
    signOut(auth);
});
        
        