import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DistributorDetailPage } from '../sales-app/distributor-detail/distributor-detail';
import { ViewProfilePage } from '../view-profile/view-profile';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-dealer-list',
    templateUrl: 'dealer-dealer-list.html',
})
export class DealerDealerListPage
{

    today_checkin:any=[];
    user_data:any={};
    start:any=0;
    limit:any=10;
    flag:any='';
    filter:any={};
    load_data:any
    constructor( private app:App,
                 public modalCtrl: ModalController,
                 public navCtrl: NavController,
                 public navParams: NavParams,
                 public storage:Storage,
                 public dbService:DbserviceProvider,
                 public loadingCtrl: LoadingController){

    }

    ionViewWillEnter()
    {
        this.user_data = this.dbService.userStorageData;
        console.log(this.dbService.userStorageData);

        this.get_assign_dr()

    }

    viewProfiePic(src)
    {
      this.modalCtrl.create(ViewProfilePage, {"Image": "http://phpstack-83335-1831788.cloudwaysapps.com/uploads/"+src}).present();
    }
    dr_list:any=[];
    get_assign_dr()
    {
        this.load_data=''

        this.dbService.onShowLoadingHandler();
        this.dbService.onPostRequestDataFromApi({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_assign_dr", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.dbService.onDismissLoadingHandler()
            this.dr_list = resp['dr_list'];
            if(!this.dr_list.length)
            {
                this.load_data='1'
            }
        },
        err=>
        {
            this.dbService.onDismissLoadingHandler();
            this.dbService.errToasr();
        })
    }
    get_assign_drsearch()
    {
        // this.db.show_loading();
        this.dbService.onPostRequestDataFromApi({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_assign_dr", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            // this.db.dismiss()
            this.dr_list = resp['dr_list'];
        },
        err=>
        {
            // this.db.dismiss();
            this.dbService.errToasr();
        })
    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.start = this.dr_list.length;
        this.dbService.onPostRequestDataFromApi({user_data:this.user_data,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_assign_dr", this.dbService.rootUrlSfa)
        .subscribe((r) =>{
            console.log(r);
            if(r['dr_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.dr_list=this.dr_list.concat(r['dr_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }

    dealer_details:any = [];
    dealer_checkin:any = [];
    dealer_order:any = [];

    edit_dis:boolean = false;
    dealer_detail(dr_id)
    {
        if(this.dbService.userStorageData.all_data.type==1)
        {

            let loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            this.dbService.onPostRequestDataFromApi({'dr_id':dr_id},'Distributor/dealer_detail', this.dbService.rootUrlSfa)
            .subscribe((result)=>{
                console.log(result);
                this.dealer_details = result['result'];
                this.dealer_checkin = result['total_checkin'];
                this.dealer_order = result['total_order'];
                loading.dismiss();
                console.log(this.user_data.type);

                if(this.user_data.type == '1')
                {
                    this.edit_dis = true;
                }
                this.navCtrl.push(DistributorDetailPage,{'dr_id':dr_id,'edit_discount':this.edit_dis,'dealer_data':this.dealer_details, 'dealer_checkin': this.dealer_checkin,'dealer_order':this.dealer_order});
            });
            loading.present();
        }
    }
    ionViewDidLeave()
    {
        let nav = this.app.getActiveNav();
        console.log(nav);

        if(nav && nav.getActive())
        {
            let activeView = nav.getActive().name;
            console.log(activeView);

            let previuosView = '';
            console.log(previuosView);

            if(nav.getPrevious() && nav.getPrevious().name)
            {
                previuosView = nav.getPrevious().name;
            }
            console.log(previuosView);
            console.log(activeView);
            console.log('its leaving');
            if((previuosView=='DealerExecutiveAppPage'))
            {
                this.navCtrl.popToRoot();
            }
        }
    }
}
