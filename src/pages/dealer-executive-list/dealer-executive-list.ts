import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { OrderDetailPage } from '../order-detail/order-detail';
import { DealerExecutiveAppPage } from '../dealer-executive-app/dealer-executive-app';
import { ExecutivDetailPage } from '../executiv-detail/executiv-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
    selector: 'page-dealer-executive-list',
    templateUrl: 'dealer-executive-list.html',
})
export class DealerExecutiveListPage {

    user_id:any=0;
    exeType:any='My';
    tabSelected:any
    start:any=0;
    limit:any=10;
    flag:any='';
    user_data:any={};
    filter:any={}
    mediaData:any=[];

    constructor(public navCtrl: NavController,
                private app:App,
                public navParams: NavParams,
                public dbService: DbserviceProvider,
                public storage:Storage) {


    }

    ionViewWillEnter() {

          this.user_data = this.dbService.userStorageData;
          this.user_id = this.dbService.userStorageData.id;
          console.log(this.user_data);

          this.get_executives();
    }

    ionViewDidLoad() {

    }

    change_tab(type)
    {
        this.exeType = type;
        this.executive_list = [];
        this.start = 0;
        this.filter = {};
        this.get_executives();
    }

    executive_list:any=[];
    my_cn:any=0;
    company_cn:any=0;
    goToDetail(id)
    {
        console.log(id);

        this.navCtrl.push(ExecutivDetailPage,{id:id})
    }
    loadDataa:any=1;
    get_executives()
    {
        this.loadDataa=1;
        this.filter.type = this.exeType;
        console.log(this.filter);

        if(!this.filter.master)
        {
            this.dbService.onShowLoadingHandler();
        }
        this.dbService.onPostRequestDataFromApi({"search":this.filter,"dr_id":this.user_id,"start":this.start,"limit":this.limit},"dealerData/get_executives", this.dbService.rootUrlSfa)
        .subscribe(resp=>{

            console.log(resp);
            this.executive_list = resp['executive_list'];
            this.company_cn = resp['company_count'];
            this.my_cn = resp['my_count'];
            this.dbService.onDismissLoadingHandler();
            this.loadDataa=0;

        },err=>
        {
            this.dbService.onDismissLoadingHandler();
            this.dbService.errToasr();
        })
    }

    get_executivessearch()
    {
        this.loadDataa=1;
        this.filter.type = this.exeType;
        console.log(this.filter);


        this.dbService.onPostRequestDataFromApi({"search":this.filter,"dr_id":this.user_id,"start":this.start,"limit":this.limit},"dealerData/get_executives", this.dbService.rootUrlSfa)
        .subscribe(resp=>{

              console.log(resp);
              this.executive_list = resp['executive_list'];
              this.company_cn = resp['company_count'];
              this.my_cn = resp['my_count'];
              this.loadDataa = 0;

        },err=>
        {
            this.dbService.errToasr();
        })
    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.start = this.executive_list.length;
        this.filter.type = this.exeType;

        this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit},"dealerData/get_executives", this.dbService.rootUrlSfa)
        .subscribe((r) =>{
            console.log(r);
            if(r['executive_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.executive_list=this.executive_list.concat(r['executive_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }

    add_order()
    {
        this.navCtrl.push(DealerAddorderPage);
    }

    goOnOrderDetail(id){
        this.navCtrl.push(OrderDetailPage,{id:id})
    }
    doRefresh (refresher)
    {
        this.filter.master='';
        this.filter.date = '';
        this.get_executives()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    add_exe()
    {
        this.navCtrl.push(DealerExecutiveAppPage);
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
            if((previuosView=='ExecutivDetailPage'))
            {
                this.navCtrl.popToRoot();
            }
        }
    }

}
