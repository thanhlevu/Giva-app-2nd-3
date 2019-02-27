import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { HttpClientModule } from "@angular/common/http";

import { MyApp } from "./app.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterPage } from "../pages/register/register";
import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { MyItemsPage } from "../pages/my-items/my-items";
import { UserInfoPage } from "../pages/user-info/user-info";
import { PostingPage } from "../pages/posting/posting";
import { EditInfoPage } from "../pages/edit-info/edit-info";
import { Camera } from "@ionic-native/camera";
import { PhotoLibrary } from "@ionic-native/photo-library";
import { MediaProvider } from "../providers/media/media";
import { PostViewPage } from "../pages/post-view/post-view";
import { PostEditPage } from "../pages/post-edit/post-edit";
import { TabsPage } from "../pages/tabs/tabs";
import { LandingPage } from '../pages/landing/landing';

import { HttpModule } from "@angular/http";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import { take } from "rxjs/operator/take";
import { ReservedPage } from "../pages/reserved/reserved";
import { ProfilePage } from "../pages/profile/profile";
import { PipesModule } from '../pipes/pipes.module';
@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    LoginPage,
    HomePage,
    LandingPage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostViewPage,
    PostEditPage,
    TabsPage,
    ReservedPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule,
    HttpClientModule,
    HttpModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RegisterPage,
    LoginPage,
    HomePage,
    LandingPage,
    PostViewPage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostEditPage,
    TabsPage,
    ReservedPage,
    ProfilePage

  ],
  providers: [
    StatusBar,
    Camera,
    PhotoViewer,
    HttpModule,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MediaProvider,
    PipesModule
  ]
})
export class AppModule { }
