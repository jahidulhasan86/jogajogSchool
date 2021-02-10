import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';

@Component({
  selector: 'app-shared-resource',
  templateUrl: './shared-resource.component.html',
  styleUrls: ['./shared-resource.component.css']
})
export class SharedResourceComponent implements OnInit {

  @Input() response : []

  selectedTab: string = 'recording';

  fileList = []

  imgFileList = []
  
  fileFilter: any = { originalname: '' };

  resourceList = []

  audioVideoList: any = [];

  recordingList: any = [];
  // = [{"company_id":"d17b5d3f-565a-4d5b-8815-e556b7cf90ed","app_id":"e21bf49f-40d8-4f1a-a23a-49980e8917ae","meeting_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","session_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","id":"f7de29c0-4495-11eb-a7ea-c7b2796f1e82","action_date":"1608669646428","action_type":"inserted","created":"1608669646428","created_by":"jahid_t1","details":null,"duration":"-21:-26811161:-46","end_time":null,"is_active":true,"name":"Marketing: Marketing Part 1","ov_ip":"https://mediaserver.jogajog.com.bd","playback_url":null,"recording_id":"17f9c450-3f8f-11eb-b249-ad951cfe2185","recording_url":"https://mediaserver.jogajog.com.bd/recordings/17f9c450-3f8f-11eb-b249-ad951cfe2185/","start_time":"1608669646428","status":"started","updated":null,"updated_by":null,"user_ids":null}];

  constructor(private xmppChatService: XmppChatService) { }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.response.currentValue !== undefined){
      const resource_id = changes.response.currentValue.resource_id;
      this.getFileHistory(resource_id);
      this.getRecordings(resource_id);
    }
  }

  currentTab(tab){
    this.selectedTab = tab;
    this.setCurrentTab();
  }

  setCurrentTab(){
    if(this.selectedTab === 'recording'){
      this.resourceList = this.recordingList;
    }else if(this.selectedTab === 'audio-video'){
      this.resourceList = this.audioVideoList;
    }else if(this.selectedTab === 'image'){
      this.resourceList = this.imgFileList;
    }else if(this.selectedTab === 'all'){
      this.resourceList = this.fileList;
    }else {
      console.log('Not implemented yet.');
    }
  }

  resourceListGeneratorByFileType(resourceList){
    this.resourceList = resourceList
    console.log(resourceList)
  }

  showPartialText(str, length, ending) {
    if (length === null) {
        length = 25;
    }
    if (ending === null) {
        ending = '..';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
  }

  getFileHistory(id) {
    if(!id) return
    this.fileList = []
     this.xmppChatService.getFileHistory(id).subscribe((result: any) => {
      if (result.status == 'ok') {
        console.log('chat file upload history', result)
        this.fileList = result.resultset
        this.imgFileList =[];
        this.fileList.forEach(e => {
          if(e.originalname.length>=21){
            e['shortname'] = this.showPartialText(e.originalname,21,"...")
          }else{
            e['shortname'] = e.originalname
          }
          if(e.mimetype.split('/')[1] == 'png'){
            this.imgFileList.push(e); 
            e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/PNGIcon.png';
          }else if(e.mimetype.split('/')[1] == 'jpeg'){
            this.imgFileList.push(e); 
            e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/JPGIcon.png';
          }
          else if(e.mimetype.split('/')[1] == 'mp3'){
            e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/MP3Icon.png';
            this.audioVideoList.push(e);
          }
            
          else if(e.mimetype.split('/')[1] == 'pdf')
            e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/PDF.png';
          else if(e.mimetype == 'text/plain')
            e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/TXT.png';
          else if(e.mimetype.split('/')[0] == 'video'){
            e.mimetype_img = '../../../../assets/images/Video.png';
            this.audioVideoList.push(e);
          }
            
          else e.mimetype_img = '../../../../assets/images/lg/new_res/shared_res/DocIcon.png';
        });

        this.fileList = this.fileList.sort((a, b) => a.added_at < b.added_at ? 1 : -1); // sort array by added_at forshow  leatest data on top
        this.setCurrentTab();
      }
    }, err => {
      console.log(err)
    })
  }

  getRecordings(id){
    let sessionid = null;
    this.xmppChatService.getRecordingByMeetingandSessionId(id,sessionid).subscribe((result: any) => {
      if (result.status == 'ok') {
        this.recordingList = result.resultset;
        this.recordingList = this.recordingList.sort((a,b) => (b.start_time > a.start_time) ? 1 : ((a.start_time > b.start_time) ? -1 : 0)); 
          this.recordingList.forEach(e=>{
          let duration = e.end_time-e.start_time;
          // var diffMins = Math.round(((duration % 86400000) % 3600000) / 60000);
          var hours =  Math.floor((duration / (1000 * 60 * 60)) % 24);
          var minutes = Math.floor(duration / 60000);
          var seconds = ((duration % 60000) / 1000).toFixed(0);
          e.duration = hours+':'+minutes+':'+seconds;       
        });

        this.setCurrentTab();
      }
    }, err => {
      console.log(err)
    });
  }

}
