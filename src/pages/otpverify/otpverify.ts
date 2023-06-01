import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, LoadingController, Loading, Platform, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
declare var SMS: any;
import {Observable} from 'rxjs/Rx';
import { DealerHomePage } from '../dealer-home/dealer-home';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-otpverify',
    templateUrl: 'otpverify.html',
})
export class OtpverifyPage {

    otpForm: FormGroup;
    otp_data:any={};

    otp_values = {one: '', two: '', three: '', four: '', five: '', six: ''};
    otpCredentials = { otp: '', mobile: '', mobile_no: ''};

    maxtime:any=30;
    maxTime:any = 0;

    counter = 30 * 60;
    countDown:any;

    otp_value:any=[];
    timer:any;

    data_value:any = {};

    hidevalue:boolean = false;
    resendActiveClass:boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public dbService: DbserviceProvider,
                public formBuilder: FormBuilder,
                public storage: Storage,
                public toastCtrl: ToastController,
                public platform: Platform,
                public zone: NgZone,
                public events: Events ) {

        this.data_value = navParams.get('data');
        this.otp_data = navParams.get('otp_data');
        console.log(this.data_value);

        this.otpForm = formBuilder.group({
              one: ['', Validators.compose([Validators.required])],
              two: ['', Validators.compose([Validators.required])],
              three: ['', Validators.compose([Validators.required])],
              four: ['', Validators.compose([Validators.required])],
              five: ['', Validators.compose([Validators.required])],
              six: ['', Validators.compose([Validators.required])]
        });

        this.onTimeCounter();
    }


    ionViewDidLoad() {

        console.log('ionViewDidLoad OtpverifyPage');
        this.platform.ready().then((readySource) => {

                var str= this.otp_value;
                var arr = (""+str).split("");
                console.log(arr);
        })
    }


    onValidateUserOtpHandler() {

        console.log(this.otp_values);
        console.log(this.otpCredentials.otp);

        if(this.data_value['otp'] == this.otpCredentials.otp) {

            this.dbService.onPostRequestDataFromApi(this.data_value, 'login/login', this.dbService.rootUrlSfa).subscribe((result:any) => {

                    console.log(result);

                    if(result.loggedInUserType=='Employee')  {

                            result['token'] = result['token'];
                            result['loginType'] = 'SFA';

                            this.storage.set('userStorageData', result);
                            this.dbService.userStorageData = result;
                            this.navCtrl.setRoot(DashboardPage);

                    } else  if(result.loggedInUserType == 'DrLogin')  {

                            result['token'] = result['token'];
                            result['loginType'] = 'DrLogin';

                            this.storage.set('userStorageData', result);
                            this.dbService.userStorageData = result;
                            this.navCtrl.setRoot(DealerHomePage);
                    }
            });

        } else  {

              this.dbService.onShowMessageAlertHandler('OTP do not match');
              console.log('otp not match');
        }
    }


    onConfirmOTPHandler() {

          this.otpCredentials.otp = '';

          for (var key in this.otp_values) {

                this.otpCredentials.otp += parseInt(this.otp_values[key]);
          }

          console.log(this.otpCredentials);

          if(this.allTrue(this.otp_values)) {

                this.onValidateUserOtpHandler();
          }
    }


    onResendOtpHandler() {

          this.maxTime = 30;
          this.onStartOtpTimerHandler();

          if(this.counter == 0) {

                this.counter = 30*60;;
                this.onTimeCounter();
          }

          this.dbService.onPostRequestDataFromApi(this.data_value, 'login/login_submit', this.dbService.rootUrlSfa).subscribe((response:any) => {

                console.log(response);
                if (response['msg'] == 'exist')  {

                    this.dbService.onShowMessageAlertHandler('OTP has been sent.');
                }
          });

          this.resendActiveClass=true;
          setTimeout(() => {

              this.resendActiveClass = false;

          }, 30000);
    }



    onTimeCounter() {

          this.countDown = Observable.timer(0, 1000).take(this.counter).map(() => --this.counter);

          this.countDown = Observable.timer(0, 1000).take(this.counter).map(() => {

              --this.counter;
              if(this.counter == 0) {

                   this.data_value['otp'] = Math.floor(100000 + Math.random() * 900000);
              }

          })
    }


    onStartOtpTimerHandler()  {

        this.timer = setTimeout((x) => {

            this.maxTime -= 1;

            if(this.maxTime>0) {

                this.hidevalue = true;
                this.onStartOtpTimerHandler();

            }  else {
                this.maxtime = 30;
                this.hidevalue = false;
            }

        }, 1000);
    }



    allTrue(obj) {

        for(var o in obj)
        if(!obj[o]) return false;

        return true;
    }


    moveFocus(nextElement,previousElement,ev) {

          if(ev.keyCode != 8 && nextElement) {

              nextElement.setFocus();
          }

          if(ev.keyCode == 8 && previousElement) {

              console.log(previousElement);
              previousElement.setFocus();
          }
    }

}
