import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ActionSheetController, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AddOrderPage } from '../../add-order/add-order';
import { Storage } from '@ionic/storage';
import { Camera ,CameraOptions} from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions, MediaFile } from '@ionic-native/media-capture';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-end-checkin',
  templateUrl: 'end-checkin.html',
})
export class EndCheckinPage {
  state_list:any=[];city_list:any=[];
  city_name:any=[];
  data:any={};
  checkin_data:any = [];
  checkin:any = {};
  checkinForm: FormGroup;
  checkinFormWithNewDealer: FormGroup;
  order_token :any = [];
  brand_assign:any = [];
  
  constructor(public navCtrl: NavController,
    private camera: Camera ,
    public androidPermissions: AndroidPermissions,
    public navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private mediaCapture: MediaCapture,
    public dbService: DbserviceProvider,
    public geolocation: Geolocation,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public locationAccuracy: LocationAccuracy ,
    public alertCtrl: AlertController,
    public storage: Storage) {
      
      this.checkin_data = this.navParams.get('data');
      console.log(this.checkin_data);
      this.getState();
      
      this.checkinForm = this.formBuilder.group({
        description: ['',Validators.compose([Validators.required])],
        
      })
      this.checkin.dr_name = this.checkin_data.dr_name
      this.checkin.name = this.checkin_data.name
      this.checkin.dr_mobile = this.checkin_data.dr_mobile_no
    }
    
    ionViewDidLoad() {
      console.log('ionViewDidLoad EndCheckinPage');
    }
    
    for_order:any = [];
    
    
    functionCalled:any=0
    end_visit(checkin_id, description)
    {
      
      console.log(this.checkin_data);
      console.log(this.checkin_data.dr_id);
      console.log(this.checkin);
      
      
      if(!description)
      {
        this.dbService.presentToast('Please Add Description !!')
        return;
      }
      
      this.dbService.onShowLoadingHandler()
      
      this.functionCalled = 1
      
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {
          
          let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
          this.geolocation.getCurrentPosition(options).then((resp) => {
            
            var lat = resp.coords.latitude
            var lng = resp.coords.longitude

            
            this.dbService.onPostRequestDataFromApi({'lat':lat, 'lng':lng, 'checkin_id': checkin_id, 'checkin': description,imgarr:this.image_data,'dr_data':this.checkin,'dr_id':this.checkin_data.dr_id},'Checkin/visit_end', this.dbService.rootUrlSfa).subscribe((result) => {
              
              this.for_order = result['for_order'];
              this.brand_assign = result['brand_assign'];
              
              if(result['msg'] == 'success')
              {
                this.checkin={};
                console.log(this.checkin);
                
                this.dbService.onDismissLoadingHandler();
                
                this.dbService.presentToast('Visit Ended Successfully !!');
                if(this.checkin_data.other_name == '')
                {
                  this.presentAlert();
                  
                }
                else
                {
                  this.navCtrl.pop()
                }
              }
              
              
              
              
            })
            
          }).catch((error) => {
            console.log('Error getting location', error);
            
            this.dbService.onDismissLoadingHandler();
            this.dbService.presentToast('Error getting location !!')
          });
        },
        error => {
          console.log('Error requesting location permissions', error);
          this.dbService.onDismissLoadingHandler();
          this.dbService.presentToast('Allow Location Permissions !!')
        });
        
      }
      
      
      test_end_visit(checkin_id, description,CHECKINdATA)
      {
        console.log(CHECKINdATA);
        console.log(checkin_id);
        console.log(description);
        console.log(this.checkin);
        
      }
      
      end_visitwithNewDealer(checkin_id, description)
      {
        console.log(this.checkin);
        
        if(!description)
        {
          let toast = this.toastCtrl.create({
            message: 'Please Add Description',
            duration: 3000,
            position: 'bottom'
          });
          
          
          
          toast.present();
          return;
        }
        
        this.dbService.onShowLoadingHandler()
        
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            
            let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
            this.geolocation.getCurrentPosition(options).then((resp) => {
              
              var lat = resp.coords.latitude
              var lng = resp.coords.longitude
              
              this.dbService.onPostRequestDataFromApi({'lat':lat, 'lng':lng, 'checkin_id': checkin_id, 'checkin': description,imgarr:this.image_data,'dr_data':this.checkin},'Checkin/visit_endWithNewDealer', this.dbService.rootUrlSfa).subscribe((result) => {
                
                this.brand_assign = result['brand_assign'];
                
                if(result['msg'] == 'success')
                {
                  
                  this.dbService.onDismissLoadingHandler();
                  
                  this.dbService.presentToast('Visit Ended Successfully !!');
                  
                  this.navCtrl.pop()
                  
                  // this.presentAlert();
                }
                
              })
              
            }).catch((error) => {
              this.dbService.onDismissLoadingHandler();
              this.dbService.presentToast('Error getting location !!');
            });
          },
          error => {
            this.dbService.onDismissLoadingHandler();
            this.dbService.presentToast('Error requesting location permissions')
          });
          
        }
        presentAlert() {
          let alert = this.alertCtrl.create({
            title: 'Create Order',
            message: 'Do you want to create order for this checkin?',
            cssClass: 'alert-modal',
            buttons: [
              {
                text: 'Yes',
                handler: () => {
                  console.log('Yes clicked');
                  console.log(this.for_order);
                  this.navCtrl.pop();
                  
                  this.navCtrl.push(AddOrderPage,{'for_order':this.for_order,'brand_assign':this.brand_assign});
                  
                }
              },
              {
                text: 'No',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                  console.log(this.for_order)
                  this.navCtrl.pop();
                  
                  
                }
              }
            ]
          });
          alert.present();
        }
        //cpture image
        onGetCaptureVideoPermissionHandler() {
          
          console.log('start');
          
          this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
            result => {
              if (result.hasPermission) {
                
                console.log('hello111');
                
                this.capturevideo();
                
              } else {
                this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
                  if (result.hasPermission) {
                    
                    console.log('hello222');
                    
                    this.capturevideo();
                    
                  }
                });
              }
            },
            err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            );
            
            
            
            
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
              this.image= 'data:image/jpeg;base64,' + imageData;
              
              console.log(this.image);
              if(this.image)
              {
                this.fileChange(this.image);
              }
            }, (err) => {
            });
          }
          videoId: any;
          flag_upload = true;
          flag_play = true;
          capturevideo()
          {
            let options: CaptureVideoOptions = { limit: 1 };
            this.mediaCapture.captureVideo(options)
            .then((videodata: MediaFile[]) => {
              console.log(videodata);
              
              var i, path, len,name;
              for (i = 0, len = videodata.length; i < len; i += 1)
              {
                path = videodata[i].fullPath;
                name = videodata[i].name;
              }
              this.videoId = path;
              this.flag_play = false;
              this.flag_upload = false;
              console.log(videodata);
              
              
            });
          }
          
          image:any='';
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
              this.image = 'data:image/jpeg;base64,' + imageData;
              console.log(this.image);
              if(this.image)
              {
                this.fileChange(this.image);
              }
            }, (err) => {
            });
          }
          captureImageVideo()
          {
            let actionsheet = this.actionSheetController.create({
              title:"Upload Image",
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
                icon:'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              }
            ]
          });
          actionsheet.present();
        }
        image_data:any=[];
        
        fileChange(img)
        {
          this.image_data=[];
          this.image_data.push(img);
          console.log(this.image_data);
          this.image = '';
        }
        
        captureMedia()
        {
          if(this.videoId)
          {
            this.captureImageVideo();
          }
          else
          {
            this.captureImageVideo();
          }
          
        }
        
        remove_image(i:any)
        {
          this.image_data.splice(i,1);
        }
        getState() {
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
          });
          
          this.dbService.onGetRequestDataFromApi('enquiry/all_state', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            
            loading.dismiss();
            console.log(response);
            this.state_list = response;
            
          });
          
          loading.present();
        }
        
        district_list:any = [];
        
        
        getDistrict(state) {
          console.log(state);
          
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
          });
          
          this.dbService.onPostRequestDataFromApi(state, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            loading.dismiss();
            console.log(response);
            this.district_list = response;
            
          });
          loading.present();
        }
        
        check_gst:any = '';
        gst_details:any = [];
        check_mobile:any = '';
        
        
        
        check_mobile_existence(mobile)
        {
          
          this.dbService.onPostRequestDataFromApi({'mobile':mobile},'Enquiry/check_mobile_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            
            this.check_mobile = result['check_mobile'];
            console.log(this.check_mobile);
            
            console.log(mobile.length);
            
          })
          
        }
        
        get_pincode_area_name(pincode)
        {
          this.dbService.onPostRequestDataFromApi(pincode, 'enquiry/pincode_city_name', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            console.log(response);
            if(response=='' || response==null)
            {
              this.city_name = "Not Matched";
            }
            else
            {
              this.city_name = response.city;
              this.data.state = {'state_name':response.state_name};
              this.data.district = {'district_name':response.district_name};
              this.data.city = {'city':response.city};
              
            }
          });
        }
        
        
        getCity(state,district) {
          console.log(state);
          console.log(district);
          
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
          });
          
          this.dbService.onPostRequestDataFromApi({'state':state,'district':district}, 'enquiry/get_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            loading.dismiss();
            console.log(response);
            this.city_list = response;
            
          });
          loading.present();
        }
        
        getArea(state,district,city) {
          console.log(state);
          
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
          });
          
          this.dbService.onPostRequestDataFromApi({'state':state,'district':district, 'city':city}, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            loading.dismiss();
            console.log(response);
            this.city_list = response;
            
          });
          loading.present();
        }
        
        
        getPincode(state,district,city,area) {
          console.log(state);
          
          let loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
          });
          
          this.dbService.onPostRequestDataFromApi({'state':state,'district':district, 'city':city, 'area':area}, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
            loading.dismiss();
            console.log(response);
            this.city_list = response;
            
          });
          loading.present();
        }
        
        selectAddressOnBehalfOfPincode()
        {
          if(this.checkin.pincode.length==6)
          {
            var loading = this.loadingCtrl.create({
              spinner: 'hide',
              content: `<img src="./assets/imgs/gif.svg"/>`,
              dismissOnPageChange: true
            });
            loading.present();
            this.dbService.onPostRequestDataFromApi({'pincode':this.checkin.pincode},'Enquiry/selectAddressOnBehalfOfPincode', this.dbService.rootUrlSfa).subscribe((result)=>{
              loading.dismiss()
              
              console.log(result);
              this.checkin.state = result['state_name']
              this.get_district()
              this.checkin.district = result['district_name']
              this.checkin.city = result['city']
              this.checkin.area = result['area']
              
            },err=>
            {
              loading.dismiss()
              
              // this.db.presentToast('Failed To Get ')
            })
          }
        }
        get_district()
        {
          this.dbService.onPostRequestDataFromApi({"state_name":this.checkin.state},"dealerData/getDistrict", this.dbService.rootUrlSfa)
          .then(resp=>{
            console.log(resp);
            this.district_list = resp['district_list'];
          },
          err=>{
            this.dbService.errToasr();
          })
        }

        MobileNumber(event: any)
        {
          const pattern = /[0-9\+\-\ ]/;
          let inputChar = String.fromCharCode(event.charCode);
          if (event.keyCode != 8 && !pattern.test(inputChar))
          {event.preventDefault(); }
        }
        
      }
      