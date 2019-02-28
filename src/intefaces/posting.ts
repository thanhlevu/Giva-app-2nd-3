export interface PostingForm {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  endTime?: string;
  contactTimeFrom?: string;
  contactTimeTo?: string;
  mime_type?: string;
  filename?: string;
  file?: File;
  contact?: string;
  info_item?: string;
  reserved: boolean;
}

export interface Picture {
  file_id: number;
  user_id?: number;
  filename?: string;
  filesize?: number;
  title?: string;
  description?: string;
  media_type?: string;
  mime_type?: string;
  time_added: string;
  screenshot?: string;
  thumbnails?: Thumbnail;
  geolocation?: {
    lat: number;
    lng: number;
  };
}

export interface Thumbnail {
  w160: string;
  w320?: string;
  w640?: string;
}

export interface User {
  user_id?: number;
  username?: string;
  password?: string;
  password2?: string;
  email?: string;
  full_name?: string;
  data_created?: Date;
}
export interface LoginResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface UsernameResponse {
  username: string;
  available: string;
}

export interface TagsResponse {
  file_id?: number;
  tag?: string;
  filename?: string;
  user_id?: number;
  description?: string;
  filesize?: number;
  mime_type?: string;
  tag_id?: number;
  time_added?: string;
  title?: string;
}

export interface PostEdit {
  title?: string;
  description?: string;
}

export interface DirectionMapJson {
  status?: string;
  routes?: [
    {
      legs?: [
        {
          arrival_time?: {
            text: string;
          };
          departure_time?: {
            text: string;
          };
          distance?: {
            text: string;
          };
          duration?: {
            text: string;
          };
          start_address?: string;
          end_address?: string;

          steps?: [
            {
              start_location?: {
                lat: string;
                lng: string;
              };
              start_location_address?: any;
              distance?: {
                text: string;
              };
              duration?: {
                text: string;
              };
              travel_mode?: string;
              travel_icon?: string;
              transit_details?: {
                departure_time?: {
                  text: string;
                };
                line?: {
                  short_name?: string;
                  vehicle?: {
                    type: string;
                  };
                };
              };
            }
          ];
        }
      ];
    }
  ];
}

export interface LocalAddressJson {
  results: [
    {
      formatted_address: string;
    }
  ];
}

export interface GeolocationByName {
  results: [
    {
      geometry: {
        location: {
          lat: string;
          lng: string;
        };
      };
    }
  ];
}

export interface DirectionLineData {
  origin: any;
  destination: any;
  travelMode: string;
  transitOptions?: {
    departureTime: Date;
    arrivalTime: Date;
    modes: [string]; // BUS, RAIL, SUBWAY, TRAIN, TRAM
    routingPreference: string; // "FEWER_TRANSFERS" or "LESS_WALKING"
  };
}
