import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MediaProvider } from '../../providers/media/media';
import { MyItemsPage } from '../my-items/my-items';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, public mediaProvider: MediaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  logout() {
    localStorage.clear();
    this.mediaProvider.loggedIn = false;
    this.navCtrl.parent.select(0);
  }

  myUploads() {
    this.navCtrl.push(MyItemsPage);
  }

}
