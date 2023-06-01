import { Component, TestabilityRegistry } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController, ModalController, LoadingController, PopoverController, ToastController } from 'ionic-angular';
import moment from 'moment';
import { CheckinDetailPage } from '../sales-app/checkin-detail/checkin-detail';
import { ExecutiveOrderDetailPage } from '../executive-order-detail/executive-order-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-leads-detail',
  templateUrl: 'leads-detail.html',
})
export class LeadsDetailPage {
    dr_id:any;
    distributor_detail:any=[];
    total_checkin:any = [];
    total_order:any = [];
    type:any
    search:any={}
    date:any
    showRelatedTab:any
    constructor( private app:App,
                 public navCtrl: NavController,
                 private alertCtrl: AlertController,
                 public dbService:DbserviceProvider,
                 public modalCtrl: ModalController,
                 public navParams: NavParams,
                 public loadingCtrl: LoadingController,
                 public popoverCtrl: PopoverController,
                 public toastCtrl:ToastController) {

        this.date = moment(this.date).format('YYYY-MM-DD');

        if(this.navParams.get('dr_id'))
        {
            this.dr_id=this.navParams.get('dr_id');
            console.log(this.dr_id);
            this.lead_detail();
        }

        if(this.navParams.get('showRelatedTab') == 'false')
        {
            this.showRelatedTab = false
        }
        else
        {
            this.showRelatedTab = true
        }
        console.log(this.navParams.get('showRelatedTab'));
        console.log(this.showRelatedTab);

        if(this.navParams.get('type'))
        {
            this.type=this.navParams.get('type');
            console.log(this.type);
            this.distributor_detaill.orderType='Primary'

            this.dr_detail('Primary');
        }

    }

    ionViewDidLoad() {

    }

    loading:any;
    lodingPersent()
    {
        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        this.loading.present();
    }


    lead_detail()
    {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        console.log(this.search);

        loading.present()
        this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id,search:this.search},'Distributor/lead_detailexec', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            this.distributor_detail = result['result'];
            this.total_checkin = result['total_checkin'];
            console.log(this.distributor_detail);
            loading.dismiss();
        });
        loading.present();
    }
    distributor_detaill:any={}
    secondary:any=[]
    dr_detail(type)
    {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        this.distributor_detaill.orderType = type

        console.log(this.search);
        loading.present()
        this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id,search:this.search},'Distributor/dr_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            this.distributor_detail = result['result'];
            // this.total_checkin = result['total_checkin'];
            this.total_order = result['Primary'];
            this.secondary = result['Secondary'];
            console.log(this.distributor_detail);
            loading.dismiss();

        });

        loading.present();
    }

    checkin_list:any = [];
    load_data:any = "0";
    order_list:any=[];



    ionViewDidLeave()
    {

    }
    checkin_detail(checkin_id)
    {

      console.log(checkin_id);

      this.dbService.onPostRequestDataFromApi({'checkin_id':checkin_id},'Checkin/checkin_detail', this.dbService.rootUrlSfa).subscribe((result)=>
      {
        console.log(result);
        if(result)
        {
            this.navCtrl.push(CheckinDetailPage,{'data':result,checkin_id:checkin_id});
        }
      })

    }

    goOnOrderDetail(id){
        this.navCtrl.push(ExecutiveOrderDetailPage,{id:id , login:'Employee'})
    }
    convertdealer()
    {
        console.log("convertdealer");
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: 'You want To Convert This Lead To Dealer',
            cssClass:'action-close',
            
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
               
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                    
                    this.navCtrl.pop();
                }
            }]
        });
        alert.present();
        console.log(this.dr_id);   
        this.dbService.onPostRequestDataFromApi({'id':this.dr_id},'Distributor/convert_lead', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);

        })

    }
}
