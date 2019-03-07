import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { Picture, Message } from '../../intefaces/posting';
import { favoriteResponse } from '../../intefaces/posting';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostViewPage } from '../post-view/post-view';

@IonicPage()
@Component({
  selector: 'page-reserved',
  templateUrl: 'reserved.html',
})
export class ReservedPage {

  configUrl = "https://media.mw.metropolia.fi/wbma";
  url = "https://media.mw.metropolia.fi/wbma/uploads/";
  picture: favoriteResponse;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaprovider: MediaProvider,public http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservedPage');
    this.getPins();
  }

  getPins(){
    
    const httpOptions = {
      headers: new HttpHeaders({
        'X-access-token': localStorage.getItem("token"),
      })
    };
    this.http.get<favoriteResponse>(this.configUrl+ "/favourites",httpOptions).subscribe(
      (item:favoriteResponse) => {
        this.picture = item;
        console.log(item);
      }
    );
    console.log(this.picture);
 }

   /* this.mediaprovider.getAllPins().subscribe(
      (item) =>{
        this.picture = item;
      }
    );
    console.log(this.picture);
  }*/
  deleteFavoutite(id: Number){
    this.mediaprovider.deleteFavourite(id).subscribe(
      (response: Message) =>{
        console.log(response);
        this.getPins(); 
      }
    );
  }
  
  viewPost(pic){
   this.navCtrl.push(PostViewPage, {
     item: pic
   })
  }
}
