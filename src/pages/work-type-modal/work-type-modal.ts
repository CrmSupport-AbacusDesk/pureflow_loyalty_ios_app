import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController, ViewController, LoadingController, Events } from 'ionic-angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-work-type-modal',
  templateUrl: 'work-type-modal.html',
})
export class WorkTypeModalPage {
  working_type:any=[]
  input_type:any = false;
  user_id:any
  data:any={};

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public navParams: NavParams,
              public viewcontrol:ViewController,
              public loadingCtrl: LoadingController,
              public locationAccuracy: LocationAccuracy,
              public dbService: DbserviceProvider,
              public geolocation: Geolocation,
              private storage: Storage,
              public events: Events) {


        const id = this.dbService.userStorageData.id;
        console.log(id);
        if(typeof(id) !== 'undefined' && id) {

              this.user_id = id;
              console.log(this.user_id);
        }

        this.getWorkingType();
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad WorkTypeModalPage');
    }

    getWorkingType()
    {
      this.dbService.onPostRequestDataFromApi({}, 'attendence/get_working_type', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            console.log(response);
            this.working_type=response;
      });
    }

    open_input(data)
    {
      this.data.work_type = data;

      if(data=='Working')
      {
        this.viewcontrol.dismiss();
        this.start_attend();
      }

      if(data == 'Travel')
      {
        this.input_type = true;
      }
      else
      {
        this.input_type = false;
      }
    }

    close()
    {
      this.viewcontrol.dismiss();
    }



    start_attend()
    {

      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {

          let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
          this.geolocation.getCurrentPosition(options).then((resp) => {

            var lat = resp.coords.latitude
            var lng = resp.coords.longitude

            this.dbService.onShowLoadingHandler()

            this.dbService.onPostRequestDataFromApi({ 'lat': lat, 'lng': lng, 'id':this.user_id, 'data':this.data}, 'Attendence/start_attend', this.dbService.rootUrlSfa).subscribe((result) =>
            {
                  if(result['msg'] =='success')
                  {
                        this.events.publish('user:login');

                        this.dbService.onDismissLoadingHandler();

                        this.viewcontrol.dismiss();

                  }
            })

          }).catch((error) => {

              this.dbService.presentToast('Could Not Get Location!!')
              this.dbService.onDismissLoadingHandler();

          });
        },
        error => {
              this.dbService.onDismissLoadingHandler();
              this.dbService.presentToast('Please Allow Location!!')
        });

      }

      submit()
      {
        console.log(this.data);
        this.start_attend();
      }


    }
