import { Component } from '@angular/core';
import { NavController, Loading, LoadingController, AlertController, ModalController, Events, NavParams, ToastController } from 'ionic-angular';
import { ScanPage } from '../scane-pages/scan/scan';
import { OfferListPage } from '../offer-list/offer-list';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OffersPage } from '../offers/offers';
import { Storage } from '@ionic/storage';
import * as moment from 'moment/moment';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { GiftListPage } from '../gift-gallery/gift-list/gift-list';
import { ViewProfilePage } from '../view-profile/view-profile';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { CoupanCodePage } from '../scane-pages/coupan-code/coupan-code';
import { CategoryPage } from '../category/category';
import { AddNewComplaintPage } from '../complaints/add-new-complaint/add-new-complaint';
import { ComplaintHistoryPage } from '../complaints/complaint-history/complaint-history';
import { MyCamplaintsPage } from '../plumber-camplaints/my-camplaints/my-camplaints';
import { ComplaintDetailPage } from '../complaints/complaint-detail/complaint-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { NearestDealerPage } from '../nearest-dealer/nearest-dealer';

import { SocialSharing } from '@ionic-native/social-sharing';


import { OfflineDbProvider } from '../../providers/offline-db/offline-db';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FavoriteProductPage } from '../favorite-product/favorite-product';
import { VideoPage } from '../video/video';


// import { CallNumber } from '@ionic-native/call-number';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    [x: string]: any;
    offer_list:any=[];
    prodCount:any={};
    
    loading:Loading;
    karigar_detail:any={};
    last_point:any='';
    today_point:any='';
    qr_code:any='';
    coupon_value:any='';
    product_count:any='';
    complaint_count:any='';
    plumber_complaint:any='';
    plumber_installation:any='';
    complaint_count_services:any;
    offer_imgurl:string='';
    
    constructor(public toastCtrl: ToastController,
        public socialSharing:SocialSharing ,
        public navCtrl: NavController,
        public nav:NavParams,
        public dbService:DbserviceProvider,
        public loadingCtrl:LoadingController,
        public storage:Storage,
        private barcodeScanner: BarcodeScanner,
        public alertCtrl:AlertController,
        public modalCtrl: ModalController,
        private push: Push ,
        public events: Events,
        
        public offlineService: OfflineDbProvider,
        public fileTransfer: FileTransfer,
        public file: File) {
            
            
            this.loginBanner();
            this.notification();
            this.get_countWithLiveServer()
            this.bannerURL = this.dbService.upload_url3
            events.subscribe('getCountProducts',(data)=>
            {
                this.get_count();
            })
            
            if(this.dbService.connection != 'offline')
            {
                this.get_count();
            }
            this.offer_imgurl = dbService.offer_imgurl;
        }
        
        get_count_ofProducts()
        {
            this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {
                
                console.log(productCount);
                this.prodCount.total= productCount
                
            },err=>
            {
                
            });
            
            
            
        }
        
        onProcessSQLDataHandler() {
            
            if(this.offlineService.localDBCallingCount === 0) {
                
                this.offlineService.localDBCallingCount++;
                this.offlineService.onValidateLocalDBSetUpTypeHandler();
            }
        }
        
        
        ionViewWillEnter()
        {
            
            this.get_count();
            console.log('ionViewDidLoad HomePage');
            if(this.dbService.connection != 'offline')
            {
                this.getData();
                this.getofferBannerList();
                
                console.log('Hello its calling');
                this.notification();
                this.onProcessSQLDataHandler();
                
            }
        }
        
        goToNewArrivals()
        {
            // console.log('newArrivals')
            if(this.dbService.connection=='offline')
            {
                let toast = this.toastCtrl.create({
                    message: 'You Are Offline .. You May Miss The Updates!',
                    duration: 3000
                });
                toast.present();
            }
            // else
            // {
            this.navCtrl.push(NewarrivalsPage);
            // }
        }
        goOnPointListPage()
        {
            // console.log('Begin async operation', refresher);
            this.get_count()
            this.getofferBannerList()
            
            this.getData();
            // refresher.complete();
        }
        
        getData()
        {
            this.presentLoading();
            // this.loading.present
            console.log("Check");
            this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/karigarHome', this.dbService.rootUrl)
            .subscribe((r:any)=>
            {
                console.log(r);
                this.loading.dismiss();
                this.product_count = r.product_count
                console.log("============================");
                
                console.log( r.product_count);
                console.log("============================");
                
                
                this.karigar_detail=r['karigar'];
                this.total_balence=r['karigar'].total_balance;
                this.last_point=r['last_point'];
                this.today_point=r['today_point'];
            },() => {
                this.loading.dismiss();
            });
        }
        installation_count:any='';
        complaint_exist:any=false;
        open_complaint:any={};
        
        get_count()
        {
            this.offlineService.onReturnActiveProductCountHandler().subscribe(productCount => {
                
                console.log(productCount);
                
                this.product_count = productCount;
                // this.complaint_count = 0;
                // this.installation_count = 0;
                // this.complaint_exist = 0;
                // this.open_complaint = 0;
                // this.plumber_complaint = 0;
                // this.plumber_installation = 0;
                console.log(this.product_count);
            });
            
            
            this.offlineService.onReturnActiveProductNewArrivalsCountHandler().subscribe(productCount1 => {
                
                this.prodCount.new= productCount1
                
            },  err =>
            {
                
            });
            
            console.log(this.prodCount);
        }
        
        
        get_countWithLiveServer()
        {
            this.dbService.onPostRequestDataFromApi({'customer_id':this.dbService.userStorageData.id},'app_master/product_catalogue_count', this.dbService.rootUrl)
            .subscribe((result:any)=> {
                
                console.log(result);
                // this.product_count = result['master_product'];
                this.complaint_count = result['complaint'];
                this.complaint_count_services = result['complaint'];
                this.installation_count = result['installation'];
                this.complaint_exist = result['complaint_exist'];
                this.open_complaint = result['open_complaint'];
                this.plumber_complaint = result['plumber'];
                this.plumber_installation = result['plumberInstallation'];
                console.log(this.product_count);
            });
            
        }
        
        alertMsg:any={};
        getofferBannerList()
        {
            console.log(this.dbService.userStorageData.id);
            console.log('offerbanner');
            this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id},'app_karigar/offerList', this.dbService.rootUrl).subscribe(r=>
                {
                    console.log(r);
                    this.offer_list=r['offer'];
                    console.log(this.offer_list);
                });
            }
            
            conInt(val)
            {
                return parseInt(val);
            }
            scan() {
                if( this.karigar_detail.manual_permission==1)
                {
                    console.log('1');
                    
                    this.navCtrl.push(CoupanCodePage)
                }
                else
                {
                    console.log('0');
                    
                    this.barcodeScanner.scan().then(resp => {
                        console.log(resp);
                        this.qr_code=resp.text;
                        console.log( this.qr_code);
                        if(resp.text != '')
                        {
                            this.dbService.onPostRequestDataFromApi({'karigar_id':this.dbService.userStorageData.id,'qr_code':this.qr_code},'app_karigar/karigarCoupon', this.dbService.rootUrl)
                            .subscribe((r:any)=>
                            {
                                console.log(r);
                                
                                if(r['status'] == 'INVALID'){
                                    this.showAlert("Invalid Coupon Code");
                                    return;
                                }
                                else if(r['status'] == 'USED'){
                                    
                                    this.alertMsg.scan_date=r.scan_date;
                                    this.alertMsg.karigar_data=r.karigar_data;
                                    this.alertMsg.scan_date = moment(this.alertMsg.scan_date).format("D-M-Y");
                                    
                                    this.showAlert("Coupon Already Used By "+this.alertMsg.karigar_data.first_name+" ( "+this.alertMsg.karigar_data.mobile_no+" ) on " + this.alertMsg.scan_date );
                                    return;
                                }
                                else if(r['status'] == 'UNASSIGNED OFFER'){
                                    this.showAlert("This Coupon Code is not applicable in your Area");
                                    return;
                                }
                                this.showSuccess( r['coupon_value'] +" points has been added into your wallet")
                                this.getData();
                            });
                        }
                        else{
                            console.log('not scanned anything');
                        }
                    });
                }
                
                
            }
            viewProfiePic()
            {
                this.modalCtrl.create(ViewProfilePage, {"Image": this.karigar_detail.profile}).present();
            }
            
            
            goOnScanePage(){
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                }
                else
                {
                    this.navCtrl.push(ScanPage);
                }
            }
            
            goOnOffersListPage(){
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                }
                else
                {
                    this.navCtrl.push(OfferListPage);
                }
                
            }
            
            goOnOffersPage(id)
            {
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    this.navCtrl.push(OffersPage,{'id':id});
                }
            }
            
            goOnPointeListPage(){
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    this.navCtrl.push(PointListPage);
                }
                
            }
            
            goOnMyCamplaintsPage(type)
            {
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                }
                else
                {
                    this.navCtrl.push(MyCamplaintsPage,{type:type});
                }
                
            }
            
            presentLoading()
            {
                this.loading = this.loadingCtrl.create({
                    content: "Please wait...",
                    dismissOnPageChange: true
                });
                this.loading.present();
            }
            goOnGiftListPage()
            {
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                }
                else
                {
                    this.navCtrl.push(GiftListPage,{'mode':'home'});
                }
            }
            
            // goToNewArrivals()
            // {
            //     // console.log('newArrivals')
            //     if(this.service.connection=='offline')
            //     {
            //         let toast = this.toastCtrl.create({
            //             message: 'You Are Offline .. You May Miss The Updates!',
            //             duration: 3000
            //         });
            //         toast.present();
            //     }
            //     // else
            //     // {
            //     this.navCtrl.push(NewarrivalsPage);
            //     // }
            // }
            // goOnPointListPage()
            // {
            //     if(this.service.connection=='offline')
            //     {
            //         this.service.showOfflineAlert()
            //     }
            //     else
            //     {
            //         this.navCtrl.push(PointListPage,{'mode':'home'});
            //     }
            // }
            // goOnProductPage()
            // {
            //    this.navCtrl.push(ProductsPage,{'mode':'home'});
            
            // }
            goOnProductPage()
            {
                // if(this.dbService.connection=='offline')
                // {
                //     let toast = this.toastCtrl.create({
                //         message: 'You Are Offline .. You May Miss The Updates!',
                //         duration: 3000
                //     });
                //     toast.present();
                // }
                
                this.navCtrl.push(CategoryPage,{'mode':'home'});
            }
            goOnComplaintAdd(type)
            {
                console.log(type);
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    this.navCtrl.push(AddNewComplaintPage,{'mode':'home',type:type});
                }
                
            }
            
            goOnOpenComplaintAdd()
            {
                
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    this.navCtrl.push(ComplaintDetailPage,{'id':this.open_complaint.id});
                }
                
            }
            
            
            // <<<<<<< HEAD
            //       }).catch((e) => {
            //         console.log(e);
            //       });
            //     }
            
            
            banner:any=[]
            // loginBanner(){
            //     console.log('called');
            
            //     this.service.post_rqst( '', 'app_karigar/loginBannersApp' )
            //     .subscribe(d => {
            //         console.log(d);
            
            //         this.banner = d.banner;
            //         console.log(this.banner);
            //     });
            // =======
            complaintHistory(type:any)
            {
                // alert('test');
                // console.log(type + 'test');
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    this.navCtrl.push(ComplaintHistoryPage,{'mode':'home',type:type});
                }
                
            }
            
            showAlert(text)
            {
                let alert = this.alertCtrl.create({
                    title:'Alert!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
            }
            goToNearestDealers(type)
            {
                console.log(this.karigar_detail.pincode);
                if(this.dbService.connection=='offline')
                {
                    this.dbService.onShowMessageAlertHandler('Offline ! Please Connect To An Active Internet Connection');
                    
                }
                else
                {
                    
                    this.navCtrl.push(NearestDealerPage,{pincode:this.karigar_detail.pincode,type:type});
                    
                }
                
            }
            showSuccess(text)
            {
                let alert = this.alertCtrl.create({
                    title:'Success!',
                    cssClass:'action-close',
                    subTitle: text,
                    buttons: ['OK']
                });
                alert.present();
            }
            
            notification()
            {
                console.log("notification");
                
                this.push.hasPermission()
                .then((res: any) => {
                    
                    if (res.isEnabled) {
                        console.log('We have permission to send push notifications');
                    } else {
                        console.log('We do not have permission to send push notifications');
                    }
                });
                
                
                const options: PushOptions = {
                    android: {
                        senderID:'588971704584'
                    },
                    ios: {
                        
                        alert: 'true',
                        badge: true,
                        sound: true
                    },
                    windows: {},
                    browser: {
                        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                    }
                };
                
                const pushObject: PushObject = this.push.init(options);
                pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
                pushObject.on('registration').subscribe((registration: any) => {
                    console.log('Device registered', registration)
                    this.dbService.onPostRequestDataFromApi({'id':this.dbService.userStorageData.id,'registration_id':registration.registrationId},'app_karigar/update_token', this.dbService.rootUrl).subscribe(r=>
                        {
                            console.log(r);
                        });
                    }
                    );
                    
                    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
                }
                
                logout()
                {
                    
                    
                    let alert = this.alertCtrl.create({
                        title: 'Logout!',
                        message: 'Are you sure you want Logout?',
                        buttons: [
                            {
                                text: 'No',
                                handler: () => {
                                    console.log('Cancel clicked');
                                    // this.d.('Action Cancelled!')
                                }
                            },
                            {
                                text: 'Yes',
                                handler: () => {
                                    //   this.itemsArr.splice(i,1);
                                    
                                    console.log('logout');
                                    this.storage.set('userStorageData', {});
                                    this.dbService.userStorageData = {};
                                    
                                }
                            }
                        ]
                    })
                    
                    alert.present();
                    
                }
                
                ref_code:any="";
                ShareApp()
                {
                    // alert('hello')
                    console.log(this.karigar_detail);
                    if(this.karigar_detail.type == "Plumber" && this.karigar_detail.referral_code!="")
                    {
                        this.ref_code = ' and use my Code *'+this.karigar_detail.referral_code+'* to get points back in your wallet'
                    }
                    this.socialSharing.share('Hey There ! here is an awesome app from PureFlow  ..Give it a try https://apps.apple.com/us/app/pureflow-india/id1592295337'+this.ref_code).then(() => {
                    console.log("success");
                }).catch((e) => {
                    console.log(e);
                });
            }
            
            goToFav()
            {
                this.navCtrl.push(FavoriteProductPage)
            }
            
            loginBanner(){
                console.log('called');
                
                this.dbService.onPostRequestDataFromApi( '', 'app_karigar/loginBannersApp' , this.dbService.rootUrl)
                .subscribe(d => {
                    console.log(d);
                    
                    this.banner = d.banner;
                    //         console.log(this.banner);
                    
                    //         this.avatars = this.banner.map((x, i) => {
                    //           const num = i;
                    //           return {
                    //             url: this.db.myurl+'app/uploads/'+x.banner,
                    //             title: ''
                    //           };
                    //         });
                    
                    // console.log(  this.avatars);
                    
                    
                });
            }
            doRefresh (refresher)
            {
                if(this.dbService.connection != 'offline')
                {
                    this.get_count();
                }
                
                setTimeout(() => {
                    refresher.complete();
                }, 1000);
                this.get_countWithLiveServer()
                this.getDate();
                this.getofferBannerList()
                
            }
            
            goToVideosPage(cat) {
                
                console.log(cat);
                this.navCtrl.push(VideoPage,{cat:cat});
            }
            
        }
        