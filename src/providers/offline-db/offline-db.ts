import { HttpClient } from '@angular/common/http';
import { Injectable, ApplicationRef } from '@angular/core';
import { DbserviceProvider } from '../dbservice/dbservice';
import { SQLiteObject } from '@ionic-native/sqlite';


import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AlertController, LoadingController, Loading, Events } from 'ionic-angular';
import { Observable, Subject } from 'rxjs';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';
var downloadProgress;

/*
Generated class for the OfflineDbProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/
@Injectable()
export class OfflineDbProvider {

      loading: Loading;
      updatedModuleCount: any = 0;
      localDBCallingCount = 0;
      localDBTblUpdatedCount = 0;

      onProductSelectedImage: any;

      shouldStartSetUpProcess: any = false;
      totalImages:any=0
      downloadedImages:any=0

      offlineDBLastInfo: any = {};

      totalSuccessDownloadImages: any = 0;
      totalFailedDownloadImages: any = 0;

      zipDownloadProgress: any = 0;
      extractImageProgress: any = 0;
      imagesDownloadProgress: any = 0;

      finalResultData: any = {};

      private _DB 	: SQLiteObject;

      private _SQL_URI : string = encodeURI(this.dbService.rootUrlSfa + 'Cron/onGetUpdatedProductDataForOfflineInstallation');

      public dataImported : boolean 	= false;

      constructor(public http: HttpClient,
            public dbService:DbserviceProvider,
        
            public fileTransfer: FileTransfer,
            public file: File,
            public loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            public storage:Storage,
     
            public ref: ApplicationRef,
            public events:Events) {


                  console.log('Hello OfflineDbProvider Provider');
            }

            importSQLFile() : void {

                  this.http.get(this._SQL_URI, {responseType: 'text'}).subscribe((sqlData) => {

                          console.log(sqlData);

                        //   this._PORTER.importSqlToDb(this._DB, sqlData)
                        //   .then((data) => {

                        //         console.log(data);

                        //         this.dataImported = true;

                        //         this.importProductImages();

                        //         console.log(this._DB);

                        //   }).catch((e) => {

                        //        console.log(e);

                        //   });


                  }, (error) => {

                         console.dir(error);
                  });
            }

            public importProductImages() {

                      this.totalImages = 1;
                      console.log('Total Images Required ' + this.totalImages);

                      const zipFileName = 'imageCatalogue.zip';

                      const fileTransfer: FileTransferObject = this.fileTransfer.create();

                      const imageSourceDirectory = 'app/Http/Controllers/Admin/Master/appOfflineUploads/';
                      var url = this.dbService.rootUrl + imageSourceDirectory + zipFileName;

                      fileTransfer.download(url, this.file.dataDirectory + zipFileName).then((entry) => {

                            console.log('download complete: ' + entry.toURL());

                        //     this.zip.unzip(entry.toURL(), this.file.dataDirectory, (progress) => {

                        //           console.log('Unzipping, ' + Math.round((progress.loaded / progress.total) * 100) + '%');
                        //           this.extractImageProgress = Math.round((progress.loaded / progress.total) * 100);

                        //           this.imagesDownloadProgress = (this.zipDownloadProgress ? (this.zipDownloadProgress/2) : 0) + (this.extractImageProgress ? this.extractImageProgress/2 : 0);

                        //           console.log('imageDownloadProgress ' + this.imagesDownloadProgress);

                        //           this.ref.tick();

                        //     }).then((result) => {

                        //           if(result === 0) console.log('SUCCESS');

                        //           this.downloadedImages++;
                        //           this.totalSuccessDownloadImages++;

                        //           console.log('Total Images Required ' + this.totalImages);
                        //           console.log('Total Images Downloaded ' + this.downloadedImages);
                        //           console.log('totalSuccessImageDownloaded ' + this.totalSuccessDownloadImages);
                        //           console.log('totalFailedImageDownloaded ' + this.totalFailedDownloadImages);

                        //           console.log('Download Completed 1111');
                        //           this.shouldStartSetUpProcess = false;

                        //           const lastUpdatedTime = moment().format('YYYY-MM-DD HH:mm:ss');
                        //           console.log('lastUpdatedTime ' + lastUpdatedTime);

                        //           this.storage.set('offlineDBLastInfo', {isSetUpCompleted: 1, lastUpdatedTime: lastUpdatedTime});

                        //           this.events.publish('getCountProducts', true);

                        //           if(result === -1) console.log('FAILED');
                        //     });

                      }, er => {

                            console.log(er);

                            this.downloadedImages++;
                            this.totalFailedDownloadImages++;

                            console.log('Total Images Required ' + this.totalImages);
                            console.log('Total Images Downloaded ' + this.downloadedImages);
                            console.log('totalSuccessImageDownloaded ' + this.totalSuccessDownloadImages);
                            console.log('totalFailedImageDownloaded ' + this.totalFailedDownloadImages);

                            console.log('download error');

                            if(this.totalImages == this.downloadedImages) {

                                  this.shouldStartSetUpProcess = false;
                            }
                      })

                      fileTransfer.onProgress((progress) => {


                                this.zipDownloadProgress = (progress.loaded/progress.total) * 100;
                                console.log('Zip Download Progress ' + this.zipDownloadProgress);

                                this.imagesDownloadProgress = (this.zipDownloadProgress ? (this.zipDownloadProgress/2) : 0) + (this.extractImageProgress ? this.extractImageProgress/2 : 0);

                                console.log(this.imagesDownloadProgress);
                                this.ref.tick();

                      });
            }


            public onReturnLocalDBHandler(): Observable<any> {

                  const requestData = new Subject< any >();

                  // this.sqlite.create({
                  //       name: 'gravityDataStore999.db',
                  //       location: 'default'
                  // }).then((db: SQLiteObject) => {

                  //         this._DB = db;

                  //         console.log(this._DB);
                  //         requestData.next(db);

                  // })

                  return requestData.asObservable();
            }


            public onValidateLocalDBSetUpTypeHandler() {

	              this.onReturnLocalDBHandler().subscribe((db) => {

                          console.log(db);

                          let userLocalDBSetUpMsg = '';
                          if(this.offlineDBLastInfo && this.offlineDBLastInfo.isSetUpCompleted === 1) {

                                 this.onInitializeLocalDBUpdationHandler(db);

                          } 
                        //   else {

                        //         this.shouldStartSetUpProcess = true;

                        //         this.storage.set('offlineDBLastInfo', {});

                        //         userLocalDBSetUpMsg = 'Account SetUp Required, It will take little time!';

                        //         let alert = this.alertCtrl.create({
                        //             title: 'Confirmation',
                        //             message: userLocalDBSetUpMsg,
                        //             buttons: [
                        //             {
                        //               text: 'Ok',
                        //                 handler: () => {

                        //                     setTimeout(() => {

                        //                          this.importSQLFile();

                        //                     }, 100);
                        //                 }
                        //             }]
                        //         });

                        //         alert.present();
                        //   }
                    })
            }


            public onInitializeLocalDBUpdationHandler(db) {

                  console.log('start');

                  const localDBLastUpdatedTime = this.offlineDBLastInfo.lastUpdatedTime ? this.offlineDBLastInfo.lastUpdatedTime : '';

                  console.log(localDBLastUpdatedTime);
                  this.onUpdateCategoryIntoLocalDBHandler(db, localDBLastUpdatedTime);
                  this.onUpdateLocalDBProductHandler(db, localDBLastUpdatedTime);
            }

            public onUpdateCategoryIntoLocalDBHandler(db, localDBLastUpdatedTime) {

                  const filterData = {};
                  filterData['lastUpdatedTime'] = localDBLastUpdatedTime;

                  this.dbService.onPostRequestDataFromApi({'filter' : filterData},'app_offline_master/parentCategory_List', this.dbService.rootUrl).subscribe((serverResult) => {

                        console.log('Category List');
                        console.log(serverResult);
                        this.onCompareCategoryLocalDBWithServerDataHandler(db, serverResult);
                        this.onCompareCategoryImagesLocalDBWithServerDataHandler(db, serverResult);

                  },(error: any) => {

                        console.log(error);
                  });
            }

            public onUpdateLocalDBProductHandler(db, currentUpdatedTime) {

                  const filterData = {};
                  filterData['lastUpdatedTime'] = currentUpdatedTime;

                  this.dbService.onPostRequestDataFromApi({'filter' : filterData},'app_offline_master/onGetProductListHandler', this.dbService.rootUrl).subscribe((serverResult) => {

                        console.log('Product List');
                        console.log(serverResult);

                        this.onCompareLocalDBProductDataWithServerDataHandler(db, serverResult);
                        this.onCompareLocalDBProductImageWithServerDataHandler(db, serverResult);

                  },(error: any) => {

                        console.log(error);
                  });
            }

            public onCompareCategoryLocalDBWithServerDataHandler(db, serverResult) {

                  serverResult.categories.forEach(serverResultRow => {

                        db.executeSql('SELECT * FROM master_category WHERE id = ?', [serverResultRow.id]).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              if(sqliteFetchResult.rows.length > 0) {

                                    db.executeSql('UPDATE master_category SET date_created=?, main_category=?, category_name=?,actual_image_name=?,status=?,last_updated=?,del=? WHERE id=?', [

                                          serverResultRow.date_created,
                                          serverResultRow.main_category,
                                          serverResultRow.category_name,
                                          serverResultRow.actual_image_name,
                                          serverResultRow.status,
                                          serverResultRow.last_updated,
                                          serverResultRow.del,
                                          serverResultRow.id
                                    ]);

                              } else {

                                    db.executeSql('INSERT INTO master_category VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[

                                          serverResultRow.id,
                                          serverResultRow.date_created,
                                          serverResultRow.created_by,
                                          serverResultRow.main_category,
                                          serverResultRow.category_name,
                                          '',
                                          serverResultRow.actual_image_name,
                                          serverResultRow.is_image_exist_app_package,
                                          '',
                                          serverResultRow.status,
                                          serverResultRow.main_category_order,
                                          serverResultRow.sub_category_order,
                                          serverResultRow.picture_reference,
                                          serverResultRow.last_updated,
                                          serverResultRow.del,
                                    ]);
                              }

                              if(serverResultRow.del == 0) {

                                    this.onDownloadImageFileForLocalDBHandler('mainCategoryImage', serverResultRow.actual_image_name,serverResult.lastUpdatedTime,db);

                              }

                        });
                  });
            }

            public onCompareCategoryImagesLocalDBWithServerDataHandler(db, serverResult) {

                  serverResult.masterCategoryImageList.forEach(serverResultRow => {

                        db.executeSql('SELECT * FROM master_category_images WHERE id = ?', [serverResultRow.id]).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              if(sqliteFetchResult.rows.length > 0) {

                                    db.executeSql('UPDATE master_category_images SET date_created=?, category_id=?, actual_image_name=?,last_updated=?,profile=?,del=? WHERE id=?', [

                                          serverResultRow.date_created,
                                          serverResultRow.category_id,
                                          serverResultRow.actual_image_name,
                                          serverResultRow.last_updated,
                                          serverResultRow.profile,
                                          serverResultRow.del,
                                          serverResultRow.id
                                    ]);

                              } else {

                                    db.executeSql('INSERT INTO master_category_images VALUES(?,?,?,?,?,?,?,?,?,?,?)',[

                                          serverResultRow.id,
                                          serverResultRow.date_created,
                                          serverResultRow.created_by,
                                          serverResultRow.category_id,
                                          '',
                                          serverResultRow.actual_image_name,
                                          serverResultRow.is_image_exist_app_package,
                                          serverResultRow.profile,
                                          serverResultRow.last_updated,
                                          serverResultRow.del,
                                          serverResultRow.cat_img_seq,
                                    ]);
                              }

                              if(serverResultRow.del == 0) {

                                  this.onDownloadImageFileForLocalDBHandler('categoryImage', serverResultRow.actual_image_name,serverResult.lastUpdatedTime,db);

                              }

                        });
                  });
            }

            public onCompareLocalDBProductDataWithServerDataHandler(db, serverResult) {

                  console.log(serverResult.productList);

                  serverResult.productList.forEach(serverResultRow => {

                        db.executeSql('SELECT * FROM master_product WHERE id = ?', [serverResultRow.id]).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              if(sqliteFetchResult.rows.length > 0) {

                                    db.executeSql('UPDATE master_product SET date_created=?, master_category_id=?,brand=?,product_name=?,material_code=?,pcs_set=?,desc=?,video_link=?,price=?,std_packing=?,cartoon_packing=?,cn_net_price=?,dd_net_price=?,master_packing=?,pcs=?,status=?,deactive_date=?,reason=?,deactive_by=?,latest=?,hsn=?,new_arrival=?,last_updated=?,del=? WHERE id=?', [

                                          serverResultRow.date_created,
                                          serverResultRow.master_category_id,
                                          serverResultRow.brand,
                                          serverResultRow.product_name,
                                          serverResultRow.material_code,
                                          serverResultRow.pcs_set,
                                          serverResultRow.desc,
                                          serverResultRow.video_link,
                                          serverResultRow.price,
                                          serverResultRow.std_packing,
                                          serverResultRow.cartoon_packing,
                                          serverResultRow.cn_net_price,
                                          serverResultRow.dd_net_price,
                                          serverResultRow.master_packing,
                                          serverResultRow.pcs,
                                          serverResultRow.status,
                                          serverResultRow.deactive_date,
                                          serverResultRow.reason,
                                          serverResultRow.deactive_by,
                                          serverResultRow.latest,
                                          serverResultRow.hsn,
                                          serverResultRow.new_arrival,
                                          serverResultRow.last_updated,
                                          serverResultRow.del,
                                          serverResultRow.id
                                    ]);

                              } else {

                                    db.executeSql('INSERT INTO master_product VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[

                                          serverResultRow.id,
                                          serverResultRow.date_created,
                                          serverResultRow.created_by,
                                          serverResultRow.master_category_id,
                                          serverResultRow.brand,
                                          serverResultRow.product_name,
                                          serverResultRow.material_code,
                                          serverResultRow.pcs_set,
                                          serverResultRow.desc,
                                          serverResultRow.video_link,
                                          '',
                                          serverResultRow.price,
                                          serverResultRow.std_packing,
                                          serverResultRow.cartoon_packing,
                                          serverResultRow.cn_net_price,
                                          serverResultRow.dd_net_price,
                                          serverResultRow.master_packing,
                                          serverResultRow.pcs,
                                          serverResultRow.status,
                                          serverResultRow.deactive_date,
                                          serverResultRow.reason,
                                          serverResultRow.deactive_by,
                                          serverResultRow.latest,
                                          '',
                                          serverResultRow.hsn,
                                          serverResultRow.new_arrival,
                                          serverResultRow.last_updated,
                                          serverResultRow.del
                                    ]);
                              }

                              console.log('serverResult.categories ' + serverResult.productList.length);

                        });
                  });

            }

            public onCompareLocalDBProductImageWithServerDataHandler(db, serverResult) {

                  this.totalImages = serverResult.productImageListCount;

                  this.storage.set('offlineDBLastInfo', {isSetUpCompleted: 1, lastUpdatedTime: serverResult.lastUpdatedTime});

                  serverResult.productImageList.forEach(serverResultRow => {

                        db.executeSql('SELECT * FROM master_product_images WHERE id = ?', [serverResultRow.id]).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              if(sqliteFetchResult.rows.length > 0) {

                                    db.executeSql('UPDATE master_product_images SET date_created=?, product_id=?, actual_image_name=?,profile=?,last_updated=?,del=? WHERE id=?', [

                                          serverResultRow.date_created,
                                          serverResultRow.product_id,
                                          serverResultRow.actual_image_name,
                                          serverResultRow.profile,
                                          serverResultRow.last_updated,
                                          serverResultRow.del,
                                          serverResultRow.id
                                    ]);

                              } else {

                                    db.executeSql('INSERT INTO master_product_images VALUES(?,?,?,?,?,?,?,?,?,?)',[

                                          serverResultRow.id,
                                          serverResultRow.date_created,
                                          serverResultRow.created_by,
                                          serverResultRow.product_id,
                                          '',
                                          serverResultRow.actual_image_name,
                                          serverResultRow.is_image_exist_app_package,
                                          serverResultRow.profile,
                                          serverResultRow.last_updated,
                                          serverResultRow.del
                                    ]);
                              }

                              if(serverResultRow.del == 0) {

                                   this.onDownloadImageFileForLocalDBHandler('productImage', serverResultRow.actual_image_name,serverResult.lastUpdatedTime,db);

                              }
                        });
                  });

            }


            public onDownloadImageFileForLocalDBHandler(type, imageName,lastUpdatedTime,db) {

                  let imageSourceDirectory, downloadDestinationDirectory = '';
                  // if(type == 'mainCategoryImage') {

                  //       imageSourceDirectory = 'app/Http/Controllers/Admin/Master/appOfflineUploads/mainCategoryImage/';

                  //       downloadDestinationDirectory = 'download/mainCategoryImage/';

                  // } else if(type == 'categoryImage') {

                  //       imageSourceDirectory = 'app/Http/Controllers/Admin/Master/appOfflineUploads/categoryImage/';

                  //       downloadDestinationDirectory = 'download/categoryImage/';

                  // } else if(type == 'productImage') {

                  //       imageSourceDirectory = 'app/Http/Controllers/Admin/Master/appOfflineUploads/productImage/';

                  //       downloadDestinationDirectory = 'download/productImage/';
                  // }



                  const fileTransfer: FileTransferObject = this.fileTransfer.create();
                  console.log(this.file.dataDirectory);

                  downloadDestinationDirectory = 'imageCatalogue/';

                  const sourceURL = this.dbService.rootUrl + 'app/Http/Controllers/Admin/Master/appOfflineUploads/' + downloadDestinationDirectory + imageName;

                  const downloadURL = this.file.dataDirectory + downloadDestinationDirectory + imageName;

                  fileTransfer.download(sourceURL, downloadURL).then((entry) => {

                        console.log('download complete: ' + entry.toURL());

                        if(type == 'productImage') {

                              this.downloadedImages++
                        }

                        if(this.totalImages==this.downloadedImages) {

                              console.log('Download Completed 1111');
                              this.shouldStartSetUpProcess = false;
                        }

                  },er=>
                  {
                        console.log(er);
                        if(type == 'productImage')
                        {
                              this.downloadedImages++
                        }

                        console.log('download error');

                        if(this.totalImages==this.downloadedImages) {

                              console.log('Download Completed 22222');
                              this.shouldStartSetUpProcess = false;
                        }
                  })
            }


            public onReturnImagePathHandler(type, imageName, recordId) : Observable<any> {

                  const requestData = new Subject< any >();

                  const resultData = Array();
                  let imagePath = '';


                  const imagePathArr = [];
                  if(type == 'mainCategoryImage') {

                        // const downloadDestinationDirectory = 'download/mainCategoryImage/';
                        const downloadDestinationDirectory = 'imageCatalogue/';
                        imagePathArr[0] = this.file.dataDirectory + downloadDestinationDirectory + imageName;

                  } else if(type == 'categoryImage') {

                        // const downloadDestinationDirectory = 'download/categoryImage/';
                        const downloadDestinationDirectory = 'imageCatalogue/';
                        imagePathArr[0] = this.file.dataDirectory + downloadDestinationDirectory + imageName;

                  } else  if(type == 'productImage') {

                        const downloadDestinationDirectory = 'imageCatalogue/';
                        imagePathArr[0] = this.file.dataDirectory + downloadDestinationDirectory + imageName;
                  }

                  let imageCheckCount = 0;

                  console.log(imagePathArr);

                  for (let index = 0; index < imagePathArr.length; index++) {

                        let path: string = imagePathArr[index];
                        let filepath = path.substring(0, path.lastIndexOf('/') + 1);
                        let filename = path.substring(path.lastIndexOf('/') + 1, path.length);

                        this.file.checkFile(filepath, filename).then((files) => {

                              console.log('index '+ index + 'files found ' + files);

                              imageCheckCount++;

                              if(!imagePath) {
                                    imagePath = filepath + filename;
                              }

                              if(imageCheckCount == imagePathArr.length) {

                                    if(!imagePath) {

                                          imagePath = 'assets/imgs/no-thumbnail.jpg';
                                          console.log(imageName, imagePath);
                                    }

                                    resultData['imagePath'] = imagePath;
                                    resultData['recordId'] = recordId;

                                    requestData.next(resultData);
                              }


                        }).catch((err) => {

                              console.log('index '+ index + 'files not found ');
                              imageCheckCount++;

                              if(imageCheckCount == imagePathArr.length) {

                                    if(!imagePath) {
                                          imagePath = 'assets/imgs/no-thumbnail.jpg';
                                          console.log(imageName, imagePath);
                                    }

                                    resultData['imagePath'] = imagePath;
                                    resultData['recordId'] = recordId;

                                    requestData.next(resultData);
                              }

                        });
                  }

                  return requestData.asObservable();
            }


            public onGetCategoryRowsHandler(db, mainCategoryName) : Observable<any> {

                  const requestData = new Subject< any >();

                  db.executeSql('SELECT master_category.*, master_category.actual_image_name as image FROM master_category WHERE main_category = ? AND status = ? AND del = ?', [mainCategoryName, 'Active', 0]).then(sqliteFetchResult => {

                        console.log(sqliteFetchResult);
                        requestData.next(sqliteFetchResult);
                  });

                  return requestData.asObservable();
            }


            public onGetCategoryListHandler(searchData) : Observable<any> {

                  const requestData = new Subject< any >();

                  this.onReturnLocalDBHandler().subscribe(db => {

                        let whereBindStr = '';
                        let whereBindArrValue = ['Active', searchData.name, 'Active', 0];

                        if( searchData && searchData.status) {

                              whereBindStr += ' AND master_category.status LIKE ?';
                              whereBindArrValue.push(searchData.status);
                        }

                        if( searchData && searchData.date) {

                              whereBindStr += ' AND master_category.date_created LIKE ?';
                              whereBindArrValue.push(searchData.date_created);
                        }

                        if( searchData && searchData.category_name) {

                              whereBindStr += ' AND master_category.category_name LIKE ?';
                              whereBindArrValue.push(searchData.category_name);
                        }

                        if( searchData && searchData.name) {

                              whereBindStr += ' AND master_category.main_category LIKE ?';
                              whereBindArrValue.push(searchData.name);
                        }

                        console.log(whereBindStr);
                        console.log('where clause ' + whereBindArrValue);

                        db.executeSql('SELECT master_category.*, master_category.actual_image_name as image FROM master_category JOIN master_product ON master_product.master_category_id = master_category.id AND master_product.status = ? WHERE master_category.main_category = ? AND master_category.status = ? AND master_category.del = ? '+whereBindStr+' GROUP BY master_category.id ORDER BY master_category.id ASC', whereBindArrValue).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              let imageAddedForCategory = 0;

                              const categoryData = Array();
                              for (let index = 0; index < sqliteFetchResult.rows.length; index++) {

                                    const categoryRow = sqliteFetchResult.rows.item(index);
                                    categoryRow.image = '';

                                    console.log(categoryRow);
                                    categoryData.push(categoryRow);

                                    db.executeSql('SELECT master_category_images.*, master_category_images.actual_image_name as image  FROM master_category_images WHERE master_category_images.category_id = ? AND master_category_images.del = ?', [categoryRow.id, 0]).then(sqliteFetchResult2 => {
                                          console.log(sqliteFetchResult2);

                                          const imageData = Array();
                                          if(sqliteFetchResult2.rows.length > 0) {

                                                let categoryId;
                                                for (let index1 = 0; index1 < sqliteFetchResult2.rows.length; index1++) {


                                                      const imageRow = sqliteFetchResult2.rows.item(index1);
                                                      categoryId = imageRow.category_id;
                                                      imageData.push(imageRow);
                                                }

                                                console.log('CtaeogryId ' + categoryId);
                                                console.log(imageData);

                                                const categoryIndex = categoryData.findIndex(categoryRow => categoryRow.id == categoryId);

                                                if(categoryIndex !== -1) {
                                                      categoryData[categoryIndex].image = imageData;
                                                }
                                          }

                                          imageAddedForCategory++;

                                          if(imageAddedForCategory == categoryData.length) {

                                                requestData.next(categoryData);
                                          }
                                    });
                              }
                        });

                  });

                  return requestData.asObservable();
            }


            public onGetProductSearchArrHandler(searchData, isNewArrival) {

                  let whereBindStr = '';
                  let whereBindArrValue = ['Active', 0];

                  if(isNewArrival == 1) {

                        whereBindStr += ' AND master_product.new_arrival = ?';
                        whereBindArrValue.push(isNewArrival);
                  }

                  if(searchData && searchData.id) {

                        whereBindStr += ' AND master_product.master_category_id = ?';
                        whereBindArrValue.push(searchData.id);
                  }

                  if( searchData && searchData.status) {

                        whereBindStr += ' AND master_product.status = ?';
                        whereBindArrValue.push(searchData.status);
                  }

                  if( searchData && searchData.date) {

                        whereBindStr += ' AND master_product.date_created LIKE ?';
                        whereBindArrValue.push(searchData.date_created);
                  }

                  if( searchData && searchData.product_name) {

                        whereBindStr += ' AND master_product.product_name LIKE ?';
                        whereBindArrValue.push(searchData.product_name);
                  }

                  if( searchData && searchData.search) {

                        whereBindStr += ' AND master_product.product_name LIKE ?';
                        whereBindArrValue.push(searchData.search);

                  }

                  const resultData = {};
                  resultData['whereBindStr'] = whereBindStr;
                  resultData['whereBindArrValue'] = whereBindArrValue;

                  return resultData;
            }

            globleSearchCount:any=0
            public onGetProductListHandler(searchData, isNewArrival): Observable<any> {

                  const requestData = new Subject< any >();
                  // var globleSearchCount = 0

                  const resultData = {};
                  let resultDataCount = 0;
                  this.onReturnLocalDBHandler().subscribe(db => {

                        db.executeSql('SELECT master_category.*, master_category_images.actual_image_name as categoryImage FROM master_category LEFT JOIN master_category_images ON master_category_images.category_id = master_category.id WHERE master_category.status = ? AND master_category.id = ?', ['Active',  searchData.id]).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              const categoryData = Array();
                              for (let index = 0; index < sqliteFetchResult.rows.length; index++) {

                                    const categoryRow = sqliteFetchResult.rows.item(index);
                                    categoryData.push(categoryRow);
                              }

                              resultData['category_name'] = categoryData;

                              resultDataCount++;

                              if(resultDataCount == 4) {
                                    requestData.next(resultData);
                              }
                        });

                        console.log(searchData);

                        const searchResultData = this.onGetProductSearchArrHandler(searchData, isNewArrival);
                        let whereBindStr1 = searchResultData['whereBindStr'];
                        const whereBindArrValue1 = searchResultData['whereBindArrValue'];

                        if(isNewArrival == 1) {
                              whereBindStr1  += ' AND master_product_images.profile = ?';
                              whereBindArrValue1.push(1);
                        }

                        console.log(searchData);
                        console.log(whereBindStr1, whereBindArrValue1);
                        console.log('check Here');

                        console.log('SELECT master_product.*, master_category.main_category, master_category.category_name, master_product_images.actual_image_name as image FROM master_product LEFT JOIN master_category ON master_category.id = master_product.master_category_id LEFT JOIN master_product_images ON master_product_images.product_id = master_product.id AND master_product_images.del = 0 WHERE master_product.status = ? AND master_product.del = ? '+whereBindStr1+' GROUP BY master_product.id ORDER BY master_product.id ASC', whereBindArrValue1);

                        db.executeSql('SELECT master_product.*, master_category.main_category, master_category.category_name, master_product_images.actual_image_name as image FROM master_product LEFT JOIN master_category ON master_category.id = master_product.master_category_id LEFT JOIN master_product_images ON master_product_images.product_id = master_product.id AND master_product_images.del = 0 WHERE master_product.status = ? AND master_product.del = ? '+whereBindStr1+' GROUP BY master_product.id ORDER BY master_product.id ASC', whereBindArrValue1).then(sqliteFetchResult => {

                              console.log(sqliteFetchResult);

                              const productData = Array();
                              this.globleSearchCount=0
                              for (let index = 0; index < sqliteFetchResult.rows.length; index++) {

                                    const productRow = sqliteFetchResult.rows.item(index);

                                    if (searchData && searchData.globalSearchData) {

                                          if(searchData.src == 'mainCategory') {

                                                console.log(productRow);
                                                if (
                                                      (productRow.main_category && (productRow.main_category).toLowerCase().includes(searchData.globalSearchData.toLowerCase()))

                                                      || (productRow.category_name && (productRow.category_name).toLowerCase().includes(searchData.globalSearchData.toLowerCase()))

                                                      || (productRow.product_name && (productRow.product_name).toLowerCase().includes(searchData.globalSearchData.toLowerCase()))) {
                                                            if(productData && productData.length < 100 )
                                                            {
                                                                  // alert('loop breaked')
                                                                  productData.push(productRow);
                                                            }
                                                            this.globleSearchCount ++
                                                            console.log(productData);
                                                      }

                                                } else if(searchData.src == 'category') {

                                                      console.log('check Here src is category')

                                                      if ((productRow.main_category && (productRow.main_category).toLowerCase().includes(searchData.categoryName.toLowerCase() ))
                                                      && ( (productRow.category_name && (productRow.category_name).toLowerCase().includes(searchData.globalSearchData.toLowerCase()))
                                                      || (productRow.product_name && (productRow.product_name).toLowerCase().includes(searchData.globalSearchData.toLowerCase())))) {
                                                            if(productData && productData.length < 100 )
                                                            {
                                                                  console.log('check Here 2')
                                                                  productData.push(productRow);
                                                                  this.globleSearchCount ++

                                                            }

                                                      }
                                                }
                                          } else {

                                                productData.push(productRow);

                                          }
                                          console.log(this.globleSearchCount);


                                    }

                                    resultData['products'] = productData;
                                    if(searchData && searchData.globalSearchData)
                                    {
                                          resultData['product_count_all'] = this.globleSearchCount;
                                    }
                                    console.log(resultData,'check here')
                                    resultDataCount++;

                                    if(resultDataCount == 4) {
                                          requestData.next(resultData);
                                    }
                              }, err => {

                                    console.log('hello1');
                                    console.log(err);
                              });

                              const whereBindStr2 = searchResultData['whereBindStr'];
                              const whereBindArrValue2 = searchResultData['whereBindArrValue'];

                              db.executeSql('SELECT master_product.* FROM master_product WHERE master_product.status = ? AND master_product.master_category_id = ? AND master_product.del = ? '+whereBindStr2+' GROUP BY master_product.master_category_id ORDER BY master_product.master_category_id ASC', whereBindArrValue2).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);
                                    resultData['product_count'] = sqliteFetchResult.rows.length;
                                    resultDataCount++;

                                    if(resultDataCount == 4) {
                                          requestData.next(resultData);
                                    }
                              });


                              db.executeSql('SELECT master_product.* FROM master_product WHERE master_product.master_category_id = ? AND master_product.del = ?', [searchData.id, 0]).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);
                                    if(searchData && !searchData.globalSearchData)
                                    {

                                          resultData['product_count_all'] = sqliteFetchResult.rows.length;
                                    }

                                    resultDataCount++;

                                    if(resultDataCount == 4) {
                                          requestData.next(resultData);
                                    }
                              });

                        });
                        console.log(resultData,'check here')
                        return requestData.asObservable();
                  }


                  public onGetProductDetailHandler(productId): Observable<any> {

                        const requestData = new Subject< any >();
                        this.onReturnLocalDBHandler().subscribe(db => {

                              db.executeSql('SELECT master_product.*, master_category.main_category, master_category.category_name FROM master_product LEFT JOIN master_category ON master_category.id = master_product.master_category_id WHERE master_product.id = ?', [productId]).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);
                                    const productData = sqliteFetchResult.rows.item(0);

                                    db.executeSql('SELECT master_product_images.*, master_product_images.actual_image_name as image  FROM master_product_images  WHERE master_product_images.product_id = ? AND master_product_images.del = ?  LIMIT 1', [productId,0]).then(sqliteFetchResult2 => {

                                          console.log(sqliteFetchResult2);

                                          const imageData = Array();
                                          for (let index = 0; index < sqliteFetchResult2.rows.length; index++) {
                                                const imageRow = sqliteFetchResult2.rows.item(index);
                                                imageData.push(imageRow);
                                          }

                                          console.log(imageData);

                                          productData.image = imageData;

                                          db.executeSql('SELECT master_product_images.*, master_product_images.actual_image_name as image FROM master_product_images  WHERE master_product_images.product_id = ? AND master_product_images.profile = ? AND master_product_images.del = ? LIMIT 1', [productId, 1,0]).then(sqliteFetchResult3 => {

                                                console.log(sqliteFetchResult3);

                                                const imageProfileData = Array();

                                                for (let index1 = 0; index1 < sqliteFetchResult3.rows.length; index1++) {

                                                      const imageProfileRow = sqliteFetchResult3.rows.item(index1);
                                                      imageProfileData.push(imageProfileRow);
                                                }

                                                console.log(imageProfileData);

                                                productData.image_profile = imageProfileData;
                                                requestData.next(productData);
                                          })
                                    })
                              })
                        });

                        return requestData.asObservable();
                  }


                  public onGetMainCategoryListHandler(searchData): Observable<any> {

                        const requestData = new Subject< any >();
                        this.onReturnLocalDBHandler().subscribe(db => {

                              let whereStr = '';
                              const whereArrValue = ['Active', 'Active', 0];
                              if(searchData && searchData.name) {

                                    whereStr = ' AND master_category.main_category LIKE ?';
                                    whereArrValue.push(searchData.name);
                              }

                              console.log('SELECT master_category.*, master_category.actual_image_name as image FROM master_category JOIN master_product ON master_product.master_category_id = master_category.id WHERE master_product.status = ? AND master_category.status = ? AND master_category.del = ? ' + whereStr + ' GROUP BY master_category.main_category ORDER BY master_category.id');

                              db.executeSql('SELECT master_category.*, master_category.actual_image_name as image FROM master_category JOIN master_product ON master_product.master_category_id = master_category.id WHERE master_product.status = ? AND master_category.status = ? AND master_category.del = ? ' + whereStr + ' GROUP BY master_category.main_category ORDER BY master_category.id', whereArrValue).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);
                                    requestData.next(sqliteFetchResult);
                              })
                        });

                        return requestData.asObservable();
                  }

                  public onReturnActiveProductCountHandler(): Observable<any> {

                        const requestData = new Subject< any >();
                        this.onReturnLocalDBHandler().subscribe(db => {

                              db.executeSql('SELECT master_product.id FROM master_product JOIN master_category ON master_category.id = master_product.master_category_id WHERE master_category.status = ? AND master_category.del = ? AND master_product.status = ? AND master_product.del = ?', ['Active', 0, 'Active', 0]).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);

                                    const productCount = sqliteFetchResult.rows.length;
                                    requestData.next(productCount);
                              });
                        })

                        return requestData.asObservable();
                  }

                  public onReturnActiveProductNewArrivalsCountHandler(): Observable<any> {

                        const requestData = new Subject< any >();
                        this.onReturnLocalDBHandler().subscribe(db => {

                              db.executeSql('SELECT master_product.id FROM master_product JOIN master_category ON master_category.id = master_product.master_category_id WHERE master_category.status = ? AND master_category.del = ? AND master_product.new_arrival = ? AND master_product.status = ? AND master_product.del = ?', ['Active', 0,1, 'Active', 0]).then(sqliteFetchResult => {

                                    console.log(sqliteFetchResult);

                                    const productCount = sqliteFetchResult.rows.length;
                                    requestData.next(productCount);
                              });
                        })

                        return requestData.asObservable();
                  }
            }
