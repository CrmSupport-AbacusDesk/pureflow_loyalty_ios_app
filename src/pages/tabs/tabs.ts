import { Component,ViewChild } from '@angular/core';
import { NavController,Nav, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { MainHomePage } from '../main-home/main-home';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { PointListPage } from '../points/point-list/point-list';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfferListPage } from '../offer-list/offer-list';
import { NewarrivalsPage } from '../newarrivals/newarrivals';
import { SelectRegistrationTypePageModule } from '../select-registration-type/select-registration-type.module';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  index:any='';
  @ViewChild(Nav) nav: Nav;
  rootPage:any;

  tab1Root = HomePage;
  tab2Root = NewarrivalsPage;
  tab3Root = ContactPage;
  tab4Root = AboutPage;

  // tabRoot = HomePage;
  tab5Root = OfferListPage;
  tab6Root = MainHomePage;
  tab7Root = PointListPage;
  tab8Root =ProfilePage;

  constructor( public storage: Storage,
               public navParams: NavParams,
               public dbService:DbserviceProvider,
               public navCtrl: NavController)
  {
    this.index = this.navParams.get('index')
    console.log(this.index);
   

    console.log(dbService);
    console.log(this.dbService.userStorageData);

    // if(this.index==0)
    // {
    //   this.rootPage==HomePage;
    //   // this.index=1
    // }

      this.storage.get('userStorageData').then((userStorageData) => {
         console.log(userStorageData);

     });

      const val = this.dbService.userStorageData.token;
      console.log(val);
      if(val == '' || val == null || val == undefined)
      {
        this.rootPage = SelectRegistrationTypePageModule;
        // this.nav.setRoot(MobileLoginPage);
      }else{


        if(this.index=='5')
        {
            console.log('index 5');

            this.navCtrl.setRoot(ProfilePage);
            // this.rootPage = ProfilePage;
            return;
        }
        // this.navCtrl.setRoot(HomePage);

        this.rootPage = HomePage;

      }

  }
  Offers(){
      this.navCtrl.push(OfferListPage);

  }
  centertab(){
    this.navCtrl.push(MainHomePage);
  }
  Wallet(){
    this.navCtrl.push(PointListPage);

  }
  profile(){
    this.navCtrl.push(ProfilePage);
  }

}
