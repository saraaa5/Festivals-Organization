let firebaseUrl = 'https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija';

function cancel_change() {
    document.getElementsByClassName("containerr")[0].style.display = "none";
}

function hideMessage(divName) {
    document.getElementById(divName).style.display = 'none';
}

function loadorgas() {
    let request = new XMLHttpRequest();
    request.onload = function () {
        if (this.readyState == 4 && this.status == 200) {
            let orgas_table = document.getElementById("orgas-container");
            let orgas = JSON.parse(request.responseText);

            for (let id in orgas) {
                let orga = orgas[id];
                let orgaNode = generateorgaNode(orga, id);
                orgas_table.appendChild(orgaNode);
            }
        } else {
            window.location.href = "./error.html";
        }
    };
    request.open('GET', firebaseUrl + '/organizatoriFestivala.json');
    request.send();
}

function generateorgaNode(orga_as_json, id) {
    let divSeparateCol = document.createElement("div");
    divSeparateCol.className = "col-sm-12 col-md-6 col-lg-4";
    divSeparateCol.id = id;

    let divCard = document.createElement("div");
    divCard.className = "card";
    divCard.style = "width: 18rem; height: 13rem; margin-bottom: 1rem; margin-left: 8vw";

    let divCardBody = document.createElement("div");
    divCardBody.className = "card-body";

    let nameElement = document.createElement("p");
    nameElement.className = "card-text";
    nameElement.innerHTML = `naziv: ${orga_as_json.naziv}`;

    let organameElement = document.createElement("p");
    organameElement.className = "card-text";
    organameElement.innerHTML = `broj telefona: ${orga_as_json.kontaktTelefon}`;

    let passwordElement = document.createElement("p");
    passwordElement.className = "card-text";
    passwordElement.innerHTML = `email: ${orga_as_json.email}`;

    let buttonDiv = document.createElement("div");
    buttonDiv.className = "buttonDiv d-flex justify-content-between mt-3";

    let deleteButton = document.createElement("a");
    deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteButton.style = "color: red; cursor: pointer;";

    let link = document.createElement("a");
    link.className = "btn btn-primary";
    link.style = "background-color: #2b152b; cursor: pointer;";

    link.textContent = "Festivali";
    link.addEventListener("click", function (e) {

        link.href = `./admin-festivali.html?${id}`;
    })

    deleteButton.addEventListener("click", function () {
        let message = document.getElementById("confirmId");
        message.style.display = "block";

        let confirmButton = document.getElementById("confirmbtn");
        confirmButton.onclick = function () {
            var request1 = new XMLHttpRequest();
            request1.onload = function () {
                if (this.readyState == 4 && this.status == 200) {
                    removeDeletedorga(id);
                } else {
                    window.location.href = "./error.html";
                }
            };
            request1.open('DELETE', `${firebaseUrl}/organizatoriFestivala/${id}.json`);
            request1.send();
        };
    });

    let editButton = document.createElement("a");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.style = "color: green; cursor: pointer;";
    editButton.id = id;
    editButton.addEventListener("click", function () {
        display_change(orga_as_json, id);
    });

    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(link);
    buttonDiv.appendChild(editButton);

    divCardBody.appendChild(nameElement);
    divCardBody.appendChild(organameElement);
    divCardBody.appendChild(passwordElement);
    divCardBody.appendChild(buttonDiv);

    divCard.appendChild(divCardBody);
    divSeparateCol.appendChild(divCard);

    return divSeparateCol;
}


function removeDeletedorga(id) {
    let orgaRow = document.getElementById(id);
    if (orgaRow) {
        orgaRow.parentNode.removeChild(orgaRow);
    }
    document.getElementById("confirmId").style.display = 'none';
}

function display_change(orga_as_json, id) {
    document.getElementById("naziv").value = orga_as_json.naziv;
    document.getElementById("adresa").value = orga_as_json.adresa;
    document.getElementById("godinaOsnivanja").value = orga_as_json.godinaOsnivanja;
    document.getElementById("kontaktTelefon").value = orga_as_json.kontaktTelefon;
    document.getElementById("email").value = orga_as_json.email;
    document.getElementById("changes").style.display = "block";

    setupSaveButton(orga_as_json, id); // Postavljanje event listener-a za dugme "save-button"

}

function removeFestivals(idFestivals) {
    let request = new XMLHttpRequest()

    request.open("DELETE", firebase + `/festivali/${idFestivals}.json`)
    request.send()
}

function changeInBase(orga_as_json, id) {
    var request = new XMLHttpRequest();

    const naziv = document.getElementById('naziv').value;
    const adresa = document.getElementById('adresa').value;
    const godinaOsnivanja = document.getElementById('godinaOsnivanja').value;
    const kontaktTelefon = document.getElementById('kontaktTelefon').value;
    const email = document.getElementById('email').value;

    orga_as_json.naziv = naziv;
    orga_as_json.adresa = adresa;
    orga_as_json.godinaOsnivanja = godinaOsnivanja;
    orga_as_json.kontaktTelefon = kontaktTelefon;
    orga_as_json.email = email;

    request.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let orga = JSON.parse(this.responseText);
            changeorgaNode(orga_as_json, id);
        }
    };

    request.open("PUT", `${firebaseUrl}/organizatoriFestivala/${id}.json`, true);
    request.send(JSON.stringify(orga_as_json));


    cancel_change();
}

function changeorgaNode(orga, id) {
    let orgaCard = document.getElementById(id);

    let nazivP = orgaCard.getElementsByTagName("p")[0];
    nazivP.innerHTML = `naziv: ${orga.naziv}`;

    let adresaP = orgaCard.getElementsByTagName("p")[1];
    adresaP.innerHTML = `adresa: ${orga.adresa}`;

    let godinaOsnivanjaP = orgaCard.getElementsByTagName("p")[2];
    godinaOsnivanjaP.innerHTML = `godina osnivanja: ${orga.godinaOsnivanja}`;

    let kontaktTelefonP = orgaCard.getElementsByTagName("p")[3];
    kontaktTelefonP.innerHTML = `broj telefona: ${orga.kontaktTelefon}`;

    let emailP = orgaCard.getElementsByTagName("p")[4];
    emailP.innerHTML = `email: ${orga.email}`;

}

function setupSaveButton(orga_as_json, id) {
    document.getElementById("save-button").addEventListener("click", function(event) {
        event.preventDefault();

        let naziv = document.getElementById("naziv").value;
        let adresa = document.getElementById("adresa").value;
        let godinaOsnivanja = document.getElementById("godinaOsnivanja").value;
        let kontaktTelefon = document.getElementById("kontaktTelefon").value;
        let email = document.getElementById("email").value;

        const isValidEmail = email => {
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
        
        const isValidPhone = kontaktTelefon => {
            const regex = /^[0-9/-]+$/;
            return regex.test(kontaktTelefon);
        }

        if(naziv == "" || adresa == "" || godinaOsnivanja == "" || kontaktTelefon == "" || email == "") {
            danger.style.display = "block";
            setTimeout(() => {
                danger.style.display = "none";
            }, 4000); 
            return false;
        }
        else if(!isValidEmail(email)) {
            dangeremail.style.display = "block";
            setTimeout(() => {
                dangeremail.style.display = "none";
            }, 4000);
            return false;
        }
        else if(!isValidPhone(kontaktTelefon)) {
            dangerphone.style.display = "block";
            setTimeout(() => {
                dangerphone.style.display = "none";
            }, 4000);
            return false;
        }
        
        else {
            setTimeout(() => {
                naziv = "";
                adresa = "";
                godinaOsnivanja = "";
                kontaktTelefon = "";
                email = "";
            }, 2000);
            done.style.display = "block";
            setTimeout(() => {
                done.style.display = "none";
            }, 4000);

            changeInBase(orga_as_json, id); // Pozivanje funkcije za ažuriranje baze podataka
            return true;
        }
        
    });
}
