import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';

/**
 * Generated class for the Super30Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-super30',
  templateUrl: 'super30.html',
})
export class Super30Page {

  plumber_list:any=[];
  loading:Loading;
  filter:any={}
  SelfData:any={}
 test:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService:DbserviceProvider,
              public loadingCtrl:LoadingController) {

    this.getList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Super30Page');
    this.presentLoading();
    this.getList();

  }

  presentLoading()
  {
    this.loading = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  doRefresh(refresher)
  {
    console.log('Begin async operation', refresher);
    this.getList();
    refresher.complete();
  }
 
  getList()
  {
    this.filter.limit = 0;
    this.dbService.onPostRequestDataFromApi( {'filter':this.filter},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe(response =>
      {
        console.log(response);
        this.loading.dismiss();
        this.plumber_list = response['karigars'];
        console.log(this.plumber_list);
        var index = response['karigarData'].findIndex(row=>row.id==this.dbService.userStorageData.id);
        console.log(index);
        if(index!=-1)
        {
          this.SelfData.id = response['karigarData'][index].id;
          this.SelfData.index  = index+1
        }
        console.log(response['karigarData'][index]);

        // this.SelfData = '';
        // this.showSuccess("Profile Photo Updated")
      });
  }

  flag:any='';


  loadData(infiniteScroll)
  {
    console.log('loading');

    this.filter.limit=this.plumber_list.length;
    this.dbService.onPostRequestDataFromApi({'filter' : this.filter},'app_karigar/getSuperPlumberList', this.dbService.rootUrl).subscribe( r =>
      {
        console.log(r);
        if(r['karigars']=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.plumber_list=this.plumber_list.concat(r['karigars']);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }

}
