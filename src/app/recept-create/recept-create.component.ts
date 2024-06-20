import { Component, OnInit } from '@angular/core';
import { Recept } from '../models/Recept';
import { Hozzavalo } from '../models/Hozzavalo';
import { ReceptService } from '../recept.service';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { User } from '../models/User';
import { AuthService } from '../auth.service';
import { Route, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {

  recept = {
    id: null,
    cim: '',
    leiras: '',
    hozzavalok: [],
    allergenek: [],
    user: null
  };

  

  selectedHozzavalo: number | undefined; // Ez tárolja a kiválasztott hozzávaló id-ját
  addedHozzavalo: number[] = [];
  hozzavalok: Anyag[] = []; // Ez tárolja az elérhető hozzávalókat
  anyag: Anyag[] = [];

  constructor(private receptService: ReceptService, private InMemoryDataService: InMemoryDataService, private router: Router) { }

  ngOnInit(): void {
    this.hozzavalok = this.InMemoryDataService.getAlapanyag();
  }

  addHozzavalo(): void {
    // Keressük meg a kiválasztott hozzávalót az elérhető hozzávalók között
    const selected = this.hozzavalok.find(h => h.id == this.selectedHozzavalo);
    console.log(selected);
    console.log(this.hozzavalok);
    console.log(this.selectedHozzavalo);
    if (selected) {
      if(this.addedHozzavalo.includes(selected.id)){
        this.addedHozzavalo.splice(this.addedHozzavalo.indexOf(selected.id),1)
        this.anyag.splice(this.anyag.indexOf(selected),1)
      }
      else{
        this.addedHozzavalo.push(selected.id);
        this.anyag.push(selected);
      }
    }
    console.log(this.addedHozzavalo);
  }



  onSubmit(): void {
      //this.recept.hozzavalok = this.anyag
      this.InMemoryDataService.addRecept(this.recept)
      //this.router.navigate(['user']);
      console.log(this.InMemoryDataService.createDb().receptjeim);
  }

}
