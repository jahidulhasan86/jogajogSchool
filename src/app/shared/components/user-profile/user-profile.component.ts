import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/user_service/account.service';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { online_status_xmpp, online_status_display } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  currentUser: any;

  public acServices;

  profile_pic: any;

  isTecherRole: any;

  imgSrc: any;

  currentStatusName: any;

  onlineStatusXmpp = online_status_xmpp;

  onlineStatusDisplay = online_status_display;

  tickImageUrl = '../../../../assets/images/chat-status/tick.png'

  constructor(public acService: AccountService, private xmppChatService: XmppChatService) {
    this.acServices = acService;
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    this.profile_pic = JSON.parse(localStorage.getItem("profile_pic"))
    if (this.getUserRole() === "Teacher") this.isTecherRole = true;
    this.getPresence()
  }

  getUserRole() {
    return this.acService.getUserRole()
  }

  getSessionUserInfo() {
    return this.acService.getSessionUserInfo()
  }

  onMouseOver() {
    this.imgSrc = this.xmppChatService.arrow_down
  }

  onMouseOut() {
    this.imgSrc = this.xmppChatService.imgSrc
  }

  getPresence() {
    this.xmppChatService.getPresence().subscribe(() => {
      const status = this.getSessionUserPresence()
      if (!!status) {
        this.imgSrc = status.imgSrc
        this.currentStatusName = status.statusName
      }
    })
  }

  getSessionUserPresence(): any {
    return this.xmppChatService.getSessionUserPresence()
  }

  setSessionUserPresence(status) {
    this.xmppChatService.setStatus(status);
  }
}
