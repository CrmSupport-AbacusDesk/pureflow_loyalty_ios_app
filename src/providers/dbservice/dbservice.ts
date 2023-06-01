import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
// import { ConstructorProvider } from '@angular/core/src/di/provider';
import JwtDecode from 'jwt-decode';
import * as moment from 'moment/moment';


@Injectable()
export class DbserviceProvider {
      token_value:any = "";
      tokenInfo:any;
      user_id:any;
      karigar_id:any='';
      karigar_status:any='';
      karigar_info:any='';
      userlogin:any;
      url:any='';
      loading:Loading;
      protected token_data : any;

        public rootUrl: string =  'http://pureflow.abacusdesk.com/dd_api/'
        public rootUrlSfa: string =  'http://pureflow.abacusdesk.com/crm/api/app/'
        public image_call_url:string =  this.rootUrl + 'app/Http/Controllers/Admin/Master/appOfflineUploads/'
        public category:string =  this.image_call_url + 'imageCatalogue/'

        public server_url: string = this.rootUrl + 'index.php/app/';
        public image_url: string= this.image_call_url + 'categoryImage/'
        public newArrival:string = this.image_call_url + 'productImage/'
        public upload_url: string = this.rootUrl;
        public upload_url1: string = 'http://pureflow.abacusdesk.com/crm/api/uploads/';
        public upload_url2: string = 'http://pureflow.abacusdesk.com/uploads/order-invoice/';
        public upload_url3: string = 'http://pureflow.abacusdesk.com/dd_api/app/uploads/';
        public offer_imgurl:string = this.upload_url3 + 'offers/';
        public gift_imgurl:string = this.upload_url3 + 'gifts/';
      

      // Test Links
      // public rootUrl: string= 'http://phpstack-83335-1831788.cloudwaysapps.com/dd_api/'
      // public rootUrlSfa: string =  'http://phpstack-83335-1831788.cloudwaysapps.com/crm/api/app/'                          
    

      // public server_url: string = this.rootUrl + 'index.php/app/';    
      // public image_call_url:string =  this.rootUrl + 'app/Http/Controllers/Admin/Master/appOfflineUploads/'  

      // public category:string =  this.image_call_url + 'imageCatalogue/'
      // public image_url: string= this.image_call_url + 'categoryImage/'
      // public newArrival:string = this.image_call_url + 'productImage/'
      
      // public upload_url: string = this.rootUrl;
      // public upload_url1: string = 'http://phpstack-83335-1831788.cloudwaysapps.com/crm/api/uploads/';                           
      // public upload_url2: string = 'http://phpstack-83335-1831788.cloudwaysapps.com/uploads/order-invoice/';                           
      // public upload_url3: string = 'http://phpstack-83335-1831788.cloudwaysapps.com/dd_api/app/uploads/';                              
      
      
      
      userStorageData: any;
      
      connection: any;
      
      public networkType = '';
      connectionChk: any;
      public backButton = 0;
      
      public deviceId:any
      public tabSelectedOrder:any;
      
      constructor(public http: HttpClient,
            public alertCtrl:AlertController,
            public loadingCtrl:LoadingController,
            public toastCtrl: ToastController,
            public http1:HttpClient,
            public storage: Storage,
            // private constant:ConstructorProvider,
          
            ) {
                  this.url=this.rootUrl;
                  this.token();
                  console.log('Hello DbserviceProvider Provider');
            }

            changeDateFormat(date){
                  return moment(date).format('MMM d, y');
            }

            token()
            {
              console.log('token');
              this.storage.get('token').then((val) => {
                this.token_value = val;
                this.tokenInfo = this.getDecodedAccessToken(this.token_value);
                if( this.tokenInfo)
                {
                  this.karigar_id=this.tokenInfo.sub;
                  console.log(this.karigar_id);
                }
              });
             }

             getDecodedAccessToken(token: string): any {
                  try{
                  return JwtDecode(token);
                  }
                  catch(Error){
                  return null;
                  }
                  }

            set_token_value(value)
            {
                  this.token_data=value;
            }
            
            get_token_data()
            {
                  return this.token_data
            }


            
            onPostRequestDataFromApi(requestData: any, fn: any, serverURL:any):any {
                  
                  let headers = new HttpHeaders().set('Content-Type', 'application/json');
                  console.log(serverURL);
                  
                  console.log(this.userStorageData);
                  
                  if(this.userStorageData && this.userStorageData.token) {
                        headers = headers.set('Authorization', 'Bearer ' + this.userStorageData.token);
                        headers = headers.set('Token', 'Bearer ' + this.userStorageData.token);
                  }
                  
                  return this.http.post(serverURL + fn, JSON.stringify(requestData), {headers: headers});
            }
            
            
            get_rqst(fn:any):any {
                  
                  let headers = new HttpHeaders().set('Content-Type', 'application/json');
                  headers = headers.set('Token', 'Bearer ' + this.token_value );
                  return this.http.get(this.rootUrl + fn, {headers: headers});
                  
            }
            
            post_rqst(request_data: any, fn: any):any {
                  this.token_value = this.get_token_data();
                  this.tokenInfo = this.getDecodedAccessToken(this.token_value); // decode token
                  if(this.tokenInfo)
                  {
                        this.karigar_id=this.tokenInfo.sub;
                        console.log(this.karigar_id);
                  }
                  let headers = new HttpHeaders().set('Content-Type', 'application/json');
                  // console.log(this.constant.rootUrl);
                  headers = headers.set('Token', 'Bearer ' + this.token_value);
                  return this.http.post(this.rootUrl + fn, JSON.stringify(request_data), {headers: headers});
                  
            }
            
            onGetRequestDataFromApi(fn:any, serverURL:any):any {
                  
                  let headers = new HttpHeaders().set('Content-Type', 'application/json');
                  
                  console.log(this.userStorageData);
                  
                  if(this.userStorageData && this.userStorageData.token) {
                        headers = headers.set('Authorization', 'Bearer ' + this.userStorageData.token);
                        headers = headers.set('Token', 'Bearer ' + this.userStorageData.token);
                  }
                  console.log(serverURL);
                  
                  return this.http.get (serverURL + fn, {headers: headers});
            }
            
            
            onMobileValidateHandler(event: any) {
                  
                  const pattern = /[0-9]/;
                  
                  let inputChar = String.fromCharCode(event.charCode);
                  
                  if (event.keyCode != 8 && !pattern.test(inputChar)) {
                        
                        event.preventDefault();
                  }
            }
            
            
            onShowMessageAlertHandler(messageText) {
                  
                  const alert = this.alertCtrl.create({
                        title:'Message!',
                        cssClass:'action-close',
                        subTitle: messageText,
                        buttons: ['OK']
                  });
                  
                  alert.present();
            }
            
            
            onShowLoadingHandler() {
                  
                  this.loading = this.loadingCtrl.create({
                        content: 'Please wait...',
                        dismissOnPageChange: true
                  });
                  
                  this.loading.present();
            }
            
            
            onDismissLoadingHandler()  {
                  
                  this.loading.dismiss();
            }
            
            public errToasr() {
                  
                  let toast = this.toastCtrl.create({
                        message: 'Error Occured ,Please try Again!!',
                        duration: 3000,
                        position: 'bottom'
                  });
                  
                  toast.present();
            }
            
            public presentToast(msg) {
                  
                  let toast = this.toastCtrl.create({
                        message: msg,
                        duration: 3000,
                        position: 'bottom'
                  });
                  
                  toast.present();
            }
            
            
            
      }
      