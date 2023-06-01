import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { OffersPage } from '../offers/offers';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-offer-list',
  templateUrl: 'offer-list.html',
})
export class OfferListPage {
  offer_list:any=[];
  loading:Loading;
  filter:any={};
  flag:any='';
  offer_imgurl:string='';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app:App) {
      this.offer_imgurl = dbService.offer_imgurl;
      console.log("url offer",this.offer_imgurl)
     if(this.dbService.connection=='offline')
      {
            this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
            this.navCtrl.setRoot(HomePage);
           
      }
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad OfferListPage');
    if(this.dbService.connection!='offline')
    {
      this.getofferList();
      this.presentLoading();
    }
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getofferList();
    refresher.complete();
  }

  goOnOffersPage(id)
  {
    this.navCtrl.push(OffersPage,{'id':id});

  }
  getofferList()
  {
    this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerList', this.dbService.rootUrl).subscribe(r=>
      {
        console.log(r);
        this.loading.dismiss();
        this.offer_list=r['offer'];
        console.log(this.offer_list);
      });
    }

    presentLoading()
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
        dismissOnPageChange: true
      });
      this.loading.present();
    }
    ionViewDidLeave()
    {
      if(this.dbService.connection!='offline')
      {
        let nav = this.app.getActiveNav();
        if(nav && nav.getActive())
        {
          let activeView = nav.getActive().name;
          let previuosView = '';
          if(nav.getPrevious() && nav.getPrevious().name)
          {
            previuosView = nav.getPrevious().name;
          }
          console.log(previuosView);
          console.log(activeView);
          console.log('its leaving');
          if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
          {

            console.log(previuosView);
            this.navCtrl.popToRoot();
          }
        }
      }
    }
  }
