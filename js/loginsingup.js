import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
let firebaseUrl = 'https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija';

function generateUserId(length = 19) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let userId = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters[randomIndex];
  }
  return "-" + userId;
}

function get_firebase(adresa, datum, email, ime, korisnicko, lozinka, prezime, telefon, zanimanje) {
  const app = initializeApp(firebaseConfig);
  const userId = generateUserId();
  const data = {
    adresa: adresa,
    datumRodjenja: datum,
    email: email,
    ime: ime,
    korisnickoIme: korisnicko,
    lozinka: lozinka,
    prezime: prezime,
    telefon: telefon,
    zanimanje: zanimanje
  };
  const dataFinal = {};
  dataFinal[userId] = data;
  console.log(data);
  const db = getDatabase(app);
  set(ref(db, "FestivalskaOrganizacija/korisnici/" + userId), data);
  console.log('WRITE DONE');
}

const firebaseConfig = {
  apiKey: "AIzaSyC8ZJg8zdHDPnAsM2CkwErZ_yEStSFyyfg",
  authDomain: "festivalskaorganizacija.firebaseapp.com",
  databaseURL: "https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "festivalskaorganizacija",
  storageBucket: "festivalskaorganizacija.appspot.com",
  messagingSenderId: "887395968774",
  appId: "1:887395968774:web:df53be77314b48f2e1a087"
};

function showMessage(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.style.backgroundColor = "purple";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function() {
    messageDiv.style.opacity = 0;
  }, 5000);
}

function closePopup() {
  document.getElementById("wrapper").style.display = "none";
}

const app = initializeApp(firebaseConfig);
const signUp = document.getElementById("submitSignUp");

signUp.addEventListener("click", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const job = document.getElementById("job").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const date = document.getElementById("date").value;
  const adress = document.getElementById("adress").value;
  const mail = document.getElementById("mail").value;
  const tell = document.getElementById("tell").value;

  // Check if any field is empty
  if (!name || !surname || !job || !username || !password || !date || !adress || !mail || !tell) {
    showMessage("Sva polja moraju biti popunjena!", "signUpMessage");
    return;
  }

  // Email validation
  let inputEmail = document.getElementById("mail");
  let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!regexEmail.test(mail)) {
    showMessage("Unesite mail u formatu xxxx@example.com", "signUpMessage");
    return;  // Stop the execution if the email is not valid
  }

  // Password validation
  let inputPassword = document.getElementById("password");
  if (password.length < 8) {
    showMessage("Šifra se mora sastojati od minimum 8 karaktera!", "signUpMessage");
    return;  // Stop the execution if the password is not valid
  }

  // Phone number validation
  let inputPhone = document.getElementById("tell");
  let regexPhone = /^[0-9]+$/;
  if (!regexPhone.test(tell)) {
    showMessage("Telefon sme samo da sadrži brojeve!", "signUpMessage");
    return;  // Stop the execution if the phone number is not valid
  }

  get_firebase(adress, date, mail, name, username, password, surname, tell, job);
  showMessage("Uspešno ste se registrovali!", "signUpMessage");
  setTimeout(() => {
    closePopup();
  }, 2000);
});

function login(username, password) {
  let request = new XMLHttpRequest();
  request.onload = function() {
    if (this.readyState == 4 && this.status == 200) {
      let users = JSON.parse(request.responseText);

      console.log("username current ", username, " pass current ", password);
      for (let id in users) {
        let current = users[id];
        console.log("username LOADED ", current.korisnickoIme, " pass LOADED ", current.lozinka);
        if (current.korisnickoIme == username && current.lozinka == password) {
          showMessage("Uspešno ste se ulogovali!", "loginMessage");
          setTimeout(() => {
            closePopup();
          }, 2000);
          return;
        }
      }
    }
    showMessage("Neispravni podaci! Pokušajte ponovo.", "loginMessage");
  }

  request.open('GET', firebaseUrl + '/korisnici.json');
  request.send();
}

const loginButton = document.getElementById("loginClick");
loginButton.addEventListener("click", () => {
  const email = document.getElementById('username-input-login').value;
  const password = document.getElementById('password-input-login').value;

  login(email, password);
});
