import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SessionService} from "../session.service";
import {ApiService} from "../api.service";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private session: SessionService, private api: ApiService) {
  }

  ngOnInit(): void {

  }

  newuser() {
    let id = (<HTMLInputElement>document.getElementById("fuserid")).value;
    let password = (document.getElementById("fpassword") as HTMLInputElement).value;

    let newUser = {
      userID: id,
      password: password
    }

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/users", true);

    console.log(JSON.stringify(newUser));
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(newUser));
  }

  login() {
    let id = (<HTMLInputElement>document.getElementById("fuserid")).value;
    let password = (document.getElementById("fpassword") as HTMLInputElement).value;

    this.api.getLogin(id).subscribe((data) => {
      if (data[0].password == password) {
        this.session.setUser(data[0].id);
        console.log("Login Succesfull " + data[0].id);
        this.router.navigateByUrl('/grid');
      }
    });

  }

}
