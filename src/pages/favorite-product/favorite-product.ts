import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { OfflineDbProvider } from '../../providers/offline-db/offline-db';


import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
    selector: 'page-favorite-product',
    templateUrl: 'favorite-product.html',
})
export class FavoriteProductPage
{
    load_data:any=''
    cat_id:any='';
    filter :any = {};
    prod_list:any=[];
    prod_cat:any={};
    prod_count:any='';
    loading:Loading;
    total_count:any='';
    flag:any='';
    no_rec:any=false;
    skelton:any={}
    src:any;
    user_data:any={};
    constructor(public navCtrl: NavController,
                public storage: Storage,
                public navParams: NavParams,
                public dbService:DbserviceProvider,
                public loadingCtrl:LoadingController,
                private app:App,
                public offlineService: OfflineDbProvider,
            
                ) {

        this.skelton = new Array(10);
    }
    ionViewWillEnter()
    {
        this.user_data = this.dbService.userStorageData;
        this.filter.user_id = this.user_data.id;
        this.get_favorite_product();
    }

    ionViewDidLoad() {

        console.log('ionViewDidLoad ProductDetailPage');

    }

    goOnProductSubDetailPage(id){
        this.navCtrl.push(ProductSubdetailPage,{'id':id})
    }


    userType:any
    get_favorite_product()
    {
        if(!this.filter.search)
        {
            this.dbService.onShowLoadingHandler();
        }
        this.load_data=''
        this.filter.start = 0;
        var userId = ''

        const loginType = this.dbService.userStorageData.login_type;
        console.log(loginType);
        console.log(this.dbService.userStorageData.loggedInUserType);

        if(loginType=='CMS')
        {
            this.userType='CMS'
        }
        else
        {
            if(this.dbService.userStorageData.loggedInUserType == 'Employee')
            {
                this.userType='Employee'


                    userId = this.dbService.userStorageData.id;

            }
            else
            {
                this.userType='drLogin'
            }
        }

        console.log(this.userType);


        setTimeout(() => {
            if(this.userType=='CMS')
            {
                this.user_data = this.dbService.userStorageData.tokenInfo;
                userId = this.dbService.userStorageData.id;
            }
            else
            {
                if(this.userType!='Employee')
                {
                    this.user_data = this.dbService.userStorageData;
                    userId = this.dbService.userStorageData.id;
                }
            }

            this.filter.user_id = userId
            this.dbService.onPostRequestDataFromApi({'filter':this.filter,userType:this.userType},'dealerData/favorite_product', this.dbService.rootUrlSfa)
            .subscribe( (resp) =>
            {
                this.load_data='1'

                if(!this.filter.search)
                {
                    setTimeout(() => {
                        this.dbService.onDismissLoadingHandler();

                    }, 1000);
                }
                console.log(resp);
                this.prod_list=resp['product_list'];

                console.log(this.prod_list);
            },(error: any) => {
                this.dbService.onDismissLoadingHandler();

            })
        }, 1000);
        ///////


    }

    loadData(infiniteScroll)
    {
        console.log('loading');
        this.filter.start=this.prod_list.length;
        this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'dealerData/favorite_product', this.dbService.rootUrl)
        .subscribe( (r) =>
        {
            console.log(r);
            if(r['product_list']=='')
            {
                this.flag=1;
            }
            else
            {
                setTimeout(()=>{
                    this.prod_list=this.prod_list.concat(r['product_list']);
                    for (let index = (this.prod_list.length - r['product_list'].length); index < this.prod_list.length; index++)
                    {
                    }
                    infiniteScroll.complete();
                },1000);
            }
        });
    }
}
