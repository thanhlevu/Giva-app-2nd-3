import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";
import { UserInfoPage } from "../user-info/user-info";
import { MyItemsPage } from "../my-items/my-items";
import { FavoritesPage } from "../favorites/favorites";
import { PostingPage } from "../posting/posting";

@IonicPage()
@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  homePage = HomePage;
  favoritesPage = FavoritesPage;
  myItemsPage = MyItemsPage;
  postingPage = PostingPage;
  profilePage = UserInfoPage;
}
