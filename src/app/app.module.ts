import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { HttpClientModule } from "@angular/common/http";
import { ChatBoxPage } from "../pages/chat-box/chat-box";

import { MyApp } from "./app.component";
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
import { ReservedPage } from "../pages/reserved/reserved";
import { CategoriesPage } from "../pages/categories/categories";
import { SpecificCategoryPage } from "../pages/specific-category/specific-category";
import { FavoritesPage } from "../pages/favorites/favorites";
import { take } from "rxjs/operator/take";
import { GoogleMapComponent } from "../components/google-map/google-map";
import { Geolocation } from "@ionic-native/geolocation";

import { HttpModule } from "@angular/http";
import { PhotoViewer } from "@ionic-native/photo-viewer";
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  Polyline,
  Spherical
} from "@ionic-native/google-maps";
import { SizePipe } from "../pipes/size/size";
import { PipesModule } from "../pipes/pipes.module";
import { ValidatorProvider } from '../providers/validator/validator';

@NgModule({
  declarations: [
    MyApp,
    RegisterPage,
    LoginPage,
    HomePage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostViewPage,
    PostEditPage,
    TabsPage,
    ReservedPage,
    GoogleMapComponent,
    ChatBoxPage,
    FavoritesPage,
    CategoriesPage,
    SpecificCategoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    FavoritesPage,
    PostViewPage,
    MyItemsPage,
    UserInfoPage,
    PostingPage,
    EditInfoPage,
    PostEditPage,
    TabsPage,
    ReservedPage,
    GoogleMapComponent,
    ChatBoxPage,
    CategoriesPage,
    SpecificCategoryPage
  ],
  providers: [
    StatusBar,
    Camera,
    PhotoViewer,
    HttpModule,
    Geolocation,
    Spherical,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MediaProvider,
    PipesModule,
    ValidatorProvider
  ]
})
export class AppModule {}
