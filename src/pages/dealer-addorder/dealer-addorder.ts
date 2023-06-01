import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Select, SelectPopover, Events } from 'ionic-angular';
import { IonicSelectableComponent, IonicSelectableSearchFailTemplateDirective } from 'ionic-selectable';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { DealerOrderPage } from '../dealer-order/dealer-order';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-addorder',
    templateUrl: 'dealer-addorder.html',
})
export class DealerAddorderPage {
    
    @ViewChild(Navbar) navBar: Navbar;
    @ViewChild(Nav) nav: Nav;
    @ViewChild('category') categorySelectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    distributorSelected: any = false
    categoryList: any = [];
    data: any = {};
    form: any = {};
    catCode_List: any = [];
    user_state: any = '';
    autocompleteItems: any = [];
    user_data: any = {};
    disable_marka: boolean = false;
    disable_transport: boolean = false;
    order_data: any = {};
    special_discount: any = 0;
    type: any = '';
    totalQty: any = 0;
    cart_qty:any=0;
    order_item: any = [];
    triggerCategory:boolean = true;
    
    searchTrigger : boolean = true;
    masterFlag :any = 'nothing';
    tmpStrLen:any = 0;
    searchText:any;

    booleanFlag : any;
    
    constructor(public navCtrl: NavController,
        public events: Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public dbService: DbserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        public appCtrl: App) {
            
            this.order_data = this.navParams.get("order_data");
            this.order_item = this.navParams.get("order_item");
            console.log(this.order_data);
            
            if (this.order_item && this.order_item.length > 0) {
                if (this.order_data && this.order_data.delivery_from != '')
                this.distributorSelected = true
                
                this.order_item.map((item) => {
                    item.subtotal_discounted = item.amount
                    item.discountedAmount = item.discounted_amount
                    item.subtotal_discount = parseFloat(item.sub_total) - parseFloat(item.subtotal_discounted)
                    item.subTotal = item.sub_total
                    this.product = item
                    this.type = this.order_data.DiscType
                    this.special_discount = this.order_data.special_discount_percentage
                    this.cal_grand_total();
                    
                })
                this.cart_array = this.order_item;
                if (this.user_data.type == "3") {
                    // this.get_distributor();
                    this.data.distributor_id = { dr_id: this.order_data.distributor_id, company_name: this.order_data.distributor_name }
                }
                // this.cal_grand_total();
            }
            else {
                // this.get_special_discount();
                
            }
            
            this.user_state = this.dbService.userStorageData.state;
            if (this.order_data && this.order_data.order_id) {
                
                this.user_data = this.order_data;
            }
            else {
                this.get_special_discount();
                
                this.user_data = this.dbService.userStorageData.all_data;
            }
            this.get_dr_marka();
            console.log(this.user_data);
            if (this.user_data.type == "3") {
                this.get_distributor();
                // this.data.distributor_id = {dr_id:this.order_data.distributor_id,company_name:this.order_data.distributor_name}
            }
            
            this.getCategory();
            this.events.subscribe(('AddOrderBackAction'), (data) => {
                this.backAction()
                
            })
        }
        SpecialDiscountLable: any = ''
        get_special_discount() {
            this.dbService.onPostRequestDataFromApi({}, "dealerData/special_discount", this.dbService.rootUrlSfa)
            .subscribe(resp => {
                console.log(resp);
                if (resp['special_discount'] && resp['special_discount']['type'])
                this.type = resp['special_discount']['type'];
                console.log(this.type);
                console.log(this.user_data);
                
                
                if (this.user_data.type == '1') {
                    if (resp['special_discount'] && resp['special_discount']['distributor_discount'])
                    this.special_discount = resp['special_discount']['distributor_discount'];
                }
                
                if (this.user_data.type == '3') {
                    if (resp['special_discount'] && resp['special_discount']['dealer_discount'])
                    this.special_discount = resp['special_discount']['dealer_discount'];
                }
                
                if (this.user_data.type == '7') {
                    if (resp['special_discount'] && resp['special_discount']['distributor_discount'])
                    this.special_discount = resp['special_discount']['distributor_discount'];
                }
                
                if (resp['special_discount'] && resp['special_discount']['lable'])
                this.SpecialDiscountLable = resp['special_discount']['lable'];
                console.log(this.SpecialDiscountLable);
                
            })
        }
        
        get_dr_marka() {
            this.dbService.onPostRequestDataFromApi({ "dr_id": this.user_data.id }, "dealerData/getdetails", this.dbService.rootUrlSfa)
            .subscribe(resp => {
                console.log(resp);
                this.user_data.private_marka = resp['private_marka'];
                this.user_data.transport_detail = resp['transport_detail'];
                
                if (this.user_data.private_marka != '') {
                    this.disable_marka = true;
                }
                
                if (this.user_data.transport_detail != '') {
                    this.disable_transport = true;
                }
            })
        }
        
        distributor_list: any = [];
        get_distributor() {
            this.dbService.onPostRequestDataFromApi({ "id": this.dbService.userStorageData.id }, 'dealerData/get_distributor', this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result);
                this.distributor_list = result;
                console.log(this.distributor_list);
                if (this.distributor_list.length == 1) {
                    this.data.distributor_id = { dr_id: this.distributor_list[0].dr_id, company_name: this.distributor_list[0].company_name }
                }
            })
        }
        
        loading: any;
        lodingPersent() {
            this.loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            });
            this.loading.present();
        }
        
        subCatList: any = [];
        getSubCategory(cat) {
            // this.booleanFlag = this.searchTrigger;
            // this.searchTrigger=true;
            this.subCatList = {};
            console.log(cat)
            console.log(this.booleanFlag);
            console.log(this.data.cat_no);
            
            if((cat['product_name'].search(' | ') != -1) && this.masterFlag != 'product' ){
                console.log("in if condition");
                let avr = cat['product_name'].indexOf(' | ');
                cat['product_name'] = cat['product_name'].substring(0,avr);
            }
            console.log(cat);
            this.data.sub_category = {};
            this.form.category = cat.category;
            this.product.category = cat.category;
            this.dbService.onPostRequestDataFromApi({ category: cat.category }, 'Distributor/getSubCategory', this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result)
                this.subCatList = result['data'];
                console.log(this.searchTrigger);
                console.log(this.booleanFlag);
                console.log(this.data.cat_no);
                
                if(this.booleanFlag == false && this.masterFlag != 'product'){
                    console.log("in if condition");
                    this.searchTrigger=true;
                    this.data.sub_category= this.subCatList.filter(row=>row.sub_category == cat.subcategory);
                    this.data.sub_category=this.data.sub_category[0];                        
                    this.getProductCode(this.data.sub_category)
                    this.data.cat_no=cat;
                    this.get_product_data(this.data.cat_no);
                    this.loading.dismiss();
                }  
                else if  (this.subCatList.length == 1){
                    console.log("in else-> if");
                    this.data.sub_category = this.subCatList[0]
                    this.getProductCode(this.data.sub_category)
                }
                else {
                    // this.subcatSelectable.open();
                    console.log("in else->");   
                }
            }, err => {
                
            })
        }
        
        getCategory() {
            // this.searchTrigger = false;
            // this.dbService.onShowLoadingHandler()
            this.dbService.onPostRequestDataFromApi('', 'Distributor/getCategory3', this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result)
                this.categoryList = result['data'];
                if (!this.order_data || !this.order_data.order_id) {
                    // this.categorySelectable.open();
                }
                // this.dbService.onDismissLoadingHandler();
            }, err => {
                // this.dbService.onDismissLoadingHandler();
                this.dbService.errToasr();
            });
        }
        temp_product_array: any = [];
        getProductCode(sub_category) {
            console.log(sub_category);
            this.form.sub_category = sub_category.sub_category;
            this.lodingPersent()
            this.dbService.onPostRequestDataFromApi({ categoryId: sub_category.id }, "product/product_code", this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result);
                this.autocompleteItems = result;
                this.temp_product_array = this.autocompleteItems;
                
                console.log(this.autocompleteItems);
                setTimeout(() => {
                    this.loading.dismiss()
                    // this.prod_codeSelectable.open();
                }, 1000);
            }, err => {
                this.loading.dismiss()
            });
        }
        
        color_list: any = [];
        brand_list: any = [];
        product: any = {};
        show_price: any = false;
        
        
        masterSearchFUnction(event,type) {
            console.log(event);
            console.log(this.searchTrigger);
            console.log(event.text);
            console.log(type);
            console.log(this.data.category);
            
            if(type=='product')
            {
                // not use right now
                
                if (event.text == '') {
                    
                }
                
                else {
                    this.dbService.onPostRequestDataFromApi({ masterSearch: event.text }, "product/product_code", this.dbService.rootUrlSfa)
                    .subscribe((result) => {
                        console.log(result);
                        this.autocompleteItems = result;
                        this.temp_product_array = this.autocompleteItems;
                        
                        console.log(this.autocompleteItems);
                        setTimeout(() => {
                            this.loading.dismiss()
                            // this.prod_codeSelectable.open();
                        }, 1000);
                    }, err => {
                        this.loading.dismiss()
                    });
                    event.text == ''
                    this.masterFlag='product';
                }
            }
            
            else if(type=='category')
            {
                this.masterFlag='nothing';
                
                let txtLength = (event.text).length;
                console.log(txtLength);
                
                console.log("in else");   
                if (event.text == '') {
                    this.searchTrigger=true;
                    this.getCategory();
                    
                }
                
                else if((this.tmpStrLen != 0) && (this.tmpStrLen > txtLength)){
                    this.searchTrigger=true;
                    this.getCategory();
                    this.tmpStrLen = txtLength;
                    this.searchText='';
                    this.data.category['category']='';
                    this.data.category['cat_no']='';
                    this.data.category['id']='';
                    this.data.category['product_name']='';
                    this.data.category['subcategory']='';
                }
                
                else {
                    
                    if(this.searchText == event.text){
                        this.tmpStrLen = (this.searchText).length
                        console.log(this.tmpStrLen);                        
                        this.searchTrigger=true;
                        this.getCategory();
                    }
                    else{ 
                        if( this.data.category){
                            
                            this.data.category['category']='';
                            this.data.category['cat_no']='';
                            this.data.category['id']='';
                            this.data.category['product_name']='';
                            this.data.category['subcategory']='';
                        }
                        console.log(this.data.category);
                        
                        this.searchTrigger=false;
                        this.searchText = event.text;
                        this.dbService.onPostRequestDataFromApi({ masterSearch: event.text }, "product/product_code", this.dbService.rootUrlSfa)
                        .subscribe((result) => {
                            console.log(result);
                            this.categoryList=result;
                            console.log(this.categoryList);
                            for(let i=0;i<this.categoryList.length;i++){
                                this.categoryList[i].product_name = this.categoryList[i].product_name +' | '+ this.categoryList[i].subcategory
                            }
                            console.log(this.categoryList);
                            /* this.temp_product_array = this.categoryList;
                            console.log(this.autocompleteItems);
                            this.data.category=this.categoryList.category;
                            this.data.sub_category=this.categoryList.subcategory;
                            this.data.cat_no=this.autocompleteItems.product_name; */
                            setTimeout(() => {
                                this.loading.dismiss()
                                // this.prod_codeSelectable.open();
                            }, 1000);
                        }, err => {
                            this.loading.dismiss()
                        });                    
                    }   
                } 
            }
        }
        get_product_data(val) {
            
            console.log(this.data);
            console.log(val);
            
            if(this.masterFlag == 'product'){
                this.data.category = val;
                this.getSubCategory(val);
                console.log(this.subCatList);
                
                setTimeout(() => {
                    console.log(this.subCatList);
                    this.data.sub_category= this.subCatList.filter(row=>row.sub_category == val.subcategory);
                    this.data.sub_category=this.data.sub_category[0];       
                    
                }, 1000);
                
            }
            
            
            
            
            // this.lodingPersent();
            console.log(val);
            
            this.form.cat_no = val.cat_no;
            this.form.category=val.category;
            this.form.product_name = val.product_name;
            this.form.product_id = val.id;
            this.form.user_state = this.user_data.state;
            this.form.user_district = this.user_data.district;
            this.form.user_id = this.user_data.id
            this.form.user_type = this.user_data.type
            this.form.sub_category=val.subcategory;
            
            this.dbService.onPostRequestDataFromApi({ "form": this.form }, "dealerData/get_product_data", this.dbService.rootUrlSfa)
            .subscribe((result) => {
                console.log(result);
                this.loading.dismiss();
                if (result['prod_price']) {
                    this.show_price = true;
                    this.product = result['prod_price'];
                    this.product.sub_category = this.form.sub_category;
                    this.product.cat_no = this.form.cat_no;
                    this.product.product_name = this.form.product_name;
                }
                
                this.brand_list = result['brand_list'];
                if (this.brand_list && this.brand_list.length == 1) {
                    this.product.brand = this.brand_list[0]['brand_name'];
                }
                
                this.color_list = result['color_list'];
                if (this.color_list && this.color_list.length == 1) {
                    this.product.color = this.color_list[0]['color_name'];
                }
                // console.log(this.product)
            })
            
            this.loading.dismiss();
            
            
        }
        
        calculate_amt(type) {
            console.log(type);
            
            console.log(typeof (this.product.qty));
            if(type == 'cartoon_qty'){
                this.product.qty= (this.product.cartoon_packing*this.product.cartoon_qty  )
                console.log(this.product.qty);
            }
            // if (this.product.qty.includes('.')) {
            //     this.product.subtotal_discounted = ''
            //     this.product.qty = ''
            //     this.dbService.presentToast('Fraction values not allowed !!');
            //     console.log(this.product.qty + 'Int Quantity');
            //     return;
            // }
            
            console.log(this.product);
            this.product.discount_amount = 0;
            this.product.subTotal = 0;
            this.product.discountedAmount = 0;
            if (this.product.qty == null) {
                this.product.qty = 0;
            }
            
            this.product.subTotal = (this.product.price) * (this.product.qty);
            
            if (this.product.discount) {
                this.product.discount_amount = (this.product.price * this.product.discount) / 100;
            }
            
            this.product.discountedAmount = parseFloat(this.product.price) - parseFloat(this.product.discount_amount)
            
            this.product.subtotal_discount = this.product.discount_amount * this.product.qty;
            
            this.product.subtotal_discounted = this.product.discountedAmount * this.product.qty;
            this.product.subtotal_discounted = this.product.subtotal_discounted.toFixed(2)
            
            
            
        }
        
        cart_array: any = []
        addToCart(qty) {
            console.log(this.product);
            console.log(qty);
            
            if (this.cart_array.length == 0) {
                this.cart_array.push(JSON.parse(JSON.stringify(this.product)));
            }
            else {
                var flag = true;
                this.cart_array.forEach(element => {
                    
                    if (this.product.category == element.category && this.product.sub_category == element.sub_category && this.product.cat_no == element.cat_no) {
                        // element.discount_amount= parseFloat(element.discount_amount) + parseFloat(this.product.discount_amount);
                        element.subTotal = parseFloat(element.subTotal) + parseFloat(this.product.subTotal);
                        // element.discountedAmount= parseFloat(element.discountedAmount) + parseFloat(this.product.discountedAmount);
                        element.subtotal_discount = parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                        element.subtotal_discount = parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                        element.subtotal_discounted = parseFloat(element.subtotal_discounted) + parseFloat(this.product.subtotal_discounted);
                        element.qty = parseFloat(element.qty) + parseFloat(this.product.qty);
                        
                        flag = false;
                    }
                });
                
                if (flag) {
                    this.cart_array.push(JSON.parse(JSON.stringify(this.product)));
                }
            }
            this.data.cat_no = {};
            this.show_price = false;
            console.log(this.cart_array);
            
            this.cal_grand_total();
            
            this.totalQty = parseInt(this.totalQty) + parseInt(qty);
            console.log(this.totalQty);
            
            
        }
        
        grand_amt: any = {};
        sub_total: any = 0;
        dis_amt: any = 0;
        gst_amount: any = 0;
        net_total: any = 0;
        spcl_dis_amt: any = 0
        grand_total: any = 0;
        
        cal_grand_total() {
            console.log(this.type);
            
            this.sub_total = parseFloat(this.sub_total) + parseFloat(this.product.subTotal);
            this.dis_amt = parseFloat(this.dis_amt) + (parseFloat(this.product.subtotal_discount));
            this.net_total = parseFloat(this.net_total) + parseFloat(this.product.subtotal_discounted);
            console.log(this.special_discount);
            
            this.spcl_dis_amt = (this.net_total * this.special_discount) / 100;
            console.log(this.spcl_dis_amt);
            
            if (this.type == 'Discount') {
                this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
            } else {
                this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
            }
            console.log(this.sub_total);
            console.log(this.dis_amt);
            console.log(this.gst_amount);
            console.log(this.grand_total);
            console.log(this.net_total - this.spcl_dis_amt);
        }
        
        delete_item(index) {
            this.cart_array.splice(index, 1);
        }
        leave: any = 0
        save_order(type) {
            this.leave = 1
            console.log(this.cart_array);
            console.log(this.form);
            console.log(this.user_data);
            if (this.user_data.type == "3") {
                if (!this.data.distributor_id) {
                    let toast = this.toastCtrl.create({
                        message: 'Please Select Distributor!',
                        duration: 3000
                    });
                    toast.present();
                    return;
                }
                this.user_data.distributor_id = this.data.distributor_id.dr_id
            }
            this.user_data.special_discount = this.special_discount;
            this.user_data.special_discount_amount = this.spcl_dis_amt;
            this.user_data.Disctype = this.type;
            // this.user_data.order_status = type;
            this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
            console.log(this.user_data);
            var orderData = { sub_total: this.sub_total, 'dis_amt': this.dis_amt, 'grand_total': this.grand_total, 'net_total': this.net_total, 'special_discount': this.special_discount, special_discount_amount: this.spcl_dis_amt }
            console.log(orderData);
            console.log( this.cart_array);
            
            
            this.dbService.onPostRequestDataFromApi({ "cart_data": this.cart_array, "user_data": this.user_data, 'orderData': orderData}, "dealerData/save_order", this.dbService.rootUrlSfa)
            .subscribe(resp => {
                console.log(resp);
                if (resp['msg'] == "success") {
                    var toastString = ''
                    if (type == 'save') {
                        this.dbService.tabSelectedOrder = 'Draft';
                        toastString = 'Order Saved To Draft Successfully !'
                    }
                    else {
                        this.dbService.tabSelectedOrder = 'Pending';
                        toastString = 'Order Placed Successfully !'
            
                    }
                    let toast = this.toastCtrl.create({
                        message: toastString,
                        duration: 3000
                    });
                    toast.present();
                    this.navCtrl.push(DealerOrderPage, { "type": "Primary" });
                    // this.navCtrl.popTo(DealerOrderPage)
                }
            })
        }
        
        ionViewDidEnter() {
            console.log('back button test called');
            this.navBar.backButtonClick = () => {
                console.log('back button test');
                
                this.backAction()
                
            };
            
            let nav = this.appCtrl.getActiveNav();
            if (nav && nav.getActive()) {
                let activeView = nav.getActive().name;
                let previuosView = '';
                if (nav.getPrevious() && nav.getPrevious().name) {
                    previuosView = nav.getPrevious().name;
                }
                console.log(previuosView);
                console.log(activeView);
                console.log('its leaving');
                // if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage'))
                // {
                
                //     console.log(previuosView);
                //     this.navCtrl.popToRoot();
                // }
            }
        }
        backAction() {
            console.log(this.cart_array);
            console.log(this.order_item);
            
            if (this.cart_array.length) {
                let alert = this.alertCtrl.create({
                    title: 'Are You Sure?',
                    subTitle: 'Your Order Data Will Be Discarded ',
                    cssClass: 'action-close',
                    
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            this.dbService.presentToast('Your Data Is Safe')
                        }
                    },
                    {
                        text: 'Confirm',
                        cssClass: 'close-action-sheet',
                        handler: () => {
                            console.log('AddOrderBackAction');
                            
                            this.navCtrl.pop();
                        }
                    }]
                });
                alert.present();
                
            }
            else {
                this.navCtrl.pop();
                console.log('Array Blank');
                
            }
            
        }
        MobileNumber(event: any) {
            const pattern = /[0-9]/;
            let inputChar = String.fromCharCode(event.charCode);
            if (event.keyCode != 8 && !pattern.test(inputChar)) {
                event.preventDefault();
            }
        }
        MobileNumber1(event: any) {
            console.log('Decimal Restrit');
            
            const charCode = (event.which) ? event.which : event.keyCode;
            console.log(charCode);
            
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }
            return true;
            
        }
        save_orderalert(type) {
            var str
            console.log(this.grand_total);
            
            if (this.grand_total > 20000000) {
                let alert = this.alertCtrl.create({
                    title: 'Max order value reached',
                    subTitle: 'Maximum order value is 2 Cr. !',
                    cssClass: 'action-close',
                    
                    buttons: [{
                        text: 'Okay',
                        role: 'Okay',
                        handler: () => {
                            
                        }
                    },
                ]
            });
            alert.present();
            return
        }
        if (type == 'save') {
            str = 'You want to save this order as draft ?'
        }
        else {
            str = 'You want to submit order ?'
        }
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: str,
            cssClass: 'action-close',
            
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    
                }
            },
            {
                text: 'Confirm',
                cssClass: 'close-action-sheet',
                handler: () => {
                    this.save_order(type)
                }
            }]
        });
        alert.present();
    }
    deleteItemFromCartAlertMessage(index, delQty) {
        
        let alert = this.alertCtrl.create({
            title: 'Are You Sure?',
            subTitle: 'You want to remove this item ??',
            cssClass: 'action-close',
            
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.dbService.presentToast('Action Cancelled')
                }
            },
            {
                text: 'Confirm',
                cssClass: 'close-action-sheet',
                handler: () => {
                    console.warn(delQty);
                    this.totalQty = this.totalQty - delQty;
                    console.log(this.totalQty);
                    this.deleteItemFromCart(index)
                }
            }]
        });
        alert.present();
    }
    deleteItemFromCart(index) {
        
        this.cart_array.splice(index, 1);
        this.dis_amt = 0;
        this.sub_total = 0;
        this.net_total = 0;
        this.spcl_dis_amt = 0;
        this.grand_total = 0;
        for (let index = 0; index < this.cart_array.length; index++) {
            
            this.dis_amt += parseFloat(this.cart_array[index].subtotal_discount);
            this.sub_total += parseFloat(this.cart_array[index].subTotal);
            this.net_total += parseFloat(this.cart_array[index].subtotal_discounted);
            
        }
        
        
        // this.sub_total = parseFloat(this.sub_total) -  parseFloat(this.cart_array[index].subTotal) ;
        
        // this.dis_amt = parseFloat(this.dis_amt) -  parseFloat(this.cart_array[index].subtotal_discount) ;
        
        // this.net_total = parseFloat(this.net_total) -  parseFloat(this.cart_array[index].subtotal_discounted) ;
        
        this.spcl_dis_amt = (this.net_total * this.special_discount) / 100;
        
        console.log(this.dis_amt);
        
        if (this.type == 'Discount') {
            this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
        } else {
            this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
        }
        
        console.log(this.grand_total);
        
        
        
        this.dbService.presentToast('Item removed !!')
    }
    
}
