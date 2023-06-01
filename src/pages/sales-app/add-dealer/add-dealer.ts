import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Navbar, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AddCheckinPage } from '../add-checkin/add-checkin';
import { ViewChild } from '@angular/core';
import { AddOrderPage } from '../../add-order/add-order';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

/**
 * Generated class for the AddDealerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-dealer',
  templateUrl: 'add-dealer.html',
})
export class AddDealerPage {

  @ViewChild(Navbar) navBar: Navbar;


  lead_form:any = {};
  state_list:any=[];
  city_list:any=[];
  data:any={};
  contact_person={};
  city_name:any=[];

  validateForm: FormGroup;
  type:any = '';
  title:any = '';
  order:any = '';

  district_list:any = [];
  check_gst:any = '';
  gst_details:any = [];
  check_mobile:any = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public dbService: DbserviceProvider,
              public formBuilder: FormBuilder,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController) {

    this.type = this.navParams.get('type');
    console.log(this.type);

    if(this.type == 1)
    {
      this.title = 'Channel Partner';
    }

    if(this.type == 3)
    {
      this.title = 'Dealer';
    }

    if(this.type == 7)
    {
      this.title = 'Direct Dealer'
    }


    if(this.navParams.get('user_type'))
    {
      this.order = this.navParams.get('user_type');
      this.type = this.navParams.get('user_type');
      this.title = 'Dealer';
    }

    this.validateForm = formBuilder.group({
        companyName: ['', Validators.compose([Validators.required])],
        name: ['', Validators.compose([Validators.required])],
        email: [''],
        mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        whatsapp: ['',Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
        gst: [''],
        dob: [''],
        anniversary_date: [''],
        address: ['', Validators.compose([Validators.required])],
        stateName: ['', Validators.compose([Validators.required])],
        districtName: ['', Validators.compose([Validators.required])],
        pincode: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
        city: ['', Validators.compose([Validators.required])],


    });
    this.getState();
    // this.get_category();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddDealerPage');
    this.navBar.backButtonClick = (e:UIEvent)=>{
      // todo something
      this.navCtrl.push(AddCheckinPage);
     }
  }



  portChange(event: {
    // component: IonicSelectableComponent,
    value: any
  }) {
    console.log('port:', event.value);
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


    check_mobile_existence(mobile)
  {

    this.dbService.onPostRequestDataFromApi({'mobile':mobile},'Enquiry/check_mobile_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);

      this.check_mobile = result['check_mobile'];
        console.log(this.check_mobile);

        console.log(mobile.length);

    })

  }


  check_gst_existence(gst)
  {

    this.dbService.onPostRequestDataFromApi({'gst':gst},'Enquiry/check_gst_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);

      this.check_gst = result['check_gst'];
        console.log(this.check_gst);
        this.gst_details = result['data'];
        console.log(this.gst_details);
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


  category_list:any = [];
  get_category()
  {
    this.dbService.onPostRequestDataFromApi({'type':this.type},'Distributor/discount_category', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.category_list = result;
      console.log(this.category_list);
    })
  }



  MobileNumber(event: any)
  {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar))
    {event.preventDefault(); }
   }

   presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Lead Added Successfully',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }


  presentToast1() {
    let toast1 = this.toastCtrl.create({
      message: 'Dealer Added Successfully',
      duration: 3000,
      position: 'bottom'
    });

    toast1.present();
  }

  data1:any=[];

  loading:any = "0";
  order_data:any = [];


  submitDealer()
  {

    console.log(this.data);
    this.loading = "1";


    if(this.validateForm.invalid)
    {
      this.validateForm.get('companyName').markAsTouched();

      this.validateForm.get('name').markAsTouched();
        this.validateForm.get('mobile').markAsTouched();
        this.validateForm.get('stateName').markAsTouched();
        this.validateForm.get('districtName').markAsTouched();
        this.validateForm.get('pincode').markAsTouched();
        this.validateForm.get('city').markAsTouched();

        this.validateForm.get('address').markAsTouched();
        this.validateForm.get('gst').markAsTouched();
        this.validateForm.get('whatsapp').markAsTouched();

      return;
    }

    // return false;


    this.data.state = this.data.state.state_name;
    this.data.district = this.data.district.district_name;
    this.data.city = this.data.city.city;
    this.data.type = this.type;


    console.log(this.data);


    // if(this.data.mobile.length == 10 && this.check_mobile == 1)
    // {
    //   // this.data.pincode = {};
    //   this.presentAlert();
    // }



    // if(this.data.mobile.length == 10 && this.check_mobile == 0)
    // {
      this.dbService.onPostRequestDataFromApi({'data':this.data},"Distributor/add_dealer", this.dbService.rootUrlSfa).subscribe(response=>{
        console.log(response);
        if(response['msg'] == 'success') {

          if(this.order != undefined)
          {
              this.order_data = response['data'];
              this.navCtrl.push(AddOrderPage,{'order_data':this.order_data,'brand_assign':[]});
              this.presentToast1();
          }

          if(this.order == undefined)
          {
            this.data1 = response['data'];

            this.navCtrl.push(AddCheckinPage,{'data':this.data1});
            this.presentToast();
          }


        }

      });

    // }

    // return false;
    this.loading = "0"


  }


  presentAlert() {
    let alert = this.alertCtrl.create({
        title: 'Alert',
        subTitle: 'Mobile No. Already Exists',
        buttons: ['Ok']
    });
    alert.present();
}



}
