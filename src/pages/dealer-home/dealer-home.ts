import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { CategoryPage } from '../category/category';
import { ContactPage } from '../contact/contact';
import { AboutPage } from '../about/about';
import { DealerOrderPage } from '../dealer-order/dealer-order';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { NearestDealerPage } from '../nearest-dealer/nearest-dealer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { DealerDealerListPage } from '../dealer-dealer-list/dealer-dealer-list';

import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { VideoPage } from '../video/video';

@IonicPage()
@Component({
    selector: 'page-dealer-home',
    templateUrl: 'dealer-home.html',
})
export class DealerHomePage {

    lable:any;
    prodCount:any={};

    constructor(public navCtrl: NavController,
                public socialSharing:SocialSharing ,
                public events: Events,
                public navParams: NavParams,
                public offlineService: OfflineDbProvider,
                public dbService:DbserviceProvider ,
                public locationAccuracy: LocationAccuracy,
                public geolocation: Geolocation,
                public toastCtrl:ToastController) {

        events.subscribe('getCountProducts',(data)=> {

            if(this.dbService.deviceId!='') {

                  console.log('device id found' + this.dbService.userStorageData.id);

                  this.dbService.onPostRequestDataFromApi({'registration_id':this.dbService.deviceId ,dr_id: this.dbService.userStorageData.id},'DealerData/updateDeviceToken', this.dbService.rootUrlSfa).subscribe((r)=> {


                  });
            }

            this.get_count();
        })
    }

    ionViewWillEnter() {
        // this.notification();
        this.getDashBoardData()
        this.loginBanner()
        this.get_count()
        if(this.dbService.userStorageData.type==1) //that means lohin user is distributor
        {
            this.lable = 'My Dealers';

        } else // that means login user is dealer
        {
            this.lable = 'My Distributors';

        }
        console.log(this.dbService.deviceId);
        if(this.dbService.deviceId!='')
        {
            console.log('device id found' + this.dbService.userStorageData.id);
             this.dbService.onPostRequestDataFromApi({'registration_id':this.dbService.deviceId ,dr_id: this.dbService.userStorageData.id},'DealerData/updateDeviceToken',this.dbService.rootUrlSfa).subscribe((r)=>
                    {
                    });
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DealerHomePage');
        this.onProcessSQLDataHandler();

        }

    onProcessSQLDataHandler() {

        if(this.offlineService.localDBCallingCount === 0) {

            this.offlineService.localDBCallingCount++;
            this.offlineService.onValidateLocalDBSetUpTypeHandler();
        }
    }
    open_menu()
    {
        this.events.publish('side_menu:navigation_barDealer');
    }
    // goToNewArrivals()
    // {
    //     this.navCtrl.push(NewarrivalsPage);
    // }
    goOnContactPage(){
        this.navCtrl.push(ContactPage,{mode:'dealer'});
    }
    goOnAboutPage(){
        this.navCtrl.push(AboutPage,{mode:'dealer'});
    }
    goToarrivals()
    {
        this.navCtrl.push(NewarrivalsPage)
    }
    goOnProductPage()
    {
        this.navCtrl.push(CategoryPage,{'mode':'home'});
    }
    goToOrders(type)
    {
        console.log(type)
        this.navCtrl.push(DealerOrderPage,{mode:'dealer',type:type});
    }

    goto_executive()
    {
        this.navCtrl.push(DealerExecutiveListPage);
    }

    banner:any=[]
    loginBanner(){
        console.log('called');

        this.dbService.onPostRequestDataFromApi( '', 'app_karigar/loginBannersApp', this.dbService.rootUrl)
        .subscribe(d => {
            console.log(d);

            this.banner = d.banner;
            console.log(this.banner);
        });
    }
    goToNearestDealers(type)
    {
        var data = this.dbService.userStorageData.all_data;
        console.log(data);


        this.navCtrl.push(NearestDealerPage,{pincode:data.pincode,type:type});

    }
    newOrder()
    {
        this.navCtrl.push(DealerAddorderPage);
    }

    delaerexecutive(type)
    {
        this.navCtrl.push(DealerExecutiveAppPage,{"type":type});
    }


    ShareApp()
    {
        this.socialSharing.share('Hey There ! here is an awesome app from PureFlow Solutions Pvt Ltd  ..Give it a try https://play.google.com/store/apps/details?id=com.gravitybath.app ')
        .then(() => {
            console.log("success");
        }).catch((e) => {
            console.log(e);
        });
    }
    goToassignedDr()
    {
        this.navCtrl.push(DealerDealerListPage);
    }
    dashboardData:any={}
    getDashBoardData()
    {
        this.dbService.onShowLoadingHandler();
        setTimeout(() => {
            console.log(this.dbService.userStorageData.id)
            this.dbService.onPostRequestDataFromApi({dr_id:this.dbService.userStorageData.id,type:this.dbService.userStorageData.type},'DealerData/getDashboardData', this.dbService.rootUrlSfa)
            .subscribe((res)=>
            {
                console.log(res);
                this.dashboardData = res;
                console.log(this.dashboardData.secondary);
                console.log(this.dashboardData.primary);
                console.log(this.dashboardData.drCount);
                if(this.dashboardData.secondary.total_amount)
                {
                    this.dashboardData.secondary.total_amount = Math.round(this.dashboardData.secondary.total_amount)
                }
                if(this.dashboardData.secondary.total_amount)
                {
                    this.dashboardData.primary.total_amount = Math.round(this.dashboardData.primary.total_amount)
                }
                this.dbService.onDismissLoadingHandler();
            },err=>
            {
                this.dbService.onDismissLoadingHandler();
                this.dbService.errToasr();
            })

        }, 1000);
    }
    check_location()
    {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        .then(() => {
            let options = {
                maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
            };
            this.geolocation.getCurrentPosition(options)
            .then((resp) => {
                var lat = resp.coords.latitude
                var lng = resp.coords.longitude
                this.dbService.onPostRequestDataFromApi({user_data:this.dbService.userStorageData,"lat":lat,"lng":lng},"dealerData/add_location", this.dbService.rootUrlSfa)
                .subscribe(resp=>{
                    console.log(resp);

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
        });
    }
    doRefresh (refresher)
    {
        this.getDashBoardData()
        this.loginBanner()
        this.get_count()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
    notification()
    {
        this.dbService.onPostRequestDataFromApi('',"dealerData/send_push_notification", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);

        })
    }
    get_count()
    {
        this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {
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

    goToVideosPage(cat){
        console.log(cat);

        this.navCtrl.push(VideoPage,{cat:cat});
      }

}
