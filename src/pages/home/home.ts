import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/posting";
import { CategoriesPage } from "../categories/categories";
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";
import { PostingPage } from "../posting/posting";
import { MyItemsPage } from "../my-items/my-items";
import { PostEditPage } from "../post-edit/post-edit";
import { EditInfoPage } from "../edit-info/edit-info";
import { MediaProvider } from "../../providers/media/media";
declare var google;
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  picArray: Picture[];
  selectedCategory: string;
  src = "http://media.mw.metropolia.fi/wbma/uploads/";
  options = {};
  title: string;
  currentLocation: any;
  distance = 0;
  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private mediaprovider: MediaProvider,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(currentPosition => {
      // get current location
      this.currentLocation = {
        lat: currentPosition.coords.latitude,
        lng: currentPosition.coords.longitude
      };
      localStorage.setItem(
        "current_location",
        JSON.stringify(this.currentLocation)
      );
      console.log("current_Location", this.currentLocation);
    });
  }

  searchByCategory() {
    this.mediaprovider
      .getFilesByTag("GIVA_Category." + this.selectedCategory)
      .subscribe((response: Picture[]) => {
        this.picArray = response;
        console.log("eeeeeeee", response);
      });
  }

  searchByTitle(ev: any) {
    this.mediaprovider
      .getFilesByTitle({ title: "GIVA_Title_" + ev.target.value })
      .subscribe((response: Picture[]) => {
        this.picArray = response;
        console.log("eeeeeeee", response);
      });
  }

  searchByDistance() {
    console.log("current_Locationsss", this.currentLocation);
    console.log("this.picArray", this.picArray);

    for (var i = 0; i < this.picArray.length; i++) {
      var loc1 = new google.maps.LatLng(this.currentLocation);
      var loc2 = new google.maps.LatLng(
        this.picArray[i].description.split("(@!GIVA?#)")[1].split(",")[0],
        this.picArray[i].description.split("(@!GIVA?#)")[1].split(",")[1]
      );

      google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2);

      console.log(
        "distance",
        google.maps.geometry.spherical.computeDistanceBetween(loc1, loc2)
      );
    }
  }

  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }
  /*   loadItems() {
    return this.http
      .get<Picture[]>("../../assets/test.json")
      .subscribe(data => {
        //console.log(data);
        this.picArray = data;
      });
  }

  loadItemsFromServer() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/media")
      .subscribe((data: Picture[]) => {
        this.picArray = data;
      });
  } */

  loadItems_GivaTag() {
    this.mediaprovider.getAllItemsWithGivaTag().subscribe(items => {
      //order by the newest post
      this.picArray = items.sort(
        (a, b) => Number(b.file_id) - Number(a.file_id)
      );
    });
  }

  viewPost(Pic: Picture) {
    this.navCtrl.push(PostViewPage, Pic);
  }

  goToPost() {
    this.navCtrl.push(PostingPage);
  }

  goToMyPosts() {
    this.navCtrl.push(MyItemsPage);
  }

  goToMyInfo() {
    this.navCtrl.push(EditInfoPage);
  }
  search() {
    this.navCtrl.push(CategoriesPage);
  }
  searchName() {
    console.log("searcName()");
    this.options = {
      title: "Search by title"
    };
    this.alertCustom(this.options);
  }
  alertCustom(options) {
    let alert = this.alertCtrl.create({
      title: options.title,
      inputs: [
        {
          name: "result",
          placeholder: "f.e chair"
        }
      ],
      buttons: [
        {
          text: "cancel",
          role: "cancel",
          handler: data => {
            console.log("vaihto peruttu");
          }
        },
        {
          text: "add",
          handler: data => this.SearchWithWord(data.result)
        }
      ]
    });
    alert.present();
  }
  SearchWithWord(data) {
    this.picArray = [];
    console.log(data);
    this.options = {
      title: data,
      description: data
    };
    this.mediaprovider
      .SearchWithWord(this.options)
      .subscribe((data: Picture[]) => {
        this.picArray = data;
      });
  }
}
