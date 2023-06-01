import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';

import { Storage } from '@ionic/storage';
import { ExecutiveEditPage } from '../executive-edit/executive-edit';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
/**
 * Generated class for the ExecutivePopoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-executive-popover',
  templateUrl: 'executive-popover.html',
})
export class ExecutivePopoverPage {

  dr_id:any;

  constructor(public navCtrl: NavController,
              public navParamss: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl:ToastController,
              private alertCtrl: AlertController,
              public storage:Storage,
              public navParams: NavParams) {

  }

  editExecutive()
  {
    var userId = this.navParams.get('userId')
      console.log(userId);
      this.navCtrl.push(ExecutiveEditPage,{userId:userId})
  }

  deleteExecutive()
    {
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: 'You Want To Delete this Executive ?',
            cssClass:'action-close',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.dbService.presentToast('Action Cancelled')
                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                      const resp = this.dbService.userStorageData;
                      console.log(resp);
                      this.dr_id = resp.id
                      this.dbService.onPostRequestDataFromApi({"userId":this.navParams.get('userId'),dr_id:this.dr_id},"dealerData/executive_delete", this.dbService.rootUrlSfa).subscribe(resp=>
                          {
                              console.log(resp);
                              this.dbService.presentToast('Deleted');
                              this.navCtrl.push(DealerExecutiveListPage)
                          },err=>
                          {
                              this.dbService.onDismissLoadingHandler();
                              this.dbService.errToasr();
                          })
                    }
                }]
            });
            alert.present();

        }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ExecutivePopoverPage');
  }

}
