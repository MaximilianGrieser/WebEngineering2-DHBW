import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getLogin(userID: string){
    return this.http.get("http://localhost:3000/users/" + userID + "/userID");
  }

  getEvents(userID: number){
    return this.http.get("http://localhost:3000/events/" + userID);
  }
  deleteEvent(eventID: number){
    return this.http.delete("http://localhost:3000/events/" + eventID);
  }

}
