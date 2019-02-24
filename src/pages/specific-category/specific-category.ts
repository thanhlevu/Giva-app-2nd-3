import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../intefaces/posting';

@IonicPage()
@Component({
  selector: 'page-specific-category',
  templateUrl: 'specific-category.html',
})
export class SpecificCategoryPage {

  url = "https://media.mw.metropolia.fi/wbma/uploads/";
  thumbnail: string;
  selectedItem: string;
  picArray: Picture[];
  TrueArray: Picture[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.selectedItem = navParams.get('category');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {
    this.loadItems_GivaTag();
  }

  loadItems_GivaTag() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/GIVA")
      .subscribe(items => {
        //order by the newest post
        this.picArray = items.sort(
          (a, b) => 
          Number(b.file_id) - Number(a.file_id)
          );
          this.loadTrue();
      });
  }
  loadTrue(){
    this.picArray.forEach(data =>{
      if(data.description.includes("description:")){
      console.log(data.description.slice(data.description.indexOf("description"),data.description.indexOf("description:")+ 9))
      }
    })
  }
}
