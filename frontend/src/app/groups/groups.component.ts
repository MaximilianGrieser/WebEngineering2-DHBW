import {Component, OnInit} from '@angular/core';
import {ApiService} from "../api.service";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  selectedLevel: any;
  private groups: any;
  private users: any
  private selectedGroup: number;
  private selectedUserInGroup: number;
  private selectedUser: number;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.listAllGroups();
    this.listAllUsers();
  }

  listAllGroups() {
    this.api.getGroups().subscribe((data) => {
      this.groups = data;
      this.groups.forEach(group => {
        let item = document.createElement("option");
        item.innerHTML = group.name;
        document.getElementById("sGroups").appendChild(item);
      });
      console.log(this.groups);
    });
  }

  selectedGroupChanged() {
    let selected = this.selectedLevel[0];
    this.selectedGroup = this.groups.find(x => x.name === selected).id;
    document.getElementById("lUsers").innerHTML = "USERS IN " + selected;
    if (selected != 0) this.listAllUsersInGroup(this.selectedGroup);
  }

  listAllUsersInGroup(groupID) {
    let list = document.getElementById("sUser");
    list.innerHTML = "";

    this.api.getUserGroup(groupID).subscribe((data) => {
      let users = data;
      users.forEach(user => {
        this.api.getUserID(user.userID).subscribe((data) => {
          let item = document.createElement("option");
          item.innerHTML = data[0].userID;
          list.appendChild(item);
        });
      });
    });
  }

  listAllUsers() {
    this.api.getUsers().subscribe((data) => {
      this.users = data;
      this.users.forEach(user => {
        let item = document.createElement("option");
        item.innerHTML = user.userID;
        document.getElementById("sAllUser").appendChild(item);
      });
      console.log(this.users);
    });
  }

  /**
   * Removes selected user from selected group
   */
  removeFromGroup() {
    let userID = (<HTMLInputElement>document.getElementById("sUser")).value;
    let groupID = this.selectedGroup;

    this.api.getLogin(userID).subscribe((data) => {
      userID = data[0].id;
      this.api.deleteUserGroup(+userID, groupID).subscribe();
    });
    location.reload();
  }

  newGroup() {
    let name = (<HTMLInputElement>document.getElementById("fgroupname")).value;

    let newGroup = {
      name: name
    };

    this.api.postGroup(newGroup).subscribe();
    location.reload();
  }

  addUserToGroup() {
    let groupID = this.selectedGroup;
    let userID = this.selectedUser;

    let newEntry = {
      userID: userID,
      groupID: groupID
    }

    console.log(newEntry)
    this.api.postUSerGroup(newEntry).subscribe();
    location.reload();
    this.listAllUsersInGroup(0);
  }


  selectedUserInGroupChanged() {
    this.selectedUserInGroup = this.users.find(x => x.userID === this.selectedLevel[0]).id;
  }

  selectedUserChanged() {
    this.selectedUser= this.users.find(x => x.userID === this.selectedLevel[0]).id;
  }
}
