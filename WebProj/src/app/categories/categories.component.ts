import { Component, OnInit } from '@angular/core';
import {ApiService} from "../api.service";

let ListCats = document.getElementById("sCats") as HTMLSelectElement;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  selectedLevel: any;
  private cats: any;
  private selectedCat: number

  constructor(private api: ApiService) { }

  ngOnInit(): void {

    this.listAllCats();
  }

    listAllCats() {
      this.api.getCategories().subscribe((data) => {
        this.cats = data;
        this.cats.forEach(cat => {
          let item = document.createElement("option");
          item.innerHTML = cat.name;
          document.getElementById("sCats").appendChild(item);
        });
        console.log(this.cats);
      });
    }

    newCategory() {
      let name = (<HTMLInputElement>document.getElementById("fcatname")).value;
      let newCat = {
        name: name
      };

      this.api.postCategory(newCat).subscribe();
      location.reload();
    }

    removeCategory() {
      this.api.deleteCategory(this.selectedCat).subscribe();
      location.reload();
    }

  selectedGroupChanged() {
    this.selectedCat = this.cats.find(x => x.name === this.selectedLevel[0]).id;;
  }
}
