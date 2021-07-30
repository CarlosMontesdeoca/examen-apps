import { Component , OnInit} from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FirebaseService } from '../services/authentication.service';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  userName: string;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  ngOnInit() {

    this.chatService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userName = res.email;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
  }

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private chatService: FirebaseService,
    private navCtrl: NavController,
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }


  fileUpload(event: FileList) {
      
      const file = event.item(0)

      if (file.type.split('/')[0] !== 'image') { 
        console.log('File type is not supported!')
        return;
      }

      this.isImgUploading = true;
      this.isImgUploaded = false;

      this.FileName = file.name;

      const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

      const imageRef = this.angularFireStorage.ref(fileStoragePath);

      this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

      this.progressNum = this.ngFireUploadTask.percentageChanges();
      this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
        
        finalize(() => {
          this.fileUploadedPath = imageRef.getDownloadURL();
          
          this.fileUploadedPath.subscribe(resp=>{
            this.fileStorage({
              name: file.name,
              filepath: resp,
              size: this.FileSize
            });
            this.isImgUploading = false;
            this.isImgUploaded = true;
            this.navCtrl.navigateForward('/dashboard');
            console.log('la imagen se a cargado con exito')
          },error => {
            console.log(error);
          })
        }),
        tap(snap => {
            this.FileSize = snap.totalBytes;
        })
      )
  }


  fileStorage(image: FILE) {
      const ImgId = this.angularFirestore.createId();
      
      this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
        console.log(data);
      }).catch(error => {
        console.log(error);
      });
  }  

}