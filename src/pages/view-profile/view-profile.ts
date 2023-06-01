import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-view-profile',
  templateUrl: 'view-profile.html',
})
export class ViewProfilePage {
  profile_pic:any='';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewProfilePage');
    this.profile_pic=this.navParams.get("Image");
     console.log(this.profile_pic);

  }
  closeModal(){
    this.viewCtrl.dismiss();
  }


}
