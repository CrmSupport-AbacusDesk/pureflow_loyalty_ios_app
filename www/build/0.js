webpackJsonp([0],{

/***/ 1021:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddDistributionPageModule", function() { return AddDistributionPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__add_distribution__ = __webpack_require__(1022);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



// import { IonicSelectableModule } from 'ionic-selectable';
// import { SelectSearchableModule } from 'ionic-select-searchable';
var AddDistributionPageModule = /** @class */ (function () {
    function AddDistributionPageModule() {
    }
    AddDistributionPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__add_distribution__["a" /* AddDistributionPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["IonicPageModule"].forChild(__WEBPACK_IMPORTED_MODULE_2__add_distribution__["a" /* AddDistributionPage */]),
            ],
        })
    ], AddDistributionPageModule);
    return AddDistributionPageModule;
}());

//# sourceMappingURL=add-distribution.module.js.map

/***/ }),

/***/ 1022:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddDistributionPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dashboard_dashboard__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_dbservice_dbservice__ = __webpack_require__(4);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
* Generated class for the AddDistributionPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
var AddDistributionPage = /** @class */ (function () {
    function AddDistributionPage(navCtrl, navParams, loadingCtrl, dbService, formBuilder, toastCtrl, alertCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.dbService = dbService;
        this.formBuilder = formBuilder;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.lead_form = {};
        this.state_list = [];
        this.city_list = [];
        this.data = {};
        this.contact_person = {};
        this.city_name = [];
        this.district_list = [];
        this.check_gst = '';
        this.gst_details = [];
        this.check_mobile = '';
        this.brandList = [];
        this.salesUserList = [];
        this.countryList = [];
        this.type = '';
        this.title = '';
        this.order = '';
        this.category_list = [];
        this.data1 = [];
        this.loading = "0";
        this.order_data = [];
        this.type = this.navParams.get('type');
        console.log(this.type);
        if (this.type == 1) {
            this.title = 'Channel Partner';
        }
        if (this.type == 3) {
            this.title = 'Dealer';
        }
        if (this.type == 7) {
            this.title = 'Direct Dealer';
        }
        this.validateForm = formBuilder.group({
            companyName: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            name: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            email: [''],
            mobile: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].maxLength(10)])],
            whatsapp: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(10), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].maxLength(10)])],
            gst: [''],
            dob: [''],
            anniversary_date: [''],
            address: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            stateName: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            districtName: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            state: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            district: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            pincode: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].minLength(6), __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].maxLength(6)])],
            city: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            cityName: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            brand: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            user: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
            country: ['India', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].compose([__WEBPACK_IMPORTED_MODULE_2__angular_forms__["Validators"].required])],
        });
        this.getState();
        // this.get_category();
    }
    AddDistributionPage.prototype.ionViewDidLoad = function () {
        this.getBrandList();
        this.getSalesUserList();
        this.getCountryList();
        // this.data.country.country_name='India';
        console.log('ionViewDidLoad AddDistributionPage');
    };
    AddDistributionPage.prototype.portChange = function (event) {
        console.log('port:', event.value);
    };
    AddDistributionPage.prototype.portChange1 = function (event) {
        console.log('port:', event.value);
    };
    AddDistributionPage.prototype.getState = function () {
        var _this = this;
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "<img src=\"./assets/imgs/gif.svg\" class=\"h55\" />",
        });
        this.dbService.onGetRequestDataFromApi('enquiry/all_state', this.dbService.rootUrlSfa).subscribe(function (response) {
            loading.dismiss();
            console.log(response);
            _this.state_list = response;
        });
        loading.present();
    };
    AddDistributionPage.prototype.getDistrict = function (state) {
        var _this = this;
        console.log(state);
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "<img src=\"./assets/imgs/gif.svg\" class=\"h55\" />",
        });
        this.dbService.onPostRequestDataFromApi(state, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe(function (response) {
            loading.dismiss();
            console.log(response);
            _this.district_list = response;
        });
        loading.present();
    };
    AddDistributionPage.prototype.check_mobile_existence = function (mobile) {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({ 'mobile': mobile }, 'Enquiry/check_mobile_existence', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.check_mobile = result['check_mobile'];
            console.log(_this.check_mobile);
            console.log(mobile.length);
        });
    };
    AddDistributionPage.prototype.check_gst_existence = function (gst) {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({ 'gst': gst }, 'Enquiry/check_gst_existence', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.check_gst = result['check_gst'];
            console.log(_this.check_gst);
            _this.gst_details = result['data'];
            console.log(_this.gst_details);
        });
    };
    AddDistributionPage.prototype.getBrandList = function () {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({}, 'Distributor/brands_list', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.brandList = result;
        });
    };
    AddDistributionPage.prototype.getSalesUserList = function () {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({}, 'Distributor/sales_user_list', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.salesUserList = result;
        });
    };
    AddDistributionPage.prototype.getCountryList = function () {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({}, 'Distributor/country_list', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.countryList = result;
        });
    };
    AddDistributionPage.prototype.get_pincode_area_name = function (pincode) {
        var _this = this;
        this.dbService.onPostRequestDataFromApi(pincode, 'enquiry/pincode_city_name', this.dbService.rootUrlSfa).subscribe(function (response) {
            console.log(response);
            if (response == '' || response == null) {
                _this.city_name = "Not Matched";
            }
            else {
                _this.city_name = response.city;
                _this.data.state = { 'state_name': response.state_name };
                _this.data.district = { 'district_name': response.district_name };
                _this.data.city = { 'city': response.city };
            }
        });
    };
    AddDistributionPage.prototype.getCity = function (state, district) {
        var _this = this;
        console.log(state);
        console.log(district);
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "<img src=\"./assets/imgs/gif.svg\" class=\"h55\" />",
        });
        this.dbService.onPostRequestDataFromApi({ 'state': state, 'district': district }, 'enquiry/get_city', this.dbService.rootUrlSfa).subscribe(function (response) {
            loading.dismiss();
            console.log(response);
            _this.city_list = response;
        });
        loading.present();
    };
    AddDistributionPage.prototype.getArea = function (state, district, city) {
        var _this = this;
        console.log(state);
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "<img src=\"./assets/imgs/gif.svg\" class=\"h55\" />",
        });
        this.dbService.onPostRequestDataFromApi({ 'state': state, 'district': district, 'city': city }, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe(function (response) {
            loading.dismiss();
            console.log(response);
            _this.city_list = response;
        });
        loading.present();
    };
    AddDistributionPage.prototype.getPincode = function (state, district, city, area) {
        var _this = this;
        console.log(state);
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: "<img src=\"./assets/imgs/gif.svg\" class=\"h55\" />",
        });
        this.dbService.onPostRequestDataFromApi({ 'state': state, 'district': district, 'city': city, 'area': area }, 'enquiry/all_city', this.dbService.rootUrlSfa).subscribe(function (response) {
            loading.dismiss();
            console.log(response);
            _this.city_list = response;
        });
        loading.present();
    };
    AddDistributionPage.prototype.get_category = function () {
        var _this = this;
        this.dbService.onPostRequestDataFromApi({ 'type': this.type }, 'Distributor/discount_category', this.dbService.rootUrlSfa).subscribe(function (result) {
            console.log(result);
            _this.category_list = result;
            console.log(_this.category_list);
        });
    };
    AddDistributionPage.prototype.MobileNumber = function (event) {
        var pattern = /[0-9\+\-\ ]/;
        var inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    };
    AddDistributionPage.prototype.presentToast = function () {
        var toast = this.toastCtrl.create({
            message: 'Lead Added Successfully',
            duration: 3000,
            position: 'bottom'
        });
        toast.present();
    };
    AddDistributionPage.prototype.presentToast1 = function () {
        var toast1 = this.toastCtrl.create({
            message: 'Dealer Added Successfully',
            duration: 3000,
            position: 'bottom'
        });
        toast1.present();
    };
    AddDistributionPage.prototype.submitDealer = function () {
        var _this = this;
        console.log(this.data);
        this.loading = "1";
        if (this.validateForm.invalid) {
            this.validateForm.get('companyName').markAsTouched();
            this.validateForm.get('name').markAsTouched();
            this.validateForm.get('mobile').markAsTouched();
            this.validateForm.get('stateName').markAsTouched();
            this.validateForm.get('districtName').markAsTouched();
            this.validateForm.get('pincode').markAsTouched();
            this.validateForm.get('city').markAsTouched();
            this.validateForm.get('address').markAsTouched();
            this.validateForm.get('gst').markAsTouched();
            // this.validateForm.get('whatsapp').markAsTouched();
            console.log(this.validateForm);
            // return;
        }
        // return false;
        if (this.data.country.country_name == 'India') {
            this.data.state = this.data.state.state_name;
            this.data.district = this.data.district.district_name;
            this.data.city = this.data.city.cityName;
        }
        this.data.type = this.type;
        console.log(this.data);
        // if(this.data.mobile.length == 10 && this.check_mobile == 1)
        // {
        //   // this.data.pincode = {};
        //   this.presentAlert();
        // }
        // if(this.data.mobile.length == 10 && this.check_mobile == 0)
        // {
        this.dbService.onPostRequestDataFromApi({ 'data': this.data }, "Distributor/add_dealer", this.dbService.rootUrlSfa).subscribe(function (response) {
            console.log(response);
            if (response['msg'] == 'success') {
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__dashboard_dashboard__["a" /* DashboardPage */]);
                _this.presentToast1();
            }
        });
        // }
        // return false;
        this.loading = "0";
    };
    AddDistributionPage.prototype.presentAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: 'Mobile No. Already Exists',
            buttons: ['Ok']
        });
        alert.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Navbar"]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["Navbar"])
    ], AddDistributionPage.prototype, "navBar", void 0);
    AddDistributionPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-add-distribution',template:/*ion-inline-start:"/Users/abacus/Downloads/Mohit_singh/PureFlow/src/pages/sales-app/add-distribution/add-distribution.html"*/'<!-- <ion-header>    \n\n  <ion-navbar>\n\n    <ion-title>\n\n      <h1>Add {{title}}</h1>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>   \n\n  \n\n  <form [formGroup]="validateForm"  >\n\n    <div class="edit new-edit">        \n\n      <ion-list>\n\n        <div>\n\n          \n\n          <ion-item >\n\n            <ion-label floating><span>Company Name *</span></ion-label>\n\n            <ion-input type="text" formControlName="companyName" [(ngModel)]="data.company_name" required></ion-input>\n\n          </ion-item>\n\n          \n\n          <p *ngIf="validateForm.get(\'companyName\').hasError(\'required\') && validateForm.get(\'companyName\').touched" class="error-left relative">Company Name is required!</p>\n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>Name *</span></ion-label>\n\n            <ion-input type="text" formControlName="name" [(ngModel)]="data.name" required></ion-input>\n\n          </ion-item>\n\n          <p *ngIf="validateForm.get(\'name\').hasError(\'required\') && validateForm.get(\'name\').touched" class="error-left relative">Name is required!</p>\n\n          \n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>GST No</span></ion-label>\n\n            <ion-input type="text" min="15" max="15" formControlName="gst" (change)="check_gst_existence(data.gst)"  [(ngModel)]="data.gst" ></ion-input>\n\n          </ion-item>\n\n          \n\n          \n\n          <p *ngIf="check_gst == 1"  class="error-left relative">GST No Already Exists!!</p>\n\n          \n\n          \n\n          <p *ngIf="validateForm.get(\'gst\').hasError(\'required\') && validateForm.get(\'gst\').touched"  class="error-left relative">GST No is required!</p>\n\n          \n\n          <p *ngIf="(validateForm.get(\'gst\').hasError(\'minlength\') || validateForm.get(\'gst\').hasError(\'maxlength\')) && validateForm.get(\'gst\').touched"  class="error-left relative">GST No must be 15 digit!</p>\n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>Mobile No *</span></ion-label>\n\n            <ion-input type="tel" minlength="10" maxlength="10" (change)="check_mobile_existence(data.mobile)" formControlName="mobile"  [(ngModel)]="data.mobile" required></ion-input>\n\n          </ion-item>\n\n          \n\n          \n\n          <p *ngIf="validateForm.get(\'mobile\').hasError(\'required\') && validateForm.get(\'mobile\').touched"  class="error-left relative">Mobile is required!</p>\n\n          \n\n          <p *ngIf="(validateForm.get(\'mobile\').hasError(\'minlength\') || validateForm.get(\'mobile\').hasError(\'maxlength\')) && validateForm.get(\'mobile\').touched"  class="error-left relative">Mobile must be 10 digit!</p>\n\n       \n\n          <ion-item >\n\n            <ion-label floating><span>Email *</span></ion-label>\n\n            <ion-input type="email" formControlName="email" [(ngModel)]="data.email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" required></ion-input>\n\n          </ion-item>\n\n          <p *ngIf="data.email && validateForm.get(\'email\').hasError(\'pattern\') && validateForm.get(\'email\').touched"  class="error-left relative">Email invalid!</p>\n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>Date of Birth</span></ion-label>\n\n            <ion-datetime display-format="MMM DD, YYYY" formControlName="dob" [(ngModel)]="data.dob"></ion-datetime>\n\n          </ion-item>\n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>Date of Anniversary</span></ion-label>\n\n            <ion-datetime display-format="MMM DD, YYYY" formControlName="anniversary_date" [(ngModel)]="data.anniversary_date"></ion-datetime>\n\n          </ion-item>\n\n          \n\n          <ion-item>\n\n            <ion-label floating><span>Address *</span></ion-label>\n\n            <ion-input type="text"formControlName="address" [(ngModel)]="data.address" required></ion-input>\n\n          </ion-item>\n\n          <p *ngIf="validateForm.get(\'address\').hasError(\'required\') && validateForm.get(\'address\').touched" class="error-left relative">Address is required!</p>\n\n          \n\n          \n\n          \n\n          \n\n          \n\n          <div class="csslecttype mt20">\n\n            <ion-item>\n\n              <ion-label class="pl15">Country *</ion-label>\n\n              <ionic-selectable\n\n              item-content \n\n              [(ngModel)]="data.country"\n\n              [items]="countryList"\n\n              itemValueField="country_name"\n\n              itemTextField="country_name"\n\n              formControlName="country"\n\n              [canSearch]="true">\n\n            </ionic-selectable>\n\n          </ion-item>\n\n          <p *ngIf="validateForm.get(\'country\').hasError(\'required\') && validateForm.get(\'country\').touched"  class="error-left relative">Country is required!</p>\n\n        </div>\n\n        \n\n        <div *ngIf="data?.country?.country_name==\'India\'">\n\n          <div class="csslecttype mt20">\n\n            <ion-item>\n\n              <ion-label class="pl15">State *</ion-label>\n\n              <ionic-selectable\n\n              item-content \n\n              [(ngModel)]="data.state"\n\n              [items]="state_list"\n\n              itemValueField="state_name"\n\n              itemTextField="state_name"\n\n              (onChange)="getDistrict(data.state.state_name)"\n\n              formControlName="stateName"\n\n              [canSearch]="true">\n\n            </ionic-selectable>\n\n          </ion-item>\n\n          <p *ngIf="validateForm.get(\'stateName\').hasError(\'required\') && validateForm.get(\'stateName\').touched"  class="error-left relative">State is required!</p>\n\n        </div>\n\n        \n\n        <div class="csslecttype mt20">\n\n          <ion-item>\n\n            <ion-label class="pl15">District *</ion-label>\n\n            <ionic-selectable\n\n            item-content \n\n            [(ngModel)]="data.district"\n\n            [items]="district_list"\n\n            itemValueField="district_name"\n\n            itemTextField="district_name"\n\n            formControlName="districtName"\n\n            (onChange)="getCity(data.state.state_name,data.district.district_name)"\n\n            [canSearch]="true">\n\n          </ionic-selectable>\n\n        </ion-item>\n\n        <p *ngIf="validateForm.get(\'districtName\').hasError(\'required\') && validateForm.get(\'districtName\').touched"  class="error-left relative">District is required!</p>\n\n      </div>\n\n      \n\n      \n\n      <div class="csslecttype mt20">\n\n        <ion-item>\n\n          <ion-label class="pl15">City *</ion-label>\n\n          <ionic-selectable\n\n          item-content \n\n          [(ngModel)]="data.city"\n\n          [items]="city_list"\n\n          itemValueField="city"\n\n          itemTextField="city"\n\n          formControlName="cityName"\n\n          [canSearch]="true">\n\n        </ionic-selectable>\n\n      </ion-item>\n\n      <p *ngIf="validateForm.get(\'city\').hasError(\'required\') && validateForm.get(\'city\').touched"  class="error-left relative">City is required!</p>\n\n    </div>\n\n  </div>\n\n  <div *ngIf="data?.country?.country_name!=\'India\'" >\n\n    <ion-item>\n\n      <ion-label floating><span>State *</span></ion-label>\n\n      <ion-input type="text"  formControlName="state" [(ngModel)]="data.state" required ></ion-input>\n\n    </ion-item>\n\n    <p *ngIf="validateForm.get(\'stateName\').hasError(\'required\') && validateForm.get(\'stateName\').touched"  class="error-left relative">State is required!</p>\n\n\n\n    <ion-item>\n\n      <ion-label floating><span>District *</span></ion-label>\n\n      <ion-input type="text"   formControlName="district" [(ngModel)]="data.district"  required ></ion-input>\n\n      <p *ngIf="validateForm.get(\'districtName\').hasError(\'required\') && validateForm.get(\'districtName\').touched"  class="error-left relative">District is required!</p>\n\n\n\n    </ion-item>\n\n    <ion-item>\n\n      <ion-label floating><span>City *</span></ion-label>\n\n      <ion-input type="text"   formControlName="city" [(ngModel)]="data.city"  required ></ion-input>\n\n      <p *ngIf="validateForm.get(\'city\').hasError(\'required\') && validateForm.get(\'city\').touched"  class="error-left relative">City is required!</p>\n\n\n\n    </ion-item>\n\n  </div> \n\n  \n\n  <ion-item>\n\n    <ion-label floating><span>Pincode *</span></ion-label>\n\n    <ion-input type="tel"  minlength="6" maxlength="6" formControlName="pincode" [(ngModel)]="data.pincode" (change)="get_pincode_area_name(data.pincode)" required ></ion-input>\n\n  </ion-item>\n\n  <p *ngIf="validateForm.get(\'pincode\').hasError(\'required\') && validateForm.get(\'pincode\').touched" class="error-left relative">Pincode is required!</p>\n\n  \n\n  <div class="csslecttype mt20">\n\n    <ion-item>\n\n      <ion-label>Sales User</ion-label>\n\n      <select-searchable\n\n      item-content\n\n      [(ngModel)]="data.user"\n\n      [isMultiple]="true"\n\n      [items]="salesUserList"\n\n      itemValueField="name"\n\n      itemTextField="name"\n\n      [canSearch]="true"\n\n      formControlName="user"\n\n      (onChange)="portChange1($event)">\n\n    </select-searchable>\n\n  </ion-item>\n\n  <p *ngIf="validateForm.get(\'user\').hasError(\'required\') && validateForm.get(\'user\').touched"  class="error-left relative">User is required!</p>\n\n  \n\n</div>\n\n\n\n\n\n<div class="csslecttype mt20">\n\n  <ion-item>\n\n    <ion-label>Brand</ion-label>\n\n    <select-searchable\n\n    item-content\n\n    [(ngModel)]="data.brand"\n\n    [isMultiple]="true"\n\n    [items]="brandList"\n\n    itemValueField="brand_name"\n\n    itemTextField="brand_name"\n\n    [canSearch]="true"\n\n    formControlName="brand"\n\n    (onChange)="portChange1($event)">\n\n  </select-searchable>\n\n</ion-item>\n\n<p *ngIf="validateForm.get(\'brand\').hasError(\'required\') && validateForm.get(\'brand\').touched"  class="error-left relative">Brand is required!</p>\n\n\n\n</div>\n\n\n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n</div>\n\n\n\n</ion-list>\n\n<div >\n\n</div>\n\n</div>\n\n\n\n</form>\n\n<div class="h16"></div>\n\n</ion-content>\n\n\n\n<ion-footer padding>\n\n  <button ion-button block round class="h45" (click)="submitDealer()" [disabled] = "loading == \'1\' && check_mobile == 1">Click To Save {{title}}</button>\n\n</ion-footer> -->\n\n'/*ion-inline-end:"/Users/abacus/Downloads/Mohit_singh/PureFlow/src/pages/sales-app/add-distribution/add-distribution.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavController"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["NavParams"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["LoadingController"],
            __WEBPACK_IMPORTED_MODULE_4__providers_dbservice_dbservice__["a" /* DbserviceProvider */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["FormBuilder"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["ToastController"],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["AlertController"]])
    ], AddDistributionPage);
    return AddDistributionPage;
}());

//# sourceMappingURL=add-distribution.js.map

/***/ })

});
//# sourceMappingURL=0.js.map