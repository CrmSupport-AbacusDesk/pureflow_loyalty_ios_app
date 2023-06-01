
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, App } from 'ionic-angular';
import { ProductSubdetailPage } from '../product-subdetail/product-subdetail';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';



@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {
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
  imageUrl:any;
  prd_img_url="http://pureflow.abacusdesk.com/dd_api/app/Http/Controllers/Admin/Master/appOfflineUploads/productImage/"

  constructor(public navCtrl: NavController, public navParams: NavParams,public service:DbserviceProvider,public loadingCtrl:LoadingController, private app:App) {
    // this.presentLoading();
    this.skelton = new Array(10);

    this.imageUrl = this.service.newArrival;
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    this.cat_id = this.navParams.get('id');
    this.getProductList(this.cat_id,'');
    
  }
  
  goOnProductSubDetailPage(id){
    this.navCtrl.push(ProductSubdetailPage,{'id':id})
  }
  
  doRefresh(refresher) 
  {
    console.log('Begin async operation', refresher);
    this.flag = '';
    this.getProductList(this.cat_id,''); 
    refresher.complete();
  }
  
  getProductList(id,search)
  {
    console.log(search);
    this.filter.search=search;
    this.filter.limit = 0;
    this.filter.id=id;
    // this.presentLoading();
    this.service.post_rqst({'filter':this.filter},'app_master/productList')
    .subscribe( (r) =>
    {
      console.log(r);
      // this.loading.dismiss();
      this.prod_list=r['products'];
      console.log("==========================");
      
      console.log(this.prod_list)
      console.log("==========================");

if(this.prod_list.length==r.product_count_all){
  this.flag=1;
}
      if(this.prod_list.length == 0)
      {
        this.no_rec = true;
      }
      else
      {
        this.no_rec = false;
      }
      for (let index = 0; index < this.prod_list.length; index++) {

          if(this.prod_list[index]['image'] && this.prod_list[index]['image'].search("base64") == -1){
            // this.imge = this.prod_list[index].image.replace(" ", "%20");
            // console.log(this.imge);
                this.prod_list[index].image = this.imageUrl + this.prod_list[index].image;
          }  else {

              this.getImages(this.prod_list[index]['id'],index)
             
          }
      }
      this.prod_cat=r['category_name'][0];
      this.prod_count=r['product_count']
      this.total_count=r['product_count_all']
      console.log(this.prod_cat);
    },(error: any) => {
      // this.loading.dismiss();
    })
  }


  imge:any;
  getImages(category_id,index)
  {
    console.log(category_id + index)
    this.service.post_rqst({'product_id' : category_id},'app_master/getproductimages').subscribe((res)=>{
      console.log(res);
      // this.flag=1
      if(res['image'].length != 0)
      {
            if(res['image'][0]['image'].search("base64") == -1) {
                  
                 this.imge = res['image'][0]['image'].replace(" ", "%20");
                 console.log(this.imge);
                  // this.prod_list[index].image = res['image'][0]['image'];
                  this.prod_list[index].image = this.imageUrl + this.imge;
                  console.log(this.prod_list);

      
            }  else {

                   this.prod_list[index]['image'] = res['image'][0]['image'];
                   console.log(this.prod_list);
                   
            }
      }
      

     

      // for (let index = 0; index < this.prod_list.length; index++) {
        
      //   if(this.prod_list[index]['image'].search("base64")== -1){
      //     this.prod_list[index].baseimage.push(this.prod_list[index])
      //   }
        
      // }

      console.log(this.prod_list);
      
    })
  }
  loadData(infiniteScroll)
  {
    console.log('loading');
    
    this.filter.limit=this.prod_list.length;
    this.service.post_rqst({'filter' : this.filter},'app_master/productList').subscribe( r =>
      {
        console.log(r);
        if(r['products']=='')
        {
          console.log('hello');
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.prod_list=this.prod_list.concat(r['products']);
            console.log('Asyn operation has stop')
            for (let index =(this.prod_list.length - r['products'].length); index < this.prod_list.length; index++) {
        
                  if(this.prod_list[index]['image'] && this.prod_list[index]['image'].search("base64") == -1) {

                       this.prod_list[index].image = this.imageUrl + this.prod_list[index].image;

                  }  else {

                       this.getImages(this.prod_list[index]['id'],index);
                    
                  }
            }

            infiniteScroll.complete();
          },1000);
        }
      });
    }
    presentLoading() 
    {
      this.loading = this.loadingCtrl.create({
        content: "Please wait...",
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
  