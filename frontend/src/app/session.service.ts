import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


  constructor() { }

  public setUser(user: number): void{
    sessionStorage.setItem('currentUser', String(user));
  }

  public getUser(): number{
    return Number(sessionStorage.getItem('currentUser'));
  }
}
