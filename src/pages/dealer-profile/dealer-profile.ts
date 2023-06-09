import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, ActionSheetController, ModalController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { DbserviceProvider } from '../../providers/dbservice/dbservice';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewProfilePage } from '../view-profile/view-profile';
import { PointLocationPage } from '../point-location/point-location';

/**
* Generated class for the DealerProfilePage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/

@IonicPage()
@Component({
    selector: 'page-dealer-profile',
    templateUrl: 'dealer-profile.html',
})
export class DealerProfilePage {

    user_data:any={};
    type:any="";
    edit:Boolean = false;
    data:any={};
    karigar_id: any;
    state_list: any;
    district_list: any;
    // locationAccuracy: any;

    constructor(public navCtrl: NavController,
                public events: Events,
                public locationAccuracy: LocationAccuracy,
                public geolocation: Geolocation,
                public navParams: NavParams,
                public session:Storage,
                public dbService:DbserviceProvider,
                public toastCtrl:ToastController,
                public actionSheetController: ActionSheetController,
                private camera: Camera,
                public alertCtrl:AlertController,
                public modalCtrl: ModalController,
                public sanitizer: DomSanitizer) {

        this.user_data = this.dbService.userStorageData.all_data;
        this.get_details();
        if(this.user_data.type == "1")
        {
            this.type = "Distributor";
        }

        if(this.user_data.type == "3")
        {
            this.type = "Dealer";
        }

        if(this.user_data.type == "7")
        {
            this.type = "Direct Dealer";
        }
        console.log(this.user_data);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad DealerProfilePage');
    }

    get_details()
    {
        this.dbService.onShowLoadingHandler();
        this.dbService.onPostRequestDataFromApi({"dr_id":this.user_data.id},"dealerData/getdetails", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            this.data = resp;

            console.log(this.data.state);
            this.dbService.onDismissLoadingHandler();
            this.getstatelist();
            this.getDistrictList(this.data.state);
        },err=>
        {
            this.dbService.onDismissLoadingHandler();

        });

    }
    check_location()
    {
        this.navCtrl.push(PointLocationPage,{'lat':this.data.lat,'log':this.data.lng,mode:'Dealer'});
        // let alert=this.alertCtrl.create({
        //     title:'Are You Sure?',
        //     subTitle: 'You Want To Point Your Current Location ?',
        //     cssClass:'action-close',

        //     buttons: [{
        //         text: 'Cancel',
        //         role: 'cancel',
        //         handler: () => {
        //             this.db.presentToast('Action Cancelled')
        //         }
        //     },
        //     {
        //         text:'Confirm',
        //         cssClass: 'close-action-sheet',
        //         handler:()=>
        //         {
        //             this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        //             .then(() => {
        //                 let options = {
        //                     maximumAge: 10000, timeout: 15000, enableHighAccuracy: true
        //                 };
        //                 this.geolocation.getCurrentPosition(options)
        //                 .then((resp) => {
        //                     var lat = resp.coords.latitude
        //                     var lng = resp.coords.longitude
        //                     this.db.addData({user_data:this.dbService.userStorageData,"lat":lat,"lng":lng},"dealerData/add_location")
        //                     .then(resp=>{
        //                         console.log(resp);

        //                     })
        //                 },
        //                 error => {
        //                     console.log('Error requesting location permissions', error);
        //                     let toast = this.toastCtrl.create({
        //                         message: 'Allow Location Permissions',
        //                         duration: 3000,
        //                         position: 'bottom'
        //                     });
        //                     toast.present();
        //                 });
        //             });
        //         }
        //     }]
        // });
        // alert.present();
    }
    editProfilePage()
    {
        this.navCtrl.push(EditProfilePage,{'detail':this.data});
    }


    getstatelist()
    {
        this.dbService.onGetRequestDataFromApi('app_master/getStates', this.dbService.rootUrl)
        .subscribe( (r) =>
        {
            console.log(r);
            this.state_list=r['states'];
            this.karigar_id=r['id'];
            console.log(this.state_list);
        });
    }

    getDistrictList(state_name)
    {
        console.log(state_name);
        this.dbService.onPostRequestDataFromApi({'state_name':state_name},'app_master/getDistrict', this.dbService.rootUrlSfa)
        .subscribe((r) =>
        {
            console.log(r);
            this.district_list=r['districts'];
            console.log(this.state_list);
        });
    }

    submit()
    {
        console.log(this.data);
        this.dbService.onPostRequestDataFromApi({"data":this.data},"dealerData/update_dealer", this.dbService.rootUrlSfa)
        .subscribe(resp=>{
            console.log(resp);
            if(resp)
            {
                this.dbService.presentToast("Success !");
                this.edit=false
                this.get_details()


                console.log(this.data.company_name);

                this.events.publish('dealerProfileUpdated',this.data.company_name)
                // this.navCtrl.push(DealerProfilePage);
            }
        })
    }

    MobileNumber(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    openeditprofile()
    {
        let actionsheet = this.actionSheetController.create({
            title:"Profile photo",
            cssClass: 'cs-actionsheet',

            buttons:[{
                cssClass: 'sheet-m',
                text: 'Camera',
                icon:'camera',
                handler: () => {
                    console.log("Camera Clicked");
                    this.takePhoto();
                }
            },
            {
                cssClass: 'sheet-m1',
                text: 'Gallery',
                icon:'image',
                handler: () => {
                    console.log("Gallery Clicked");
                    this.getImage();
                }
            },
            {
                cssClass: 'cs-cancel',
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    console.log('Cancel clicked');
                }
            }
        ]
    });
    actionsheet.present();
}
takePhoto()
{
    console.log("i am in camera function");
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth : 500,
        targetHeight : 400
    }

    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.user_data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.user_data.profile);
        if(this.user_data.profile)
        {
            this.uploadImage(this.user_data.profile);
        }
    }, (err) => {
    });
}
getImage()
{
    const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum:false
    }
    console.log(options);
    this.camera.getPicture(options).then((imageData) => {
        this.user_data.profile = 'data:image/jpeg;base64,' + imageData;
        console.log(this.user_data.profile);
        if(this.user_data.profile)
        {
            this.uploadImage(this.user_data.profile);
        }
    }, (err) => {
    });
}
uploadImage(profile)
{
    console.log(profile);
    // this.db.show_loading()
    this.dbService.onPostRequestDataFromApi( {'dr_id': this.user_data.id,'profile':profile },'dealerData/updateProfilePic', this.dbService.rootUrlSfa).subscribe(r =>
        {
            console.log(r);
            this.dbService.presentToast("Profile Photo Updated");
            this.get_details()
            // this.db.dismiss()
        },
        err=>
        {
            // this.db.dismiss()
            this.dbService.errToasr();
        });

    }

    viewProfiePic()
    {
        this.modalCtrl.create(ViewProfilePage, {"Image": "http://app.gravitybath.com/uploads/"+this.data.image}).present();
    }

}
