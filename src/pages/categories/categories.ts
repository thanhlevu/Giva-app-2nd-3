import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpecificCategoryPage } from "../specific-category/specific-category";

@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {

  turn;
  categories: Array<String> = ["Electronics","Furnitures","Clothes & Accesories", "Vehicles", "Others"]

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriesPage');
  }

  onClick(item){
    console.log(item);
    if(item == "Clothes & Accesories"){
      this.turn = "Clothes_Accessories";
      this.navCtrl.push(SpecificCategoryPage,{
        category: this.turn,
      });
    }else{
      this.navCtrl.push(SpecificCategoryPage,{
        category: item
      });
    }
    
  }
}
