var firebaseUrl = 'https://festivalskaorganizacija-default-rtdb.europe-west1.firebasedatabase.app';
var xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var response = JSON.parse(this.responseText);
        console.log(response);
        // Process the response data here
    }
};

xhttp.open('GET', firebaseUrl + '/organizatoriFestivala.json');
xhttp.send();