import { Component, ViewChild, ElementRef  } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
// import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult,NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { ProfilePage } from '../profile/profile';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { DomSanitizer } from '@angular/platform-browser';

/**
* Generated class for the PointLocationPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
declare var google;

@IonicPage()
@Component({
  selector: 'page-point-location',
  templateUrl: 'point-location.html',
})
export class PointLocationPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  address:string;

  latitude:any;
  longitude:any;
  locat:any;
  geoAddress:any='';
  old_location:any;
  // geolocation: any;
  new_lat:any;
  new_long:any;
  cust_latLong:any;
  plum_latLong:any;
  GoogleAddress:any;
  url:any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(public navCtrl: NavController,
              public toastCtrl:ToastController,
              public locationAccuracy: LocationAccuracy,
              public navParams: NavParams,
              public geolocation: Geolocation,
              public dbService:DbserviceProvider,
              private nativeGeocoder: NativeGeocoder,
              public alertCtrl:AlertController,
              private sanitize: DomSanitizer) {
                if(this.new_lat  == undefined){
                  this.GoogleAddress = "https://maps.google.com/maps?q="+this.new_lat+','+this.new_long+"&output=embed"        
                  this.url = this.sanitize.bypassSecurityTrustResourceUrl(this.GoogleAddress);
                }
                this.loadMap();
               
        //  alert('haksjaks');
        //  this.getGeolocation();
  }
  isDealer:any


  ionViewDidLoad() {
    console.log('ionViewDidLoad PointLocationPage');

    this.latitude=this.navParams.get("lat");

    this.longitude=this.navParams.get("log");
    this.old_location=this.navParams.get("old_loc");
    if(this.navParams.get("mode")=='Dealer')
    {
      this.isDealer=true;
    }
    else
    {
      this.isDealer=false;
    }

    console.log(this.longitude);
    this.loadMap();

  }

  showSuccess(text)
  {
    let alert = this.alertCtrl.create({
      title:'Success!',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  loadMap() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
    .then(() => {
      let options = {
        maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
      };
      this.geolocation.getCurrentPosition().then((resp) => {
        let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }


        this.new_lat=resp.coords.latitude;
        this.new_long=resp.coords.longitude;
         console.log("lat value ",this.new_lat)
         console.log("lat value ",this.new_long)
        console.log(latLng);
        console.log("dydfwhdfhgcfd",this.GoogleAddress)
        if(this.new_lat != null){
          this.GoogleAddress = "https://maps.google.com/maps?q="+this.new_lat+','+this.new_long+"&output=embed"        
          this.url = this.sanitize.bypassSecurityTrustResourceUrl(this.GoogleAddress);
        }
      

        this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.addMarker(this.map);

      }).catch((error) => {
        this.dbService.presentToast('Error getting location')
        console.log('Error getting location', error);
      })
    },
    error => {
      console.log('Error requesting location permissions', error);
      let toast = this.toastCtrl.create({
        message: 'Allow Location Permissions',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    });

  }

  addMarker(map:any){

    let marker = new google.maps.Marker({
      map: map,
      animation: google.maps.Animation.DROP,
      position: map.getCenter()
    });

    let content = this.geoAddress;

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  getGeoencoder(latitude:any,longitude:any)
  {
    // console.log("getGeoencoder functions call",this.new_long);
    // console.log("this.geoencoderOptions",this.geoencoderOptions);
    // this.generateAddress('');
    
    // this.nativeGeocoder.reverseGeocode(this.new_lat, this.new_long, this.geoencoderOptions)
    // .then((result: NativeGeocoderReverseResult[]) => console.log("ya jaru ri ja a a a  a",JSON.stringify(result[0])))
      
    //   // this.geoAddress = this.generateAddress(result[0]);
    //   // console.log("======================================>",result)
    //   // console.log("getGeoencoder",this.geoAddress);
    //   // console.log("======================================>",result[0])
      
  
    // .catch((error: any) => {
    //   // alert('Error getting location'+ JSON.stringify(error));
    //   console.log("getGeoencoder inside catch ",error);
      

    // });

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
  };
  
  this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818, options)
    .then((result: NativeGeocoderReverseResult[]) => console.log(JSON.stringify(result[0])))
    .catch((error: any) => console.log(error));
  
  this.nativeGeocoder.forwardGeocode('Berlin', options)
    .then((coordinates: NativeGeocoderForwardResult[]) => console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude))
    .catch((error: any) => console.log(error));
  }

  //Return Comma saperated address
  generateAddress(addressObj:any){
    console.log("genarte address call===>",addressObj);
    console.log("genarte address call===>",this.address);
    let obj = [];
    let address = "";

    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if(obj[val].length)
      address += obj[val]+', ';
    }
    // console.log(address);

    return address.slice(0, -2);
  }

  add_loc()
  {
    this.loadMap();
    // this.geoAddress='NIT';
    console.log(this.geoAddress);
    console.log(this.new_lat);
    console.log(this.new_long);
    this.dbService.onPostRequestDataFromApi( {'customer_id': this.dbService.userStorageData.id,'cust_lat': this.new_lat,'cust_long':this.new_long ,'cust_geo_address':this.geoAddress},'app_karigar/addGeoLocation', this.dbService.rootUrl).subscribe(result =>
      {
      

        console.log(result);
        if(result['status']=='failed')
        {
          // alert('Geo Location not found! Try Again');
          // this.showSuccess("Geo Location not found!")   ;
          return;

        }
        var val=this.navCtrl.last();
        console.log("VAL");
        console.log(val);
        // alert('Geo Location updated successfully !');
        this.showSuccess("Geo Location updated Successfully!")   ;

        // this.navCtrl.setRoot(TabsPage,{index:'5'});
        this.navCtrl.setRoot(ProfilePage);
      });

  }
    addDealerLocation()
    {
      // this.geoAddress='NIT';
      console.log(this.geoAddress);
      console.log(this.new_lat);
      console.log(this.new_long);
      this.dbService.onPostRequestDataFromApi({user_data:this.dbService.userStorageData,"lat":this.new_lat,"lng":this.new_long},"dealerData/add_location", this.dbService.rootUrlSfa)
      .subscribe(resp=>{
        console.log(resp);

        this.dbService.presentToast("Geo Location updated!")

        this.navCtrl.pop();



      });

    }

    calculateAndDisplayRoute()
    {
      console.log(this.old_location);
      console.log(this.geoAddress);

      this.directionsService.route({
        origin:this.new_lat+','+this.new_long ,
        destination: this.latitude +','+this.longitude,
        travelMode: 'DRIVING'
      }, (response, status) => {
        // console.log(response);
        window.alert(response );

        // console.log(status);

        if (status === 'OK') {
          this.directionsDisplay.setDirections(response);
        } else {
          // window.alert('Directions request failed due to ' + status);
        }
      });
    }

    // trustSrc = function(src) {
    //   console.log("convert into trust src");
    //   return trustAsResourceUrl(src);
    // }

  }
