import { Component, OnInit } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController
} from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/interfaces";
import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";
import { PostingPage } from "../posting/posting";
import { MyItemsPage } from "../my-items/my-items";
import { PostEditPage } from "../post-edit/post-edit";
import { MediaProvider } from "../../providers/media/media";
declare var google;
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  picArray: Picture[];
  selectedCategory: string = "all";
  src = "http://media.mw.metropolia.fi/wbma/uploads/";
  options = {};
  title: string;
  currentLocation: any;
  selectedRadius = 50;
  data: any;
  keyword: string = "";
  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private mediaProvider: MediaProvider,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(currentPosition => {
      // get current location
      this.currentLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
    });
  }

  // search items by category
  searchByCategory() {
    this.searching();
  }

  // search items by title
  searchByTitle(ev: any) {
    if (ev.target.value) {
      this.keyword = ev.target.value.toLowerCase();
    } else {
      this.keyword = "";
    }
    this.searching();
  }

  // search items by distance
  searchByDistance() {
    this.searching();
  }

  // refresh new data
  doRefresh(event) {
    this.loadItems_GivaTag();
    setTimeout(() => {
      event.complete();
    }, 2000);
  }

  // reload item when the page showed again
  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }

  // load all item with GIVA tag
  loadItems_GivaTag() {
    this.mediaProvider.getAllItemsWithGivaTag().subscribe(items => {
      //order by the newest post
      this.picArray = items
        .sort((a, b) => Number(b.file_id) - Number(a.file_id))
        .filter(
          item =>
            item.description.split("(@!GIVA?#)")[6].split(":")[1] == "false" ||
            item.description.split("(@!GIVA?#)")[7].split(":")[1] ==
              localStorage.getItem("userID") ||
            item.user_id == Number(localStorage.getItem("userID"))
        );
    });
  }

  // got to PostViewPage
  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }

  // get all searching values and using CTD filter
  searching() {
    var myLocation = new google.maps.LatLng(this.currentLocation);
    if (this.selectedCategory != "all") {
      this.mediaProvider
        .getFilesByTag("GIVA_Category." + this.selectedCategory)
        .subscribe((response: Picture[]) => {
          this.picArray = this.CTD_Filter(response);
        });
    } else {
      this.mediaProvider.getAllItemsWithGivaTag().subscribe(items => {
        //order by the newest post
        this.picArray = this.CTD_Filter(items);
      });
    }
  }

  // CTD filter = Category - Title - Distance filter
  CTD_Filter(data: Picture[]) {
    var myLocation = new google.maps.LatLng(this.currentLocation);
    return data
      .sort((a, b) => Number(b.file_id) - Number(a.file_id))
      .filter(
        item =>
          item.description.split("(@!GIVA?#)")[6].split(":")[1] == "false" ||
          item.description.split("(@!GIVA?#)")[7].split(":")[1] ==
            localStorage.getItem("userID") ||
          item.user_id == Number(localStorage.getItem("userID"))
      )
      .filter(item2 =>
        item2.title
          .split("GIVA_Title_")[1]
          .toLowerCase()
          .includes(this.keyword.toLowerCase())
      )
      .filter(
        item3 =>
          google.maps.geometry.spherical.computeDistanceBetween(
            myLocation,
            new google.maps.LatLng(
              item3.description
                .split("(@!GIVA?#)")[1]
                .split(",")[0]
                .split("geolocation:")[1],
              item3.description.split("(@!GIVA?#)")[1].split(",")[1]
            )
          ) <
          Number(this.selectedRadius) * 1000
      );
  }
}
