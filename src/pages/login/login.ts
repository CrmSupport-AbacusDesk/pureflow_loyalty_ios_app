import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController ,AlertController, Platform,Nav} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { OtpverifyPage } from '../otpverify/otpverify';
import { SelectRegistrationTypePage } from '../select-registration-type/select-registration-type';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    @ViewChild(Nav) nav: Nav;

    loading:any = "0";
    loading1:any;

    registerType:any='';
    validations_form: FormGroup;
    register_type:any = {};
    rootPage:any;

    form = { phone : '', otp : 0, type:'', registerType : '' };

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public FormBuilder: FormBuilder,
                public LoadingCtrl:LoadingController,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public platform: Platform,
                public loadingCtrl: LoadingController) {

            this.register_type = this.navParams.get('registerType1');
            this.registerType = this.navParams.get('registerType');
            console.log(this.registerType);

            this.validations_form = FormBuilder.group({
                  phone: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
            })
    }

    ionViewDidLoad() {
         console.log('ionViewDidLoad LoginPage');
    }


    onLoginSubmitHandler() {

            if (this.validations_form.invalid) {

                    this.validations_form.get('phone').markAsTouched();
                    return;
            }

            this.form.otp = Math.floor(100000 + Math.random() * 900000);
            this.form.registerType = this.registerType;

            console.log(this.form);

            this.dbService.onShowLoadingHandler();

            this.dbService.onPostRequestDataFromApi(this.form, 'login/login_submit', this.dbService.rootUrlSfa).subscribe((response:any) => {

                this.dbService.onDismissLoadingHandler();

                if (response['msg'] == 'exist')  {

                      this.navCtrl.push(OtpverifyPage,{data:this.form, otp_data:response['data']});

                } else {

                        let alertMessage;

                        if (response['user_data']!=null) {

                            alertMessage = 'Mobile Registered as '+response['user_data']['login_type'];

                        } else {

                            alertMessage = 'Mobile Not Registered';
                        }

                        this.dbService.onShowMessageAlertHandler(alertMessage);
                }

            }, err => {

                   this.dbService.onDismissLoadingHandler();
            });
    }

    onBackButtonClickHanlder() {

         this.navCtrl.push(SelectRegistrationTypePage);
    }

}
