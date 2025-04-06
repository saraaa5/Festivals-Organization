var firebaseUrl = 'https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app/FestivalskaOrganizacija';

        function loadFestival() {
            let request = new XMLHttpRequest();
            let url = window.location.href.split("?")[1];
            let first = url.split("/")[0];
            let second = url.split("/")[1];

            request.onload = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        let festival = JSON.parse(request.responseText);
                        displayFestivalInfo(festival);
                    } else {
                        window.location.href = "./error.html";
                    }
                }
            };

            let festivalId = `${firebaseUrl}/festivali/${first}/${second}.json`;
            request.open('GET', festivalId);
            request.send();
        }

        function displayFestivalInfo(festival) {
            let infoDiv = document.getElementById("festival-info");
            infoDiv.innerHTML = '';

            let naziv = document.createElement("p");
            naziv.innerHTML = ` ${festival.naziv}`;
            naziv.style.fontWeight = "1000";
            naziv.style.fontSize = "5vh";

            let opis = document.createElement("p");
            opis.innerHTML = `<strong>Opis:</strong> ${festival.opis}`;

            let tip = document.createElement("p");
            tip.innerHTML = `<strong>Tip:</strong> ${festival.tip}`;

            let prevoz = document.createElement("p");
            prevoz.innerHTML = `<strong>Prevoz:</strong> ${festival.prevoz}`;

            let cena = document.createElement("p");
            cena.innerHTML = `<strong>Cena:</strong> ${festival.cena}`;

            let maxOsoba = document.createElement("p");
            maxOsoba.innerHTML = `<strong>Maksimalan broj osoba:</strong> ${festival.maxOsoba}`;

            infoDiv.appendChild(naziv);
            infoDiv.appendChild(opis);
            infoDiv.appendChild(tip);
            infoDiv.appendChild(prevoz);
            infoDiv.appendChild(cena);
            infoDiv.appendChild(maxOsoba);

            displayFestivalImages(festival.slike);
        }

        function displayFestivalImages(slike) {
            let slikeContainer = document.getElementById("slike-container");
            slikeContainer.innerHTML = '';
            slike.forEach(slikaUrl => {
                let img = document.createElement("img");
                img.src = slikaUrl;
                img.className = "slika";
                slikeContainer.appendChild(img);
            });
        }

        // Poziv funkcije za učitavanje festivala prilikom učitavanja stranice
        loadFestival();