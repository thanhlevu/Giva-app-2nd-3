import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, AlertController } from "ionic-angular";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { Picture } from "../../intefaces/posting";
import { CategoriesPage } from "../categories/categories";

import { HttpClient } from "@angular/common/http";
import { RegisterPage } from "../register/register";
import { PostViewPage } from "../post-view/post-view";
import { PostingPage } from "../posting/posting";
import { MyItemsPage } from "../my-items/my-items";
import { PostEditPage } from "../post-edit/post-edit";
import { MediaProvider } from "../../providers/media/media";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage implements OnInit {
  picArray: Picture[];

  src = "http://media.mw.metropolia.fi/wbma/uploads/";
  options = {};

  constructor(
    public navCtrl: NavController,
    private photoViewer: PhotoViewer,
    public http: HttpClient,
    private alertCtrl: AlertController,
    private mediaprovider: MediaProvider
  ) {}

  ngOnInit() {}
  ionViewDidEnter() {
    this.loadItems_GivaTag();
  }
  loadItems() {
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
  }

  loadItems_GivaTag() {
    return this.http
      .get<Picture[]>("http://media.mw.metropolia.fi/wbma/tags/GIVA")
      .subscribe(items => {
        //order by the newest post
        this.picArray = items.sort(
          (a, b) => Number(b.file_id) - Number(a.file_id)
        );
        console.log("G:", this.picArray);
      });
  }

  viewImage(url: string) {
    //this.photoViewer.show(this.src + url);
  }

  viewPost(Pic: Picture) {
    console.log(Pic);

    if (Pic.user_id == localStorage.userID) {
      this.navCtrl.push(PostEditPage, Pic);
    } else {
      this.navCtrl.push(PostViewPage, Pic);
    }
  }

  goToPost() {
    this.navCtrl.push(PostingPage);
  }

  goToMyPosts() {
    this.navCtrl.push(MyItemsPage);
  }

  search(){
    this.navCtrl.push(CategoriesPage);
  }
  searchName(){
    console.log("searcName()");
    this.options = {
      title:"Search by title",
    } 
    this.alertCustom(this.options);
  }
  alertCustom(options){
    let alert = this.alertCtrl.create({
      title: options.title,
      inputs: [
        {
          name: 'result',
          placeholder: 'f.e chair'
        }
      ],
      buttons: [
        {
          text: 'cancel',
          role: 'cancel',
          handler: data => {
            console.log('vaihto peruttu');
          }
        },
        {
          text: 'add',
          handler: data =>
          this.SearchWithWord(data.result)
          }
      ]
    });
    alert.present();
  }
  SearchWithWord(data){
    this.picArray = [];
    console.log(data);
    this.options = {
      "title":data,
      "description": data
    }
    this.mediaprovider.SearchWithWord(this.options).subscribe(
      (data: Picture[]) => {
        this.picArray = data;
      });
  }
}
