import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExecutivDetailPage } from '../executiv-detail/executiv-detail';
import { SelectSearchableModule, SelectSearchableComponent } from 'ionic-select-searchable';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';


@IonicPage()
@Component({
  selector: 'page-executive-edit',
  templateUrl: 'executive-edit.html',
})
export class ExecutiveEditPage {

  userId:any;
  data:any={};
  updatedData:any={};
  validateForm: FormGroup;
  type:any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              public toastCtrl: ToastController) {

    if(this.navParams.get('userId'))
    {
          this.userId=this.navParams.get('userId');
          this.type=this.navParams.get('type');
          console.log(this.userId);
          this.userDetail();

    }

    this.validateForm = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      email: [''],
      mobile: ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
      address: ['', Validators.compose([])],
      stateName: ['', Validators.compose([])],
      districtName: ['', Validators.compose([])],
      pincode: ['', Validators.compose([ Validators.minLength(6), Validators.maxLength(6)])],
      cityName: ['', Validators.compose([])],

    });
  }

  MobileNumber(event: any)
  {
      const pattern = /[0-9\+\-\ ]/;
      let inputChar = String.fromCharCode(event.charCode);
      if (event.keyCode != 8 && !pattern.test(inputChar))
      {event.preventDefault(); }
  }
  user:any=[];
  brand:any=[];
  userDetail()
  {

    this.data.user=[];
    this.data.brand=[];
    this.dbService.onShowLoadingHandler();

    this.dbService.onPostRequestDataFromApi({'userId':this.userId},'DealerData/executive_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.dbService.onDismissLoadingHandler();
      this.data=result['executive_data'];
      this.data.stateName={state_name:this.data.state_name};
      this.data.districtName={district_name:this.data.district_name};
      this.data.cityName={city:this.data.city};
      this.data.address = this.data.street
      this.data.mobile = this.data.contact_01
      if(this.data.state_name)
      {
        this.getDistrict(this.data.state_name);
      }
      if(this.data.district_name)
      {
        this.getCity(this.data.state_name,this.data.district_name);
      }
    } ,err=>
    {
      this.dbService.onDismissLoadingHandler();

    });
  }

  portChange1(event: {
    component: SelectSearchableComponent,
    value: any
  }) {
    console.log('port:', event.value);
  }



  ionViewDidLoad() {
    this.getState();
  }

  brandList:any=[];
  salesUserList:any=[];
  countryList:any=[];



  state_list:any=[];
  getState() {
    this.dbService.onGetRequestDataFromApi('enquiry/all_state', this.dbService.rootUrlSfa).subscribe((response:any)=>{
      console.log(response);
      this.state_list = response;
    }
    ,err=>
    {
      this.dbService.onDismissLoadingHandler();
    }
    );
  }

  district_list:any = [];

  getDistrict(state) {
    this.data.districtName={}
    this.dbService.onPostRequestDataFromApi(state, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
      console.log(response);
      this.district_list = response;
    } ,err=>
    {
    });
  }

  city_list:any=[];
  getCity(state,district) {
    this.dbService.onPostRequestDataFromApi({'state':state,'district':district}, 'enquiry/get_city', this.dbService.rootUrlSfa).subscribe((response:any)=>{
      console.log(response);
      this.city_list = response;
    } ,err=>
    {
    });
  }



  saveUpdate()
  {
    console.log('called');

    if(this.validateForm.invalid)
    {
      this.validateForm.get('name').markAsTouched();
      this.validateForm.get('mobile').markAsTouched();
      this.validateForm.get('stateName').markAsTouched();
      this.validateForm.get('districtName').markAsTouched();
      this.validateForm.get('pincode').markAsTouched();
      this.validateForm.get('cityName').markAsTouched();
      this.validateForm.get('address').markAsTouched();
      console.log('called invalid');
      return;
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
    this.dbService.onShowLoadingHandler()
    this.dbService.onPostRequestDataFromApi(this.data,"DealerData/ExecutiveUpdate", this.dbService.rootUrlSfa).subscribe(response=>{
      this.dbService.onDismissLoadingHandler();
      console.log(response);
      if(response['msg'] == 'Success')
      {
        this.dbService.presentToast('Details Updated Successfully');
        this.navCtrl.push(ExecutivDetailPage,{id:this.userId}) ;
      }

    },err=>
    {
      this.dbService.onDismissLoadingHandler();

      this.dbService.errToasr();
    });
  }


}
