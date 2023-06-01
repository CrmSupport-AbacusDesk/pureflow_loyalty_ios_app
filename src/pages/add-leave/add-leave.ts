import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,LoadingController } from 'ionic-angular';
import * as moment from 'moment/moment';
import { LeaveListPage } from '../leave-list/leave-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-add-leave',
  templateUrl: 'add-leave.html',
})
export class AddLeavePage {
  data:any={};
  attend_id:any;
  start_time:any='';
  stop_time:any='';
  currentTime:any='';
  sub_list:any=[];
  today_date:any='';
  loading: any;

  currentDay:any=''
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService: DbserviceProvider,
              public alertCtrl:AlertController,
              private toastCtrl: ToastController,
              public loadingCtrl:LoadingController) {

  }

  ionViewDidLoad() {

        console.log('ionViewDidLoad AddLeavePage');
        this.currentTime = moment().format("HH:mm:ss");
        this.data.currentDay = moment().format("Y-M-D");

        this.today_date = new Date().toISOString().slice(0,10);
        console.log(this.today_date);
        this.data.type = 'Full Day';
  }

  add_leave() {

         this.dbService.onShowLoadingHandler();

         this.dbService.onPostRequestDataFromApi({'data':this.data}, 'leave/add_leave',  this.dbService.rootUrlSfa).subscribe(response => {

              console.log(response);

              this.presentToast1();
              this.navCtrl.push(LeaveListPage);
              this.dbService.onDismissLoadingHandler();

        },err=> {

              this.dbService.onDismissLoadingHandler();
              this.dbService.errToasr()
        });
    }

    presentToast1() {

          let toast1 = this.toastCtrl.create({
              message: 'Leave Added Successfully',
              duration: 3000,
              position: 'bottom'
          });

          toast1.present();
    }
}
