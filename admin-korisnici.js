let firebaseUrl =
  "https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija";
let EDIT = false;
let ID = "";
function cancel_change() {
  document.getElementsByClassName("containerr")[0].style.display = "none";
}

function hideMessage(divName) {
  document.getElementById(divName).style.display = "none";
}

function generateUserId(length = 19) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let userId = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters[randomIndex];
  }
  return "-" + userId;
}

function loadUsers() {
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.readyState == 4 && this.status == 200) {
      const cleanup = {
        korisnickoIme: "",
        lozinka: "",
        ime: "",
        prezime: "",
        email: "",
        datumRodjenja: "",
        adresa: "",
        telefon: "",
        zanimanje: "",
      };
      display_change(cleanup, "");
      document.getElementById("users-container").innerHTML = "";
      let users_table = document.getElementById("users-container");
      let users = JSON.parse(request.responseText);

      for (let id in users) {
        let user = users[id];
        let userNode = generateUserNode(user, id);
        users_table.appendChild(userNode);
      }
    } else {
      window.location.href = "./error.html";
    }
  };
  request.open("GET", firebaseUrl + "/korisnici.json");
  request.send();
}

function generateUserNode(user_as_json, id) {
  let divSeparateCol = document.createElement("div");
  divSeparateCol.className = "col-sm-12 col-md-6 col-lg-4";
  divSeparateCol.id = id;

  let divCard = document.createElement("div");
  divCard.className = "card";
  divCard.style =
    "width: 18rem; height: 13rem; margin-bottom: 1rem; margin-left: 8vw";

  let divCardBody = document.createElement("div");
  divCardBody.className = "card-body";

  let nameElement = document.createElement("p");
  nameElement.className = "card-text";
  nameElement.innerHTML = `ime: ${user_as_json.ime}`;

  let lastNameElement = document.createElement("p");
  lastNameElement.className = "card-text";
  lastNameElement.innerHTML = `prezime: ${user_as_json.prezime}`;

  let usernameElement = document.createElement("p");
  usernameElement.className = "card-text";
  usernameElement.innerHTML = `korisničko ime: ${user_as_json.korisnickoIme}`;

  let passwordElement = document.createElement("p");
  passwordElement.className = "card-text";
  passwordElement.innerHTML = `lozinka: ${user_as_json.lozinka}`;

  let buttonDiv = document.createElement("div");
  buttonDiv.className = "buttonDiv d-flex justify-content-between mt-3";

  let deleteButton = document.createElement("a");
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.style = "color: red; cursor: pointer;";

  deleteButton.addEventListener("click", function () {
    let message = document.getElementById("confirmId");
    message.style.display = "block";

    let confirmButton = document.getElementById("confirmbtn");
    confirmButton.onclick = function () {
      var request1 = new XMLHttpRequest();
      request1.onload = function () {
        if (this.status == 200) {
          console.log("del success");
          removeDeletedUser(id);
        } else {
          window.location.href = "./error.html";
        }
      };
      request1.open("DELETE", `${firebaseUrl}/korisnici/${id}.json`);
      request1.send();
    };
  });

  let editButton = document.createElement("a");
  editButton.innerHTML = `<i class="fas fa-edit"></i>`;
  editButton.style = "color: green; cursor: pointer;";
  editButton.id = id;
  editButton.addEventListener("click", function () {
    display_change(user_as_json, id);
  });

  buttonDiv.appendChild(deleteButton);
  buttonDiv.appendChild(editButton);

  divCardBody.appendChild(nameElement);
  divCardBody.appendChild(lastNameElement);
  divCardBody.appendChild(usernameElement);
  divCardBody.appendChild(passwordElement);
  divCardBody.appendChild(buttonDiv);

  divCard.appendChild(divCardBody);
  divSeparateCol.appendChild(divCard);

  return divSeparateCol;
}

function removeDeletedUser(id) {
  let userRow = document.getElementById(id);
  if (userRow) {
    userRow.parentNode.removeChild(userRow);
  }
  document.getElementById("confirmId").style.display = "none";
}

function display_change(user_as_json, id) {
  document.getElementById("username-input").value = user_as_json.korisnickoIme;
  document.getElementById("password-input").value = user_as_json.lozinka;
  document.getElementById("name-input").value = user_as_json.ime;
  document.getElementById("lastname-input").value = user_as_json.prezime;
  document.getElementById("email-input").value = user_as_json.email;
  document.getElementById("date-input").value = user_as_json.datumRodjenja;
  document.getElementById("adress-input").value = user_as_json.adresa;
  document.getElementById("phone-input").value = user_as_json.telefon;
  document.getElementById("job-input").value = user_as_json.zanimanje;
  document.getElementById("changes").style.display = "block";
  EDIT = true;
  ID = id;
}

function changeInBase(user_as_json, id) {
  var request = new XMLHttpRequest();

  const lozinka = document.getElementById("password-input").value;
  const email = document.getElementById("email-input").value;
  const ime = document.getElementById("name-input").value;
  const prezime = document.getElementById("lastname-input").value;
  const adresa = document.getElementById("adress-input").value;
  const korisnickoIme = document.getElementById("username-input").value;
  const telefon = document.getElementById("phone-input").value;
  const zanimanje = document.getElementById("job-input").value;
  const datumRodjenja = document.getElementById("date-input").value;

  user_as_json.ime = ime;
  user_as_json.lozinka = lozinka;
  user_as_json.prezime = prezime;
  user_as_json.adresa = adresa;
  user_as_json.zanimanje = zanimanje;
  user_as_json.datumRodjenja = datumRodjenja;
  user_as_json.korisnickoIme = korisnickoIme;
  user_as_json.telefon = telefon;
  user_as_json.email = email;

  request.onload = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let user_as_json = JSON.parse(this.responseText);
        changeUserNode(user_as_json, id);
      }
    }
  };

  request.open("PUT", firebaseUrl + "/korisnici/" + id + ".json", true);
  request.send(JSON.stringify(user_as_json));

  cancel_change();

  /*request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let orga = JSON.parse(this.responseText);
            changeorgaNode(orga_as_json, id);
        }
    };

    request.open("PUT", `${firebaseUrl}/organizatoriFestivala/${id}.json`, true);
    request.send(JSON.stringify(orga_as_json));


    cancel_change();*/
}

function changeUserNode(user, id) {
  let userCard = document.getElementById(id);

  let prezimeP = userCard.getElementsByTagName("p")[2];
  prezimeP.innerHTML = `prezime: ${user.prezime}`;

  let nameP = userCard.getElementsByTagName("p")[1];
  nameP.innerHTML = `ime: ${user.ime}`;

  let lozinkaP = userCard.getElementsByTagName("p")[0];
  lozinkaP.innerHTML = `lozinka: ${user.lozinka}`;
}

document
  .getElementById("save-button")
  .addEventListener("click", function (event) {
    event.preventDefault();

    let user_as_json = {};
    var request = new XMLHttpRequest();
    let korisnickoIme = document.getElementById("username-input").value;
    let lozinka = document.getElementById("password-input").value;
    let ime = document.getElementById("name-input").value;
    let prezime = document.getElementById("lastname-input").value;
    let email = document.getElementById("email-input").value;
    let datumRodjenja = document.getElementById("date-input").value;
    let adresa = document.getElementById("adress-input").value;
    let telefon = document.getElementById("phone-input").value;
    let zanimanje = document.getElementById("job-input").value;

    const isValidEmail = (email) => {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (telefon) => {
      const regex = /^[0-9]+$/;
      return regex.test(telefon);
    };

    if (
      korisnickoIme == "" ||
      lozinka == "" ||
      ime == "" ||
      prezime == "" ||
      email == "" ||
      datumRodjenja == "" ||
      adresa == "" ||
      telefon == "" ||
      zanimanje == ""
    ) {
      danger.style.display = "block";
      setTimeout(() => {
        danger.style.display = "none";
      }, 4000);
      return false;
    } else if (!isValidEmail(email)) {
      dangeremail.style.display = "block";
      setTimeout(() => {
        dangeremail.style.display = "none";
      }, 4000);
      return false;
    } else if (!isValidPhone(telefon)) {
      dangerphone.style.display = "block";
      setTimeout(() => {
        dangerphone.style.display = "none";
      }, 4000);
      return false;
    } else {
      setTimeout(() => {
        korisnickoIme == "";
        lozinka == "";
        ime == "";
        prezime == "";
        email == "";
        datumRodjenja == "";
        adresa == "";
        telefon == "";
        zanimanje == "";
      }, 2000);
      done.style.display = "block";
      setTimeout(() => {
        done.style.display = "none";
      }, 4000);
      user_as_json.ime = ime;
      user_as_json.lozinka = lozinka;
      user_as_json.prezime = prezime;
      user_as_json.adresa = adresa;
      user_as_json.zanimanje = zanimanje;
      user_as_json.datumRodjenja = datumRodjenja;
      user_as_json.korisnickoIme = korisnickoIme;
      user_as_json.telefon = telefon;
      user_as_json.email = email;

      if (!EDIT) {
        ID = generateUserId();
      }

      request.onload = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            let users_table = document.getElementById("users-container");
            if (EDIT) {
              EDIT = false;
              loadUsers();
            } else {
              let userNode = generateUserNode(user_as_json, ID);
              users_table.appendChild(userNode);
            }
          }
        }
      };

      request.open("PUT", firebaseUrl + "/korisnici/" + ID + ".json", true);
      request.send(JSON.stringify(user_as_json));

      return true;
    }
  });
