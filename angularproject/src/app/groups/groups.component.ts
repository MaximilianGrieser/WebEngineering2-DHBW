import { Component, OnInit } from '@angular/core';
let ListGroups = document.getElementById("sGroups") as HTMLSelectElement;
let ListUsers = document.getElementById("sAllUser") as HTMLSelectElement;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  selectedLevel: any;
  private options: any;

  constructor() { }

  ngOnInit(): void {
    // this.listAllGroups();
    // this.listAllUsers();
  }

   listAllGroups() {
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

  selectedGroupChanged() {
    let selected = this.selectedLevel;
    document.getElementById("lUsers").innerHTML = "USERS IN " + this.options[selected].value;

    selected++

    if(selected != 0) this.listAllUsersInGroup(selected);
  }

  listAllUsersInGroup(groupID) {
    let list = document.getElementById("sUser");
    while (list.firstChild) {
      // @ts-ignore
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

  listAllUsers() {
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

  removeFromGroup() {
    let userID = (<HTMLInputElement>document.getElementById("sUser")).value;

    let groupID = ListGroups.selectedIndex;
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

  newGroup() {
    let name = (<HTMLInputElement>document.getElementById("fgroupname")).value;

    let newGroup = {
      name: name
    };

    let request = new XMLHttpRequest();

    request.open("POST", "http://localhost:3000/groups", false);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newGroup));

    location.reload();
  }

  addUserToGroup() {
    let groupID = ListGroups.selectedIndex;
    groupID++

    let userID = ListUsers.selectedIndex;
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

    let selected = ListUsers.selectedIndex;
    selected++

    location.reload();
    this.listAllUsersInGroup();
  }


}
