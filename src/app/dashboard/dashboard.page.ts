import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent,NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/authentication.service';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-chat',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  messages: Observable<any[]>;
  newMsg: string;
  userName: string;
  
  constructor(
    private chatService: FirebaseService,
    private router: Router,
    private navCtrl: NavController,
    //private authService: AuthenticateService
  ) {}

  ngOnInit() {
    this.messages = this.chatService.getChatMessages();

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

  sendMessage() {
    this.newMsg = CryptoJS.AES.encrypt(
      this.newMsg.trim(),
      '1721949285'
    ).toString();
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
    //console.log(this.credentialForm.get('email'))
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('', { replaceUrl: true });
    });
  }

  goToSendFile() {
    this.navCtrl.navigateForward('/home');
  }
}

