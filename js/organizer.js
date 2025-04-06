var firebaseUrl =
  "https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija";
let sviOrganizatori = {};
let organizatoriKopija = {};
let organizatorData;

function loadorganizerr() {
  let request = new XMLHttpRequest();
  let url = window.location.href.split("?")[1];

  let festivalId = url.split("/")[0];
  request.onload = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        let organizator = JSON.parse(request.responseText);
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
        let festivals = JSON.parse(request.responseText);

        sviFestivali = festivals;
        copy();

        // Prikaz informacija o organizatoru
        let infoDiv = document.getElementById("organizator-info");
        infoDiv.style.fontSize = "1.2rem"; /* ili druga odgovarajuća veličina */
        infoDiv.style.color = "rgb(104, 89, 110)";
        infoDiv.style.fontFamily = "'Archivo', sans-serif";
        infoDiv.style.justifyContent = "center";
        infoDiv.style.display = "flex";
        infoDiv.style.flexDirection = "column"; /* Promeniti na kolonu */
        infoDiv.style.alignItems = "center";
        infoDiv.style.lineHeight = "1.5";

        let naziv = document.createElement("p");
        naziv.innerHTML = `<strong>Naziv:</strong> ${organizator.naziv}`;

        let adresa = document.createElement("p");
        adresa.innerHTML = `<strong>Adresa:</strong> ${organizator.adresa}`;

        let godina = document.createElement("p");
        godina.innerHTML = `<strong>Godina osnivanja:</strong> ${organizator.godinaOsnivanja}`;

        let kontaktTelefon = document.createElement("p");
        kontaktTelefon.innerHTML = `<strong>Kontakt telefon:</strong> ${organizator.kontaktTelefon}`;

        let email = document.createElement("p");
        email.innerHTML = `<strong>Email:</strong> ${organizator.email}`;

        infoDiv.appendChild(naziv);
        infoDiv.appendChild(adresa);
        infoDiv.appendChild(godina);
        infoDiv.appendChild(kontaktTelefon);
        infoDiv.appendChild(email);

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

function generateOrganizorNode(org_as_json, festivalsId, id) {
  let divCol = document.createElement("div");
  divCol.className = "col-sm-12 col-md-6 col-lg-4";
  divCol.id = id;
  divCol.style.marginBottom = "4vh";

  let divCard = document.createElement("div");
  divCard.className = "kartica";
  divCard.style.width = "18rem";

  let img = document.createElement("img");
  img.src = org_as_json.slike[1];
  img.className = "slika";
  img.alt = org_as_json.naziv;
  img.style.height = "160px";
  img.style.width = "260px";

  let divCardBody = document.createElement("div");
  divCardBody.className = "kartica-kontent";

  let title = document.createElement("h5");
  title.className = "naziv";
  title.textContent = org_as_json.naziv;

  let typePara = document.createElement("p");
  typePara.className = "tip";
  typePara.textContent = org_as_json.tip;

  let link = document.createElement("a");
  link.className = "dugme";
  link.textContent = "Više informacija";
  link.addEventListener("click", function (e) {
    link.href = `./festival.html?${festivalsId}/${id}`;
  });

  divCardBody.appendChild(title);
  divCardBody.appendChild(typePara);
  divCardBody.appendChild(link);

  divCard.appendChild(img);
  divCard.appendChild(divCardBody);

  divCol.appendChild(divCard);

  return divCol;
}
function openFilter() {
  var content = document.getElementById("search-festivals");
  if (content.style.display === "none") {
    content.style.display = "flex";
  } else {
    content.style.display = "none";
  }
}

function filter() {
  let inputFiledTitle = document.getElementById("title-input-option");
  let inputFiledType = document.getElementById("type-input-option");

  let festivalTitle = inputFiledTitle.value;
  let festivalType = inputFiledType.value;

  search(festivalTitle.trim(), festivalType.trim());

  for (let id in festivaliKopija) {
    const festival = festivaliKopija[id];

    highlightMatchingText("title", festival.naziv, id, true);
    highlightMatchingText("type", festival.tip, id, true);

    if (
      festivalTitle != "" &&
      festival.naziv.toLowerCase().includes(festivalTitle.toLowerCase())
    ) {
      let term = festivalTitle.trim().toLowerCase();
      highlightMatchingText("title", festival.naziv, id, false, term);
    }

    if (
      festivalType != "" &&
      festival.tip.toLowerCase().includes(festivalType.toLowerCase())
    ) {
      let term = festivalType.trim().toLowerCase();
      highlightMatchingText("type", festival.tip, id, false, term);
    }
  }

  refreshNodes();
}

function search(festivalTitle, festivalType) {
  copy();

  if (!festivalTitle && !festivalType) {
    return;
  }

  let countInputs = 0;

  if (festivalTitle) {
    countInputs += 2;
  }

  if (festivalType) {
    countInputs += 4;
  }

  for (let id in sviFestivali) {
    let count = 0;
    const festival = sviFestivali[id];
    if (
      festivalTitle &&
      festival.naziv.toLowerCase().includes(festivalTitle.toLowerCase())
    ) {
      count += 2;
    }

    if (
      festivalType &&
      festival.tip.toLowerCase().includes(festivalType.toLowerCase())
    ) {
      count += 4;
    }

    if (count == countInputs) continue;

    delete festivaliKopija[id];
  }
}

function highlightMatchingText(element, text, id, redo, term) {
  let content = document.getElementById(id);
  console.log("====================================");
  console.log(element, text, id, redo);
  console.log("====================================");
  if (!content) {
    console.error(`Element with ID ${id} not found.`);
    return;
  }

  if (element === "title") {
    let headerH = content.getElementsByTagName("h5")[0];

    if (!headerH) {
      console.error("Title header not found.");
      return;
    }
    if (redo) {
      headerH.innerHTML = `${text}`;
    } else {
      const regex = new RegExp(`(${term})`, "gi");
      const newText = text.replace(regex, '<span class="highlight">$1</span>');
      headerH.innerHTML = newText;
      console.log("====================================");
      console.log(newText);
      console.log("====================================");
    }
  } else if (element === "type") {
    let typeParam = content.getElementsByTagName("p")[0];

    if (!typeParam) {
      console.error("Type parameter not found.");
      return;
    }
    if (redo) {
      typeParam.innerHTML = `${text}`;
    } else {
      const regex = new RegExp(`(${term})`, "gi");
      const newText = text.replace(regex, '<span class="highlight">$1</span>');
      typeParam.innerHTML = newText;
      console.log("====================================");
      console.log(newText);
      console.log("====================================");
    }
  }
}

/*function highlightMatchingText(text, id, redo, searchTerm) {
  let content = document.getElementById(id);
  let headerH = content.getElementsByTagName("h5")[0];
  if (redo) {
      headerH.innerHTML = `${text}`;
  } else {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const newText = text.replace(regex, '<span class="highlight">$1</span>');
      headerH.innerHTML = newText;
  }
}*/

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

function hideCard(card) {
  card.style.display = "none";
}

document
  .getElementById("toggle-search-festivals")
  .addEventListener("click", function () {
    var content = document.getElementById("search-festivals");
    if (content.style.display === "none") {
      content.style.display = "contents";
    } else {
      content.style.display = "none";
    }
  });
