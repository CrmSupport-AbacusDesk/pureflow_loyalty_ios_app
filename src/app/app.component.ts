import { Component, ViewChild } from '@angular/core';
import { Platform, Nav,Events, App, ToastController, AlertController, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';

import { DbserviceProvider } from '../providers/dbservice/dbservice';
import { AboutusModalPage } from '../pages/aboutus-modal/aboutus-modal';

import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AppVersion } from '@ionic-native/app-version';
import { SelectRegistrationTypePage } from '../pages/select-registration-type/select-registration-type';
import { DashboardPage } from '../pages/dashboard/dashboard';

import { Network } from '@ionic-native/network';
import { DealerHomePage } from '../pages/dealer-home/dealer-home';
import { DealerProfilePage } from '../pages/dealer-profile/dealer-profile';
import { AboutPage } from '../pages/about/about';
import { VideoCategoryPage } from '../pages/video-category/video-category';
import { CheckinListPage } from '../pages/sales-app/checkin-list/checkin-list';
import { AttendencePage } from '../pages/attendence/attendence';
import { MainDistributorListPage } from '../pages/sales-app/main-distributor-list/main-distributor-list';
import { DistributorListPage } from '../pages/sales-app/distributor-list/distributor-list';
import { TravelListPage } from '../pages/travel-list/travel-list';
import { LeadsDetailPage } from '../pages/leads-detail/leads-detail';
import { LeaveListPage } from '../pages/leave-list/leave-list';
import { FavoriteProductPage } from '../pages/favorite-product/favorite-product';
import { NewarrivalsPage } from '../pages/newarrivals/newarrivals';
import { CategoryPage } from '../pages/category/category';
import { DealerDealerListPage } from '../pages/dealer-dealer-list/dealer-dealer-list';
import { DealerCheckInPage } from '../pages/dealer-check-in/dealer-check-in';
import { DealerOrderPage } from '../pages/dealer-order/dealer-order';
import { DealerAddorderPage } from '../pages/dealer-addorder/dealer-addorder';
import { DealerDiscountPage } from '../pages/dealer-discount/dealer-discount';
import { ContactPage } from '../pages/contact/contact';
import { OfflineDbProvider } from '../providers/offline-db/offline-db';
import { ScanPage } from '../pages/scane-pages/scan/scan';
import { Market } from '@ionic-native/market';
import { HomePage } from '../pages/home/home';

export interface PageInterface {

      title: string;
      name: string;
      component: any;
      icon: string;
      index?: number;
      tabName?: string;
      tabComponent?: any;
      show:any;
}
@Component({
    templateUrl: 'app.html'
})
export class MyApp {

    @ViewChild(Nav) nav: Nav;

    rootPage:any;

    pages: PageInterface[];

    iosAppVersion:any='';
    mobileAppVersion:any='';

    public UserLoggedInData: any = {};

    constructor( private network :Network,
                 public platform: Platform,
                public statusBar: StatusBar,
                 public menu: MenuController,
                 public splashScreen: SplashScreen,
                 public modalCtrl: ModalController,
                 public storage:Storage,
                 public events:Events,
                 public app: App,
                 public toastCtrl:ToastController,
                 public alertCtrl:AlertController,
                 public push: Push,
                 public dbService:DbserviceProvider,
                 public offlineDB:OfflineDbProvider,
                 public market:Market,
                 public appVersion: AppVersion)  {

                  this.initializeApp();

                  this.events.subscribe('user:navigation_menu', () => {
                    this.open_nav_menu();
               });
            
               this.events.subscribe('side_menu:navigation_barDealer', () => {
                   // this.setPagesDealer('LoggedIn');
                   this.open_nav_menu();
               });

           
      }
     
  initializeApp(){
      this.platform.ready().then(() => {

        this.statusBar.overlaysWebView(false);
        this.splashScreen.hide();
        this.statusBar.backgroundColorByHexString('#204766');

        this.onCheckAppCurrentVersionHandler();

        // this.storage.get('offlineDBLastInfo').then((offlineDBLastInfo) => {

        //          console.log(offlineDBLastInfo);
        //          if(!offlineDBLastInfo || !offlineDBLastInfo.isSetUpCompleted) {

        //                offlineDBLastInfo = {};
        //                offlineDBLastInfo.isSetUpCompleted = 0;
        //                offlineDBLastInfo.lastUpdatedTime = '';
        //                this.storage.set('offlineDBLastInfo', {});
        //          }

        //          this.offlineDB.offlineDBLastInfo = offlineDBLastInfo;
        // });

        this.storage.get('userStorageData').then((storageData) => {

              this.dbService.userStorageData = storageData;

              const tokenData = storageData && storageData.token ? storageData.token : '';
              console.log(tokenData);

              if(tokenData && tokenData != null) {

                    const loginType = storageData.loginType;
                    console.log(loginType);

                    if (loginType == 'CMS') {

                            const karigarId = storageData.id;
                            this.onGetLoggedInUserDataHandler(karigarId);

                    } else if(loginType == 'Employee' || loginType == 'SFA') {

                          this.nav.setRoot(DashboardPage);
                          this.onSetSalesUserSideBarPage();

                    } else if (loginType == 'DrLogin') {

                          this.nav.setRoot(DealerHomePage);
                          this.onSetDrSideBarPage('LoggedIn');
                    }

              } else {

                      this.rootPage = SelectRegistrationTypePage;
              }
        });

        this.platform.registerBackButtonAction(() => {

              const overlayView = this.app._appRoot._overlayPortal._views[0];

              if (overlayView && overlayView.dismiss) {

                  overlayView.dismiss();
                  return;
              }

              var nav = this.app.getActiveNav();
              var activeView = nav.getActive().name;

              // console.log("id ======>",this.id);
              

              console.log(activeView);
              console.log(nav.canGoBack());

              if ( activeView == 'HomePage' || activeView == 'MobileLoginPage'
                  || activeView == 'OtpPage' ||  activeView == 'DealerHomePage'
                  ||  activeView == 'DashboardPage' ||  activeView == 'SelectRegistrationTypePage') {

                      console.log('shouldStartSetUpProcess');
                      console.log(this.offlineDB.shouldStartSetUpProcess);

                     if(this.offlineDB.shouldStartSetUpProcess === false ) {

                        if (this.dbService.backButton == 0) {

                                this.dbService.backButton = 1;

                                let toast = this.toastCtrl.create({

                                      message: 'Press again to exit!',
                                      duration: 2000
                                });

                                toast.present();

                                setTimeout(() => {

                                    this.dbService.backButton = 0;

                                }, 2500);

                          } else {
                              this.platform.exitApp();
                          }

                     } 
                

              } else if (activeView == 'DealerAddorderPage') {


              }
               else if (nav.canGoBack()) {

                      console.log('ok');
                      nav.pop();

              } else if(activeView == 'GiftListPage' || activeView == 'TransactionPage'
                      || activeView == 'ProfilePage' || activeView =='MainHomePage') {

                      nav.parent.select(0);
              } 
              
              else if(nav.canGoBack()==false) {
                let alert = this.alertCtrl.create({
                  title: 'App termination',
                  message: 'Are you sure you want Exit?',
                  buttons: [
                    {
                      text: 'Stay',
                      handler: () => {
                        console.log('Cancel clicked');
                        // this.d.('Action Cancelled!')
                      }
                    },
                    {
                      text: 'Exit',
                      handler: () => {
                        this.platform.exitApp();
                      }
                    }
                  ]
                })
            
                alert.present();
              // this.platform.exitApp();
              }

        });
  });

}

      

      onGetLoggedInUserDataHandler(karigarId) {

            this.dbService.onPostRequestDataFromApi({ karigar_id :karigarId },'app_karigar/profile', this.dbService.rootUrl).subscribe((result)=> {

                console.log(result);

                if (result['status'] == "SUCCESS") {

                      const karigarData = result['karigar'];

                      if (karigarData.del == '1') {

                            this.rootPage = SelectRegistrationTypePage;
                            this.dbService.onShowMessageAlertHandler('Your Account has been suspended');

                            this.storage.set('userStorageData', {});
                            this.dbService.userStorageData = {};
                            return;

                      } else if(karigarData.status == 'Verified') {

                            // this.nav.push(HomePage);
                            this.rootPage = TabsPage;

                      } else  if( karigarData.status != 'Verified') {

                            this.rootPage = TabsPage;
                            // this.nav.push(HomePage);
                            // this.nav.push(TabsPage);
                      }

                } else {

                      this.storage.set('userStorageData', {});
                      this.dbService.userStorageData = {};
                      return;
                }

            }, error => {

                  this.rootPage = TabsPage;
            });
      }


      onSetSalesUserSideBarPage() {


            console.log('hello111');

            if ( this.dbService.userStorageData.role_id
                && (this.dbService.userStorageData.role_id == 'Market'
                    || this.dbService.userStorageData.user_type == 'MARKET'
                    || this.dbService.userStorageData.user_type == 'market')
                && this.dbService.userStorageData.token != undefined
            )  {

              console.log('hello2222');

                this.pages = [
                    {
                      title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true
                    },
                    {
                      title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'shopping_basket', show: true
                    },
                    {
                      title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true
                    },
                    {
                      title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
                    },
                    {
                      title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
                    },
                    {
                      title: 'Check-In', name: 'Check-In', component: CheckinListPage , index: 9,icon: 'home_work', show: true
                    },
                    {
                      title: 'Attendance', name: 'AttendencePage', component: AttendencePage,index: 11, icon: 'date_range', show: true
                    },
                    {
                      title : 'Channel Partner', name: 'Distributor', component: MainDistributorListPage,index: 15, icon: 'group', show: true
                    },
                    {
                      title : 'Direct Dealer', name: 'Direct Dealer', component: MainDistributorListPage,index: 13, icon: 'person_pin', show: true
                    },
                    {
                      title : 'Dealer', name: 'Dealer', component: MainDistributorListPage,index: 12, icon: 'person', show: true
                    },
                    {
                      title: 'Lead', name: 'Lead', component: DistributorListPage,index: 5, icon: 'group_add', show: true
                    },
                    {
                      title : 'Travel Plan', name: 'TravelListPage', component: TravelListPage, index: 23, icon: 'contacts', show: true
                    },
                    {
                      title : 'Leave', name: 'LeaveListPage', component:LeaveListPage ,index: 10, icon: 'beach_access', show: true
                    },
                    {
                      title : 'Scan Page', name: 'Scan Page', component:ScanPage, index: 7, icon: 'contact_phone', show: true
                    },
                ];

                console.log(this.pages);
            }

            if (this.dbService.userStorageData.role_id && this.dbService.userStorageData.user_type == 'OFFICE') {

                 // this means user is distributor executive

              console.log('hello3333');


                this.pages = [
                    {
                      title : 'Home', name: 'HomePage', component:DashboardPage, index: 0, icon: 'home', show: true
                    },
                    {
                      title: 'Products', name: 'CategoryPage', component: CategoryPage , index: 9,icon: 'shopping_basket', show: true
                    },
                    {
                      title: 'New Arrivals', name: 'NewarrivalsPage', component: NewarrivalsPage,index: 11, icon: 'fiber_new', show: true
                    },
                    {
                      title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
                    },
                    {
                      title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
                    },
                    {
                      title: 'Check-In', name: 'Check-In', component: CheckinListPage , index: 9,icon: 'home_work', show: true
                    },
                    {
                      title: 'Attendance', name: 'AttendencePage', component: AttendencePage,index: 11, icon: 'date_range', show: true
                    },
                    {
                      title : 'Dealer', name: 'Dealer', component: MainDistributorListPage,index: 12, icon: 'person', show: true
                    },
                    {
                      title: 'Lead', name: 'Lead', component: DistributorListPage,index: 5, icon: 'group_add', show: true
                    },
                    {
                      title : 'Travel Plan', name: 'TravelListPage', component: TravelListPage, index: 23, icon: 'contacts', show: true
                    },
                    {
                      title : 'My Channel Partner', name: 'My Channel Partner', component: LeadsDetailPage, index: 24, icon: 'group', show: true
                    },
                    {
                      title : 'Leave', name: 'LeaveListPage', component:LeaveListPage ,index: 10, icon: 'beach_access', show: true
                    },
                    {
                      title : 'Scan Page', name: 'Scan Page', component:ScanPage, index: 7, icon: 'contact_phone', show: true
                    },
                ];
            }


            console.log('hello4444');

        }


        onSetDrSideBarPage(loginType) {

            if (loginType == 'LoggedIn') {

                  if(this.dbService.userStorageData.type == '1') {

                        var name = 'Dealer List';
                        var title = 'Dealer List';
                        var show = true;

                  } else if(this.dbService.userStorageData.type == '3') {

                        var name = 'Distributor List';
                        var title = 'Distributor List';
                        var show = true;

                  } else {

                        var show = false;
                  }

                  if (this.dbService.userStorageData.type == 1) {

                      this.pages = [

                          {
                            title : 'Home', name: 'HomePage', component:DealerHomePage, index: 0, icon: 'home', show: true
                          },
                          {
                            title : 'Product Catalogue', name: 'Product Catalogue', component:CategoryPage, index: 2, icon: 'toys', show: true
                          },
                          {
                            title : 'New Arrivals', name: 'New Arrivals', component:NewarrivalsPage, index: 1, icon: 'fiber_new', show: true
                          },
                          {
                            title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
                          },
                          {
                            title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
                          },
                          {
                            title : 'My Dealers', name: name, component:DealerDealerListPage, index: 7, icon: 'how_to_reg', show: show
                          },
                          {
                            title : 'Sales Person Visit', name: 'DealerCheckInPage', component:DealerCheckInPage, index: 4, icon: 'home_work', show: true
                          },
                          {
                            title : 'My Orders', name: 'DealerOrderPage', component:DealerOrderPage, index: 3, icon: 'all_inbox', show: true
                          },
                          {
                            title : 'Add New Order', name: 'DealerAddorderPage', component:DealerAddorderPage, index: 8, icon: 'widgets', show: true
                          },
                          {
                            title : 'Discount', name: 'DealerDiscountPage', component:DealerDiscountPage, index: 5, icon: 'card_giftcard', show: true
                          },
                          {
                            title : 'About Us', name: 'About Us', component:AboutPage, index: 6, icon: 'contacts', show: true
                          },
                          {
                            title : 'Contact Us', name: 'Contact Us', component:ContactPage, index: 7, icon: 'contact_phone', show: true
                          },
                          {
                            title : 'Scan Page', name: 'Scan Page', component:ScanPage, index: 7, icon: 'contact_phone', show: true
                          },
                      ];

                  } else  {

                        // that means login user is dealer

                        this.pages=[
                            {
                              title : 'Home', name: 'HomePage', component:DealerHomePage, index: 0, icon: 'home', show: true
                            },
                            {
                              title : 'Product Catalogue', name: 'Product Catalogue', component:CategoryPage, index: 2, icon: 'toys', show: true
                            },
                            {
                              title : 'New Arrivals', name: 'New Arrivals', component:NewarrivalsPage, index: 1, icon: 'fiber_new', show: true
                            },
                            {
                              title : 'Favorite Product', name: 'Favorite Product', component:FavoriteProductPage, index: 2, icon: 'star', show: true
                            },
                            {
                              title : 'Videos', name: 'Videos', component:VideoCategoryPage, index: 9, icon: 'videocam', show: true
                            },
                            {
                              title : 'My Distributors', name: name, component:DealerDealerListPage, index: 7, icon: 'how_to_reg', show: show
                            },
                            {
                              title : 'My Orders', name: 'DealerOrderPage', component:DealerOrderPage, index: 3, icon: 'all_inbox', show: true
                            },
                            {
                              title : 'Add New Order', name: 'DealerAddorderPage', component:DealerAddorderPage, index: 8, icon: 'widgets', show: true
                            },
                            {
                              title : 'About Us', name: 'About Us', component:AboutPage, index: 6, icon: 'contacts', show: true
                            },
                            {
                               title : 'Contact Us', name: 'Contact Us', component:ContactPage, index: 7, icon: 'contact_phone', show: true
                            },
                            {
                              title : 'Scan Page', name: 'Scan Page', component:ScanPage, index: 7, icon: 'contact_phone', show: true
                            },
                        ];
                  }
            }
        }


        onGoToSalesUserPageHandler(page: PageInterface) {

              let params = {};

              if (page.index) {
                  params = { tabIndex: page.index };
              }

              if(page.name == 'Direct Dealer' ) {

                      this.nav.push(page.component, { type:7 });

              } else if (page.name == 'Dealer') {

                      this.nav.push(page.component, { type:3 });

              } else if (page.name == 'Distributor') {

                      this.nav.push(page.component, { type:1 });

              } else if(page.name=='My Channel Partner') {

                    this.dbService.onPostRequestDataFromApi({},'DealerData/getCreatedDr', this.dbService.rootUrlSfa).subscribe((resp)=> {

                            console.log(resp);
                            this.nav.push(page.component, {'dr_id':resp[0],'type':'Dr','showRelatedTab': 'false'});
                    })

              } else if (this.nav.getActiveChildNavs().length && page.index != undefined)  {

                      console.log(page.index);
                      this.nav.getActiveChildNavs()[0].select(page.index);

              } else {

                      console.log(page.index);
                      console.log(page.component );
                      this.nav.push(page.component, params);
              }
      }


      onGoToDrPageHandler(page: PageInterface) {

            let params = {};

            if (page.name == 'DealerOrderPage') {

                  console.log(this.dbService.userStorageData.type);

                  params = {

                        type: 'Primary',
                        tabIndex: page.index
                  };

            } else {

                  if (page.index) {

                        params = { tabIndex: page.index };
                  }
            }


            if (this.nav.getActiveChildNavs().length && page.index != undefined) {

                    console.log(page.index);
                    this.nav.getActiveChildNavs()[0].select(page.index);

            } else {

                  console.log(page.index);
                  console.log(page.component );

                  if(page.name == 'HomePage') {

                      this.nav.setRoot(DealerHomePage);

                  } else {

                      this.nav.push(page.component, params);
                  }
            }
      }


      onGoToProfilePage() {

          this.nav.push(DealerProfilePage);
      }


      onCheckAppCurrentVersionHandler()  {

          this.dbService.onPostRequestDataFromApi('', 'app_karigar/app_version', this.dbService.rootUrl).subscribe(resp => {

              console.log(resp);
              this.iosAppVersion = resp['ios_app_version'];

              this.appVersion.getVersionNumber().then(resp => {

                  console.log(resp);
                  this.mobileAppVersion = resp;

                  if (this.mobileAppVersion != this.iosAppVersion) {

                        let updateAlert = this.alertCtrl.create({
                            title: 'Update Available',
                            message: 'A newer version of this app is available for download. Please update it from app store !',
                            buttons: [
                                {
                                  text: 'Cancel',
                                },
                                {
                                    text: 'Update Now',
                                    handler: () => {
                                        this.market.open("id1592295337");
                                    }

                                }
                            ]
                        });

                        updateAlert.present();
                  }

                  console.log("version");

              });
          });
      }


      onLogoutHandler() {

            const alert = this.alertCtrl.create({
                title: 'Logout!',
                message: 'Are you sure you want Logout?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {

                            this.storage.set('userStorageData', {});

                            this.nav.setRoot(SelectRegistrationTypePage);
                        }
                    }
                ]
            })

            alert.present();
      }


      open_nav_menu() {

            console.log('test');
            this.menu.open('first');
            this.menu.enable(true, 'first');

            const loginType = this.dbService.userStorageData.loginType;

            if(loginType == 'Employee' || loginType == 'SFA') {

                  console.log('Enter');

                  this.onSetSalesUserSideBarPage();

            } else if (loginType == 'DrLogin') {

                  this.onSetDrSideBarPage('LoggedIn');
            }
      }

}
