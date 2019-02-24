import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-specific-category',
  templateUrl: 'specific-category.html',
})
export class SpecificCategoryPage {

  url = "https://media.mw.metropolia.fi/wbma/uploads/";
  thumbnail: string;
  selectedItem: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.selectedItem = navParams.get('category');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {
    this.getItemsByTag();
  }

  getItemsByTag(){

  }
}
