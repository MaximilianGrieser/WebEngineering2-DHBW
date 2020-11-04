window.onload = function() {
    listAllGroups()
}

function listAllGroups() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert("Groups loaded");
            console.log(this.responseText);
        }
    }

    request.open("GET", "http://localhost:3000/groups", false);
    request.send();
}

function newGroup() {
    let newGroup = {
        name: "test Group"
    };

    let request = new XMLHttpRequest();

    request.open("POST", "http://localhost:3000/groups", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newGroup));
}