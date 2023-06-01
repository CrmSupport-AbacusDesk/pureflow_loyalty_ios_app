import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, App } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectSearchableModule, SelectSearchableComponent } from 'ionic-select-searchable';
import { DistributorDetailPage } from '../distributor-detail/distributor-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-edit-network',
  templateUrl: 'edit-network.html',
})
export class EditNetworkPage {

  dr_id:any;
  data:any={};
  updatedData:any={};
  validateForm: FormGroup;
  type:any;

  user:any=[];
  brand:any=[];

  brandList:any=[];
  salesUserList:any=[];
  countryList:any=[];

  state_list:any=[];

  constructor(private app:App,
              public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              public dbService:DbserviceProvider,
              public toastCtrl: ToastController) {

    if(this.navParams.get('dr_id'))
    {
      this.dr_id=this.navParams.get('dr_id');
      this.type=this.navParams.get('type');
      console.log(this.dr_id);
      this.lead_detail();

    }

    this.validateForm = formBuilder.group({
      companyName: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      email: [''],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      gst: [''],
      address: ['', Validators.compose([])],
      // state: ['', Validators.compose([])],
      // district: ['', Validators.compose([])],
      stateName: ['', Validators.compose([])],
      districtName: ['', Validators.compose([])],
      pincode: ['', Validators.compose([ Validators.minLength(6), Validators.maxLength(6)])],
      // city: ['', Validators.compose([])],
      cityName: ['', Validators.compose([])],

    });
  }


  lead_detail()
  {

    this.data.user=[];
    this.data.brand=[];

    var loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
    });

    this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id},'Distributor/distributor_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.data=result['result'];
      // this.data.country_name={country_name: this.data.country};

      this.data.stateName={state_name:this.data.state};
      this.data.districtName={district_name:this.data.district};
      this.data.cityName={city:this.data.city};

      console.log(this.data.districtName);

      if(this.data.state)
      {
        this.getDistrict(this.data.state);
      }
      if(this.data.district)
      {
        this.getCity(this.data.state,this.data.district);
      }

      console.log(this.data);

      loading.dismiss();
    });
    loading.present();
  }

  portChange1(event: {
    component: SelectSearchableComponent,
    value: any
  }) {
    console.log('port:', event.value);
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

  ionViewDidLoad() {


    this.getState();

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

  city_list:any=[];
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

  city_name:any=[];
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
  presentToast1() {
    let toast1 = this.toastCtrl.create({
      message: 'Update Successfully',
      duration: 3000,
      position: 'bottom'
    });

    toast1.present();
  }

  check_gst:any;
  check_gst_existence(gst)
  {

    this.dbService.onPostRequestDataFromApi({'gst':gst},'Enquiry/check_gst_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);

      this.check_gst = result['check_gst'];
      console.log(this.check_gst);
      // this.gst_details = result['data'];
      // console.log(this.gst_details);
    })

  }
  check_mobile:any=''
  check_mobile_existence(mobile)
  {
    this.check_mobile=''
    console.log(this.dr_id);
    if(mobile && mobile.length==10)
    {
      this.dbService.onPostRequestDataFromApi({dr_id:this.dr_id,'mobile':mobile},'Enquiry/check_mobile_existence', this.dbService.rootUrlSfa).subscribe((result)=>{
        this.check_mobile = result['check_mobile'];

      })
    }

  }

  saveUpdate()
  {
    console.log('called');

    if(this.validateForm.invalid)
    {
      this.validateForm.get('companyName').markAsTouched();

      this.validateForm.get('name').markAsTouched();
      this.validateForm.get('mobile').markAsTouched();
      this.validateForm.get('stateName').markAsTouched();
      this.validateForm.get('districtName').markAsTouched();
      this.validateForm.get('pincode').markAsTouched();
      // this.validateForm.get('city').markAsTouched();
      this.validateForm.get('cityName').markAsTouched();

      this.validateForm.get('address').markAsTouched();
      this.validateForm.get('gst').markAsTouched();
      console.log('called invalid');
      // this.service.presentToast(Please Fill All )
      return;
    }
    if( this.check_mobile==1)
    {
      this.dbService.presentToast('Mobile Already Exist!!')
      return
    }

    if(this.data.districtName.district_name)
    {
      this.data.district=this.data.districtName.district_name;
    }
    if(this.data.stateName.state_name)
    {
      this.data.state=this.data.stateName.state_name
    }
    if(this.data.cityName.city)
    {
      this.data.city=this.data.cityName.city;
    }

    console.log(this.data);
    this.dbService.onShowLoadingHandler()
    this.dbService.onPostRequestDataFromApi(this.data,"Distributor/dr_update", this.dbService.rootUrlSfa).subscribe(response=>{
      console.log(response);
      this.dbService.onDismissLoadingHandler();
      if(response['msg'] == 'success')
      {
        if(this.type==1)
        {

          this.dbService.onPostRequestDataFromApi({'dr_id':this.dr_id},'Distributor/distributor_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            this.navCtrl.push(DistributorDetailPage,{'distributor_data':result['result'], 'distributor_checkin': result['total_checkin'], 'distributor_order':result['total_order']});

          });
        }
        this.presentToast1();
      }

    },err=>
    {
          this.dbService.onDismissLoadingHandler();
          this.dbService.errToasr();
    });
  }


}
