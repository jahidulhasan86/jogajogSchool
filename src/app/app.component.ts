import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { XmppChatService } from './shared/services/xmpp-chat/xmpp-chat.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'jogajog-school';

  sessionUserCheckerInt: NodeJS.Timeout;

  constructor(private xmppChatService: XmppChatService, private router: Router) {
  }

  ngOnInit(){
    this.clearLocalStorageItem()
    this.checkSessionExist()
    this.getPushMessage()
  }

  checkSessionExist() {
    this.sessionUserCheckerInt = setInterval(() => {
      if (localStorage.hasOwnProperty('sessionUser')) {
        this.connectXampp()
        clearTimeout(this.sessionUserCheckerInt)
      }
    }, 1000)
  }

  connectXampp() {
    const userStore = JSON.parse(localStorage.getItem('sessionUser'));
    const user = { username: userStore.user_name, password: userStore.password, user_id: userStore.id };
    this.xmppChatService.checkConnection(user);
    let globalRetryValue = 0;
    this.xmppChatService.onConnect$.subscribe((onConnect) => {
      console.log('globalRetryValue: ', globalRetryValue);
      if (onConnect === false) {
        globalRetryValue++;
        if (globalRetryValue <= 5) {
          this.xmppChatService.checkConnection(user);
        }
      } else {
        this.getSubjectAndUserList().forEach((subject: any) => {
          this.connectChatRoom(subject)
        });
        globalRetryValue = 0;
      }
    });
  }

  getSubjectAndUserList(): [] {
    return JSON.parse(localStorage.getItem('subject_list'))
  }

  connectChatRoom(subject) {
    this.xmppChatService.chats = [];
    this.xmppChatService.pageNo = 1;
    this.xmppChatService.chatListAdd(this.xmppChatService.chats);
    this.xmppChatService.connectChatRoom(subject.id);
    this.xmppChatService.setRoomStatus(subject.id + "@conference." + environment.host, subject.id, "online working", "online");
    this.xmppChatService.ClearUnread(subject.id + "@conference." + environment.host);
  }

  getPushMessage() {
    this.xmppChatService.getPushMessage().subscribe((result) => {
      if (!!result) {
        this.pushMessageHandler(result.data)
      }
    })
  }

  pushMessageHandler(data) {
    if (!!data) {
      const payload = data.payload ? JSON.parse(data.payload) : null
      if (data.type == '9') {
        this.callHandler(payload)
      }
    }
  }

  callHandler(payload) {
    if (!!payload) {
      if (payload.action === 'member_join') {
        this.getSubjectAndUserList().forEach((subject: any) => {
          if(subject.id === payload.id){
            if(localStorage.hasOwnProperty('isWaitForHostDialogOpen')){
              this.incomingCallJoin(subject)
              return
            }
            this.incomingCallJoinPopUp(subject)
          }
        });
      }
    }
  }

  incomingCallJoinPopUp(subject) {
    console.log(subject)
    Swal.fire({
      title: 'Incoming call from ' + subject.subject_name,
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Join',
      cancelButtonText: "Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(["student/call"], { queryParams: { subject: JSON.stringify(subject) } })
      }
    })
  }

  incomingCallJoin(subject){
    if(!!subject){
      const waitForHostId = document.getElementById('waitForHostId')
      if(!!waitForHostId) waitForHostId.click()
      this.router.navigate(["student/call"], { queryParams: { subject: JSON.stringify(subject) } })
    }
  }

  clearLocalStorageItem(){
    if(localStorage.hasOwnProperty('isWaitForHostDialogOpen')){
      localStorage.removeItem('isWaitForHostDialogOpen')
    }
  }
}
