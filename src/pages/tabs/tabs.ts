import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ReservedPage } from '../reserved/reserved';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { UserInfoPage } from '../user-info/user-info';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  reservedPage = ReservedPage;
  homePage = HomePage;
  profilePage = UserInfoPage; 

}
