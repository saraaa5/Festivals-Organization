var firebaseUrl = 'https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija';
let sviOrganizatori = {};
let organizatoriKopija = {};

function loadorganizer() {
    var request = new XMLHttpRequest();
    request.onload = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                removeCard("organizators-container");

                let organizerWrapper = document.querySelector("#organizators-container");
                let organizers = JSON.parse(request.responseText);
                
                sviOrganizatori = organizers; // Ensure sviOrganizatori is populated
                
                for (let id in organizers) {
                    let organizer = organizers[id];
                    let orgNode = generateOrganizorNode(organizer, id);
                    organizerWrapper.appendChild(orgNode);
                }

                copy(); // Initialize organizatoriKopija with sviOrganizatori
            } else {
                window.location.href = "./error.html";
            }
        }
    };

    request.open("GET", firebaseUrl + "/organizatoriFestivala.json");
    request.send();
}

function generateOrganizorNode(org_as_json, id) {
    let divCol = document.createElement("div");
    divCol.className = "col-sm-12 col-md-6 col-lg-4";
    divCol.id = id;
    divCol.style.marginBottom = "4vh";

    let divCard = document.createElement("div");
    divCard.className = "kartica";
    divCard.style.width = "18rem";

    let img = document.createElement("img");
    img.src = org_as_json.logo;
    img.className = "slika";
    img.alt = org_as_json.naziv;
    img.style.height = "160px";
    img.style.width = "260px";

    let divCardBody = document.createElement("div");
    divCardBody.className = "kartica-kontent";

    let title = document.createElement("h5");
    title.className = "naziv";
    title.textContent = org_as_json.naziv;

    let yearPara = document.createElement("p");
    yearPara.className = "godinaOsnivanja";
    yearPara.textContent = org_as_json.godinaOsnivanja;

    let link = document.createElement("a");
    link.className = "dugme";
    link.textContent = "Više informacija";
    link.href = `./organizer.html?${id}`;

    divCardBody.appendChild(title);
    divCardBody.appendChild(yearPara);
    divCardBody.appendChild(link);

    divCard.appendChild(img);
    divCard.appendChild(divCardBody);

    divCol.appendChild(divCard);

    return divCol;
}

function removeCard(cardd) {
    let card = document.querySelector("#" + cardd);
    while (card.firstChild) {
        card.removeChild(card.firstChild);
    }
}

function filter() {
  let inputFiledTitle = document.getElementById("organizators-input");
  let organizatorTitle = inputFiledTitle.value.trim().toLowerCase();

  search(organizatorTitle);
  for (let id in organizatoriKopija) {
      const organizator = organizatoriKopija[id];
      highlightMatchingText(organizator.naziv, id, false, organizatorTitle);
  }
  refreshNodes();
}

function copy() {
    organizatoriKopija = { ...sviOrganizatori };
}

function search(organizatorTitle) {
    copy();

    if (!organizatorTitle) {
        return;
    }

    for (let id in sviOrganizatori) {
        const organizator = sviOrganizatori[id];
        if (!organizator.naziv.toLowerCase().includes(organizatorTitle)) {
            delete organizatoriKopija[id];
        }
    }
}

function highlightMatchingText(text, id, redo, searchTerm) {
  let content = document.getElementById(id);
  let headerH = content.getElementsByTagName("h5")[0];
  if (redo) {
      headerH.innerHTML = `${text}`;
  } else {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const newText = text.replace(regex, '<span class="highlight">$1</span>');
      headerH.innerHTML = newText;
  }
}

function refreshNodes() {
    for (let id in sviOrganizatori) {
        let card = document.getElementById(id);
        if (organizatoriKopija[id]) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    loadorganizer();

    document.getElementById("organizators-input").addEventListener("input", filter);
});
