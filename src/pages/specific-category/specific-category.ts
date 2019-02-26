import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../intefaces/posting';
import { PostViewPage } from '../post-view/post-view';

@IonicPage()
@Component({
  selector: 'page-specific-category',
  templateUrl: 'specific-category.html',
})
export class SpecificCategoryPage {

  url = "https://media.mw.metropolia.fi/wbma/media/";
  thumbnail: string;
  selectedItem: string;
  picArray: Picture[];
  TrueArray: Picture[];
  category;
  sendPic: Picture;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.selectedItem = navParams.get('category');
    console.log(this.selectedItem);
  }

  ionViewDidLoad() {
    this.loadItems_GivaTag(this.selectedItem);
  }

  loadItems_GivaTag(category) {
    this.category = "GIVA_"+ category;
    console.log(this.category);
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/"+ this.category)
      .subscribe(items => {
        //order by the newest post
        this.picArray = items.sort(
          (a, b) => Number(b.file_id) - Number(a.file_id)
        );
        console.log("G:", this.picArray);
      });
  }
  viewPost(pic){
this.navCtrl.push(PostViewPage,{
  picture: pic
});
}
}
