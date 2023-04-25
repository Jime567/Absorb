// Import the functions needed from firebase sdk's
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-analytics.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence
} from
  "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, set, onValue, get, ref, update, child, remove, push }
  from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// The web app's Firebase configuration
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
var data = null;
//current user stuff
auth.onAuthStateChanged(function (user) {
  if (user) {
    //sets the variable on the global scale
    globalThis.user = auth.currentUser;
    if (currentView = 'blankPage') {
      navigator('landingscreen', 'blankPage');
    }

     //get deckList from database and update it locally
     const dbref = ref(db);
     get(child(dbref,  "users/" + user.uid + '/deckList' )).then((snapshot)=> {
     if(snapshot.exists()) {
       data = snapshot.val();
       deckList = data;
       populateLists();
       }
     else {
       console.log("There is no data here")
     }
   });

  } else {
    // No user is signed in.
    navigator("firstPagescreen", "blankPage");
  }
});

//start navigation
var currentView = 'firstPagescreen'
const navigator = (shown, hidden) => {
  document.getElementById(hidden).style.display = 'none';
  document.getElementById(shown).style.display = 'block';
  currentView = shown;


};

//global variables
var deckList = ["Empty"];
var cardList = ["Empty"];
var definitionList = ["Empty"];
var currDeck = null;
var guest = false;

//start blankPage
const blankPage = document.getElementById("blankPage");


//start firstPage --------------------------------------------------------------------------
const firstPage = document.getElementById('firstPagescreen');
firstPage.style.display = 'none';

const createAccountButton = document.getElementById("CreateAccountButton");
createAccountButton.addEventListener("click", function () {
  navigator('createaccountscreen', 'firstPagescreen');
});
const logInButton = document.getElementById('LogInButton');
logInButton.addEventListener("click", function () {
  navigator('loginscreen', 'firstPagescreen');
});

//Guest Login Info
const guestButton = document.getElementById("guestButton");
guestButton.addEventListener("click", function () {
  signInGuest(); 
})

function signInGuest() {

  signInWithEmailAndPassword(auth, "guest@guest.guest", "guestguest")
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user)
    //navigate to landing page
    navigator('landingscreen', 'firstPagescreen');
    guest = true;
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
    alert(errorMessage);
  });

}


//start create account page ----------------------------------------------------------------
const createaccount = document.getElementById("createaccountscreen");
//set it to be invisible
createaccount.style.display = 'none';
const initCreateAccountPage = () => {
  //add listeners
  //back button 
  const backButtonCreate = document.getElementById("backButtonCreate");
  backButtonCreate.addEventListener("click", function () {
    navigator("firstPagescreen", "createaccountscreen");
  });
  //submitting the form
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
        //clear text entry fields
        document.getElementById('newEmail').value='';
        document.getElementById('newPassword').value='';
        //setup database
        set(ref(db, 'users/' + userId), {
          email: user.email,
          deckList: deckList
        });
        
        //Log new user in
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
            //navigate to landing page
            navigator('landingscreen', 'createaccountscreen');
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
loginscreen.style.display = "none";
//back button listener
const backButtonLogIn = document.getElementById("backButtonLogIn");
backButtonLogIn.addEventListener("click", function () {
  navigator("firstPagescreen", "loginscreen");
});
//Grabbing Log-in Information
const entryForm = document.getElementById("LogInForm");
entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  //Collect user-inputted data
  var email = document.getElementById('inputEmail').value;
  var password = document.getElementById("inputPassword").value;
  //clear data from entry fields
  document.getElementById('inputEmail').value ='';
  document.getElementById('inputPassword').value='';

  //send data to firebase auth
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      //get deckList data from firebase
          const dbref = ref(db);
          get(child(dbref,  "users/" + user.uid + '/deckList' )).then((snapshot)=> {
          if(snapshot.exists()) {
            data = snapshot.val();
            deckList = data;
            }
          else {
            console.log("There is no data here")
          }
        }); 

      //navigate to landing page
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
landingpagescreen.style.display = "none";
//puts the user's email up at the top of the landing page
auth.onAuthStateChanged(function (user) {
  if (user) {
    document.getElementsByClassName("pagetitle")[0].innerText = "Account: " + user.email;
    if (user.email == "guest@guest.guest") {
      document.getElementsByClassName("pagetitle")[0].innerText = "Absorb: Guest Mode";
      guest = true;
    }
  }
});
//sign out button
const signOutButton = document.getElementById("signOutButton");
signOutButton.addEventListener("click", function () {
  navigator("firstPagescreen", "landingscreen");
  signOut(auth);
  deleteContents();
  console.log(data);
  deleteGlobalVariables();

});
//Create Deck Screen
const createdeckscreen = document.getElementById("createdeckscreen");
createdeckscreen.style.display = 'none';
//create deck button
const createDeckButton = document.getElementById("createDeckButton");
createDeckButton.addEventListener("click", function () {
  //start create deck window
  createdeckscreen.style.display = 'block';
  createDeckButton.style.display = 'none';
});
const deckNameEntryForm = document.getElementById("newDeckNameInput");
const createDeckNameButton = document.getElementById("newDeckNameInputButton");

deckNameEntryForm.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    createDeckNameButton.click();
  }
});
createDeckNameButton.addEventListener("click", function () {
  //Collect user-inputted data
  var newDeckName = deckNameEntryForm.value;
  //clear the input
  deckNameEntryForm.value='';
  //add deck to database
  if (guest == true) {
    alert("Guest Editing Prohibited");
  }
  else {
    deckToDatabase(auth.currentUser.uid, newDeckName);
    deleteContents();
    populateLists();
  }
});

//populate list of decks
function populateLists() {
  
  if (deckList[0] == "Empty") {
    console.log("This user has no decks")
  }
  else {
    for (let i = 0; i < deckList.length; i++) {
      buildListItem(deckList[i]);
    }
  }
}

//populate list of decks in GUI
const buildListItem = (deckName) => {
  const isoContainer = document.createElement("div");
  isoContainer.className = "isoContainer";
  const div = document.createElement("div");
  div.className = "deckListDiv";
  const options = document.createElement("div");
  options.className = "options";

  //make a paragraph 
  const para = document.createElement("p");
  const node = document.createTextNode(deckName);
  para.appendChild(node);

  //make the study button
  const doer = document.createElement("button");
  doer.className = "doButton";
  doer.innerHTML = "Study";

  //study button functionality
   doer.onclick = function () {
    const dbref = ref(db);
    currDeck = deckName;
    //get the list of cards and check first to see if it is empty
    get(child(dbref,  "users/" + user.uid + '/' + convertToPath(deckName) + '/definitionList')).then((snapshot)=> {
      if(snapshot.exists()) {
        data = snapshot.val();
        definitionList = data;
        if (definitionList[0] == "Empty") {
          alert("No Cards to Study");
        }
        //if not empty, navigate on
        else {
          const studyHeader = document.getElementById("studyScreenHeader");
          studyHeader.innerHTML = (deckName);
          navigator('studyscreen', 'landingscreen');
          //get the card list
          get(child(dbref,  "users/" + user.uid + '/' + convertToPath(deckName) + "/cardList")).then((snapshot)=> {
          if(snapshot.exists()) {
            data = snapshot.val();
            cardList = data;
            startStudy();
            }
          else {
            console.log("There be no cards here")
            }
          });
        }
        }
      else {
        alert("No Cards to Study");
      }
    });
    
      
  }
  //make the delete button
  const deleter = document.createElement("button");
  deleter.className="deleteButton";
  deleter.innerHTML = "Delete";

  //make the edit button
  const editor = document.createElement("button");
  editor.className = "editButton";
  editor.innerHTML = "Edit";

  //edit button functionality
  editor.onclick = function () {
    
    navigator('editorscreen', 'landingscreen');
    const editHeader = document.getElementById('editScreenTitle')
    editHeader.innerHTML = deckName;
    currDeck = deckName;

    //get cardList from database and update it locally
    const dbref = ref(db);
    get(child(dbref,  "users/" + user.uid + '/' + deckName + '/cardList')).then((snapshot)=> {
    if(snapshot.exists()) {
      data = snapshot.val();
      cardList = data;
      }
    else {
      console.log("There be no cards here")
    }
  });

  //get definitionList from database and update it locally
  get(child(dbref,  "users/" + user.uid + '/' + deckName + '/definitionList')).then((snapshot)=> {
  if(snapshot.exists()) {
    data = snapshot.val();
    definitionList = data;
    populateCardLists();
    }
  else {
    console.log("There are no definitions for some reason")
  }
});
    
  };
  
  //delete button functionality
  deleter.onclick = function () {
    if (guest == false) {
      deleteDeck(user.uid, deckName);
    }
    else {
      alert("Guest Editing Prohibited")
    }
  };
  
  //add individual section to parent div
  div.appendChild(para);

  options.appendChild(editor);
  options.appendChild(doer);
  options.appendChild(deleter);
  div.appendChild(options);
  const container = document.getElementById("listFlashcards");
  isoContainer.appendChild(div);
  container.appendChild(isoContainer);
};



//Clear list in GUI
const deleteContents = () => {
  const parentElement = document.getElementById("listFlashcards");
  let child = parentElement.lastElementChild;
  while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
  };
};

//Start Edit Screen -------------------------------------------------------------------------------->
const editdeckscreen = document.getElementById("editorscreen");
//initially set not to be displayed
editdeckscreen.style.display = "none";
//create card screen controls
const cardNameEntry = document.getElementById("newCardNameInput");
const cardTermEntry = document.getElementById("newCardTermInput");
cardTermEntry.addEventListener("keydown", function(event) {
    if (event.code === "Tab") {
    event.preventDefault();
    createCardButton.click();
    cardNameEntry.focus();
  }
});
const createCardButton = document.getElementById("newCardButton");

//back button controls
const backEditButton = document.getElementById("backButtonEdit");
backEditButton.addEventListener("click", function () {
  deleteGlobalVariablesExceptDeckList();
  navigator("landingscreen", "editorscreen");
  deleteEditorContents("listEditFlashcards");
});
//create card button
createCardButton.addEventListener("click", function () {
  if (guest == true) {
    alert("Guest Editing Prohibited");
  }
  else {
    //Collect user-inputted data
    var newCardName = cardNameEntry.value;
    var newCardTerm = cardTermEntry.value;
    //clear the input
    cardNameEntry.value='';
    cardTermEntry.value='';
    //add card to database
    console.log(newCardName + ' : ' + newCardTerm);
    cardToDeck(user.uid, currDeck, newCardName, newCardTerm);  
    //update GUI
    deleteEditorContents();
    populateCardLists();
    cardNameEntry.focus();
  }
});


//populate list of cards in GUI
const buildCardListItem = (cardTerm, cardDefinition) => {
  
  const div = document.createElement("div");
  const termDiv = document.createElement("div");
  termDiv.className = "termDiv";
  const defDiv = document.createElement("div");
  defDiv.className = "defDiv";
  div.className = "cardListDiv";

  //make the term  
  const termPara = document.createElement("p");
  termPara.innerHTML = convertToText(cardTerm); //converts text to HTML
  const defPara = document.createElement("p");
  defPara.innerHTML = convertToText(cardDefinition);
  const deleter = document.createElement("button");
  deleter.className = "deleteCardButton";
  deleter.innerHTML = "Delete";
  
  //delete button functionality
  deleter.onclick = function () {
    console.log(guest);
    if (guest == true) {
      alert("Guest Editing Prohibited");
    }
    else {
      deleteCard(user.uid, currDeck, cardTerm);
    }
  };
  
  //add individual section to parent div
  termDiv.append(termPara);
  defDiv.append(defPara);
  div.appendChild(termDiv);
  div.appendChild(defDiv);
  div.appendChild(deleter);
  const container = document.getElementById("listEditFlashcards");
  container.appendChild(div);
};

//populate list of cards
function populateCardLists() {
  if (cardList[0] == "Empty") {
    console.log("This user has no cards")
  }
  else {
    for (let i = 0; i < cardList.length; i++) {
      buildCardListItem(cardList[i], definitionList[i]);
    }
  }
}

//Clear list in GUI
const deleteEditorContents = () => {
  const parentElement = document.getElementById("listEditFlashcards");
  let child = parentElement.lastElementChild;
  while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
  };
};
//Start Study Screen ------------------------------------------------------------------------------->
const studyPage = document.getElementById('studyscreen');
studyPage.style.display = 'none';

//back button 
const backer = document.getElementById("backButtonStudy");
  backer.addEventListener("click", function () {
    navigator("landingscreen", "studyscreen");
    const mcTerm = document.getElementById("mcTerm");
    if (mcTerm != undefined || mcTerm != null) {
      deleteMC();
    }
    else {
      deleteTyped();
    }
    
  });
//start study mode function
function startStudy() {
  const genMode = generateRandomIntegerInRange(0,1);
  if (genMode == 0) {
    genTyped();
  }
  else {
    if (cardList.length < 5) {
      genTyped();
    }
    else {
      genMC();
    }
  }
}

function genMC() {
  //generate visuals
  const mcDiv = document.createElement("div");
  mcDiv.className = "mcDiv";
  const options = document.createElement("div");
  options.className = "options";
  const mcTerm = document.createElement('h2');
  mcTerm.id = "mcTerm";
  const option1 = document.createElement("button");
  option1.id = "a";
  const option2 = document.createElement("button");
  option2.id = 'b';
  const option3 = document.createElement("button");
  option3.id = 'c';
  const option4 = document.createElement("button");
  option4.id='d';
  
  //get a card from the list
  const cardNum = generateRandomIntegerInRange(0, cardList.length -1 );
  mcTerm.innerHTML = cardList[cardNum];
  
  //populate the options
  var list = [];
  var i = 0;
  while (i < 4) {
    const temp = generateRandomIntegerInRange(0, cardList.length - 1);
    console.log("Num: ", temp);
    if (temp != cardNum && !list.includes(temp)) {
      list.push(temp);
      i++;
    }
  }
  i = 0;
  
  option1.innerHTML = definitionList[list[0]];
  option2.innerHTML = definitionList[list[1]];
  option3.innerHTML = definitionList[list[2]];
  option4.innerHTML = definitionList[list[3]];
  list = [];
  //randomly replace one of the options with the correct value
  const correctOption = generateRandomIntegerInRange(0, 3);
  switch (correctOption) {
    case 0:
      option1.innerHTML = definitionList[cardNum];
      break;
    case 1:
      option2.innerHTML = definitionList[cardNum];
      break;
    case 2:
      option3.innerHTML = definitionList[cardNum];
      break;
    case 3:
      option4.innerHTML = definitionList[cardNum];
      break;
  }
  //listener for keypresses
  document.addEventListener("keypress", (event) => {
    console.log(event.key);
    if (event.key == "1" || event.key == "2" || event.key == "3" || event.key == "4") {
     revealAnswer();
    }
  });
  //listeners for each option
  option1.addEventListener('click', function onClick(event) {
    revealAnswer();     
  });

  option2.onclick = function () {
    revealAnswer();
  }
    
  option3.onclick = function () {
    revealAnswer();
  }

  option4.onclick = function () {
    revealAnswer();
  }
  //add everything into the HTML
  const studyScreen = document.getElementById("StudyScreenContainer");
  options.appendChild(option1);
  options.appendChild(option2);
  options.appendChild(option3);
  options.appendChild(option4);
  mcDiv.appendChild(mcTerm);
  mcDiv.appendChild(options); 
  studyScreen.appendChild(mcDiv);

  function revealAnswer() {
    option1.style.backgroundColor = "#d90f3b";
    option2.style.backgroundColor = "#d90f3b";
    option3.style.backgroundColor = "#d90f3b";
    option4.style.backgroundColor = "#d90f3b";
    console.log(correctOption);
    switch (correctOption) {
      case 0:
        option1.style.backgroundColor = "#1A970A";
        break;
      case 1:
        option2.style.backgroundColor = "#1A970A";
        break;
      case 2:
        option3.style.backgroundColor = "#1A970A";    
        break;
      case 3:
        option4.style.backgroundColor = "#1A970A";        
        break;
    }
    setTimeout(function(){
      deleteMC();
      startStudy();
    }, 2000);
    

  }
}

function genTyped() {
  //generate visuals
  const buttonDiv = document.createElement("div");
  buttonDiv.className = "buttonDiv";
  const showAnswer = document.createElement("button");
  showAnswer.innerHTML = "Show Answer";
  showAnswer.id = "showAnswer";
  showAnswer.class = "showAnswer";
  buttonDiv.appendChild(showAnswer);
  const defHeader = document.createElement('h2');
  defHeader.id = "defHeader";
  const studyContainer = document.getElementById("StudyScreenContainer");
  studyContainer.appendChild(defHeader);
  const termInput = document.createElement("input");
  termInput.id = ("termInput");
  termInput.style = "resize: none;"
  termInput.placeholder = "Enter Term";
  studyContainer.appendChild(termInput);

  //get a card from the list
  const cardNum = generateRandomIntegerInRange(0, cardList.length - 1);
  defHeader.innerHTML = definitionList[cardNum];
  
  //retrieve and evaluate response
  termInput.focus();
  termInput.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
      //Collect user-inputted data
      var guess = termInput.value;
      guess = guess.toLowerCase();
      var answer = cardList[cardNum];
      answer = answer.toLowerCase();
      console.log(answer);
      if (guess == answer) {
        deleteTyped();
        startStudy();
      }
      else {
        termInput.value = "";
        termInput.placeholder ="Try Again"
        studyContainer.appendChild(buttonDiv);
      }
    }
    showAnswer.addEventListener("click", function () {
      termInput.placeholder = cardList[cardNum];
      termInput.focus();
    });

});
}

function deleteMC() {
  const a = document.getElementById('a');
  const b = document.getElementById('b');
  const c = document.getElementById('c');
  const d = document.getElementById('d');
  if (a != null) {
    a.remove();
    b.remove();
    c.remove();
    d.remove();

  const term = document.getElementById("mcTerm");
  term.remove();
  }
 
}

function deleteTyped() {
  const defHeader = document.getElementById("defHeader");
  const termInput = document.getElementById("termInput");
  const showAnswer = document.getElementById("showAnswer");
  defHeader.remove();
  termInput.remove();
  if (showAnswer != null) {
    showAnswer.remove();
  }


}
//Database Manipulation Functions------------------------------------------------------------------->
//get the value at a certain path
function getData(path){
  //get deckList data from firebase
  const dbref = ref(db);
    get(child(dbref,  path)).then((snapshot)=> {
    if(snapshot.exists()) {
      data = snapshot.val();
      console.log("Data within get Data "+ data);
      const temp = document.getElementById("studyScreenHeader");
      return data;
      }
    else {
      console.log("There be no cards here")
    }
  });
}

//create Deck in Database
function deckToDatabase(userUid, deckName) {

  

  update(ref(db, 'users/' + userUid +'/' + convertToPath(deckName)), {
    cardList: cardList,
    definitionList: definitionList
  });

  //is this the first deck?
  if (deckList[0] == "Empty") {
    deckList[0] = deckName;
  }
  else {
    //update the lists of deck for the user locally and on server
    deckList.push(deckName);
    
  }
  update(ref(db, 'users/' + userUid), {
    deckList: deckList
  });
}

//create card in deck in database
function cardToDeck(userUid, deckName, cardName, cardDefinition) {
  console.log(convertToPath(cardName));
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName)), {
    name: cardName,
    definition: cardDefinition,
    mc: 0,
    typed: 0
  });


  //is this the first card?
  if (cardList[0] == "Empty") {
    cardList[0] = cardName;
    definitionList[0] = cardDefinition;
  }
  else {
    //update the lists of deck for the user locally and on server
    cardList.push(cardName);
    definitionList.push(cardDefinition);
    
  }
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName)), {
    cardList: cardList,
    definitionList: definitionList
  });
  
}

//delete deck from the database
function deleteDeck(userUid, deckName) {
  remove(ref(db, 'users/' + userUid + '/' + convertToPath(deckName)));
  var index = deckList.indexOf(deckName);
  if (index > -1) {
    deckList.splice(index, 1);
    console.log("Deck Deleted From Array");
  }
  //update on firebase
  update(ref(db, 'users/' + userUid), {
    deckList: deckList
  });
  deleteContents();
  populateLists();
  cardList = ["Empty"];
  definitionList = ["Empty"];
  currDeck = null;
}

//delete card from deck in database
function deleteCard(userUid, deckName, cardName) {
  remove(ref(db, 'users/' + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName)))
  var index = cardList.indexOf(cardName);
  if (index > -1) {
    cardList.splice(index, 1);
    definitionList.splice(index, 1);
    console.log("Card Deleted From Array");
  }
  //TODO: Delete card list in gui and re populate it
  //update on firebase
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName)), {
    cardList: cardList,
    definitionList: definitionList
  });
  deleteEditorContents();
  populateCardLists();
}

//set the card's multiple choice value
function setCardMC(userUid, deckName, cardName, value) {
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName)), {
    mc: value
  });
}

function getCardMC(userUid, deckName, cardName) {
  const path = "users/" + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName) + "/mc";
  data = getData(path);
  return data;
}

//set the card's typed value
function setCardTyped(userUid, deckName, cardName, value) {
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName) + '/' + cardName), {
    typed: value
  });
  setCardMC(userUid, deckName, cardName, value);
}

function getCardTyped(userUid, deckName, cardName) {
  const path = "users/" + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName) + '/typed';
  data = getData(path);
  return data;
}

//change the definition on a specific card
function setCardDefinition(userUid, deckName, cardName, cardDefinition) {
  update(ref(db, 'users/' + userUid + '/' + convertToPath(deckName) + '/' + convertToPath(cardName)), {
    definition: cardDefinition
  });
}
// --------------------------------------------------------------------------------------
//Paths must be non-empty strings and can't contain ".", "#", "$", "[", or "]"
//Parser Functions for User Input
function convertToPath(string) {
  length = string.length;
  for (let i = 0; i < length; i++) {
    string = string.replace('.', '--PERIOD--');
    string = string.replace('#', '--HASHTAG--');
    string = string.replace('$', '--DOLLAR--');
    string = string.replace('[', '--LEFTBRACKET--');
    string = string.replace(']', '--RIGHTBRACKET--');
    string = string.replace('\n', '--NEWLINE--')
  };
  return(string);
}

function convertToText(string) {
  length = string.length;
  for (let i = 0; i < length; i++) {
    string = string.replace('--PERIOD--', '.');
    string = string.replace('--HASHTAG--', '#');
    string = string.replace('--DOLLAR--', '$');
    string = string.replace('--LEFTBRACKET--', '[');
    string = string.replace('--RIGHTBRACKET--', ']');
    //convert all line breaks to HTML
    string = string.replace('--NEWLINE--', '<br>')
    string = string.replace('\n', '<br>');

  };
  return(string);

}

//random number generator
function generateRandomIntegerInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Delete local variables
function deleteGlobalVariables() {
  deckList = ["Empty"];
  cardList = ["Empty"];
  definitionList = ["Empty"];
  currDeck = null;
  guest = false;
  
}

function deleteGlobalVariablesExceptDeckList() {
  cardList = ["Empty"];
  definitionList = ["Empty"];
  currDeck = null;
}
