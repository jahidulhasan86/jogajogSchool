import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as $ from 'jquery';
import { DomSanitizer, SafeResourceUrl, } from '@angular/platform-browser';
import { ChatResourceModule } from '../../modules/chat-resource/chat-resource.module';
import { ChatResourceLayoutComponent } from '../chat-resource-layout/chat-resource-layout.component';
import { ActivatedRoute, Router } from '@angular/router';

const sign = require('jwt-encode');
const secret = 'SB2019'

@Component({
  selector: 'app-call-layout',
  templateUrl: './call-layout.component.html',
  styleUrls: ['./call-layout.component.css']
})
export class CallLayoutComponent implements OnInit {

  isChatSelected = false;

  subject: any;

  @ViewChild('chatLayout') private chatComp: ChatResourceLayoutComponent;
  
  selectedSubject: any;
  
  count: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSubjectList()
  }

  getSubjectList() {
    this.route.queryParamMap.subscribe((x) => {
      if (!!x) {
        this.subject = JSON.parse(x.get('subject'))
        this.selectedSubject = JSON.parse(x.get('subject'))
      }
    })
  }

  toggleChat(event) {
    if (this.isChatSelected) {
      this.isChatSelected = false;
    } else {
      this.isChatSelected = true;
      Object.assign(this.selectedSubject, {count: this.count ++})
      this.subject = this.selectedSubject
    }
    if (this.isChatSelected) {
      var el = document.getElementById("call");
      if (el.classList.contains("col-xl-12")) {
        el.classList.remove("col-xl-12");
        el.classList.add("col-xl-8");

      }
      /* $('#call').removeClass('col-xl-12');
       $('#call').addClass('col-xl-7'); */
    } else {
      $('#call').removeClass('col-xl-8');
      $('#call').addClass('col-xl-12');
    }
  }

  destroyChatComopnent(event) {
    this.chatComp.ngOnDestroy();
    this.isChatSelected = false;
  }

}