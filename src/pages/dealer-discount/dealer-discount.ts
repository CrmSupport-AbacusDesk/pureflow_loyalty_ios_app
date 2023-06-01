import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-discount',
    templateUrl: 'dealer-discount.html',
})
export class DealerDiscountPage {
    norec:any=false
    today_checkin:any=[];
    user_id:any=0;
    start:any=0;
    limit:any=10;
    flag:any='';
    filter:any={};
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public storage:Storage,
                public dbService:DbserviceProvider) {

            this.user_id = this.dbService.userStorageData.id;
            console.log(this.user_id);
            this.get_all_checkin()
    }

    ionViewDidLoad() {

    }

    discount_list:any=[];
    get_all_checkin()
    {
        this.dbService.onShowLoadingHandler()
        this.norec=false
        this.dbService.onPostRequestDataFromApi({user_id:this.user_id,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_discount", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.dbService.onDismissLoadingHandler()
            this.discount_list = resp['discount_list'];
            if(this.discount_list.length==0)
            {
                this.norec=true
            }
        },err=>
        {
            this.dbService.onDismissLoadingHandler();
            this.dbService.errToasr()
        })
    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.start = this.discount_list.length;
        this.dbService.onPostRequestDataFromApi({user_id:this.user_id,"start":this.start,"limit":this.limit,"search":this.filter},"dealerData/get_discount", this.dbService.rootUrlSfa)
        .subscribe((r) =>{
            console.log(r);
            if(r['discount_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.discount_list=this.discount_list.concat(r['discount_list']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
}
