window.onload = function() {
    listAllGroups();
    listAllUsers();
}

function listAllGroups() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let groups = JSON.parse(this.responseText);
            groups.forEach(group => {
                let item = document.createElement("option");
                item.innerHTML = group.name;
                document.getElementById("sGroups").appendChild(item);
            });
            console.log(groups);
        }
    }

    request.open("GET", "http://localhost:3000/groups", false);
    request.send();
}

function selectedGroupChanged() {
    let element = document.getElementById("sGroups");
    let selected = element.selectedIndex;
    document.getElementById("lUsers").innerHTML = "USERS IN " + element.options[selected].value;

    selected++

    if(selected != 0) listAllUsersInGroup(selected);
}

function listAllUsersInGroup(groupID) {
    let list = document.getElementById("sUser");
    while (list.firstChild) {
        list.remove(list.firstChild);
    }

    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let users = JSON.parse(this.responseText);
            users.forEach(user => {
                let request = new XMLHttpRequest();

                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {

                        let item = document.createElement("option");
                        item.innerHTML = JSON.parse(this.responseText)[0].userID;
                        list.appendChild(item);
                    }
                }

                request.open("GET", "http://localhost:3000/users/" + user.userID + "/ID", false);
                request.send();
            });
            console.log(users);
        }
    }

    request.open("GET", "http://localhost:3000/usersgroup/" + groupID, false);
    request.send();
}

function listAllUsers() {
    let request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let users = JSON.parse(this.responseText);
            users.forEach(user => {
                let item = document.createElement("option");
                item.innerHTML = user.userID;
                document.getElementById("sAllUser").appendChild(item);
            });
            console.log(users);
        }
    }

    request.open("GET", "http://localhost:3000/users", false);
    request.send();
}

function removeFromGroup() {
    let userID = document.getElementById("sUser").value;
    let groupID = document.getElementById("sGroups").selectedIndex;
    groupID++

    let request = new XMLHttpRequest();

    console.log(userID, groupID)

    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let request = new XMLHttpRequest();
            
            userID = JSON.parse(this.responseText)[0].id;

            request.open("DELETE", "http://localhost:3000/usersgroup/" + userID + "/" + groupID, false);
            request.send();            
        }
    }

    request.open("GET", "http://localhost:3000/users/" + userID + "/userID", false);
    request.send();

    location.reload();
}

function newGroup() {
    let name = document.getElementById("fgroupname").value;

    let newGroup = {
        name: name
    };

    let request = new XMLHttpRequest();

    request.open("POST", "http://localhost:3000/groups", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newGroup));

    location.reload();
}

function addUserToGroup() {
    let groupID = document.getElementById("sGroups").selectedIndex;
    groupID++
    
    let userID = document.getElementById("sAllUser").selectedIndex;
    userID++

    let newEntry = {
        userID: userID,
        groupID: groupID
    }

    console.log(JSON.stringify(newEntry))

    let request = new XMLHttpRequest();

    request.open("POST", "http://localhost:3000/usersgroup", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newEntry));   

    let selected = document.getElementById("sGroups").selectedIndex;
    selected++

    listAllUsersInGroup()
}