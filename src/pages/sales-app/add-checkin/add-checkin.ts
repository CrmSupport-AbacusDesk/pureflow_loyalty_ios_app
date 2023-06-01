import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, Navbar, Platform, AlertController  } from 'ionic-angular';
import { AddDealerPage } from '../add-dealer/add-dealer';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';



@IonicPage()
@Component({
  selector: 'page-add-checkin',
  templateUrl: 'add-checkin.html',
})
export class AddCheckinPage {

  @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;

  @ViewChild(Navbar) navBar: Navbar;

  userPincode:any
  userPincodeCheck = true ;
  data:any = {};
  distribution_data:any=[];
  addNewDealer:any=false;
  distributorList: any = [];
  AddCheckinForm:FormGroup;

  customer_type:any = {};
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              public dbService: DbserviceProvider,
              public toastCtrl: ToastController,
              public formBuilder: FormBuilder,
              public platform: Platform,
              public locationAccuracy: LocationAccuracy,
              public geolocation: Geolocation,
              public storage:Storage) {

      this.checkUserLocation()
      this.data = {};

      if(this.navParams.get('data'))
      {
        this.distribution_data = this.navParams.get('data');
        console.log(this.distribution_data);

        this.data.network = this.distribution_data.type;
        console.log(this.data.network);

        this.data.dr_id = this.distribution_data.id;
        console.log(this.data.dr_id);

        this.data.type_name = {'company_name':this.distribution_data.company_name};
        console.log(this.data.type_name);

        this.type_name.company_name = this.distribution_data.company_name;
        this.type_name.name = this.distribution_data.name;
        this.type_name.mobile = this.distribution_data.mobile;
      }

      this.AddCheckinForm = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
        mobile: ['',Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])]
      })

    }
    userType:any;
    ionViewDidLoad() {
      console.log('ionViewDidLoad AddCheckinPage');

      // this.navBar.backButtonClick = (e:UIEvent)=>{
      //   // todo something
      //   this.navCtrl.push(CheckinListPage);
      // }

        const userType = this.dbService.userStorageData.user_type;
        console.log(userType);
        if(userType=='OFFICE')
        {
          this.data.network=3;
          this.get_network_list(this.data.network)
          this.userType  = userType
        }
    }


    loading:any;
    lodingPersent()
    {
      this.loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
      });
      this.loading.present();
    }


    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Visit Started Successfully',
        duration: 3000,
        position: 'bottom'
      });



      toast.present();
    }


    distributor_network_list:any = [];

    get_network_list(network_type)
    {
      this.addNewDealer=false
      this.data.type_name = {};
      this.load = "0";

      console.log(network_type);

      if(network_type != 'Other')
      {
        var loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
        });
        this.dbService.onPostRequestDataFromApi({'type':network_type},'Distributor/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
          console.log(result);
          this.distributor_network_list = result;
          loading.dismiss();
          this.open();
        });
        loading.present();
      }



    }

    open()
    {
      this.selectComponent.open();
    }

    startVisit()
    {

      console.log(this.distribution_data);

      var loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
      });
      // if(this.data.type_name && this.data.type_name.pincode)
      // {
      //   if(this.data.type_name.pincode != this.userPincode)
      //   {
      //     this.service.presentToast('Your Location Does Not Match With The Counter Location ')
      //     return
      //   }
      // }
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        () => {

          console.log('Request successful');

          let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
          this.geolocation.getCurrentPosition(options).then((resp) => {


            var lat = resp.coords.latitude
            var lng = resp.coords.longitude

            if(this.distribution_data == '')
            {
              console.log(this.data);
              this.data.dr_id = this.data.type_name.id;
              this.data.dr_name = this.data.type_name.name;
              this.data.lat = lat;
              this.data.lng = lng;

              this.dbService.onPostRequestDataFromApi({'data':this.data},'Checkin/start_visit_new', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                if(result == 'success')
                {

                  this.navCtrl.pop();
                  loading.dismiss();
                  this.presentToast();
                }
                else
                {
                  loading.dismiss();
                }
              });
            }

            if(this.distribution_data != '')
            {
              this.dbService.onPostRequestDataFromApi({'data':this.data},'Checkin/start_visit_new', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                if(result == 'success')
                {

                  this.navCtrl.pop();
                  loading.dismiss();
                  this.presentToast();
                }
                else
                {
                  loading.dismiss();
                }
              });

            }


          }).catch((error) => {
            console.log('Error getting location', error);
            // this.saveOrderHandler({});
            console.log('Error requesting location permissions', error);
            loading.dismiss();
            let toast = this.toastCtrl.create({
              message: 'Allow Location Permissions',
              duration: 3000,
              position: 'bottom'
            });



            toast.present();
          });
        },
        error => {
          console.log('Error requesting location permissions', error);
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Allow Location Permissions',
            duration: 3000,
            position: 'bottom'
          });



          toast.present();
        });



        loading.present();

      }



      MobileNumber(event: any)
      {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar))
        {event.preventDefault(); }
      }


      load:any = "0";
      type_name:any={};

      other_name:any = '';
      other(name,network,type_name)
      {
        this.addNewDealer=false
        console.log(type_name);

        this.type_name = type_name;
        this.load = "1";

        console.log(name);
        console.log(network);
        if(name == 'Add New Channel Partner')
        {
          this.navCtrl.push(AddDealerPage,{'type': network});
        }

        if(name == 'Add New Direct Dealer')
        {
          this.navCtrl.push(AddDealerPage,{'type': network});
        }

        if(name == 'Add New Dealer')
        {
          this.addNewDealer = true;
        }

      }

      check_num(mobile)
      {
        this.checkExist=false
        console.log(mobile);

        if(mobile && mobile.length == 10)
        {
          console.log(mobile.length);

          console.log(mobile);
          this.check_mobile_existence(mobile)
        }
      }
      checkExist=false
      check_mobile_existence(mobile)
      {
        // this.data.mobile=mobile

        var loading = this.loadingCtrl.create({
          spinner: 'hide',
          content: `<img src="./assets/imgs/gif.svg"/>`,
          dismissOnPageChange: true
        });
        loading.present();
        this.dbService.onPostRequestDataFromApi({'mobile':mobile},'Enquiry/check_mobile_existenceLead', this.dbService.rootUrlSfa).subscribe((result)=>{

          loading.dismiss()

          if(result['executive']!=0)
          {
            let alert=this.alertCtrl.create({
              title:'Exists !!',
              subTitle: 'Mobile No Is Already Registered With An Executive !!',
              cssClass:'action-close',

              buttons: [
                {
                  text:'Okay',
                  cssClass: 'close-action-sheet',
                  handler:()=>
                  {
                  }
                }]
              });
              alert.present();
              this.data.mobile='';
              return;
            }
            if(result['check_mobile']==1)
            {
              this.checkExist=true

              this.dbService.presentToast('Dealer With Same Mobile No. Already Exists')

            }
            else
            {
              this.data.DealerExist=false;

              this.checkExist=false
            }

          },err=>
          {
            loading.dismiss()

          })



        }
        startDealerVisit()
        {
          if(this.checkExist==true)
          {
            this.dbService.presentToast('Mobile No. Already Exists !!');
            return
          }
          this.dbService.onShowLoadingHandler()
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
              this.geolocation.getCurrentPosition(options).then((resp) => {

                this.data.lat = resp.coords.latitude
                this.data.lng = resp.coords.longitude

                this.data.type = 'Retailer';
                console.log(this.data);

                this.dbService.onPostRequestDataFromApi({'data':this.data},'Checkin/start_dealer_visit', this.dbService.rootUrlSfa).subscribe((result)=>{
                  console.log(result);
                  if(result == 'success')
                  {

                    this.navCtrl.pop();
                    this.dbService.onDismissLoadingHandler();
                    this.presentToast();
                  }
                },err=>
                {
                  this.dbService.onDismissLoadingHandler();
                  this.dbService.errToasr();
                });

              }).catch((error) => {
                console.log('Error getting location', error);
                console.log('Error requesting location permissions', error);
                this.dbService.onDismissLoadingHandler();
                let toast = this.toastCtrl.create({
                  message: 'Allow Location Permissions',
                  duration: 3000,
                  position: 'bottom'
                });



                toast.present();
              });
            },
            error => {
              console.log('Error requesting location permissions', error);
              this.dbService.onDismissLoadingHandler();
              let toast = this.toastCtrl.create({
                message: 'Allow Location Permissions',
                duration: 3000,
                position: 'bottom'
              });



              toast.present();
            });
          }
          startOtherVisit()
          {
            this.dbService.onShowLoadingHandler()
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              () => {
                let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                this.geolocation.getCurrentPosition(options).then((resp) => {

                  this.data.lat = resp.coords.latitude
                  this.data.lng = resp.coords.longitude

                  console.log(this.data);

                  this.dbService.onPostRequestDataFromApi({'data':this.data},'Checkin/start_other_visit', this.dbService.rootUrlSfa).subscribe((result)=>{
                    console.log(result);
                    if(result == 'success')
                    {

                      this.dbService.onDismissLoadingHandler();
                      this.navCtrl.pop();
                      this.presentToast();
                    }
                  },err=>
                  {
                    this.dbService.onDismissLoadingHandler();
                    this.dbService.errToasr();
                  });

                }).catch((error) => {
                  console.log('Error getting location', error);
                  // this.saveOrderHandler({});
                  console.log('Error requesting location permissions', error);
                  this.dbService.onDismissLoadingHandler();
                  let toast = this.toastCtrl.create({
                    message: 'Allow Location Permissions',
                    duration: 3000,
                    position: 'bottom'
                  });



                  toast.present();
                });
              },
              error => {
                console.log('Error requesting location permissions', error);
                this.dbService.onDismissLoadingHandler();
                let toast = this.toastCtrl.create({
                  message: 'Allow Location Permissions',
                  duration: 3000,
                  position: 'bottom'
                });



                toast.present();
              });
            }
            userCurrentLocation:any
            checkUserLocation()
            {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  let options = {maximumAge: 10000, timeout: 15000, enableHighAccuracy: true};
                  this.geolocation.getCurrentPosition(options).then((resp) => {

                    this.data.lat = resp.coords.latitude
                    this.data.lng = resp.coords.longitude

                    console.log(this.data);

                    this.dbService.onPostRequestDataFromApi({'data':this.data},'Checkin/checkPincode', this.dbService.rootUrlSfa).subscribe((result)=>{
                      console.log(result);
                      this.userPincode = result[0]
                      this.userCurrentLocation = result[1]
                      console.log('check console here');

                      console.log(this.userPincode);
                      console.log(this.userCurrentLocation);

                    },err=>
                    {
                      this.dbService.onDismissLoadingHandler();
                      this.dbService.errToasr();
                    });

                  }).catch((error) => {
                    console.log('Error getting location', error);
                    console.log('Error requesting location permissions', error);
                    this.dbService.onDismissLoadingHandler();
                    let toast = this.toastCtrl.create({
                      message: 'Allow Location Permissions',
                      duration: 3000,
                      position: 'bottom'
                    });



                    toast.present();
                  });
                },
                error => {
                  console.log('Error requesting location permissions', error);
                  this.dbService.onDismissLoadingHandler();
                  let toast = this.toastCtrl.create({
                    message: 'Allow Location Permissions',
                    duration: 3000,
                    position: 'bottom'
                  });



                  toast.present();
                });
              }

            }
