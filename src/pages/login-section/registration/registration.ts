import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, Loading, ModalController  } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { TabsPage } from './../../../pages/tabs/tabs';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';
import { Camera, CameraOptions } from '@ionic-native/camera';
import {AboutusModalPage} from '../../aboutus-modal/aboutus-modal'
import { Storage } from '@ionic/storage';




@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  data:any={};
  state_list:any=[];
  district_list:any=[];
  city_list:any=[];
  pincode_list:any=[];
  selectedFile:any=[];
  file_name:any=[];
  karigar_id:any='';
  formData= new FormData();
  myphoto:any;
  profile_data:any='';
  loading:Loading;
  today_date:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public alertCtrl:AlertController,
              public actionSheetController: ActionSheetController,
              private camera: Camera,
              private loadingCtrl:LoadingController,
              private transfer: FileTransfer,
              public modalCtrl: ModalController,
              private storage:Storage) {

    this.getstatelist();
    this.getDr();
    // this.data.gender="male";
    this.data.document_type='Adharcard';
    this.today_date = new Date().toISOString().slice(0,10);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
    this.data.mobile_no = this.navParams.get('mobile_no');
    this.data.type = this.navParams.get('loginType');
    // this.data.type = "Customer";
    console.log(this.data.type);
    this.data.profile='';
    this.data.document_image='';
    console.log(this.data.profile);

  }

  getstatelist()
  {
    this.dbService.onGetRequestDataFromApi('app_master/getStates', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
        this.state_list=r['states'];
        this.karigar_id=r['id'];
        console.log(this.state_list);
      });
    }

    getDistrictList(state_name)
    {
      console.log(state_name);
      this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrl).subscribe( r =>
        {
          console.log(r);
          this.district_list=r['districts'];
          console.log(this.state_list);
        });
      }

      getDr()
      {
        // this.service.post_rqst({},'app_karigar/getDr').subscribe( r =>
        //   {
        //     console.log(r);
        //   });
        }



        submit()
        {
          console.log(this.selectedFile);
          this.presentLoading();
          console.log('data');
          this.data.type = this.navParams.get('loginType');
          if(this.data.type == 'Customer')
          {
            this.data.status='Verified';
            // console.log(this.data.dealer_status);
          }
          else{

            this.data.status='Pending';
          }
          console.log(this.data);
          this.data.karigar_edit_id='';

          this.dbService.onPostRequestDataFromApi( {'karigar': this.data },'app_karigar/addKarigar', this.dbService.rootUrl).subscribe( r =>
            {
              console.log(r);
              this.loading.dismiss();
              this.karigar_id=r['id'];
              console.log(this.karigar_id);

              if(r['status']=="SUCCESS")
              {
                console.log('if');
                // this.showSuccess("Registered Successfully!");
                this.dbService.onPostRequestDataFromApi({'mobile_no': this.data.mobile_no ,'mode' :'App'},'auth/login',this.dbService.rootUrl).subscribe( r =>
                  {
                    console.log(r);
                    if(r['status'] == 'NOT FOUND'){

                      return;

                    } else if(r['status'] == 'ACCOUNT SUSPENDED'){

                      this.showAlert("Your account has been suspended");
                      return;

                    }
                    else if(r['status'] == 'SUCCESS')
                    {
                        r['loginType'] = 'CMS';
                        r['user']['token'] = r['token'];
                        r['user']['loginType'] = r['loginType'];
                        this.storage.set('userStorageData',r['user']);

                        this.dbService.userStorageData = [];
                        this.dbService.userStorageData = r['user'];

                        console.log(this.dbService.userStorageData);
                        this.navCtrl.push(TabsPage);

                        if( r['user'].status !='Verified')
                        {
                              let contactModal = this.modalCtrl.create(AboutusModalPage);
                              contactModal.present();
                              return;
                        }
                    }

                  });
                }
                else if(r['status']=="EXIST")
                {
                  this.showAlert("Already Registered!");
                }
              });
            }
            namecheck(event: any)
            {
              const pattern = /[A-Z\+\-\a-z ]/;
              let inputChar = String.fromCharCode(event.charCode);
              if (event.keyCode != 8 && !pattern.test(inputChar))
              {event.preventDefault(); }
            }

            caps_add(add:any)
            {
              this.data.address = add.replace(/\b\w/g, l => l.toUpperCase());
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
            showAlert(text) {
              let alert = this.alertCtrl.create({
                title:'Alert!',
                cssClass:'action-close',
                subTitle: text,
                buttons: ['OK']
              });
              alert.present();
            }
            openeditprofile()
            {
              let actionsheet = this.actionSheetController.create({
                title:"Profile photo",
                cssClass: 'cs-actionsheet',

                buttons:[{
                  cssClass: 'sheet-m',
                  text: 'Camera',
                  icon:'camera',
                  handler: () => {
                    console.log("Camera Clicked");
                    this.takePhoto();
                  }
                },
                {
                  cssClass: 'sheet-m1',
                  text: 'Gallery',
                  icon:'image',
                  handler: () => {
                    console.log("Gallery Clicked");
                    this.getImage();
                  }
                },
                {
                  cssClass: 'cs-cancel',
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    console.log('Cancel clicked');
                  }
                }
              ]
            });
            actionsheet.present();
          }
          takePhoto()
          {
            console.log("i am in camera function");
            const options: CameraOptions = {
              quality: 70,
              destinationType: this.camera.DestinationType.DATA_URL,
              targetWidth : 500,
              targetHeight : 400
            }

            console.log(options);
            this.camera.getPicture(options).then((imageData) => {
              this.data.profile = 'data:image/jpeg;base64,' + imageData;
              console.log(this.data.profile);
            }, (err) => {
            });
          }
          getImage()
          {
            const options: CameraOptions = {
              quality: 70,
              destinationType: this.camera.DestinationType.DATA_URL,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              saveToPhotoAlbum:false
            }
            console.log(options);
            this.camera.getPicture(options).then((imageData) => {
              this.data.profile = 'data:image/jpeg;base64,' + imageData;
              console.log(this.data.profile);
            }, (err) => {
            });
          }

          flag:boolean=true;

          onUploadChange(evt: any) {
            // this.flag=false;
            // const file = evt.target.files[0];

            // if (file) {
            //   const reader = new FileReader();

            //   reader.onload = this.handleReaderLoaded.bind(this);
            //   reader.readAsBinaryString(file);
            // }
            let actionsheet = this.actionSheetController.create({
              title:" Upload File",
              cssClass: 'cs-actionsheet',

              buttons:[{
                cssClass: 'sheet-m',
                text: 'Camera',
                icon:'camera',
                handler: () => {
                  console.log("Camera Clicked");
                  this.takeDocPhoto();
                }
              },
              {
                cssClass: 'sheet-m1',
                text: 'Gallery',
                icon:'image',
                handler: () => {
                  console.log("Gallery Clicked");
                  this.getDocImage();
                }
              },
              {
                cssClass: 'cs-cancel',
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          actionsheet.present();
        }
        takeDocPhoto()
        {
          console.log("i am in camera function");
          const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            targetWidth : 500,
            targetHeight : 400
          }

          console.log(options);
          this.camera.getPicture(options).then((imageData) => {
            this.flag=false;
            this.data.document_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.document_image);
          }, (err) => {
          });
        }
        getDocImage()
        {
          const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
          }
          console.log(options);
          this.camera.getPicture(options).then((imageData) => {
            this.flag=false;
            this.data.document_image = 'data:image/jpeg;base64,' + imageData;
            console.log(this.data.document_image);
          }, (err) => {
          });
        }
        // handleReaderLoaded(e) {
        //   this.data.document_image = 'data:image/png;base64,' + btoa(e.target.result);
        //   console.log( this.data.document_image );
        // }
        presentLoading()
        {
          this.loading = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
          });
          this.loading.present();
        }

        MobileNumber(event: any) {
          const pattern = /[0-9]/;
          let inputChar = String.fromCharCode(event.charCode);
          if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
          }
        }

}
