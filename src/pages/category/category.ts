import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductsPage } from '../products/products';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { errorHandler } from '@angular/platform-browser/src/browser';
import { ProductDetailPage } from '../product-detail/product-detail';
import { NewarrivalsPage } from '../newarrivals/newarrivals';

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  prod_cat_list:any=[];
  filter :any = {};
  flag:any='';
  loading:Loading;
  cat_images:any=[];
  category_count:any='';
  no_rec:any=false;
  skelton:any={}
  prd_img_url:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController,private app:App) {
    this.skelton = new Array(10);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.presentLoading();
    this.prd_img_url = this.service.category 
  }
  ionViewWillEnter()
  {
    this.getProductCategoryList('');
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.getProductCategoryList('');
    this.flag='';
    refresher.complete();
  }
  goToNewArrivals()
  {
    console.log('newArrivals')
    this.navCtrl.push(NewarrivalsPage);
  }
  goOnCategoryListPage(name){
    this.presentLoading2();
    this.filter.limit = 0;
    this.filter.name = name;
    this.service.post_rqst({'filter' : this.filter},'app_master/checkCategoryLength')
    .subscribe((r)=>
    {
      console.log(r);
      this.loading.dismiss();
      if(r['categories'].length == 1)
      {
        console.log('list length is one');
        this.navCtrl.push(ProductDetailPage,{'id':r['categories'][0].id})
    
      }
      else{
        console.log('list length is two');

        this.navCtrl.push(ProductsPage,{'name':name})
      }
    },(error: any) => {
      this.loading.dismiss();
    })

  }
  getProductCategoryList(search)
  {
    console.log('catagorylist');
    this.filter.search=search;
    this.filter.limit = 0;
    this.service.post_rqst({'filter' : this.filter},'app_master/parentCategory_List')
    .subscribe((r) =>
    {
      // this.loading.dismiss();
      console.log(r);
      this.prod_cat_list=r['categories'];
      if(this.prod_cat_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      for (let index = 0; index < this.prod_cat_list.length; index++) {
       console.log(this.prod_cat_list[index])
        this.getCategoryImages(this.prod_cat_list[index]['main_category'],index)
      }
    },(error: any) => {
      // this.loading.dismiss();
    }
    );
    
  }

  
  getCategoryImages(categoryId,index)
  {
    console.log(categoryId)
  //  this.prod_cat_list[index]['image'] = 'http://gravity.abacusdesk.com/dd_api/app/uploads/newarrival.jpg';
  this.service.post_rqst({'categoryid':categoryId},'app_master/getcategoryImage').subscribe((res)=>
  {
    console.log(res)
    // console.log(res['categories'][0]['image'])
    this.prod_cat_list[index]['image'] = res['categories'][0]['image']
  })
  }
  
  loadData(categoryId,index,infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.prod_cat_list.length;
    this.service.post_rqst({'categoryid':categoryId},'app_master/parentCategoryList').subscribe( r =>
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
            console.log('Asyn operation has stop')
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
    presentLoading2() 
    {
      this.loading = this.loadingCtrl.create({
        content: "",
        dismissOnPageChange: false
      });
      this.loading.present();
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
  