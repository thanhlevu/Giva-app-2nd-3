import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { HttpClient } from "@angular/common/http";
import "rxjs/add/operator/map";
import { DirectionMapJson } from "../../intefaces/posting";
import { Modal, ModalController, ModalOptions } from "ionic-angular";
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
declare var google;

@Component({
  selector: "google-map",
  templateUrl: "google-map.html"
})
export class GoogleMapComponent {
  @ViewChild("map") mapElement;
  map: any;
  destination = {
    lat: 0,
    lng: 0
  };
  currentLocation: any = "";
  departureTime = new Date();
  transportMode: string; //   ==>    "bus" / "train" / "subway" / "tram" / "rail"
  origin: {
    lat: number;
    lng: number;
  };
  onStartFromNewPlace = false;
  selectedMode = "DRIVING"; //   ==>    "DRIVING" / "BICYCLING" / "TRANSIT" / "WALKING"
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  constructor(
    private geolocation: Geolocation,
    public http: HttpClient,
    private spherical: Spherical,
    private modal: ModalController,
    public navParams: NavParams
  ) {}

  ngOnInit() {
    this.destination.lat = Number(
      this.navParams.data.description
        .split("$")[2]
        .split(":")[1]
        .split(",")[0]
    );
    this.destination.lng = Number(
      this.navParams.data.description
        .split("$")[2]
        .split(":")[1]
        .split(",")[1]
    );
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    let that = this;

    // create a map and zoom to the center point.
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 7,
      center: { lat: 60.172922, lng: 24.938719 } //Helsinki Geolocation
    });
    that.directionsDisplay.setMap(map);

    // get the current location and save it in local storage
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(currentPosition) {
          // get current location
          that.currentLocation = {
            lat: currentPosition.coords.latitude,
            lng: currentPosition.coords.longitude
          };
          map.setCenter(that.currentLocation); // adjust the camera to the current location
          console.log("currentLocation: ", that.currentLocation);
          // save the current location to Local Storage
          localStorage.setItem(
            "current_location",
            JSON.stringify(that.currentLocation)
          );

          //if depart from the current location ==> the starting point is the current location.
          if (that.onStartFromNewPlace == false) {
            that.origin = that.currentLocation;
          }

          // ==> display the route direction from "origin" to "destination" if using the private transport: "DRIVING" / "BICYCLING" / "WALKING"
          if (that.selectedMode !== "TRANSIT") {
            that.directionsService.route(
              {
                origin: that.origin, // { lat: 60.221492899999994, lng: 24.7788449 }  or 60.2222,24.656 or "Espoo"
                destination: that.destination,
                travelMode: google.maps.TravelMode[that.selectedMode] // "DRIVING" / "BICYCLING" / "WALKING" / ("TRANSIT")
              },
              function(response, status) {
                if (status == "OK") {
                  that.directionsDisplay.setDirections(response);
                } else {
                  window.alert("Directions request failed due to " + status);
                }
              }
            );
          }
          // ==> display the route direction from "origin" to "destination" if using the public transport: "TRANSIT" (BUS / RAIL / SUBWAY / TRAIN / TRAM)
          else {
            that.directionsService.route(
              {
                origin: that.origin, // { lat: 60.221492899999994, lng: 24.7788449 }  or 60.2222,24.656 or "Espoo"
                destination: that.destination,
                travelMode: google.maps.TravelMode[that.selectedMode], // "TRANSIT"
                transitOptions: {
                  departureTime: that.departureTime, // Date Format:  "Tue Feb 26 2019 12:50:53 GMT+0200"
                  //arrivalTime: new Date("2019-03-25T22:00:00Z"),
                  modes: [that.transportMode], // BUS, RAIL, SUBWAY, TRAIN, TRAM
                  routingPreference: "FEWER_TRANSFERS" // "FEWER_TRANSFERS" or "LESS_WALKING"
                }
              },
              function(response, status) {
                if (status == "OK") {
                  that.directionsDisplay.setDirections(response);
                } else {
                  window.alert("Directions request failed due to " + status);
                }
              }
            );
          }
        },
        function() {}
      );
    } else {
      alert("Browser doesn't support Geolocation");
    }
  }

  openModal() {
    // set Modal options
    const myModalOptions: ModalOptions = {
      //showBackdrop: false,
      enableBackdropDismiss: false // do not allow to touch on backdrop to close the Modal
      // enterAnimation?: string;
      // leaveAnimation?: string;
      // cssClass?: string;
    };

    // prepare the route data for transfering to SettingMapPage
    let routeData = {
      originGeo:
        this.onStartFromNewPlace == false ? this.currentLocation : this.origin,
      destinationGeo: this.destination,
      modes: this.selectedMode,
      transportMode: this.transportMode,
      departure_time: this.departureTime
    };

    // pass the route data to "SettingMapPage" and apply the Modal options
    let settingMapModal: Modal = this.modal.create(
      "SettingMapPage",
      {
        data: routeData
      },
      myModalOptions
    );

    settingMapModal.present(); // present the Modal

    // onWillDismiss function will be executed BEFORE dismissing the SettingMap Modal
    settingMapModal.onWillDismiss(directionLineData => {
      //console.log(directionLineData);
    });

    // onWillDismiss function will be executed AFTER dismissing the SettingMap Modal
    settingMapModal.onDidDismiss(directionLineData => {
      this.origin = directionLineData.origin;

      this.selectedMode = directionLineData.travelMode;
      this.departureTime = directionLineData.transitOptions.departureTime;
      if (this.selectedMode == "TRANSIT") {
        this.transportMode = directionLineData.transitOptions.transportMode.toUpperCase();
      }
      if (this.selectedMode == "BICYCLE") {
        this.selectedMode = "BICYCLING";
      }
      this.onStartFromNewPlace = true;
      this.calculateAndDisplayRoute();
    });
  }
}
