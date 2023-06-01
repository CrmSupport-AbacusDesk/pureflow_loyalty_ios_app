import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, Events, Platform, MenuController, ModalCmp, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { CheckinListPage } from '../sales-app/checkin-list/checkin-list';
import moment from 'moment';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MainDistributorListPage } from '../sales-app/main-distributor-list/main-distributor-list';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { OrderListPage } from '../order-list/order-list';
import { AddCheckinPage } from '../sales-app/add-checkin/add-checkin';
import { WorkTypeModalPage } from '../work-type-modal/work-type-modal';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { Network } from '@ionic-native/network';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
    selector: 'page-dashboard',
    templateUrl: 'dashboard.html',
})
export class DashboardPage {

    attend_id: any = '';
    currentTime:any = '';
    user_id:any = '';

    last_attendence_data: any = [];
    user_data:any = [];
    today_checkin:any = [];
    total_dealer:any= [];
    total_distributor:any = [];
    total_direct_dealer:any = [];
    user_logged_in:boolean;
    start_attend_time:any;
    total_primary_order:any = [];
    total_secondary_order:any = [];
    primary_order_sum :number;
    secondary_order_sum:number;

    attendence_data: any = [];
    prodCount:any = {};

    constructor(private network :Network,
                public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public geolocation: Geolocation,
                private storage: Storage,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public events: Events,
                public locationAccuracy: LocationAccuracy,
                public platform: Platform,
                public push: Push,
                public dbService: DbserviceProvider,
                public menu: MenuController,
                public modal: ModalController,
                public offlineService: OfflineDbProvider) {


              events.subscribe('getCountProducts',(data)=> {
                    this.get_count_ofProducts();
              })
        }

        ionViewWillEnter()
        {
            this.last_attendence();
            this.get_count_ofProducts();

            var time =  new Date();

            this.currentTime = moment().format("HH:mm:ss");

            this.platform.ready().then(()=>{


                this.network.onConnect().subscribe(() => {
                    this.dbService.connectionChk = 'online;'
                });
                this.network.onDisconnect().subscribe(() => {
                    this.dbService.connectionChk = 'offline';
                });

            })
        }

        get_count_ofProducts() {

            this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {

                console.log(productCount);
                this.prodCount.total= productCount

            },err=>
            {

            });

            this.offlineService.onReturnActiveProductNewArrivalsCountHandler().subscribe(productCount1 => {

                this.prodCount.new= productCount1

            },err=>
            {

            });
            console.log(this.prodCount);

        }

        onProcessSQLDataHandler() {

            if(this.offlineService.localDBCallingCount === 0) {

                this.offlineService.localDBCallingCount++;
                this.offlineService.onValidateLocalDBSetUpTypeHandler();
            }
        }


        ionViewDidLoad() {

            this.onProcessSQLDataHandler();
        }

        ionViewDidEnter()
        {
            this.last_attendence();

            this.events.publish('current_page','Dashboard');
        }

        ionViewDidLeave()
        {
            this.events.publish('current_page','');
        }


        openModal()
        {
            let workTypeModal =  this.modal.create(WorkTypeModalPage);

            workTypeModal.onDidDismiss(data =>
                {
                    this.events.publish('user:login');
                    this.last_attendence();
                });

                workTypeModal.present();
        }

        stop_attend() {

            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {

                    let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                    this.geolocation.getCurrentPosition(options).then((resp) => {

                        var lat = resp.coords.latitude
                        var lng = resp.coords.longitude
                        this.dbService.onShowLoadingHandler()

                        this.dbService.onPostRequestDataFromApi({ 'lat': lat, 'lng': lng, 'attend_id': this.last_attendence_data.attend_id }, 'Attendence/stop_attend', this.dbService.rootUrlSfa).subscribe((result) => {

                            if(result =='success')
                            {
                                this.last_attendence();
                                this.dbService.onDismissLoadingHandler();

                                this.dbService.presentToast('Work Time Stopped Successfully')
                            }
                        },err=>
                        {
                            this.dbService.onDismissLoadingHandler()
                            this.dbService.errToasr()
                        })

                    }).catch((error) => {
                        this.dbService.presentToast('Could Not Get Location !!')
                    });
                },
                error => {
                    this.dbService.presentToast('Please Allow Location !!')

                });
        }

        presentAlert() {
            let alert = this.alertCtrl.create({
                title: 'Stop Time',
                message: 'Do you want to stop work time?',
                cssClass: 'alert-modal',
                buttons: [
                    {
                        text: 'Yes',
                        handler: () => {
                            console.log('Yes clicked');
                            this.stop_attend();
                        }
                    },
                    {
                        text: 'No',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');



                        }
                    }

                ]
            });
            alert.present();
        }


        last_attendence()
        {
            this.dbService.onGetRequestDataFromApi('Attendence/last_attendence_data', this.dbService.rootUrlSfa).subscribe((result) => {
                console.log(result);
                this.last_attendence_data = result['attendence_data'];
                this.user_data = result['user_data'];
                this.today_checkin = result['today_checkin'];
                this.total_dealer = result['total_dealer'];
                this.total_direct_dealer = result['total_direct_dealer'];
                this.total_distributor = result['total_distributor'];
                this.total_primary_order = result['total_primary_order'];
                this.total_secondary_order = result['total_secondary_order'];

                if(this.last_attendence_data.start_time != '')
                {
                    var dt = moment("12:15 AM", ["h:mm A"]).format("HH:mm");
                    var H = +this.last_attendence_data.start_time.substr(0, 2);
                    var h = (H % 12) || 12;
                    var ampm = H < 12 ? "AM" : "PM";
                    this.start_attend_time = h + this.last_attendence_data.start_time.substr(2, 3) + ampm;
                }
            })
        }

        open_menu()
        {
            console.log(this.dbService.userStorageData);
            this.events.publish('user:navigation_menu');
        }

        goToCheckin()
        {
            this.navCtrl.push(CheckinListPage);
        }

        goToMainDistributorListPage(type)
        {
            this.navCtrl.push(MainDistributorListPage ,{'type':type})
        }

        start_visit()
        {
            this.navCtrl.push(AddCheckinPage);
        }

        goToOrders(type)
        {
            this.navCtrl.push(OrderListPage,{'type':type});
        }
}
