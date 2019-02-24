import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { Picture } from '../../intefaces/posting';
import { favoriteResponse } from '../../intefaces/posting';

/**
 * Generated class for the ReservedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reserved',
  templateUrl: 'reserved.html',
})
export class ReservedPage {

  picture: favoriteResponse;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public mediaprovider: MediaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservedPage');
    this.getPins();
  }

  getPins(){
    this.mediaprovider.getAllPins().subscribe(
      (item: favoriteResponse) =>{
      
      }
    );
    console.log("array: ", this.picture)
  }
}
