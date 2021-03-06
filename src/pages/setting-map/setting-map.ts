import { Component } from "@angular/core";
import { IonicPage, NavParams, ViewController } from "ionic-angular";
import { HttpClient } from "@angular/common/http";
import {
  DirectionMapJson,
  LocalAddressJson,
  GeolocationByName,
  DirectionLineData
} from "../../intefaces/interfaces";
declare var google;

@IonicPage()
@Component({
  selector: "page-setting-map",
  templateUrl: "setting-map.html"
})
export class SettingMapPage {
  directionMapJson: DirectionMapJson;
  departure_time: string;
  originGeo: string;
  routeData: any;
  vehicle: string;
  routeUrl: string;
  constructor(
    private navParams: NavParams,
    private view: ViewController,
    private http: HttpClient
  ) {}

  ionViewWillLoad() {
    this.routeData = this.navParams.get("data"); // take the transfered route data

    //get the departure time from the route data
    this.departure_time =
      this.routeData.departure_time.getHours() +
      ":" +
      this.routeData.departure_time.getMinutes();

    // get the vehicle saved
    this.vehicle = localStorage.getItem("vehicle");

    // get the starting point saved from GoogleMapPage

    if (localStorage.getItem("departure_point")) {
      this.originGeo = localStorage.getItem("departure_point");
    }

    // setRouteInfo function to custom the route info
    this.setRouteInfo();
  }

  setRouteInfo() {
    // save or resave the vehicle if the user input the new vehicle
    localStorage.setItem("vehicle", this.vehicle);

    // set the new departure time for the route, present it on the Modal
    this.routeData.departure_time.setHours(this.departure_time.split(":")[0]);
    this.routeData.departure_time.getMinutes(this.departure_time.split(":")[1]);

    // get the origin place that the user inputs
    if (this.originGeo) {
      this.routeUrl = `/api/directions/json?origin=${this.originGeo}
        &destination=${this.routeData.destinationGeo.lat}, ${
        this.routeData.destinationGeo.lng
      }`;

      // save or resave the starting point if the user input the new starting point
      localStorage.setItem("departure_point", this.originGeo);
    } else {
      this.routeUrl = `/api/directions/json?origin=${
        JSON.parse(localStorage.getItem("current_location")).lat
      }, ${JSON.parse(localStorage.getItem("current_location")).lng}
            &destination=${this.routeData.destinationGeo.lat}, ${
        this.routeData.destinationGeo.lng
      }`;
      localStorage.removeItem("departure_point");
    }

    // format the route Url with the selected vehicle
    switch (this.vehicle) {
      case "car": {
        this.routeUrl += "&mode=driving";
        break;
      }
      case "walking": {
        this.routeUrl += "&mode=walking";
        break;
      }
      case "bike": {
        this.routeUrl += "&mode=bicycle";
        break;
      }
      case "bus": {
        this.routeUrl += "&mode=transit&transit_mode=bus";
        break;
      }
      case "train": {
        this.routeUrl += "&mode=transit&transit_mode=train";
        break;
      }
      case "rail": {
        this.routeUrl += "&mode=transit&transit_mode=rail";
        break;
      }
      case "metro": {
        this.routeUrl += "&mode=transit&transit_mode=subway";
        break;
      }
      default: {
        this.routeUrl += "&mode=driving";
        break;
      }
    }

    // set the departure time if using the public transport    (if transit => departure_time doesnt include milisecond)
    if (this.routeUrl.includes("&mode=transit&")) {
      this.routeUrl += `&departure_time=${Math.round(
        this.routeData.departure_time.getTime() / 1000
      )}&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
    } else {
      this.routeUrl += `&departure_time=${this.routeData.departure_time.getTime()}&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;
    }

    // get the direction route data from google map API
    this.http
      .get(this.routeUrl)
      .subscribe((directionData: DirectionMapJson) => {
        this.directionMapJson = directionData;

        // if there is some error == not OK, then give an alert
        if (directionData.status !== "OK") {
          this.originGeo = ""; // set the starting point input field back to empty
          this.vehicle = "car"; // set the vehicle input field back to "car"
          alert(directionData.status);
        }
        // if receiving the direction route data
        else if (directionData.routes[0]) {
          for (
            let j = 0;
            j < directionData.routes[0].legs[0].steps.length;
            j++
          ) {
            // get the address based on the geolocation
            let url = `/api/geocode/json?latlng=${
              directionData.routes[0].legs[0].steps[j].start_location.lat
            },${
              directionData.routes[0].legs[0].steps[j].start_location.lng
            }&key=AIzaSyAj6v6LHIeWH3B-Il-AZiXuhMWq3hHsQu8`;

            this.http.get(url).subscribe((localAddress: LocalAddressJson) => {
              let that = this;
              that.directionMapJson.routes[0].legs[0].steps[
                j
              ].start_location_address =
                localAddress.results[0].formatted_address;
            });

            //set the Icon for travel mode
            switch (
              this.directionMapJson.routes[0].legs[0].steps[j].travel_mode
            ) {
              case "WALKING": {
                this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                  "walk";
                break;
              }
              case "DRIVING": {
                // both "car" and "bicycle" are "DRIVING"
                if (this.vehicle == "undefined" || "car") {
                  this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                    "car";
                }
                if (this.vehicle == "bike") {
                  this.directionMapJson.routes[0].legs[0].steps[j].travel_icon =
                    "bicycle";
                }
                break;
              }
              case "TRANSIT": {
                switch (
                  this.directionMapJson.routes[0].legs[0].steps[j]
                    .transit_details.line.vehicle.type
                ) {
                  case "BUS": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "bus";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "BUS " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }

                  case "COMMUTER_TRAIN" || "TRAM" || "RAIL": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "train";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "TRAIN " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                  case "SUBWAY": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "subway";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "SUBWAY " +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                  case "FERRY": {
                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_icon = "boat";

                    this.directionMapJson.routes[0].legs[0].steps[
                      j
                    ].travel_mode =
                      "SHIP" +
                      this.directionMapJson.routes[0].legs[0].steps[j]
                        .transit_details.line.short_name;
                    break;
                  }
                }
              }
            }
          }
        }
      });
  }

  // click on CLOSE button to close the Modal
  closeModal() {
    this.setRouteInfo();
    // prepare the direction route data to pass to the GoogleMapPage: origin, destination, travelMode (transportMode), departure_time
    let directionLineData = {
      origin: this.originGeo
        ? this.originGeo
        : this.routeUrl.split("origin=")[1].split("&destination")[0],
      destination: this.routeUrl.split("&destination=")[1].split("&")[0],
      travelMode: this.routeUrl
        .split("&mode=")[1]
        .split("&")[0]
        .toUpperCase(),
      transitOptions: {
        departureTime: this.routeData.departure_time,
        //arrivalTime: this.routeUrl.split("&arrival_time=")[1].split("&")[0],
        transportMode:
          this.routeUrl.split("&mode=")[1].split("&")[0] == "transit"
            ? this.routeUrl
                .split("&transit_mode=")[1]
                .split("&")[0]
                .toUpperCase()
            : "" // BUS, RAIL, SUBWAY, TRAIN, TRAM
      }
    };
    this.view.dismiss(directionLineData);
  }
}
