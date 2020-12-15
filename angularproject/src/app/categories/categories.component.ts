import { Component, OnInit } from '@angular/core';

let ListCats = document.getElementById("sCats") as HTMLSelectElement;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.listAllCats();
  }

    listAllCats() {
      let request = new XMLHttpRequest();

      request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          let cats = JSON.parse(this.responseText);
          cats.forEach(cat => {
            let item = document.createElement("option");
            item.innerHTML = cat.name;
            document.getElementById("sCats").appendChild(item);
          });
          console.log(cats);
        }
      }

      request.open("GET", "http://localhost:3000/categories", false);
      request.send();
    }

    newCategory() {
      let name = (<HTMLInputElement>document.getElementById("fcatname")).value;

      let newCat = {
        name: name
      };

      let request = new XMLHttpRequest();

      request.open("POST", "http://localhost:3000/categories", false);
      request.setRequestHeader("Content-Type", "application/json");
      request.send(JSON.stringify(newCat));

      location.reload();
    }

    removeCategory() {
      let selected = ListCats.selectedIndex;
      selected++

      let request = new XMLHttpRequest();

      request.open("DELETE", "http://localhost:3000/categories/" + selected, false);
      request.send();

      location.reload();
    }


}
