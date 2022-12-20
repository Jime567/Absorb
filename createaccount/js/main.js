  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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
    measurementId: "G-2QDJM7BV0H"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth();


document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {  
      initApp();
      
    }
  });
  
  const initApp = () => {
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
            alert("Registration Successful!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                alert(error);
            });
        });

       

    };


const tester = () => {
    confirm("This is a test");
};