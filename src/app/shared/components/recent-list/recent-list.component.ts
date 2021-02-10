import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISubject } from '../../interfaces/ISubject';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { online_status_xmpp } from '../../../../environments/environment'
//const conststatusGreenImage = require('../../../../assets/images/').default;
import { Subscription, concat } from 'rxjs';
import * as $ from 'jquery'
/* const constcircleYellowImage = require('../../../../assets/images/Circle_Yellow.png').default;
const constcircleRedImage = require('../../../../assets/images/Circle_Red.png').default;
const constgroupsImage = require('../../../../assets/images/Group Icons/Group-Icon.png').default;
const constgeoGroupsIcon = require('../../../../assets/images/Group Icons/Geo-Groups.png').default;
const constflightsIcon = require('../../../../assets/images/Group Icons/flights.png').default;
const constpinnedGroupIcon =require('../../../../assets/images/Group Icons/Pinned-group.png').default;
const constprofileDummyImage = require('../../../../assets/images/default_profile icon.png').default;
const constlistDropdownIcon = require('../../../../assets/images/list_dropdown_icon.png').default;
 */import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-recent-list',
  templateUrl: './recent-list.component.html',
  styleUrls: ['./recent-list.component.css']
})
export class RecentListComponent implements OnInit {

  public listDropdownIconUrl = '';
  public statusGreenImageUrl = '';
  public circleYellowImageUrl ='';
  public circleRedImageUrl = '';
  public groupsImageUrl = '';
  public geoGroupsIconUrl = ''; 
  public flightsIconUrl = '';
  public pinnedGroupIconUrl = '';
  public profileDummyImageUrl = '';
  conferenceFilter: any = { group_name: '' };
  private subscriptions: Array<Subscription> = [];
  public profilePhotoUrl:any;
  @Input() subjectObj: ISubject

  @Output() SubjectEvtEmitter = new EventEmitter<any>();
  @Output() peopleEvtEmitter = new EventEmitter<any>();
  @Output() datatEmitter = new EventEmitter<any>();
  

  selected_user_id: any;
  usersObj:any={};

  list_name: string

  subjectFilter: any = { subject_name: '' };

  chatsHistory: any[];
  public selectedGroup;
  isInSession: any;
  constructor(private xmppChatService: XmppChatService) {

    this.profilePhotoUrl = environment.profilePhotoUrl;
    this.statusGreenImageUrl = environment.conststatusGreenImage;
    this.circleYellowImageUrl = environment.constcircleYellowImage;
    this.circleRedImageUrl = environment.constcircleRedImage;
    this.groupsImageUrl = environment.constgroupsImage;
    this.geoGroupsIconUrl = environment.constgeoGroupsIcon;
    this.flightsIconUrl = environment.constflightsIcon;
    this.pinnedGroupIconUrl = environment.constpinnedGroupIcon;
    this.profileDummyImageUrl = environment.constprofileDummyImage;
    this.listDropdownIconUrl = environment.constlistDropdownIcon;
    this.selectedGroup = { iselected: false, isgroup: false, user_name: "", user_id: '', group_id: '', total_user: 0, user_list: [] };
  }

  ngOnInit(): void {
    this.ShowHistory();

    this.subscriptions.push(this.xmppChatService.onSelectedGroup$.subscribe((group) => {
      this.selectedGroup = group;
      console.log("recent select", this.selectedGroup)
      // selectedGroup.created_by == sUser.id ? true: (sUser.company_id == globalValue.company_id) ? (!selectedGroup.is_pinned || (selectedGroup.is_pinned && selectedGroup.is_allow_contributor)) : sUser.is_company_admin || !selectedGroup.is_pinned || (selectedGroup.is_pinned && selectedGroup.is_allow_contributor)
    }));
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   if (this.subjectObj.subjects.length > 0) {
    //     this.subjectSelectedForChat()
    //   }
    // }, 500);
  }

  selectedSubject(subject) {
    // this.selected_user_id = subject.id
    // this.SubjectEvtEmitter.emit(subject)
  }

  subjectSelectedForChat() {
    // this.subjectObj.subjects.forEach((subject: any) => {
    //   if(subject.id === this.subjectObj.selected_subject.id){
    //     this.selectedSubject(subject)
    //   }
    // })
  }

  ShowHistory() {
    this.chatsHistory = []
    var chatRetrive = [];
    var chat = this.xmppChatService.latestMessage;
    for (var key in chat) {
      if (chat.hasOwnProperty(key)) {
        var statusobj = this.xmppChatService.presenceList[key.split("@")[0]];
        chat[key].onlinestatus = statusobj;
        if (statusobj == 'online' || statusobj == online_status_xmpp.online) {
        chat[key].inOnline = true;
        }
        chatRetrive.push(chat[key]);
      }
    }

    chatRetrive.sort(function (x, y) {
      return y.stamp - x.stamp;
    });

    this.chatsHistory = chatRetrive.sort((a, b) => (a.is_pinned === b.is_pinned) ? 0 : a.is_pinned ? -1 : 1);
    this.usersObj.users =[];
     this.chatsHistory.forEach(e=>{
       
      this.usersObj.users.push({user_name:e.name, user_id:e.user_id,
        dept_name:e.msg,time:e.time, group_id:e.group_id, room:e.room })
    }); 
    console.log("chat history:", this.chatsHistory)
    this.xmppChatService.recentChatHistoryListListner.next(this.chatsHistory);
    this.xmppChatService.recentChatHistoryList$.subscribe(result => {
      this.chatsHistory = result;
      // console.log("chat history:" , this.chatsHistory)
    })

  }
  _activeClick(event) {
    console.log("active event ", event)
    event.currentTarget.classList.add('active_l2g_row')
    var recentChatList = document.getElementsByClassName('recentChat')
    for (let i = 0; i < recentChatList.length; i++) {
      recentChatList[i].classList.remove('active_l2g_row')
    }
    event.currentTarget.classList.add('active_l2g_row');

    /* the below code is for : when run on desktop */
   /*  if(isElectronRunning)   
    { 
      ipcRenderer.send('maximize-me-please')
    }
 */    ///////////////// 
  }
  openChattingWindow(data): void {
    data.user_name = data.name;
    if(data.group_id){
      data.class_id = data.group_id;
      this.SubjectEvtEmitter.emit(data);
    }else{
      this.peopleEvtEmitter.emit(data);
    }
    

    
    if (this.isInSession == true) {
     
      document.getElementById("jitsi-container").style.display = 'none';
      let targetWelcmDom: any;
      targetWelcmDom = document.getElementsByClassName("wlcomeImage")[0];
      targetWelcmDom.style.display = ''
     
      this.xmppChatService.openChattingWindowChange(true, true);
      data.clickFromChat = true;
        this.peopleEvtEmitter.emit(data);
    } else {
      this.xmppChatService.openChattingWindowChange(true, true);
      data.clickFromChat = false;
          this.peopleEvtEmitter.emit(data);
    }
 
    var chatBoxUL = $("#chatBoxUL");
    var chatBoxUlTimeInterval = setInterval(function(){ 
      var headerHeight = $(".header").height();
      var footerHeight = $(".footer").height();
      var toolbarContentHeight = $(".toolbar-content").height()
      if(chatBoxUL){
        $("#chatBoxUL").css("height", window.innerHeight - (headerHeight + footerHeight + toolbarContentHeight + 80))
        clearInterval(chatBoxUlTimeInterval);
      } else {
        chatBoxUL = $("#chatBoxUL");
      }
    }, 1000)
    
    $(".profilePhoto-leftHeader, .selectedGroup, .groupParticipants").css("display", "block")
    $(".toolbar-content").slideDown();
  }
  conferenceMembers(members) {
   // this.conferenceService.singleConference$.next(members)
  }
  userEvtEmitter(event){
    this.datatEmitter.emit(event);
  }

}
