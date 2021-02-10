import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/user_service/account.service';

const sign = require('jwt-encode');
const secret = 'SB2019';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  //styleUrls: ['./chat-resource-layout.component.css']
})
export class CallComponent implements OnInit {

  authUser: any;

  fireCount = 0;

  selected_current_conference_id: any;

  callURL: SafeResourceUrl;

  @Output() chatDivOpen = new EventEmitter<any>();

  @Output() destroyChat = new EventEmitter<any>();

  @Input() subject: any

  constructor(public sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, private accountService: AccountService) {
  }

  ngOnInit() {
    this.fireCount = 0;
    this.authUser = JSON.parse(localStorage.getItem("sessionUser"));
    const obj = this.objectCreatorForCall(this.authUser, this.subject.id)
    if (!!obj) {
      const url = this.tokenGenerator(obj)
      if (!!url) {
        this.callURL = this.sanitizer.bypassSecurityTrustResourceUrl(url)
      }
    }
  }

  objectCreatorForCall(authUser, currentConference) {
    const obj = {}
    Object.assign(obj, {
      id: authUser.id,
      user_name: authUser.user_name,
      access_token: authUser.access_token,
      role: authUser.role.role_name,
      company_id: authUser.company_id,
      app_id: authUser.app_id,
      app_name: 'l2t',
      avater_url: authUser.profile_pic,
      conference_id: currentConference,
      type: 'room'
    })
    return obj
  }

  test($event) {
    const iframe = document.getElementById('iframe')
    if (!!iframe) {
      iframe.style.height = window.innerHeight - 74 + 'px'
      iframe.style.border = 'none'
    }
    this.fireCount++
    if (this.fireCount == 2) {
      this.navigateClassAfterCallLeave()
    }
  }

  tokenGenerator(obj) {
    const url: string = 'https://classroom.sdk.jogajog.com.bd/class-room/' + obj.conference_id + '?session_token='
    const jwt = sign(obj, secret)
    return url.concat(jwt)
  }

  chatDivOpened() {
    this.chatDivOpen.emit('complete');
  }

  getUserRole() {
    return this.accountService.getUserRole()
  }

  navigateClassAfterCallLeave() {
    const sideNavToggle = document.getElementById("side-nav-toggle")
    if (!!sideNavToggle) sideNavToggle.click()
    if (this.getUserRole() === 'Teacher') this.router.navigate(['instructor'])
    else this.router.navigate(['student'])
  }
}  