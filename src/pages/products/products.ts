import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductDetailPage } from '../product-detail/product-detail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  name:any='';
  skelton:any={}
  imageUrl:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App ) {
    this.imageUrl = this.service.image_url;
    this.skelton = new Array(10);

  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.filter.name  = this.navParams.get('name');
  }
  ionViewWillEnter()
  {
    this.getProductCategoryList();
    this.presentLoading();
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getProductCategoryList(); 
    refresher.complete();
  }
  
  goOnProductDetailPage(id){
    this.navCtrl.push(ProductDetailPage,{'id':id})
  }
  getProductCategoryList()
  {
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/categoryList')
    .subscribe((r)=>
    {
      // this.loading.dismiss();
      this.prod_cat_list=r['categories'];
      if(this.prod_cat_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      // for (let index = 0; index < this.prod_cat_list.length; index++) {
        
      //   this.getImages(this.prod_cat_list[index]['id'],index)

        
      // }
      // if(this.prod_cat_list.length == 1)
      // {
      //   console.log('list length is one');
      //   console.log(this.prod_cat_list[0].id);
      //   this.goOnProductDetailPage(this.prod_cat_list[0].id)
      // }
    },(error: any) => {
      // this.loading.dismiss();
    })
  }
  // getImages(category_id,index)
  // {
  //   this.service.post_rqst({'category_id' : category_id},'app_master/getSubCatImages').subscribe((res)=>
  //   {
      
  //     this.prod_cat_list[index]['image']=res['image'];
  //   })
  // }
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.prod_cat_list.length;
    this.service.post_rqst({'filter' : this.filter},'app_master/categoryList')
    .subscribe( r =>
      {
        console.log(r);
        if(r['categories']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.prod_cat_list=this.prod_cat_list.concat(r['categories']);
            console.log(this.prod_cat_list.length +' '+ r['categories'].length)
            for (let index =(this.prod_cat_list.length - r['categories'].length); index < this.prod_cat_list.length; index++) {
              console.log(index)
              // this.getImages(this.prod_cat_list[index]['id'],index)
      
              
            }
            infiniteScroll.complete();
          },1000);
        }
      });
    }
    presentLoading() 
    {
      // this.loading = this.loadingCtrl.create({
      //   content: "Please wait...",
      //   dismissOnPageChange: false
      // });
      // this.loading.present();
    }
    ionViewDidLeave()
    {
      let nav = this.app.getActiveNav();
      if(nav && nav.getActive()) 
      {
        let activeView = nav.getActive().name;
        let previuosView = '';
        if(nav.getPrevious() && nav.getPrevious().name)
        {
          previuosView = nav.getPrevious().name;
        }  
        console.log(previuosView); 
        console.log(activeView);  
        console.log('its leaving');
        if((activeView == 'HomePage' || activeView == 'GiftListPage' || activeView == 'TransactionPage' || activeView == 'ProfilePage' ||activeView =='MainHomePage') && (previuosView != 'HomePage' && previuosView != 'GiftListPage'  && previuosView != 'TransactionPage' && previuosView != 'ProfilePage' && previuosView != 'MainHomePage')) 
        {
          console.log(previuosView);
          this.navCtrl.popToRoot();
        }
      }
    }
  }
  