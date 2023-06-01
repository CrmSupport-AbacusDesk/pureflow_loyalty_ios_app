import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { AddOrderPage } from '../add-order/add-order';
import { Storage } from '@ionic/storage';
import moment from 'moment';
import { CameraOptions, Camera } from '@ionic-native/camera';

import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { DealerAddorderPage } from '../dealer-addorder/dealer-addorder';
import { ViewProfilePage } from '../view-profile/view-profile';
declare var DocumentViewer: any;



/**
* Generated class for the OrderDetailPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()


@Component({
    selector: 'page-order-detail',
    templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

    order_id:any;
    orderDetail:any=[];
    userDetail:any=[];
    order_item_array:any = [];
    login:any;
    order_id1:any = '';
    currentDate:any='';
    orderDate:any='';
    dispatch:boolean = false;
    loginData:any={};
    upload_url:any='';
    userType:any='';
    pdfUrl:any;
    loginId:any;

    constructor(public navCtrl: NavController,
                public modalCtrl: ModalController,
                public loadingCtrl: LoadingController,
                public navParams: NavParams,
                public toastCtrl: ToastController,
                public alertCtrl:AlertController,
                public storage: Storage,
                public actionSheetController:ActionSheetController,
                public camera:Camera,
                private transfer: FileTransfer,
                public dbService:DbserviceProvider,
                public file:File) {

          this.pdfUrl = this.dbService.upload_url1 +'orderPdf/';
    }

    ionViewWillEnter()
    {
        this.loginId = this.dbService.userStorageData.id;
        if(this.navParams.get('login'))
        {
            this.login = this.navParams.get('login');
        }
        else
        {
            this.login = 'DrLogin'
        }
        console.log(this.login);

        

        this.collObject.index=true
        this.upload_url = this.dbService.upload_url2;
        this.loginData = this.dbService.userStorageData;

        const loginType = this.dbService.userStorageData.user_type;
        console.log(loginType);
        if(loginType=='CMS')
        {
            this.userType='notDrLogin'
        }
        else
        {
            this.userType='drLogin'
        }

        console.log(this.userType);

        if(this.userType=='CMS')
        {
            this.user_data = this.dbService.userStorageData.tokenInfo;
        }
        else
        {
            this.user_data = this.dbService.userStorageData.all_data;
        }

        if(this.navParams.get('order_id'))
        {
            this.order_id1 = this.navParams.get('order_id');
            this.getOrderDetail(this.order_id1);
        }

        this.currentDate = moment().format("YY:MM:DD");
        console.log(this.currentDate);


        this.storage.get('order_item_array').then((order_item) => {
            console.log(order_item);
            if(typeof(order_item) !== 'undefined' && order_item){
                this.order_item_array = order_item;

            }
        });

        if(this.navParams.get("id"))
        {
            this.order_id=this.navParams.get("id");
            if(this.order_id)
            {
                console.log(this.order_id);

                this.getOrderDetail(this.order_id);
            }
        }

        if(this.navParams.get('customer_order_detail'))
        {
            this.userDetail = this.navParams.get('customer_order_detail');
            this.orderDetail = this.navParams.get('customer_order_item');
            this.tag = this.navParams.get('tag');
        }
        console.log(this.userDetail);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad OrderDetailPage');
    }

    tag:any;
    show_image:boolean = false
    getOrderDetail(order_id)
    {
        console.log(order_id);
        this.lodingPersent();
        this.dbService.onPostRequestDataFromApi({"order_id":order_id},"Order/order_detail", this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            this.orderDetail=result['detail'];
            this.userDetail=result['data'];
            // this.userDetail.order_total = Math.round(parseFloat(this.userDetail.order_total))
            this.userDetail.order_grand_totalAfterRoundOff = Math.round(parseFloat(this.userDetail.order_grand_total))
            this.userDetail.netBreakup = (parseFloat(this.userDetail.order_grand_total)/1.18)            
            this.userDetail.gstBreakup = parseFloat(this.userDetail.order_grand_total)-parseFloat(this.userDetail.netBreakup)
            this.userDetail.gstBreakup.toFixed(); 
            this.userDetail.disc_percentage = Math.round((parseFloat(this.userDetail.order_discount)*100)/parseFloat(this.userDetail.sub_total));
            console.log(this.userDetail);
            this.image = result['images'];
            this.orderDetail.map((item)=>{
                // item.afterDiscount = parseFloat(item.price)-((parseFloat(item.price)/100)*parseInt(item.discount_percent))
                item.afterDiscount = parseFloat(item.price)-parseFloat(item.discount_amount)
                item.amountAfterRoundOff =Math.round(item.amount)
                item.edit_true = true;
                item.edit_true1 = true;
                if(item.dispatch_qty!="0")
                {
                    this.show_image = true;
                }
            })
            if(this.userDetail.company_name)
            {
                this.tag=this.userDetail.company_name[0].toUpperCase();
            }
            this.orderDate=moment(this.userDetail.order_date_created).format("YY:MM:DD");
            console.log(this.orderDate);


            this.loading.dismiss();

        })
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


    active:any = {};
    order_item_discount :any ={};
    value:any = {};
    // edit_true:boolean = true;

    edit_order(index,order_item_id,category,dr_id,type,cat_no,type_cartoon)
    {
        console.log(type_cartoon);
        console.log(index);
        console.log(order_item_id);
        console.log(cat_no);
        console.log(dr_id);
        console.log(type);
        if(type_cartoon=='cartoon_qty')
        {
            this.active[index] = Object.assign({'cartoon_qty':"1"});
            console.log(this.active);
            this.orderDetail[index].edit_true1 = false;

        }
        else{

            this.active[index] = Object.assign({'qty':"1"});
                console.log(this.active);
            this.orderDetail[index].edit_true = false;
            
        }
        this.dbService.onPostRequestDataFromApi({'category':category, 'dr_id':dr_id, 'type':type, 'cat_no':cat_no},'Order/order_item_discount', this.dbService.rootUrlSfa)
        .subscribe((result)=>{
            console.log(result);
            if(result)
            {
                if(result['data'] == null)
                {
                    this.order_item_discount = null;
                }else{
                    this.order_item_discount = result['data'][0];
                    console.log(this.order_item_discount);
                }

                this.value = result['data1'][0];
                console.log(this.value);
            }
        });
    }

    edit_order_executive(index,order_item_id,category,dr_id,type,cat_no)
    {
        console.log(index);
        console.log(order_item_id);
        console.log(cat_no);
        console.log(dr_id);
        console.log(type);
        this.active[index] = Object.assign({'qty':"1"});
        console.log(this.active);
        this.orderDetail[index].edit_true = false;

        this.dbService.onPostRequestDataFromApi({'category':category, 'dr_id':dr_id, 'type':type, 'cat_no':cat_no},'Order/order_item_discount', this.dbService.rootUrlSfa)
        .subscribe((result)=>{
            console.log(result);
            if(result)
            {
                if(result['data'] == null)
                {
                    this.order_item_discount = null;
                }else{
                    this.order_item_discount = result['data'][0];
                    console.log(this.order_item_discount);
                }

                this.value = result['data1'][0];
                console.log(this.value);
            }
        });
    }


    gst:any;
    discount_amt:any;
    discounted_amt:any;
    gst_amount:any;
    order:any = {};
    order_data:any={};
    subTotal:any;
    amount:any;

    calculateAmount(qty,index,del,type,data:any,)
    {
        console.log(this.orderDetail);
        console.log(type);
        if(type=='cartoon_qty')
        {

            console.log(this.orderDetail[index]['cartoon_qty']);
            console.log("cartoon_qty");
            
            console.log(this.orderDetail[index].cartoon_packing);
             this.orderDetail[index].qty= (this.orderDetail[index].cartoon_qty*this.orderDetail[index].cartoon_packing)
            console.log(this.orderDetail.qty);
        
        }
        

        var itemData =  this.orderDetail[index]
        console.log(itemData);
        this.userDetail.special_discount_amount =0

        this.orderDetail[index].sub_total = this.orderDetail[index].price * this.orderDetail[index].qty;
        this.orderDetail[index].discount_amount = this.orderDetail[index].price * this.orderDetail[index].discount_percent / 100;
        this.orderDetail[index].discounted_amount = this.orderDetail[index].price - this.orderDetail[index].discount_amount;
        // this.orderDetail[index].gst_amount = this.orderDetail[index].discounted_amount * this.orderDetail[index].gst_percent / 100;
        this.orderDetail[index].amount = parseFloat(this.orderDetail[index].discounted_amount) *  this.orderDetail[index].qty;

        this.orderDetail[index].sub_total = parseFloat(this.orderDetail[index].sub_total);
        this.orderDetail[index].discount_amount = parseFloat(this.orderDetail[index].discount_amount);
        this.orderDetail[index].discounted_amount = parseFloat(this.orderDetail[index].discounted_amount);
        this.orderDetail[index].gst_amount = parseFloat(this.orderDetail[index].gst_amount);
        this.orderDetail[index].amount = parseFloat(this.orderDetail[index].amount);

        this.order_data.sub_total = 0;
        this.order_data.discount = 0;
        this.order_data.gst = 0;
        this.order_data.order_total = 0;
        // this.order_data.special_discount_amount =0
        console.log(this.userDetail);

        for(var i=0; i<this.orderDetail.length;i++)
        {
            this.order_data.sub_total += parseFloat(this.orderDetail[i]['sub_total']);
            this.order_data.order_total += parseFloat(this.orderDetail[i]['amount']);
            this.order_data.discount += parseFloat(this.orderDetail[i].sub_total)-parseFloat(this.orderDetail[i].amount);
            this.order_data.gst += parseFloat(this.orderDetail[i]['gst_amount']);


            console.log(this.order_data);

            this.userDetail.sub_total = this.order_data.sub_total;
            this.userDetail.order_total = this.order_data.order_total;
            this.userDetail.order_discount = this.order_data.discount;
            this.userDetail.order_gst = this.order_data.gst;
        }
        this.order_data.special_discount_amount = (this.order_data.order_total * parseFloat(this.userDetail.special_discount_percentage) )/100
        this.userDetail.special_discount_amount = this.order_data.special_discount_amount;
        if(this.userDetail.DiscType=='Discount')
        {
            this.order_data.order_grand_total = this.order_data.order_total - this.order_data.special_discount_amount
        }
        else
        {
            this.order_data.order_grand_total = this.order_data.order_total + this.order_data.special_discount_amount

        }
        console.log(this.order_data);

        this.userDetail.order_grand_total = this.order_data.order_grand_total;
        this.userDetail.order_grand_totalAfterRoundOff = Math.round(this.userDetail.order_grand_total)
        this.userDetail.netBreakup = (parseFloat(this.userDetail.order_grand_total)/1.18)
        this.userDetail.gstBreakup = parseFloat(this.userDetail.order_grand_total)-parseFloat(this.userDetail.netBreakup)

        if(del==true)
        {

            this.update_order(data.index,data.order_id,data.order_item_id,true)
        }
    }
    calculateAmountExecutive(qty,index,del,data:any)
    {
        console.log(this.orderDetail);

        var itemData =  this.orderDetail[index]
        console.log(itemData);
        this.userDetail.special_discount_amount =0

        this.orderDetail[index].sub_total = this.orderDetail[index].price * this.orderDetail[index].qty;
        this.orderDetail[index].discount_amount = this.orderDetail[index].price * this.orderDetail[index].discount_percent / 100;
        this.orderDetail[index].discounted_amount = this.orderDetail[index].price - this.orderDetail[index].discount_amount;
        // this.orderDetail[index].gst_amount = this.orderDetail[index].discounted_amount * this.orderDetail[index].gst_percent / 100;
        this.orderDetail[index].amount = parseFloat(this.orderDetail[index].discounted_amount) *  this.orderDetail[index].qty;

        this.orderDetail[index].sub_total = parseFloat(this.orderDetail[index].sub_total);
        this.orderDetail[index].discount_amount = parseFloat(this.orderDetail[index].discount_amount);
        this.orderDetail[index].discounted_amount = parseFloat(this.orderDetail[index].discounted_amount);
        this.orderDetail[index].gst_amount = parseFloat(this.orderDetail[index].gst_amount);
        this.orderDetail[index].amount = parseFloat(this.orderDetail[index].amount);

        this.order_data.sub_total = 0;
        this.order_data.discount = 0;
        this.order_data.gst = 0;
        this.order_data.order_total = 0;
        // this.order_data.special_discount_amount =0
        console.log(this.userDetail);

        for(var i=0; i<this.orderDetail.length;i++)
        {
            this.order_data.sub_total += parseFloat(this.orderDetail[i]['sub_total']);
            this.order_data.order_total += parseFloat(this.orderDetail[i]['amount']);
            this.order_data.discount += parseFloat(this.orderDetail[index].sub_total)-parseFloat(this.orderDetail[index].amount);
            this.order_data.gst += parseFloat(this.orderDetail[i]['gst_amount']);


            console.log(this.order_data);

            this.userDetail.sub_total = this.order_data.sub_total;
            this.userDetail.order_total = this.order_data.order_total;
            this.userDetail.order_discount = this.order_data.discount;
            this.userDetail.order_gst = this.order_data.gst;
        }
        this.userDetail.special_discount_percentage=0
        this.order_data.special_discount_amount = (this.order_data.order_total * parseFloat(this.userDetail.special_discount_percentage) )/100
        this.userDetail.special_discount_amount = this.order_data.special_discount_amount;
        if(this.userDetail.DiscType=='Discount')
        {
            this.order_data.order_grand_total = this.order_data.order_total - this.order_data.special_discount_amount
        }
        else
        {
            this.order_data.order_grand_total = this.order_data.order_total + this.order_data.special_discount_amount

        }
        console.log(this.order_data);

        this.userDetail.order_grand_total = this.order_data.order_grand_total;
        this.userDetail.order_grand_totalAfterRoundOff = Math.round(this.userDetail.order_grand_total)
        this.userDetail.netBreakup = (parseFloat(this.userDetail.order_grand_total)/1.18)
        this.userDetail.gstBreakup = parseFloat(this.userDetail.order_grand_total)-parseFloat(this.userDetail.netBreakup)

        if(del==true)
        {

            this.update_order(data.index,data.order_id,data.order_item_id,true)
        }
    }



    calculateAmount1(qty,index)
    {
        console.log(index);
        console.log(qty);
        console.log(this.orderDetail[index]);
        console.log(this.userDetail);

        this.orderDetail[index].sub_total = this.orderDetail[index].price * this.orderDetail[index].qty;
        this.orderDetail[index].discount_amount = this.orderDetail[index].sub_total * this.orderDetail[index].discount_percent / 100;
        this.orderDetail[index].discounted_amount = this.orderDetail[index].sub_total - this.orderDetail[index].discount_amount;
        this.orderDetail[index].amount = this.orderDetail[index].discounted_amount;
        this.orderDetail[index].sec_ord_background_dis = this.orderDetail[index].sub_total * this.order_item_discount.distributor / 100;
        this.orderDetail[index].sec_ord_background_amt = this.orderDetail[index].sub_total - this.orderDetail[index].sec_ord_background_dis;

        this.orderDetail[index].sub_total = parseFloat(this.orderDetail[index].sub_total);
        this.orderDetail[index].discount_amount = parseFloat(this.orderDetail[index].discount_amount);
        this.orderDetail[index].discounted_amount = parseFloat(this.orderDetail[index].discounted_amount);
        this.orderDetail[index].amount = parseFloat(this.orderDetail[index].amount);
        this.orderDetail[index].sec_ord_background_dis = parseFloat(this.orderDetail[index].sec_ord_background_dis);
        this.orderDetail[index].sec_ord_background_amt = parseFloat(this.orderDetail[index].sec_ord_background_amt);

        this.order_data.subTotal = 0;
        this.order_data.order_total = 0;
        this.order_data.order_discount = 0;
        this.order_data.sec_ord_background_amt = 0;

        for(var i=0;i<this.orderDetail.length;i++)
        {
            this.order_data.subTotal += parseFloat(this.orderDetail[i]['sub_total']);
            this.order_data.order_total += parseFloat(this.orderDetail[i]['amount']);
            this.order_data.order_discount += parseFloat(this.orderDetail[i]['discount_amount']);
            this.order_data.sec_ord_background_amt += parseFloat(this.orderDetail[i]['sec_ord_background_amt']);

            this.userDetail.sub_total = this.order_data.subTotal;
            this.userDetail.order_total = this.order_data.order_total;
            this.userDetail.order_discount = this.order_data.order_discount;
            this.userDetail.sec_ord_background_amt = this.order_data.sec_ord_background_amt;
        }
    }

    presentAlert() {
        let alert = this.alertCtrl.create({
            title: 'Alert',
            subTitle: 'Order is already saved in Cart',
            buttons: ['Dismiss']
        });
        alert.present();
    }


    user_data:any={};
    brand_assign:any = [];
    add_new_item(order_id,dr_id)
    {
        console.log(order_id);
        console.log(dr_id);

        if(this.order_item_array == '')
        {
            this.dbService.onPostRequestDataFromApi({'dr_id':dr_id},'Order/user_detail', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                this.user_data = result['data'];
                this.brand_assign = result['brand_assign'];
                this.navCtrl.push(AddOrderPage,{'data':this.user_data,'order_id':order_id, 'brand_assign':this.brand_assign});
            });
        }
        else{
            this.presentAlert();
        }
    }

    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'Order Item Updated Successfully',
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }


    presentToast1() {
        let toast = this.toastCtrl.create({
            message: 'Order Item Deleted Successfully',
            duration: 3000,
            position: 'bottom'
        });



        toast.present();
    }

    update_order(index,order_id,order_item_id,del:any)
    {
        if(!this.orderDetail[index].qty && del==false)
        {
            this.dbService.presentToast('Please Enter Valid Quantity')
            return;
        }
        this.lodingPersent();

        this.dbService.onPostRequestDataFromApi({'order_id':order_id, 'order_item_id':order_item_id, 'item':this.orderDetail[index], 'order':this.userDetail , delete:del,loginId:this.dbService.userStorageData.id},'Order/update_order_item', this.dbService.rootUrlSfa)
        .subscribe((result)=>{
            console.log(result);
            if(result[1]===0)
            {
                this.navCtrl.pop()
                this.loading.dismiss();

                this.dbService.presentToast('Order Deleted Sucessfully')
                return

            }
            if(result[0] == 'success')
            {
                this.loading.dismiss();
                if(del==false)
                {
                    this.presentToast();
                }
                else{
                    this.dbService.presentToast('Order Item Deleted Sucessfully')
                }
                this.getOrderDetail(order_id);
            }
        })
        this.active = {};
        this.orderDetail[index].edit_true = true;
        this.orderDetail[index].edit_true1 = true;

    }


    delete_item(index,order_id,order_item_id)
    {
        console.log(index);
        console.log(order_id);
        console.log(order_item_id);

        let alert = this.alertCtrl.create({
            title: 'Confirm ',
            message: 'Are you sure you want to delete this item ?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.orderDetail[index].qty=0
                        var data = { index:index , order_id:order_id , order_item_id:order_item_id }
                        this.calculateAmount(0,index,true,'',data)
                        // this.delete_order_item(index,order_id,order_item_id);
                    }
                }
            ]
        })

        alert.present();
    }



    delete_order_item(index,order_id,order_item_id)
    {
        console.log(index);
        console.log(order_id);
        console.log(order_item_id);
        // return
        this.lodingPersent();


        this.dbService.onPostRequestDataFromApi({'order_id':order_id,'order_item_id':order_item_id},'Order/delete_order_item', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
            if(result == 'success')
            {
                this.orderDetail.splice(index,1);
                this.loading.dismiss();
                this.presentToast1();
                this.getOrderDetail(order_id);
            }
        })
    }
    forceDispatch()
    {
        let alert=this.alertCtrl.create({
            title:'Are You Sure?',
            subTitle: 'You want To Dispatch Order Manually?',
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
                {
                    this.dbService.onPostRequestDataFromApi({'loginId':this.loginId,id:this.userDetail.order_id},'dealerData/changeStatusToDispatch', this.dbService.rootUrlSfa)
                    .subscribe((result)=>{
                        this.dbService.presentToast('Order Dispatched Successfully');
                        this.userDetail.order_status='Dispatch'
                        this.getOrderDetail(this.userDetail.order_id);
                    },err=>
                    {
                    });
                }
            }]
        });
        alert.present();
    }

    check_num(indx)
    {
        console.log(this.orderDetail[indx]);

        if(this.orderDetail[indx]['pending_qty'] < this.orderDetail[indx]['disp_qty'])
        {
            let toast = this.toastCtrl.create({
                message: 'Invalid Qty',
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            this.orderDetail[indx]['disp_qty'] = this.orderDetail[indx]['pending_qty'];
        }
    }

    dispatch_item()
    {
        console.log(this.orderDetail);

        this.dbService.onPostRequestDataFromApi({'loginId':this.loginId,"item":this.orderDetail},"dealerData/dispatch_order", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            if(resp['msg'] == "success")
            {
                console.log(this.dbService.rootUrlSfa+'dealerData/upload_invoice?id='+resp['order_id']+'&created_type='+this.userType+'&created_by='+this.loginData.id);

                if(this.image.length > 0)
                {
                    this.image.forEach(element => {

                        const fileTransfer: FileTransferObject = this.transfer.create();
                        var random = Math.floor(Math.random() * 100);
                        let options: FileUploadOptions = {
                            fileKey: 'photo',
                            fileName: "myImage_" + random + ".jpg",
                            chunkedMode: false,
                            mimeType: "image/jpeg",
                        }

                        fileTransfer.upload(element, this.dbService.rootUrlSfa+'dealerData/upload_invoice?id='+resp['order_id']+'&created_type='+this.userType+'&created_by='+this.loginData.id, options)
                        .then((data) => {
                            console.log(data);
                            console.log("success");

                        }, (err) => {
                            console.log(err);
                            console.log("error");
                        })
                    });
                }

                let toast = this.toastCtrl.create({
                    message: 'Order Item Dispatched Successfully',
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();

                this.getOrderDetail(this.order_id);
                this.dispatch = false;

            }
        })
    }

    open_camera()
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
            }]
        });
        actionsheet.present();
    }

    image:any=[];

    takePhoto()
    {
        console.log("i am in camera function");
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL ,
            targetWidth : 500,
            targetHeight : 400
        }

        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.image.push('data:image/jpeg;base64,' + imageData);
            console.log(this.image);
        }, (err) => {
        });
    }
    getImage()
    {
        const options: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL ,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            saveToPhotoAlbum:false
        }
        console.log(options);
        this.camera.getPicture(options).then((imageData) => {
            this.image.push('data:image/jpeg;base64,' + imageData);
            console.log(this.image);
        });
    }

    delete_image(data,i)
    {
        let updateAlert = this.alertCtrl.create({
            title: 'Delete',
            message: 'Are you sure ?',
            buttons: [
                {text: 'No', },
                {text: 'Yes',
                handler: () => {

                    this.dbService.onPostRequestDataFromApi({"data":data},"dealerData/delete_image", this.dbService.rootUrlSfa)
                    .subscribe(resp=>{
                        console.log(resp);
                        this.image.splice(i,1);
                    })
                }}
            ]
        });
        updateAlert.present();
    }

    more_item(id)
    {
        console.log(id);
        this.orderDetail.map(row=>{
            row.discount = row.discount_percent;
        })
        this.navCtrl.push(DealerAddorderPage,{"order_item":this.orderDetail,"order_data":this.userDetail});
    }
    more_item_executive(id)
    {
        console.log(id);
        this.orderDetail.map(row=>{
            row.discount = row.discount_percent;
        })
        this.navCtrl.push(AddOrderPage,{"order_item":this.orderDetail,"order_data":this.userDetail});
    }
    collObject:any={}
    collapse(index)
    {

        console.log(index);
        console.log(this.collObject.index);

        if( this.collObject.index==true)
        {
            this.collObject.index=false
        }
        else
        {
            this.collObject.index=true
        }
        console.log(this.collObject.index);

    }
    changeStatus()
    {


        let alert=this.alertCtrl.create({
            title:'Are You Sure!',
            subTitle: "You want to place order ?",
            cssClass:'action-close',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.dbService.presentToast('Order not placed')
                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                    console.log(this.userDetail.order_id);


                    this.dbService.onShowLoadingHandler()
                    this.dbService.onPostRequestDataFromApi({id:this.userDetail.order_id},'order/changeStatus', this.dbService.rootUrlSfa)
                    .subscribe((result)=>{
                        this.dbService.presentToast('Order Placed Successfully');
                        this.dbService.onDismissLoadingHandler()
                        this.userDetail.order_no = result[1]
                        this.userDetail.order_status='Pending'
                        this.getOrderDetail(this.userDetail.order_id);

                    },err=>
                    {
                        this.dbService.onDismissLoadingHandler()
                        this.dbService.errToasr()
                    });
                }
            }]
        });
        alert.present();

    }
    updateStatus(status,reason,remark,pre_close_remark)
    {
        console.log(this.dbService.userStorageData.id);

        if(!status)
        {
            this.dbService.presentToast('Select Status')
            return

        }
        var str= status
        var str1
        if(status=='Approved')
        {
            str='accept';
            str1='accepted';
        }
        else if( status=='Pre Close')
        {
            str = 'pre close'
            str1 = 'pre closed'
        }
        else
        {
            str = 'refer back'
            str1 = 'referred back'
        }

        if(status=='Reject' && !reason)
        {
            this.dbService.presentToast('Refer back reason required !!')
            return
        }
        if(status=='Pre Close' && !pre_close_remark)
        {
            this.dbService.presentToast('Pre close reason required !!')
            return
        }
        let alert=this.alertCtrl.create({
            title:'Are You Sure!',
            subTitle: "You want to "+str+" order ?",
            cssClass:'action-close',

            buttons: [{
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    this.userDetail.changeStatus=false
                    this.dbService.presentToast('Order not '+str1)
                }
            },
            {
                text:'Confirm',
                cssClass: 'close-action-sheet',
                handler:()=>
                {
                    console.log(this.userDetail.order_id);
                    this.userDetail.changeStatus=false


                    this.dbService.onShowLoadingHandler();
                    this.dbService.onPostRequestDataFromApi({id:this.userDetail.order_id,status:status,reason:reason,reamrk:remark,pre_close_remark:pre_close_remark,loginId:this.dbService.userStorageData.id},'dealerData/changeStatusOrder', this.dbService.rootUrlSfa)
                    .subscribe((result)=>{
                        if(this.userDetail.reason_reject1 !='')
                        {
                            this.userDetail.reason_reject=this.userDetail.reason_reject1
                        }
                        else
                        {
                            this.userDetail.reason_reject=''
                        }
                        if(this.userDetail.remark1 !='')
                        {
                            this.userDetail.remark = this.userDetail.remark1
                        }
                        else
                        {
                            this.userDetail.remark=''
                        }
                        this.dbService.presentToast('Order Status Updated Successfully');
                        this.dbService.onDismissLoadingHandler();
                        this.userDetail.order_status=status
                        if(result[1])
                        {
                            this.userDetail.order_no = result[1]
                        }
                        this.getOrderDetail(this.userDetail.order_id);

                    },err=>
                    {
                        this.userDetail.changeStatus=false

                        this.dbService.onDismissLoadingHandler();
                        this.dbService.errToasr();
                    });
                }
            }]
        });
        alert.present();

    }
    imageModal(src)
    {
        console.log(src);

        this.modalCtrl.create(ViewProfilePage, {"Image": src}).present();
    }

    goToDownload(orderID)
    {
        console.log(orderID);

        this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
            dismissOnPageChange: true
        });

        this.loading.present();

        this.dbService.onPostRequestDataFromApi({"order_id":orderID},"cron/orderPdf", this.dbService.rootUrlSfa).subscribe((result)=>
        {
            console.log(result);


            setTimeout(() => {
               this.loading.dismiss();
            }, 1000);


            if(result == 'success')
            {
                console.log(this.pdfUrl);

                var pdfName = orderID +'.pdf';

                const fileTransfer: FileTransferObject = this.transfer.create();

                var url = this.pdfUrl + orderID +'.pdf';


                console.log(url);
                window.open(url, '_blank');

                DocumentViewer.previewFileFromUrlOrPath(
                  function () {
                  console.log('success');
                  }, function (error) {
                  if (error == 53) {
                      console.log('No app that handles this file type.');
                  }else if (error == 2){
                      console.log('Invalid link');
                  }
                },
                url, 'PDF', 'application/pdf');

                // fileTransfer.download(url, this.file.externalRootDirectory + '/Download/' + pdfName).then((entry) => {
                //     console.log('download complete: ' + entry.toURL());
                // });

            }

        });
    }

    presentToast2() {
        let toast = this.toastCtrl.create({
            message: 'PDF Download Successfully, Check in your downloads',
            duration: 3000,
            position: 'bottom'
        });

        toast.present();
    }

}
