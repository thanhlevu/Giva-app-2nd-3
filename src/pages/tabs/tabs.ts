import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams } from 'ionic-angular';

import { MediaProvider } from '../../providers/media/media';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { ReservedPage } from './../reserved/reserved';
import { PostingPage } from './../posting/posting';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  homeRoot = HomePage;
  reservedRoot = ReservedPage;
  profileRoot = ProfilePage;
  postingRoot = PostingPage;
  loginRoot = LoginPage;

  constructor(
    public app: App, public mediaProvider: MediaProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabPage');
  }

  tabChanged(evt) {
    if (evt.tabTitle === 'Login') {
      this.navCtrl.push(LoginPage);
    }
  }

}
