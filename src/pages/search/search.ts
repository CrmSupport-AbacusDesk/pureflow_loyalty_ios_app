import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
* Generated class for the SearchPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  data:any=[];
  brandlist:any=[];

  request =false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService: DbserviceProvider,
              public loadingCtrl: LoadingController
    ) {


    }


    dataChanged = function(newObj){
      console.log(newObj.length);
      if(newObj.length == 0) {
        this.data = [];
        console.log(this.data);
      }else if(newObj.length > 0){
        console.log(newObj);
        this.request=true;

          setTimeout(()=>{
              this.dbService.onPostRequestDataFromApi(newObj, 'search/search_alldata', this.dbService.server_url).then((response:any)=>{
                    console.log(response);
                    this.data = response;
                    this.request=false;
              });
          },500);
      }
    }

    getCategory() {
      // this.navCtrl.push(CatalougePage);

    }

    goToProductDetailPage(id) {
      // this.navCtrl.push(ProductDetailsPage,{p_id:id});
    }

    getsubCategory(){
      // this.navCtrl.push(SubcategoryPage);
    }


    getBrand(){
      // this.navCtrl.push(BrandPage);
    }


    ionViewDidLoad() {
      console.log('ionViewDidLoad SearchPage');
    }



  }
