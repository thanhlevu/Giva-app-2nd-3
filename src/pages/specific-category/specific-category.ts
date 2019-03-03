import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Picture } from '../../intefaces/posting';
import { PostViewPage } from '../post-view/post-view';
import { Observable } from 'rxjs/Observable';

/**
 * 
 * Pictures are showing up
 * 
 */
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
  picArray1: Observable<Picture[]>;
  category;


  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient) {
    this.selectedItem = navParams.get('category');
  }

  ionViewDidLoad() {
    //this.loadItems_GivaTag(this.selectedItem);
    this.loadSpecItems(this.selectedItem);
  }

  loadItems_GivaTag(category) {
    this.category = "GIVA_"+ category;
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/"+ this.category)
      .subscribe(items => {
        //order by the newest post
        this.picArray = items.sort(
          (a, b) => Number(b.file_id) - Number(a.file_id)
        );
      });
  }
  loadSpecItems(category){
    console.log("loading");
    this.category = "GIVA_"+ category;
    return this.http.get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/"+ this.category)
    .subscribe(items =>{
      this.picArray = items.sort(
      (a, b) => Number(b.file_id) - Number(a.file_id)
    );
    }
    );
  }

  viewPost(pic){
this.navCtrl.push(PostViewPage,{
  picture: pic
});
}
}
