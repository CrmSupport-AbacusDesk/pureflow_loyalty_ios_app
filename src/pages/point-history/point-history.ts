import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the PointHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-point-history',
  templateUrl: 'point-history.html',
})
export class PointHistoryPage {
  scan:string='';
  service:any=[];
  service1:string='';
  referal:string='';
  redeem:string='';
  filter:any={};
  transaction_detail:any=[];
  loading:any;
  offerData:any=[];
  coupon_list:any=[];
  referal_histroy:any=[];
  notData:boolean=false;

  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private dbService:DbserviceProvider,
    public loadingCtrl:LoadingController,
    ) 
    {
    this.scan = this.navParams.get('scan');
    this.service1 = this.navParams.get('service');
    this.redeem = this.navParams.get('redeem');
    this.referal = this.navParams.get('referal');
   }

  ionViewDidLoad() {
      if( this.scan === 'scan'){
          this.getCoupanHistory();
          
         
      }
      else if(this.service1 === 'service'){
        this.services() 
       
      }
      else if(this.redeem === 'redeem'){
        this.getTransactionDetail();
     
      }
      else if(this.referal === 'referal'){
        this.referals() 
       
      }
      // else if()
  }
  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
      enableBackdropDismiss : true
    });
    this.loading.present();
  }
  doRefresh(refresher)
  {
        if( this.scan === 'scan'){
          this.getCoupanHistory();
  
      }
      else if(this.service1 === 'service'){
        this.services() 
      }
      else if(this.redeem === 'redeem'){
        this.getTransactionDetail();
      }
      else if(this.referal === 'referal'){
        this.referals() 
      }
    refresher.complete();
  }

  

  getCoupanHistory()
  {
    this.presentLoading();
    this.filter.limit=0;
    console.log( this.loading);
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/couponHistory', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
        if(r){
          this.coupon_list =r['coupon'];
          console.log("karigar point length====>", this.coupon_list.length)
          this.loading.dismiss();
        }
      });
    }
    flag:any='';
    loadDataScan(infiniteScroll)
    {
      console.log('loading');
      this.filter.limit=this.coupon_list.length;
      this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/couponHistory', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          if(r['coupon'] == '')
          { this.flag=1;}
          else
          {
            setTimeout(()=>{
              this.coupon_list=this.coupon_list.concat(r['coupon']);
              console.log('Asyn operation has stop')
              infiniteScroll.complete();
            },1000);
          }
        });
      }

      services(){
        this.presentLoading();
        this.filter.limit=0;
            this.dbService.onPostRequestDataFromApi({'plumber_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/getPlumberComplaintList', this.dbService.rootUrl)
            .subscribe((r)=>
            {
                console.log(r);
                if(r)
                {
                    this.loading.dismiss();
                    this.service = r['plumberComplaintList']
                  
                }
            });
      }

      loadDataService(infiniteScroll)
      {
        console.log('loading');
        this.filter.limit=this.service.length;
        this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'plumber_id': this.dbService.userStorageData.id },'app_karigar/getPlumberComplaintList', this.dbService.rootUrl).subscribe( r =>
          {
            console.log(r);
            if(r['coupon'] == '')
            { this.flag=1;}
            else
            {
              setTimeout(()=>{
                this.service =this.service.concat(r['plumberComplaintList']);
                console.log('Asyn operation has stop')
                infiniteScroll.complete();
              },1000);
            }
          });
        }
      referals(){
           this.presentLoading();
          this.filter.limit=0;
          this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/referal_logs', this.dbService.rootUrl)
          .subscribe((r)=>
          {
              console.log(r);
              if(r)
              {
                  this.referal_histroy = r['referal_logs']
                  this.loading.dismiss();
              }
          });
        }
        loadDataReferal(infiniteScroll)
        {
          console.log('loading');
          this.filter.limit=this.referal_histroy.length;
          this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/referal_logs', this.dbService.rootUrl).subscribe( r =>
            {
              console.log(r);
              if(r['coupon'] == '')
              { this.flag=1;}
              else
              {
                setTimeout(()=>{
                  this.referal_histroy =this.referal_histroy.concat(r['referal_logs']);
                  console.log('Asyn operation has stop')
                  infiniteScroll.complete();
                },1000);
              }
            });
          }

         
        getTransactionDetail()
          {  this.presentLoading();
              
              this.filter.limit=0;
              this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'filter':this.filter},'app_karigar/transaction', this.dbService.rootUrl)
              .subscribe((r)=>
              {
                  console.log(r);
                  if(r)
                  {
                      this.transaction_detail=r['transaction']
                      console.log("value ====>",this.transaction_detail.length)
                     
                     
                  }
                  this.loading.dismiss();
              });
          }
          loadDataRedeem(infiniteScroll)
          {
            console.log('loading');
            this.filter.limit = this.transaction_detail.length;
            this.dbService.onPostRequestDataFromApi( {'filter':this.filter,'karigar_id': this.dbService.userStorageData.id },'app_karigar/transaction', this.dbService.rootUrl).subscribe( r =>
              {
                console.log(r);
                // if(r['coupon'] == '')
                // { this.flag=1;}
                // else
                // {
                  setTimeout(()=>{
                    this.transaction_detail = this.transaction_detail.concat(r['transaction']);
                    console.log('Asyn operation has stop')
                    infiniteScroll.complete();
                  },1000);
                // }
              });
            }



}
