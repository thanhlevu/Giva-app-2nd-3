import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { HttpClientModule } from "@angular/common/http";
import { GoogleMapPage } from "../pages/google-map/google-map";

import { MyApp } from "./app.component";
import { RegisterPage } from "../pages/register/register";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { PinsPage } from "../pages/pins/pins";
import { MyItemsPage } from "../pages/my-items/my-items";
import { UserInfoPage } from "../pages/user-info/user-info";
import { PostingPage } from "../pages/posting/posting";
import { EditInfoPage } from "../pages/edit-info/edit-info";
import { Camera } from "@ionic-native/camera";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { MediaProvider } from "../providers/media/media";
import { PostViewPage } from "../pages/post-view/post-view";
import { PostEditPage } from "../pages/post-edit/post-edit";

import { HttpModule } from "@angular/http";
import { PhotoViewer } from "@ionic-native/photo-viewer";
@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    LoginPage,
    HomePage,
    PinsPage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostViewPage,
    PostEditPage,
    GoogleMapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    LoginPage,
    HomePage,
    PinsPage,
    PostViewPage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostEditPage,
    GoogleMapPage
  ],
  providers: [
    StatusBar,
    Camera,
    PhotoViewer,
    HttpModule,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MediaProvider
  ]
})
export class AppModule {}
