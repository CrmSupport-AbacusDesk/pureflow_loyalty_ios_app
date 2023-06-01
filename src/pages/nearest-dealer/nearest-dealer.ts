import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

@IonicPage()
@Component({
    selector: 'page-nearest-dealer',
    templateUrl: 'nearest-dealer.html',
})
export class NearestDealerPage {

    constructor(public navCtrl: NavController,
                public dbService:DbserviceProvider,
                public navParams: NavParams,
                private launchNavigator: LaunchNavigator) {

           console.log(this.navParams.get('type'));
    }
    search:any={};
    ionViewDidLoad() {
        this.search.pincode = this.navParams.get('pincode')
        this.search.type = this.navParams.get('type')
        console.log(this.search.type);
        this.getNearestDealer(this.search.type);
    }
    dealerData:any=[];
    loadData:any=1;
    getNearestDealer(type)
    {
        this.dbService.onShowLoadingHandler()
        if(!this.search.pincode)
        this.search.pincode = this.navParams.get('pincode')
        this.dbService.onPostRequestDataFromApi({'pincode':this.search.pincode,type:type},'app_karigar/nearestDealer', this.dbService.rootUrl)
        .subscribe((r:any)=>
        {
            this.dbService.onDismissLoadingHandler();
            console.log(r);
            this.dealerData = r['dealerData']
            this.loadData = 0;

        },err=>
        {
            this.dbService.onDismissLoadingHandler();

        });
    }
    getNearestDealerSearch(type)
    {
        if(!this.search.pincode)
        this.search.pincode = this.navParams.get('pincode')
        this.dbService.onPostRequestDataFromApi({'pincode':this.search.pincode,type:type},'app_karigar/nearestDealer', this.dbService.rootUrl
        )
        .subscribe((r:any)=>
        {
            console.log(r);
            this.dealerData = r['dealerData']
            this.loadData=0

        },err=>
        {

        });
    }

    show_loc(data)
    {
        let options: LaunchNavigatorOptions = {
            app: this.launchNavigator.APP.GOOGLE_MAPS
        }
        if(data.lat && data.lng)
        {
            this.launchNavigator.navigate([data.lat,data.lng], options)
            .then(success => console.log('Launched navigator'),
            error => console.log('Error launching navigator', error)
            );
        }
        else
        {
            this.dbService.presentToast("No Location Found");
        }
    }

}
