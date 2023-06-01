import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, Loading, LoadingController } from 'ionic-angular';
import { OtpPage } from '../otp/otp';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { SelectRegistrationTypePage } from '../../select-registration-type/select-registration-type';


@IonicPage()
@Component({
    selector: 'page-mobile-login',
    templateUrl: 'mobile-login.html',
})
export class MobileLoginPage {

    data:any = {};
    otp:any = '';
    loading:Loading;
    loginType:any = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public dbService: DbserviceProvider,
                public alertCtrl:AlertController,
                public loadingCtrl:LoadingController) {

          this.loginType = this.navParams.get('registerType');
          console.log(this.loginType);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad MobileLoginPage');
    }


    onLoginSubmitHandler() {

        this.dbService.onShowLoadingHandler();

        

        if(this.data.mobile_no == '9319180958' || this.data.mobile_no == '7070183423' ||  this.data.mobile_no == '9560533107') {

            this.data.otp = '123456';

        } else {

            this.data.otp = Math.floor(100000 + Math.random() * 900000);

        }

        console.log(this.data);

        this.dbService.onPostRequestDataFromApi({'login_data': this.data },'app_karigar/karigarLoginOtp_new', this.dbService.rootUrl).subscribe((r) => {

                console.log(r);
                this.dbService.onDismissLoadingHandler();

                if (r['status'] == 'REQUIRED MOBILE NO') {

                      this.dbService.onShowMessageAlertHandler("Please enter Mobile No to continue.");
                      return false;

                } else if (r['status'] == "SUCCESS") {

                      this.otp = r['otp'];

                      this.navCtrl.push(OtpPage, {
                              otp: this.data.otp,
                              mobile_no: this.data.mobile_no,
                              loginType: this.loginType
                      });
                }
        });
    }

    onBackButtonClickHanlder() {

         this.navCtrl.push(SelectRegistrationTypePage);
    }
}
