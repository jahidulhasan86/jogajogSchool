import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';

@Component({
  selector: 'app-resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.css']
})
export class ResourceListComponent implements OnInit {

  @Input() resourceList: any

  @Input() currentTab: string

  fileFilter: any = { originalname: '' };

  keys = '$Ue0ugMTAAARrNokdEEiaz';

  constructor(private router: Router, private xmppChatService: XmppChatService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  viewToNewTab(fileInfo){
    window.open(fileInfo.url); 
  }

  download(fileInfo) {
    window.open(fileInfo.url);
    this.xmppChatService.downloadFile(fileInfo).then((result)=>{
      console.log(result);
    });
  }

  playRecordedFile(record) {
    if (!record) return
    window.open('recording-play?record=' + this.encryptRecordObject(record))
  }

  downloadRecordedFile(recording) {
    let url = recording.recording_url;
    url = url + recording.name + '.zip';
    window.open(url, "_blank");
  }

  encryptRecordObject(value) {
    return encodeURIComponent(CryptoJS.AES.encrypt(JSON.stringify(value), this.keys).toString());
  }

}
