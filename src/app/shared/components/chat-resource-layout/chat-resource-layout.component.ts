
import { Component, Input, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chat-resource-layout',
  templateUrl: './chat-resource-layout.component.html',
  styleUrls: ['./chat-resource-layout.component.css']
})
export class ChatResourceLayoutComponent implements OnInit, OnDestroy {

  @Input() id: any

  @Input() people: any

  @Input() subject: any
  // tempSubject: any;
  
  imgSrc: string = '../../../../assets/images/add icon default.png';
  
  isChatSelected: boolean = true;

  fileList = [{"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608531884877","added_at":"2020-12-21T06:24:44.913Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/jpeg","originalname":"Bill Gates Words.jpg","reference_id":null,"reference_type":null,"resource_type":"conference","size":37480,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608531884877_Bill Gates Words.jpg","shortname":"Bill Gates Words.jpg","mimetype_img":"JPGIcon.png"},{"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608527186484","added_at":"2020-12-21T05:06:26.529Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/png","originalname":"three dots icon.png","reference_id":null,"reference_type":null,"resource_type":"conference","size":10847,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608527186484_three dots icon.png","shortname":"three dots icon.png","mimetype_img":"PNGIcon.png"}]

  imgFileList = [{"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608527186484","added_at":"2020-12-21T05:06:26.529Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/png","originalname":"three dots icon.png","reference_id":null,"reference_type":null,"resource_type":"conference","size":10847,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608527186484_three dots icon.png","shortname":"three dots icon.png","mimetype_img":"PNGIcon.png"},{"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608531884877","added_at":"2020-12-21T06:24:44.913Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/jpeg","originalname":"Bill Gates Words.jpg","reference_id":null,"reference_type":null,"resource_type":"conference","size":37480,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608531884877_Bill Gates Words.jpg","shortname":"Bill Gates Words.jpg","mimetype_img":"JPGIcon.png"}, {"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608527186484","added_at":"2020-12-21T05:06:26.529Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/png","originalname":"three dots icon.png","reference_id":null,"reference_type":null,"resource_type":"conference","size":10847,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608527186484_three dots icon.png","shortname":"three dots icon.png","mimetype_img":"PNGIcon.png"}, {"resource_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","file_id":"1608527186484","added_at":"2020-12-21T05:06:26.529Z","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","encoding":"7bit","filename":null,"mimetype":"image/png","originalname":"three dots icon.png","reference_id":null,"reference_type":null,"resource_type":"conference","size":10847,"uploaded_by":null,"uploaded_by_name":null,"url":"https://api.jogajog.com.bd/files/1608527186484_three dots icon.png","shortname":"three dots icon.png","mimetype_img":"PNGIcon.png"}]

  response

  count: number = 0;

  constructor(private xmppChatService: XmppChatService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) { }

 
  ngOnInit(): void {
    if(this.route.snapshot.paramMap.get('subject-id')){
      this.id = this.route.snapshot.paramMap.get('subject-id');  
    }
    if(localStorage.getItem('selected_subject')){
      this.subject =  JSON.parse(localStorage.getItem('selected_subject'));
      localStorage.removeItem('selected_subject');
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if(!!changes.subject && !!changes.subject.currentValue ) {

      this.subject = changes.subject.currentValue;
      // this.tempSubject = changes.subject.currentValue;
      this.id = this.subject.id;
      this.response = {'resource_id' : this.subject.id};
      // if (!this.isChatSelected) {
      //   this.response = {'resource_id' : this.subject.id};
      // }
    } 
    
    if (!!changes.people && !!changes.people){
      this.people = changes.people.currentValue;
    }
  }

  updateSelectedDom(event, dom){
    $('.btn-selector').removeClass('btn-primary').addClass('btn-normal');
    $(event.target.classList.add('btn-primary'));
    this.isChatSelected = dom == 'chat' ? true : false
    // this.response = dom !== 'chat' ? {'resource_id':this.subject.id} : '';
    // this.id = this.subject.id;

    // if(dom === 'chat') {
    //   Object.assign(this.tempSubject, {count: this.count ++})
    //   this.subject = this.tempSubject;
    // }
  }

  onMouseOut()
  {
    this.imgSrc = '../../../../assets/images/add icon default.png'
  }
  
  onMouseOver()
  {
    this.imgSrc = '../../../../assets/images/add_icon_selected.png'
  }

  getFiles(e) {
    var filesArray = e.target.files;
    
    let names
    if (filesArray.length > 0) {

      for (let i = 0; i < filesArray.length; i++) {
        names += filesArray[i].name + '\n'
        var fileType = filesArray[i].type.substring(0, filesArray[i].type.indexOf("/"));
        var fileUploadIdentifiedId;
        if (fileType == 'application') {
          fileType = 'file'
        }

        var randomId = Math.floor(Math.random() * 100)
        fileUploadIdentifiedId =  'randomId_' + filesArray[i].lastModified + randomId;
        filesArray[i].fileUploadIdentifiedId = fileUploadIdentifiedId;

        var toUser = {
          user_name: this.id,
          user_id: this.id,
        }

        let reader = new FileReader;
        reader.onload = (e: any) => {
          var timestamp = new Date().getTime();
          var d = new Date(timestamp);
          var pushMSG = {
            "from": "",//"me",
            "msg": e.target.result,
            "align": "right",
            "image_url": "",
            "stamp": d.toLocaleString(undefined, {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
            'thumbnail': e.target.result,
            "isFile": true,
            "fileType": fileType,
            "id": filesArray[i].fileUploadIdentifiedId,
            "isLoader": true,
            'fileShortName': filesArray[i].name,
            sendingFailedText: true,
          }
        };
        reader.readAsDataURL(filesArray[i]);

        // upload file from here
        if (fileType) {
          this.spinner.show();
          this.xmppChatService.audioVideoUpload(filesArray[i], fileUploadIdentifiedId, toUser)
            .subscribe(result => {
              this.spinner.hide();
              if (result.status == 'ok') {
                this.response = result.result;
                Swal.fire({
                  title: 'Uploaded',
                  text: 'File successfully uploaded.',
                  timer: 2000,
                  showConfirmButton: false
                });
                
              }
            }, err => {
              this.spinner.hide();
              console.log("from new upload method", err) 
              Swal.fire({
                icon: 'warning',
                backdrop: false,
                text: 'Uploading failed, Please try again!'
              });            
            })
        } else {
          console.log("File are not supported yet.");
          Swal.fire({
            icon: 'warning',
            backdrop: false,
            text: 'Uploading failed, Please try again!'
          });
        }
      }
    }
  }
  
  ngOnDestroy(){
    console.log('destroyed');
  }

}
