var firebaseUrl =
  "https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija";
let sviOrganizatori = {};
let organizatoriKopija = {};
let organizatorData;
let EDIT = false;
let ID = "";
let festivalsId = "";

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
function hideMessage(divName) {
    document.getElementById(divName).style.display = 'none';
}

function delete_button(id) {
  let element = document.getElementById(id);
  if (confirm("Želite li obrisati ovaj entitet?")) {
    element.remove();
  }
}
function cancel_change() {
  document.getElementsByClassName("changes")[0].style.display = "none";
}

function loadorganizerr() {
  let request = new XMLHttpRequest();
  let url = window.location.href.split("?")[1];

  let festivalId = url.split("/")[0];
  request.onload = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let organizator = JSON.parse(request.responseText);
        festivalsId = organizator.festivali;
        loadFestivals(organizator.festivali, organizator);
        organizatorData = organizator;
      }
    } else {
      window.location.href = "./error.html";
    }
  };
  console.log(firebaseUrl + `/organizatoriFestivala/${festivalId}.json`);
  request.open(
    "GET",
    firebaseUrl + `/organizatoriFestivala/${festivalId}.json`
  );
  request.send();
}

function loadFestivals(festivalsId, organizator) {
  let request = new XMLHttpRequest();

  request.onload = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let festivals_table = document.getElementById("festivals-container");
        festivals_table.innerHTML = "";
        let festivals = JSON.parse(request.responseText);

        sviFestivali = festivals;
        copy();

        // Prikaz informacija o organizatoru

        // Generisanje i prikaz kartica festivala
        for (let id in festivals) {
          let org = festivals[id];
          console.log(org);
          let orgNode = generateOrganizorNode(
            org,
            festivalsId,
            id,
            organizator
          );
          festivals_table.appendChild(orgNode);
        }
      }
    } else {
      window.location.href = "./error.html";
    }
  };
  let orgid = firebaseUrl + `/festivali/${festivalsId}.json`;
  request.open("GET", orgid);
  request.send();
}

function copy() {
  festivaliKopija = {};
  for (let elem in sviFestivali) {
    festivaliKopija[elem] = sviFestivali[elem];
  }
}

function generateOrganizorNode(org_as_json, festivalsId, id, organizator) {
  let divCol = document.createElement("div");
  divCol.className = "col-sm-12 col-md-6 col-lg-4";
  divCol.id = id;

  let divCard = document.createElement("div");
  divCard.className = "card";
  divCard.style.width = "18rem";

  let divCardBody = document.createElement("div");
  divCardBody.className = "card-body";

  let title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = org_as_json.naziv;

  let addressPara = document.createElement("p");
  addressPara.className = "card-text";
  addressPara.innerHTML = `${organizator.adresa}`;

  let typePara = document.createElement("p");
  typePara.className = "card-text";
  typePara.innerHTML = `${org_as_json.tip}`;

  let buttonDiv = document.createElement("div");
  buttonDiv.className = "buttonDiv";

  let deleteButton = document.createElement("a");
  deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
  deleteButton.style = "color: red";

  deleteButton.addEventListener("click", function () {
    let message = document.getElementById("confirmId");
    message.style.display = "block";

    let confirmButton = document.getElementById("confirmbtn");
    confirmButton.addEventListener("click", function () {
      var request1 = new XMLHttpRequest();
      request1.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            removeOrganizatorNode(id);
          } else {
            window.location.href = "./error.html";
          }
        }
      };
      request1.open(
        "DELETE",
        firebaseUrl + `/festivali/${festivalsId}/${id}.json`
      );
      request1.send();
    });
  });

  let upgradeButton = document.createElement("a");
  upgradeButton.innerHTML = `<i class="fas fa-pen"></i>`;
  upgradeButton.style = "color: beige";
  upgradeButton.addEventListener("click", function () {
    display_change(org_as_json, festivalsId, id);
  });

  buttonDiv.appendChild(upgradeButton);
  buttonDiv.appendChild(deleteButton);

  divCardBody.appendChild(title);
  divCardBody.appendChild(addressPara);
  divCardBody.appendChild(typePara);
  divCardBody.appendChild(buttonDiv);

  divCard.appendChild(divCardBody);

  divCol.appendChild(divCard);

  return divCol;
}

function refreshNodes() {
  for (let id in sviFestivali) {
    let card = document.getElementById(id);

    if (festivaliKopija[id]) {
      card.style.display = "block";
      continue;
    }
    hideCard(card);
  }
}
function removeOrganizatorNode(id) {
  let organizatorNode = document.getElementById(id);
  if (organizatorNode) {
    let organizators_table = document.getElementById("festivals-container");
    organizators_table.removeChild(organizatorNode);
  }
}

function display_change(organizator_as_json, festivalsId, id) {
  let outerElement = document.querySelector(".changes");
  if (outerElement) {
    outerElement.style.display = "block";
  }

  if (true) {
    let maxPerson = document.getElementById("osobe");
    document.getElementById("osobe").value = organizator_as_json.maxOsoba;
    document.getElementById("naziv").value = organizator_as_json.naziv;
    document.getElementById("prevoz").value = organizator_as_json.prevoz;
    document.getElementById("cena").value = organizator_as_json.cena;
    document.getElementById("tip").value = organizator_as_json.tip;
    document.getElementById("opis").value = organizator_as_json.opis;

    maxPerson.addEventListener("keypress", function (event) {
      let regexNumber = /^\d*$/;

      let key = event.key;
      if (!regexNumber.test(key)) {
        event.preventDefault();
      }
    });
    ID = id;
    EDIT = true;
  }
}

function changeInBase(organizator_as_json, id) {
  var request = new XMLHttpRequest();

  const passenger = document.getElementById("osobe").value;
  const name = document.getElementById("naziv").value;
  const ride = document.getElementById("prevoz").value;
  const price = document.getElementById("cena").value;
  const type = document.getElementById("tip").value;
  const description = document.getElementById("opis").value;

  organizator_as_json.naziv = name;
  organizator_as_json.maxOsoba = passenger;
  organizator_as_json.prevoz = ride;
  organizator_as_json.tip = type;
  organizator_as_json.cena = price;
  organizator_as_json.opis = description;

  request.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        loadorganizerr();

        let organizator_as_json = JSON.parse(this.responseText);
        console.log(
          "put success ",
          organizator_as_json,
          " id: ",
          id,
          " collectionId: ",
          festivalsId
        );
      } else {
        console.log("put failed");
      }
    }
  };

  request.open(
    "PUT",
    firebaseUrl + `/festivali/${festivalsId}/${id}.json`,
    true
  );
  request.send(JSON.stringify(organizator_as_json));

  cancel_change();
}

function changeOrganizatorNode(organizator, id) {
  let organizatorCard = document.getElementById(id);

  let emailP = organizatorCard.getElementsByTagName("p")[1];
  emailP.innerHTML = ` max osoba: ${organizator.maxOsoba}`;

  let typePara = organizatorCard.getElementsByTagName("p")[0];
  typePara.innerHTML = `cena: ${organizator.cena}`;

  let headerH = organizatorCard.getElementsByTagName("h5")[0];
  headerH.innerHTML = `${organizator.naziv}`;
}

document.getElementById("adding").addEventListener("click", function () {
  var content = document.getElementById("class");
  content.style.display = "contents";
  document.getElementById("osobe").value = "";
  document.getElementById("naziv").value = "";
  document.getElementById("prevoz").value = "";
  document.getElementById("cena").value = "";
  document.getElementById("tip").value = "";
  document.getElementById("opis").value = "";
});

document.getElementById("save-button").addEventListener("click", function () {
  let maxPerson = document.getElementById("osobe");
  let name = document.getElementById("naziv");
  let ride = document.getElementById("prevoz");
  let price = document.getElementById("cena");
  let type = document.getElementById("tip");
  let description = document.getElementById("opis");

  let organizator = {
    maxOsoba: maxPerson.value,
    naziv: name.value,
    prevoz: ride.value,
    cena: price.value,
    tip: type.value,
    opis: description.value,
  };

  if (EDIT) {
    changeInBase(organizator, ID);
    EDIT = false;
  } else {
    ID = generateUserId();
    changeInBase(organizator, ID);
  }
});
