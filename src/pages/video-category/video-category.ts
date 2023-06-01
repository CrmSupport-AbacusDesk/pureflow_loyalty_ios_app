import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { VideoPage } from '../video/video';

/**
* Generated class for the VideoCategoryPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
  selector: 'page-video-category',
  templateUrl: 'video-category.html',
})
export class VideoCategoryPage {

  noRec:any=false
  categoryData:any=[];

  constructor(public navCtrl: NavController,
              public dbService:DbserviceProvider,
              public navParams: NavParams) {

       this.getCatData();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoCategoryPage');
  }

  getCatData()
  {
        this.dbService.onShowLoadingHandler()
        this.dbService.onPostRequestDataFromApi('','app_master/VideoCatData', this.dbService.rootUrl)
        .subscribe( (r) =>
        {
                this.categoryData = r.categories
                console.log(this.categoryData);
                if(this.categoryData.length==0)
                {
                  this.noRec=true;
                }
                this.dbService.onDismissLoadingHandler();

        },(error: any) => {
              this.dbService.onDismissLoadingHandler();
        })
  }
  goToVideosPage(cat){
        console.log(cat);

        this.navCtrl.push(VideoPage,{cat:cat});
  }
}
