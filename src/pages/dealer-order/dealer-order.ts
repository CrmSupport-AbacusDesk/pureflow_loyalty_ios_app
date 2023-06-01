import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { OrderDetailPage } from '../order-detail/order-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-order',
    templateUrl: 'dealer-order.html',
})
export class DealerOrderPage{

    user_id:any=0;
    order_type:any='';
    tabSelected:any
    start:any=0;
    limit:any=10;
    flag:any='';
    user_data:any={};
    filter:any={}
    count:any={}
    constructor(public navCtrl: NavController,
                private app:App,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public storage:Storage) {

    }

    ionViewDidLoad(){
        // alert('test')
    }
    ionViewWillEnter()
    {
        if(this.dbService.tabSelectedOrder && this.dbService.tabSelectedOrder!='')
        {
            this.filter.order_status = this.dbService.tabSelectedOrder;
        }
        else
        {
            this.filter.order_status='Pending'
        }
        this.order_type = this.navParams.get("type");
        console.log(this.order_type);

        this.user_data = this.dbService.userStorageData;
        this.user_id = this.dbService.userStorageData.id;
        console.log(this.user_data);
        console.log(this.user_data.type);
        

        this.get_orders();

        if((this.dbService.userStorageData.type==1) && !this.order_type) //that means login user is distributor
        {
            this.order_type = 'Primary'
        }
        else // that means login user is dealer
        {
            this.order_type = 'Secondary'
        }
        this.order_type = this.navParams.get("type");
    }

    change_tab(type)
    {
        this.order_type = type;
        this.order_list = [];
        this.start = 0;
        this.filter = {};
        this.get_orders();
    }

    order_list:any=[];
    // pri_ord:any=0;
    // sec_ord:any=0;
    sendRequest:any=false
    get_orders()
    {
        console.log(this.filter.order_status);

        this.filter.type = this.order_type;
        this.sendRequest=false
        this.dbService.onShowLoadingHandler();

        this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit,'status':this.filter.order_status,type:this.user_data.type},"dealerData/get_orders2", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.order_list = resp['order_list'];
            this.count = resp['count'];
            this.flag=''
            this.order_list.map((item)=>{
                item.order_grand_total = Math.round(item.order_grand_total);
            })
            // if(!this.filter.master)
            this.sendRequest=true
            this.dbService.onDismissLoadingHandler();
        },err=>
        {
            this.dbService.onDismissLoadingHandler();
            this.dbService.errToasr();
        })
    }


    get_orderssearch()
    {

        this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit,'status':this.filter.order_status,type:this.user_data.type},"dealerData/get_orders2", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.order_list = resp['order_list'];
            this.count = resp['count'];

            // this.pri_ord = resp['pri_ord_cn'];
            // this.sec_ord = resp['sec_ord_cn'];

            this.order_list.map((item)=>{
                item.order_grand_total = Math.round(item.order_grand_total);
            })

        },err=>
        {
        })
    }


    get_orders1(){

        console.log(this.order_type);
        console.log(this.filter);
        
        this.start = this.order_list.length;
        this.filter.type = this.order_type;

        this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit,'status':this.filter.order_status,type:this.user_data.type},"dealerData/get_orders2", this.dbService.rootUrlSfa)
        .subscribe((r) =>{
            console.log(r);
            this.order_list=this.order_list.concat(r['order_list']);
        });
    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.start = this.order_list.length;
        this.filter.type = this.order_type;

        this.dbService.onPostRequestDataFromApi({"search":this.filter,"user_id":this.user_id,"start":this.start,"limit":this.limit,'status':this.filter.order_status},"dealerData/get_orders2", this.dbService.rootUrlSfa)
        .subscribe((r) =>{
            console.log(r);
            if(r['order_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.order_list=this.order_list.concat(r['order_list']);
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
        this.start=0
        this.filter.master='';
        this.filter.date = '';
        this.get_orders()
        setTimeout(() => {
            refresher.complete();
        }, 1000);
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
            if((previuosView=='DealerAddorderPage'))
            {
                this.navCtrl.popToRoot();
            }
        }
    }
}
