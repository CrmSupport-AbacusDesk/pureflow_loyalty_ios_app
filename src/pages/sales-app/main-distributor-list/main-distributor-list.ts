import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LeadsDetailPage } from '../../leads-detail/leads-detail';
import { DbserviceProvider } from '../../../providers/dbservice/dbservice';

@IonicPage()
@Component({
  selector: 'page-main-distributor-list',
  templateUrl: 'main-distributor-list.html',
})
export class MainDistributorListPage {

  user_right:any=[];
  DrType:any;

  distributor_list:any = [];
  load_data:any = "0";
  limit=0;
  flag:any='';
  search:any;

  distributor_details:any = [];
  distributor_checkin:any = [];
  distributor_order:any=[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dbService: DbserviceProvider,
              public loadingCtrl: LoadingController) {

        console.log(this.navParams.get('type'));
        this.DrType = this.navParams.get('type')
        this.get_distributor_list();
  }


  get_distributor_list()
  {
    console.log(this.DrType);
    this.dbService.onShowLoadingHandler()
    this.dbService.onPostRequestDataFromApi({'limit':this.limit,'company_name':this.search,type:this.DrType},'Distributor/distributor_lists', this.dbService.rootUrlSfa).subscribe((result)=>{
      console.log(result);
      this.distributor_list = result;

      if(this.distributor_list.length == 0)
      {
        this.load_data = "1";
      }
      this.dbService.onDismissLoadingHandler();
    },
    er=>
    {
      this.dbService.onDismissLoadingHandler()
      this.dbService.errToasr()
    });
  }


  loadData(infiniteScroll)
  {
    console.log('loading');

    this.dbService.onPostRequestDataFromApi({'limit':this.distributor_list.length,type:this.DrType},'Distributor/distributor_lists', this.dbService.rootUrlSfa).subscribe( result=>
      {
        console.log(result);
        if(result=='')
        {
          this.flag=1;
        }
        else
        {
          setTimeout(()=>{
            this.distributor_list=this.distributor_list.concat(result);
            console.log('Asyn operation has stop')
            infiniteScroll.complete();
          },1000);
        }
      });
    }



    distributor_detail(dr_id)
    {
      this.navCtrl.push(LeadsDetailPage,{'dr_id':dr_id,'type':'Dr'})
    }

  doRefresh (refresher)
  {
    this.search={}
    this.limit=0

      this.get_distributor_list()
      setTimeout(() => {
          refresher.complete();
      }, 1000);
  }

  }
