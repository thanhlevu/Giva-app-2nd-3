import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpecificCategoryPage } from "../specific-category/specific-category";


@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  categories: Array<String> = ["Electronics","Furnitures","Clothes & Accesories", "Vehicles", "Others"]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  onClick(item){
    this.navCtrl.push(SpecificCategoryPage,{
      category: item
    });
  }
}
