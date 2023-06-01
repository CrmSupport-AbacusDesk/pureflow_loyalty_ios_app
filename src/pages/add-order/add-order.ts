import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController, Navbar, ModalController, Platform, Nav, App, Events } from 'ionic-angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { OrderListPage } from '../order-list/order-list';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ViewChild } from '@angular/core';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()

@Component({
    selector: 'page-add-order',
    templateUrl: 'add-order.html',
})
export class AddOrderPage {
    @ViewChild('category') categorySelectable: IonicSelectableComponent;
    @ViewChild('subCategory') subcatSelectable: IonicSelectableComponent;
    @ViewChild('productCode') prod_codeSelectable: IonicSelectableComponent;
    @ViewChild('selectComponent') selectComponent: IonicSelectableComponent;
    @ViewChild('distributorSelectable') distributorSelectable: IonicSelectableComponent;
    
    distributorSelected:any=false
    categoryList:any=[];
    data:any={};
    form:any={};
    catCode_List:any=[];
    user_state:any='';
    autocompleteItems:any=[];
    user_data:any={};
    disable_marka:boolean = false;
    disable_transport:boolean = false;
    order_data:any={};
    special_discount:any=0;
    type:any='';
    cart_array:any=[]
    adddMoreItem:any=false
    order_item:any=[];
    checkinData:any={};
    
    subCatList:any = [];
    color_list:any=[];
    brand_list:any=[];
    product:any={};
    alldata:any;
    show_price:any = false;
    totalQty:any=0;
    cart_qty:any=0
    loading: any;
    searchTrigger : boolean = true;
    masterFlag :any = 'nothing';
    tmpStrLen:any = 0;
    searchText:any;
    booleanFlag : any;

    
    
    constructor(public navCtrl: NavController,
        public events:Events,
        public loadingCtrl: LoadingController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public dbService:DbserviceProvider,
        public toastCtrl: ToastController,
        private alertCtrl: AlertController,
        public storage: Storage,
        public modal: ModalController,
        public platform: Platform,
        public appCtrl: App) {
            
            this.getmeall();
            // console.log(dbService.userStorageData);
            
            if(this.navParams.get('for_order'))
            {
                this.checkinData = this.navParams.get('for_order')
                console.log(this.navParams.get('for_order'));
                this.data.networkType = this.checkinData.dr_type
                this.get_network_listFromCheckin(this.data.networkType);
                this.get_distributor();
            }
            
            this.order_data = this.navParams.get("order_data");
            this.order_item = this.navParams.get("order_item");
            console.log(this.order_data);
            
            if(this.order_item && this.order_item.length > 0)
            {
                if(this.order_data && this.order_data.delivery_from!='')
                this.distributorSelected=true
                
                this.order_item.map((item)=>
                {
                    item.subtotal_discounted = item.amount
                    item.discountedAmount = item.discounted_amount
                    item.subtotal_discount = parseFloat(item.sub_total)-parseFloat(item.subtotal_discounted)
                    item.subTotal = item.sub_total
                    this.product = item
                    this.type = this.order_data.DiscType
                    this.special_discount = this.order_data.special_discount_percentage
                    this.cal_grand_total();
                    
                })
                this.cart_array = this.order_item;
                
                if(this.user_data.type == "3")
                {
                    this.data.distributor_id = {dr_id:this.order_data.distributor_id,company_name:this.order_data.distributor_name}
                }
                this.data.networkType=this.order_data.type
                this.get_network_listMoreItem(this.data.networkType)
                
            }
            else
            {
                
            }
            
            if(this.order_data && this.order_data.order_id)
            {
                
                this.user_data = this.order_data;
            }
            
            console.log(this.user_data);
            
            if(this.user_data.type == "3")
            {
                this.get_distributormoreItem();
            }
            
            this.getCategory();
            this.events.subscribe(('AddOrderBackAction'),(data)=>
            {
                this.backAction()
                
            })
            
        }
        userType:any;
        
        ionViewDidLoad()
        {
            const userType = this.dbService.userStorageData.user_type;
            
            console.log(userType);
            if(userType=='OFFICE')
            {
                this.data.networkType=3;
                this.get_network_list(this.data.networkType)
                this.userType  = userType
                //   this.get_network_list(1)
            }
            
        }
        backAction()
        {
            console.log(this.cart_array);
            console.log(this.order_item);
            
            if(this.cart_array.length )
            {
                let alert=this.alertCtrl.create({
                    title:'Are You Sure?',
                    subTitle: 'Your Order Data Will Be Discarded ',
                    cssClass:'action-close',
                    
                    buttons: [{
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => {
                            this.dbService.presentToast('Your Data Is Safe')
                        }
                    },
                    {
                        text:'Confirm',
                        cssClass: 'close-action-sheet',
                        handler:()=>
                        {
                            console.log('AddOrderBackAction');
                            
                            this.navCtrl.pop();
                        }
                    }]
                });
                alert.present();
                
            }
            else
            {
                this.navCtrl.pop();
                console.log('Array Blank');
                
            }
            
        }
        
        getCategory()
        {
            // this.service.show_loading()
            this.dbService.onPostRequestDataFromApi('','Distributor/getCategory3', this.dbService.rootUrlSfa)
            .subscribe((result)=>
            {
                console.log(result)
                this.categoryList = result['data'];
                if(!this.order_data || !this.order_data.order_id)
                {
                }
                // this.service.dismiss();
            },err=>
            {
                // this.service.dismiss();
                this.dbService.errToasr();
            });
        }
        
        
        calculate_amt(type){

console.log(type);

            console.log(typeof(this.product.qty));
            if(type == 'cartoon_qty'){
            this.product.qty= (this.product.cartoon_packing*this.product.cartoon_qty  )
            console.log(this.product.qty);
            }
            console.log(this.product);
            this.product.discount_amount = 0;
            this.product.subTotal = 0;
            this.product.discountedAmount = 0;
            console.log(this.product.qty);
            // if(this.product.qty){
            //     if((this.product.qty).contains('.'))
            //     {
            //         this.product.subtotal_discounted=''
            //         this.product.qty = ''
            //         this.dbService.presentToast('Fraction values not allowed !!');
            //         console.log(this.product.qty  + 'Int Quantity');
            //         return ;
            //     }
            //     else{

            //     }
            // }
            
            if(this.product.qty == null)
            {
                this.product.qty = 0;
            }
            
            
            this.product.subTotal = (this.product.price)*(this.product.qty);
            
            if(this.product.discount)
            {
                this.product.discount_amount = (this.product.price * this.product.discount)/100;
            }
            
            this.product.discountedAmount = parseFloat(this.product.price) - parseFloat(this.product.discount_amount)
            
            this.product.subtotal_discount = this.product.discount_amount * this.product.qty;
            
            this.product.subtotal_discounted = this.product.discountedAmount * this.product.qty;
            console.log(this.product.subtotal_discounted);
            
            this.product.subtotal_discounted  = this.product.subtotal_discounted.toFixed(2)
            
            
            
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
        
        
        getmeall()
        {
            this.dbService.onPostRequestDataFromApi({}, 'dealerData/test1', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
            })
        }
        
        
        
        get_product_data(val)
        {
            console.log(val);
            
            console.log(this.data.type_name.id);
            
            // this.dbService.onShowLoadingHandler();
            
            console.log(this.user_data);
            
            this.form.cat_no = val.cat_no;
            this.form.product_name = val.product_name;
            this.form.product_id = val.id;
            this.form.user_state = this.user_data.state;
            this.form.user_district = this.user_data.district;
            this.form.user_id = this.data.type_name.id;
            this.form.user_type = this.user_data.type;
            this.form.category= val.category;
            this.form.selected_dr_id=  this.selected_drid;
            this.form.sub_category=val.subcategory;
            
            console.log(this.form);
            console.log(this.data);
            
            this.dbService.onPostRequestDataFromApi({"form":this.form}, 'dealerData/get_product_dataExecutive', this.dbService.rootUrlSfa).subscribe((result)=>{
                
                console.log(result);
                // this.dbService.onDismissLoadingHandler();
                if(result['prod_price'])
                {
                    this.show_price = true;
                    this.product = result['prod_price'];
                    this.product.sub_category = this.form.sub_category;
                    this.product.cat_no=this.form.cat_no;
                    this.product.product_name=this.form.product_name;
                }
                
                this.brand_list = result['brand_list'];
                if(this.brand_list && this.brand_list.length == 1)
                {
                    this.product.brand = this.brand_list[0]['brand_name'];
                }
                
                this.color_list = result['color_list'];
                if(this.color_list && this.color_list.length == 1)
                {
                    this.product.color = this.color_list[0]['color_name'];
                }
                console.log(this.product)
            })
        }
        
        getSubCategory(cat)
        {
            this.subCatList = {};
            console.log(cat)
            console.log(this.booleanFlag);
            console.log(this.data.cat_no);

            if((cat['product_name'].search(' | ') != -1) && this.masterFlag != 'product' ){
                console.log("in if condition");
                let avr = cat['product_name'].indexOf(' | ');
                cat['product_name'] = cat['product_name'].substring(0,avr);
            }
            console.log(cat)
            this.data.sub_category={};
            this.form.category = cat.category;
            this.product.category = cat.category;
            this.dbService.onPostRequestDataFromApi({category:cat.category},'Distributor/getSubCategory', this.dbService.rootUrlSfa).subscribe((result)=>{
                
                console.log(result)
                this.subCatList = result['data'];
                if(this.booleanFlag == false && this.masterFlag != 'product'){
                    console.log("in if condition");
                    this.searchTrigger=true;
                    this.data.sub_category= this.subCatList.filter(row=>row.sub_category == cat.subcategory);
                    this.data.sub_category=this.data.sub_category[0];                        
                    this.getProductCode(this.data.sub_category)
                    this.data.cat_no=cat;
                    this.get_product_data(this.data.cat_no);
                    // this.loading.dismiss();
                } 
                


                else if(this.subCatList.length==1)
                {
                    this.data.sub_category = this.subCatList[0]
                    this.getProductCode(this.data.sub_category)
                }
                else
                {
                    // this.subcatSelectable.open();
                }
            },err=>{
                
            })
        }
        temp_product_array:any=[];
        
        getProductCode(sub_category)
        {
            console.log(sub_category);
            this.form.sub_category = sub_category.sub_category;
            this.dbService.onShowLoadingHandler()
            this.dbService.onPostRequestDataFromApi({categoryId:sub_category.id},"product/product_code", this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.autocompleteItems=result;
                this.temp_product_array = this.autocompleteItems;
                
                console.log(this.autocompleteItems);
                setTimeout(() => {
                    this.dbService.onDismissLoadingHandler()
                    // this.prod_codeSelectable.open();
                }, 1000);
            },err=>
            {
                this.dbService.onDismissLoadingHandler()
            });
        }
        
        master_search(event,type){

            console.log(type);
            console.log(event);
            console.log(this.searchTrigger);
            console.log(event.text);

            console.log(this.data.category);
            
                
                if (event.text == '') {
                    
                }
                
                // else {
                //     this.dbService.onPostRequestDataFromApi({ masterSearch: event.text }, "product/product_code", this.dbService.rootUrlSfa)
                //     .subscribe((result) => {
                //         console.log(result);
                //         this.autocompleteItems = result;
                //         this.temp_product_array = this.autocompleteItems;
                        
                //         console.log(this.autocompleteItems);
                //         setTimeout(() => {
                //             this.loading.dismiss()
                //             // this.prod_codeSelectable.open();
                //         }, 1000);
                //     }, err => {
                //         this.loading.dismiss()
                //     });
                // }
            
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
                                    // this.loading.dismiss()
                                    // this.prod_codeSelectable.open();
                                }, 1000);
                            }, err => {
                                // this.loading.dismiss()
                            });                    
                        }   
                    } 
                }
        }
        
        
        
        
        
        
        distributor_network_list:any = [];
        
        get_network_list(network_type)
        {
            this.data.type_name = {};
            this.dbService.onShowLoadingHandler()
            this.dbService.onPostRequestDataFromApi({'type':network_type},'DealerData/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.distributor_network_list = result;
                this.dbService.onDismissLoadingHandler();
                this.open();
            });
        }
        get_network_listFromCheckin(network_type)
        {
            this.data.type_name = {};
            this.dbService.onPostRequestDataFromApi({'type':network_type},'DealerData/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.distributor_network_list = result;
                var Index =  this.distributor_network_list.findIndex(row=>row.id==this.checkinData.dr_id)
                console.log(this.distributor_network_list[Index]);
                this.data.type_name = this.distributor_network_list[Index]
                
                // this.open();
            });
        }
        
        get_network_listMoreItem(network_type)
        {
            this.data.type_name = {};
            // this.service.show_loading()
            this.dbService.onPostRequestDataFromApi({'type':network_type},'DealerData/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
                this.adddMoreItem = true
                console.log(result);
                this.distributor_network_list = result;
                console.log(this.order_data);
                console.log(this.order_data.id)
                var index = this.distributor_network_list.findIndex(row => row.id == this.order_data.id )
                console.log(index);
                
                console.log(this.distributor_network_list[index]);
                this.data.type_name = this.distributor_network_list[index]
                console.log(this.data.type_name);
                
                this.get_dr_marka();
                
                
            });
        }
        
        open()
        {
            this.selectComponent.open();
        }
        
        addToCart(qty)
        {
            console.log(this.product);
            if(this.cart_array.length == 0)
            {
                this.cart_array.push(this.product);
            }
            else
            {
                var flag = true;
                this.cart_array.forEach(element => {
                    
                    if(this.product.category == element.category && this.product.sub_category == element.sub_category && this.product.cat_no == element.cat_no)
                    {
                        // element.discount_amount= parseFloat(element.discount_amount) + parseFloat(this.product.discount_amount);
                        element.subTotal=parseFloat(element.subTotal) + parseFloat(this.product.subTotal);
                        // element.discountedAmount= parseFloat(element.discountedAmount) + parseFloat(this.product.discountedAmount);
                        element.subtotal_discount= parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                        element.subtotal_discount= parseFloat(element.subtotal_discount) + parseFloat(this.product.subtotal_discount);
                        element.subtotal_discounted= parseFloat(element.subtotal_discounted) + parseFloat(this.product.subtotal_discounted);
                        element.qty= parseFloat(element.qty) + parseFloat(this.product.qty);
                        
                        flag = false;
                    }
                });
                
                if(flag)
                {
                    this.cart_array.push(this.product);
                }
            }
            this.data.cat_no = {};
            this.show_price = false;
            console.log(this.cart_array);
            
            this.cal_grand_total();
            this.totalQty=parseInt(this.totalQty)+parseInt(qty);
            console.log(this.totalQty);
            
        }
        
        grand_amt:any={};
        sub_total:any=0;
        dis_amt:any=0;
        gst_amount:any=0;
        net_total:any=0;
        spcl_dis_amt:any=0
        grand_total:any=0;
        selected_drid:number=0;
        cal_grand_total()
        {
            console.log(this.type);
            
            this.sub_total = parseFloat(this.sub_total) + parseFloat(this.product.subTotal);
            this.dis_amt = parseFloat(this.dis_amt) + (parseFloat(this.product.subtotal_discount));
            this.net_total = parseFloat(this.net_total) + parseFloat(this.product.subtotal_discounted);
            console.log(this.special_discount);
            
            this.spcl_dis_amt = (this.net_total * this.special_discount)/100;
            console.log(this.spcl_dis_amt);
            
            if(this.type=='Discount')
            {
                this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
            }else
            {
                this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
            }
            console.log(this.sub_total);
            console.log(this.dis_amt);
            console.log(this.gst_amount);
            console.log(this.grand_total);
            console.log(this.net_total - this.spcl_dis_amt);
        }
        deleteItemFromCartAlertMessage(index,delQty)
        {
            let alert=this.alertCtrl.create({
                title:'Are You Sure?',
                subTitle: 'You want to remove this item ??',
                cssClass:'action-close',
                
                buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        this.dbService.presentToast('Action Cancelled')
                    }
                },
                {
                    text:'Confirm',
                    cssClass: 'close-action-sheet',
                    handler:()=>
                    { this.totalQty=this.totalQty-delQty;
                        this.deleteItemFromCart(index)
                    }
                }]
            });
            alert.present();
        }
        deleteItemFromCart(index)
        {
            this.sub_total = parseFloat(this.sub_total) -  parseFloat(this.cart_array[index].subTotal) ;
            
            this.dis_amt = parseFloat(this.dis_amt) -  parseFloat(this.cart_array[index].subtotal_discount) ;
            
            this.net_total = parseFloat(this.net_total) -  parseFloat(this.cart_array[index].subtotal_discounted) ;
            
            this.spcl_dis_amt = (this.net_total * this.special_discount)/100;
            
            if(this.type=='Discount')
            {
                this.grand_total = Math.round(this.net_total - this.spcl_dis_amt);
            }else
            {
                this.grand_total = Math.round(this.net_total + this.spcl_dis_amt);
            }
            
            this.cart_array.splice(index,1);
            
            this.dbService.presentToast('Item removed !!')
        }
        openCategory()
        {
            
            this.data.cat_no="";
            this.product.discount='';
            
            console.log(this.data.networkType);
            console.log(this.data.type_name);
            
            this.selected_drid= this.data.type_name.id;
            console.log(this.selected_drid);
            
            
            
            if(this.data.networkType!=3)
            {
                this.categorySelectable.open();
            }
            else
            {
                this.get_distributor();
            }
            this.user_data.private_marka = this.data.type_name.private_marka  ;
            this.user_data.transport_address = this.data.type_name.transport_address  ;
            this.user_data.transport_name = this.data.type_name.transport_name  ;
            this.user_data.transport_mobile = this.data.type_name.transport_mobile  ;
        }
        get_dr_marka()
        {
            this.dbService.onPostRequestDataFromApi({"dr_id":this.data.type_name.id},"dealerData/getdetails", this.dbService.rootUrlSfa)
            .subscribe(resp=>{
                console.log(resp);
                this.user_data.private_marka = resp['private_marka'];
                this.user_data.transport_detail = resp['transport_name'];
                this.user_data.transport_detail = resp['transport_mobile'];
                this.user_data.transport_detail = resp['transport_address'];
                
                if(this.user_data.private_marka!='')
                {
                    this.disable_marka = true;
                }
                
                if(this.user_data.transport_detail!='')
                {
                    this.disable_transport = true;
                }
            })
        }
        
        
        
        openCategory2()
        {
            this.categorySelectable.open();
            
        }
        distributor_list:any=[]
        
        get_distributormoreItem()
        {
            // this.service.show_loading();
            this.dbService.onPostRequestDataFromApi({'type':1},'DealerData/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.distributor_list = result;
                
                
                var index = this.distributor_list.findIndex(row => row.id == this.order_data.distributor_id )
                console.log(index);
                
                console.log(this.distributor_list[index]);
                this.data.distributor_id = this.distributor_list[index]
                // this.service.dismiss();
                // this.distributorSelectable.open();
                
            });
        }
        get_distributor()
        {
            this.dbService.onShowLoadingHandler();
            this.dbService.onPostRequestDataFromApi({'type':1},'DealerData/get_type_list', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.distributor_list = result;
                
                this.dbService.onDismissLoadingHandler();
                if(this.distributor_list.length==1)
                {
                    this.data.distributor_id = this.distributor_list[0]
                }
                else
                {
                    this.distributorSelectable.open();
                }
                
            });
        }
        save_orderalert(type)
        {
            var str
            console.log(this.grand_total);
            
            if(this.grand_total > 20000000)
            {
                let alert=this.alertCtrl.create({
                    title:'Max order value reached',
                    subTitle: 'Maximum order value is 2 Cr. !',
                    cssClass:'action-close',
                    
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
        if(type=='save')
        {
            str = 'You want to save this order as draft ?'
        }
        else
        {
            str = 'You want to submit order ?'
        }
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: str,
            cssClass:'action-close',
            
            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    
                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                    this.save_order(type)
                }
            }]
        });
        alert.present();
    }
    SpecialDiscountLable:any=''
    leave:any=0
    save_order(type)
    {
        this.leave=1
        this.user_data.type = this.data.networkType;
        
        if(this.user_data.type == "3" )
        {
            if(!this.data.distributor_id)
            {
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
        this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
        this.user_data.dr_id = this.data.type_name.id
        if(this.data.distributor_id && this.data.distributor_id.id)
        this.user_data.distributor_id = this.data.distributor_id.id
        var orderData = {sub_total:this.sub_total,'dis_amt':this.dis_amt,'grand_total':this.grand_total,'net_total':this.net_total,'special_discount':this.special_discount,special_discount_amount:this.spcl_dis_amt}
        
        
        this.dbService.onPostRequestDataFromApi({"cart_data":this.cart_array,"user_data":this.user_data,'orderData':orderData},"dealerData/save_orderExecutive", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            if(resp['msg'] == "success")
            {
                var toastString=''
                if(type=='save')
                {
                    toastString='Order Saved To Draft Successfully !'
                }
                else
                {
                    toastString='Order Placed Successfully !'
                }
                if(this.user_data.distributor_id)
                {
                    console.log('Secondary');
                    
                    this.navCtrl.push(OrderListPage,{'type':'Secondary'})
                }
                else
                {
                    console.log('Primary');
                    
                    this.navCtrl.push(OrderListPage,{'type':'Primary'})
                }
                this.dbService.presentToast(toastString)
            }
        })
    }
    
}
