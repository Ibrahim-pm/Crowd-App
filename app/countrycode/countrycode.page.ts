import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Countries, Country} from './interface';
import { ModalController } from '@ionic/angular';
import {Location} from '@angular/common';
@Component({
  selector: 'app-countrycode',
  templateUrl: './countrycode.page.html',
  styleUrls: ['./countrycode.page.scss'],
})
export class CountrycodePage implements OnInit {
  allItems: Array<Country> = [];
  public items: Array<Country> = [];

  constructor(private http: HttpClient, private modalController: ModalController, private location: Location) {
    this.setItems();
  }
  ngOnInit() {
  }
  async viewDetails(item) {
    await this.modalController.dismiss(item);
  }
  setItems() {
    this.http.get('assets/countries.json').toPromise().then(
        (res: Countries) => {
          this.allItems = res.countries;
          this.items = this.allItems;
          console.log(this.items)
        }
    );
  }
  filterItems(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() !== '') {
      val = val.toLowerCase();
      this.items = this.items.filter((item) => {
        return item.name.toLowerCase().includes(val)
            || item.nativeName.includes(val)
            || item.capital.toLowerCase().includes(val);
      });
    } else {
      this.items = this.allItems;
    }
  }
  async goBack() {
      await this.modalController.dismiss();
  }
}
