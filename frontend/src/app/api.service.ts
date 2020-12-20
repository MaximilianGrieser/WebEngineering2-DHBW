import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  postUser(user: object) {
    return this.http.post("http://localhost:3000/users", user);
  }

  getUsers() {
    return this.http.get("http://localhost:3000/users") as any;
  }

  getLogin(userID: string) {
    return this.http.get("http://localhost:3000/users/" + userID + "/userID");
  }

  getUserID(userID: number) {
    return this.http.get("http://localhost:3000/users/" + userID + "/ID");
  }

  getEvents(userID: number) {
    return this.http.get("http://localhost:3000/events/" + userID);
  }

  postEvent(event: object) {
    return this.http.post("http://localhost:3000/events", event);
  }

  putEvent(eventID: number, event: object) {
    return this.http.put("http://localhost:3000/events/" + eventID, event);
  }

  deleteEvent(eventID: number) {
    return this.http.delete("http://localhost:3000/events/" + eventID);
  }

  getEventCategories(eventID: number) {
    return this.http.get("http://localhost:3000/eventcategories/" + eventID as any);
  }

  getCategories() {
    return this.http.get("http://localhost:3000/categories") as any;
  }

  postCategory(cat:object) {
    return this.http.post("http://localhost:3000/categories", cat);
  }

  deleteCategory(catIdx: number){
    return this.http.delete("http://localhost:3000/categories/" + catIdx);
  }

  getGroups() {
    return this.http.get("http://localhost:3000/groups") as any;
  }

  postGroup(group: object) {
    return this.http.post("http://localhost:3000/groups", group);
  }

  getUserGroup(groupID: number) {
    return this.http.get("http://localhost:3000/usersgroup/" + groupID) as any;
  }


  deleteUserGroup(userID: number, groupID: number) {
    return this.http.delete("http://localhost:3000/usersgroup/" + userID + "/" + groupID)
  }

  postUSerGroup(con: object) {
    return this.http.post("http://localhost:3000/usersgroup", con)
  }
}
