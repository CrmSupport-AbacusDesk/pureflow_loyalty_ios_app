import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Loading, LoadingController, App, } from 'ionic-angular';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { OffersPage } from '../../offers/offers';
import { CancelpolicyModalPage } from '../../cancelpolicy-modal/cancelpolicy-modal';

@IonicPage()
@Component({
	selector: 'page-gift-detail',
	templateUrl: 'gift-detail.html',
})
export class GiftDetailPage {
	gift_id:any='';
	gift_detail:any={};
	balance_point:any='';
	loading:Loading;
	star:any='';
	rating_star:any='';
	otp:'';
	offer_balance:any=''
	karigar_detail:any={};
	total_balance:number=0;
	offer_imgurl:string='';
	gift_imgurl:string='';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public modalCtrl: ModalController,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController,
              private app: App) {
				this.offer_imgurl = dbService.offer_imgurl;
				this.gift_imgurl = dbService.gift_imgurl;
			  }

	ionViewDidLoad() {
		console.log('ionViewDidLoad GiftDetailPage');
		this.gift_id = this.navParams.get('id');
		this.getGiftDetail(this.gift_id)
		this.presentLoading();
	}

	presentCancelPolicyModal() {
		let contactModal = this.modalCtrl.create(CancelpolicyModalPage,{'karigar_id':this.dbService.userStorageData.id,'gift_id':this.gift_id});
		contactModal.present();
		console.log('otp');
	}
	goOnOfferDetailPage(offer_id)
	{
		this.navCtrl.push(OffersPage,{'id':offer_id})
	}


	getGiftDetail(gift_id)
	{
		console.log(gift_id);
		this.dbService.onPostRequestDataFromApi({'gift_id' :gift_id,'karigar_id':this.dbService.userStorageData.id},'app_karigar/giftDetail', this.dbService.rootUrl).subscribe( r =>
			{
				console.log(r);
				this.loading.dismiss();
				this.gift_detail=r['gift'];
				this.karigar_detail=r['karigar'];
				this.total_balance=r['karigar'].total_balance
				this.rating_star=parseInt(r['gift'].rating);
				console.log(this.gift_detail);
				this.offer_balance= parseInt(r['gift'].offer_balance );
				this.balance_point= parseInt(r['karigar'].balance_point ) + parseInt(r['karigar'].service_wallet_balance_points) + parseInt(r['karigar'].referal_point_balance);
				console.log(this.balance_point
					);
				
				this.gift_detail.coupon_points = parseInt( this.gift_detail.coupon_points );
				if(r['gift_star'])
				{
					this.star=parseInt(r['gift_star'].star);
					console.log(this.star);
				}

			});
		}
		presentLoading()
		{
			this.loading = this.loadingCtrl.create({
				content: "Please wait...",
				dismissOnPageChange: false
			});
			this.loading.present();
		}

		rating(star)
		{
			this.presentLoading();
			console.log(star);
			this.dbService.onPostRequestDataFromApi({'star':star,'gift_id' :this.gift_id,'karigar_id':this.dbService.userStorageData.id,'offer_id':this.gift_detail.offer_id},'app_karigar/giftRating', this.dbService.rootUrl).subscribe(r=>{
				console.log(r);
				if(r)
				{
					this.getGiftDetail(this.gift_id)
				}
			});
		}
		ionViewDidLeave() {

			let nav = this.app.getActiveNav();

			if(nav && nav.getActive()) {

				  let activeView = nav.getActive().name;

				  let previuosView = '';
				  if(nav.getPrevious() && nav.getPrevious().name) {
					previuosView = nav.getPrevious().name;
				  }

				  console.log(previuosView);
				  console.log(activeView);
				  console.log('its leaving');

				  if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) {

				      console.log(previuosView);
				      this.navCtrl.popToRoot();
				  }
			}

		  }
	}
