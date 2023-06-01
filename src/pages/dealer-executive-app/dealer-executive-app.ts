import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { DealerExecutiveListPage } from '../dealer-executive-list/dealer-executive-list';
import { DealerDealerListPage } from '../dealer-dealer-list/dealer-dealer-list';
import { DistributorDetailPage } from '../sales-app/distributor-detail/distributor-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
    selector: 'page-dealer-executive-app',
    templateUrl: 'dealer-executive-app.html',
})
export class DealerExecutiveAppPage {

    form:any={};
    user_data:any={};
    type:any='';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private alertCtrl: AlertController,
                public dbService:DbserviceProvider,
                public loadingCtrl: LoadingController) {

            this.type = this.navParams.get("type");
            console.log(this.type);

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DealerExecutiveAppPage');
        this.get_states();
        this.user_data = this.dbService.userStorageData;
    }

    state_list:any=[];
    get_states()
    {
        this.dbService.onShowLoadingHandler()

        this.dbService.onPostRequestDataFromApi({},"dealerData/getStates", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.state_list = resp['state_list'];
            this.dbService.onDismissLoadingHandler()
        },
        err=>{

            this.dbService.errToasr();
            this.dbService.onDismissLoadingHandler();
        })
    }


    district_list:any=[];
    get_district()
    {
        // this.db.show_loading()
        this.dbService.onPostRequestDataFromApi({"state_name":this.form.state},"dealerData/getDistrict", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.district_list = resp['district_list'];
            // this.db.dismiss()
        },
        err=>{
            this.dbService.errToasr();
            // this.db.dismiss()
        })
    }

    submit()
    {
        console.log(this.form);

        if(this.form.mobile.length!=10)
        {
            return
        }
        if(this.type != 'dealer' && this.execExists==true)
        {
            this.dbService.presentToast('Mobile Already Exists');
            return
        }
        this.dbService.onShowLoadingHandler()
        this.dbService.onPostRequestDataFromApi({"data":this.form,"loginData":this.user_data,"type":this.type},"dealerData/save_executive", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.dbService.onDismissLoadingHandler()

            if(resp['msg'] == 'success')
            {
                this.dbService.presentToast("Success!");
                if(this.type == 'dealer')
                {
                    this.navCtrl.push(DealerDealerListPage);
                }
                else
                {
                    this.navCtrl.push(DealerExecutiveListPage);
                }
            }
        },
        err=>{
            this.dbService.errToasr();
            this.dbService.onDismissLoadingHandler();
        });
    }

    MobileNumber(event: any)
    {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar))
        {event.preventDefault(); }
    }
    // count:any=0
    check_num()
    {
        console.log(this.form.mobile.length);

        if(this.form.mobile.length == 10)
        {
            console.log(this.form.mobile.length);

            console.log(this.form.mobile);
            this.check_mobile_existence(this.form.mobile)
        }
    }
    checkDealerExist()
    {
        console.log(this.form.mobile.length);

        if(this.form.mobile.length == 10)
        {
            console.log(this.form.mobile.length);

            console.log(this.form.mobile);
            this.check_mobile_existence2(this.form.mobile)
        }
    }
    checkExist=false
    check_mobile_existence(mobile)
    {
        this.form={}
        this.form.mobile=mobile
        console.log(this.form.mobile.length)
        // if(this.form.mobile.lenght==10)
        // {
        var loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: `<img src="./assets/imgs/gif.svg"/>`,
            dismissOnPageChange: true
        });
        loading.present();
        console.log(this.dbService.userStorageData.id);
        this.dbService.onPostRequestDataFromApi({'mobile':mobile,dist_id:this.dbService.userStorageData.id},'Enquiry/check_mobile_existence1', this.dbService.rootUrlSfa).subscribe((result)=>{
            console.log(result);
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
                    this.form.mobile='';
                    return;
                }
                if(result['cpExist']!=0)
                {
                    let alert=this.alertCtrl.create({
                        title:'Exists !!',
                        subTitle: 'Mobile No Is Already Registered !!',
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
                        this.form.mobile='';
                        return;

                }
                if(result['check_mobile']==1)
                {
                    this.checkExist=true
                    this.form = result['data'][0]
                    this.get_district()

                    if(this.form.assigned!=0)
                    {
                        this.dbService.presentToast('Dealer Already Assigned');
                        // if(this.count==0)
                        this.dealer_detail(this.form.id)
                    }
                    else
                    {
                        this.dbService.presentToast('Dealer With Same Mobile No. Already Exists')

                    }
                    this.form.street = result['data'][0].address

                    this.form.DealerExist=true;
                }
                else
                {
                    this.form.DealerExist=false;

                    this.checkExist=false
                }
                // this.count++

            },err=>
            {
                loading.dismiss()

            })

            // }


        }
        execExists:any=false
        check_mobile_existence2(mobile)
        {
            this.execExists = false
            this.form={}
            this.form.mobile=mobile

            var loading = this.loadingCtrl.create({
                spinner: 'hide',
                content: `<img src="./assets/imgs/gif.svg"/>`,
                dismissOnPageChange: true
            });
            loading.present();
            this.dbService.onPostRequestDataFromApi({'mobile':mobile},'Enquiry/check_mobile_existence2', this.dbService.rootUrlSfa).subscribe((result)=>{
                console.log(result);
                loading.dismiss()
                if(result['execData']!=0)
                {
                    this.execExists = true;
                    return
                }
                if(result['dealer']!=0)
                {
                    let alert=this.alertCtrl.create({
                        title:'Exists !!',
                        subTitle: 'Mobile No Is Already Registered !!',
                        cssClass:'action-close',

                        buttons: [
                            {
                                text:'Okay',
                                cssClass: 'close-action-sheet',
                                handler:()=>
                                {
                                    this.form.mobile='';
                                }
                            }]
                        });
                        alert.present();
                        this.form.mobile='';

                    }

                },err=>
                {
                    loading.dismiss()

                })

                // }


            }
            selectAddressOnBehalfOfPincode()
            {
                if(this.form.pincode.length==6)
                {
                    var loading = this.loadingCtrl.create({
                        spinner: 'hide',
                        content: `<img src="./assets/imgs/gif.svg"/>`,
                        dismissOnPageChange: true
                    });
                    loading.present();
                    this.dbService.onPostRequestDataFromApi({'pincode':this.form.pincode},'Enquiry/selectAddressOnBehalfOfPincode', this.dbService.rootUrlSfa).subscribe((result)=>{
                        loading.dismiss()

                        console.log(result);
                        this.form.state = result['state_name']
                        this.get_district()
                        this.form.district = result['district_name']
                        this.form.city = result['city']
                        this.form.area = result['area']

                    },err=>
                    {
                        loading.dismiss()

                        // this.db.presentToast('Failed To Get ')
                    })
                }
            }
            dealer_details:any = [];
            dealer_checkin:any = [];
            dealer_order:any = [];

            edit_dis:boolean = false;
            dealer_detail(dr_id)
            {
                if(this.dbService.userStorageData.all_data.type==1)
                {

                    let loading = this.loadingCtrl.create({
                        spinner: 'hide',
                        content: `<img src="./assets/imgs/gif.svg" class="h55" />`,
                    });
                    this.dbService.onPostRequestDataFromApi({'dr_id':dr_id},'Distributor/dealer_detail', this.dbService.rootUrlSfa)
                    .subscribe((result)=>{
                        console.log(result);
                        this.dealer_details = result['result'];
                        this.dealer_checkin = result['total_checkin'];
                        this.dealer_order = result['total_order'];
                        loading.dismiss();
                        console.log(this.user_data.type);

                        if(this.user_data.type == '1')
                        {
                            this.edit_dis = true;
                        }
                        this.navCtrl.push(DistributorDetailPage,{'dr_id':dr_id,'edit_discount':this.edit_dis,'dealer_data':this.dealer_details, 'dealer_checkin': this.dealer_checkin,'dealer_order':this.dealer_order});
                    });
                    loading.present();
                }
            }
        }
