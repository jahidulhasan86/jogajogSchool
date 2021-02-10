import { Component, EventEmitter, OnInit, Output, OnDestroy, SimpleChanges, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { env } from 'process';
import { NgxSpinnerService } from 'ngx-spinner';

declare var require: any;
// const linkify = require('linkify-it')();
let connectionStatus = null;
let userStore = null;
let uploadingFileQueue;

@Component({
  selector: 'app-chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.css']
})
export class ChattingComponent implements OnInit {
	public chatlist: Array<any> = [];
	selectedGroup: any = {};

	// selectedGroup = {
	//   isgroup: true,
	//   profile_pic: ''
	// }

	public msg;

	public chatStatus = {
		isVisible: false,
		statusText: ''
	}

	// Web-chat
	public profilePhotoImageUrl = '';
	public loaderImageUrl = '';
	public typingPlaceholderImageUrl = '';
	public attachmentImageUrl = '';
	public sendImageUrl = '';
  
	// tslint:disable-next-line: no-output-on-prefix
	@Output() onChange: EventEmitter<File> = new EventEmitter<File>();
  
	public acServices;
	public isConnected;
	public sentUser;
	public fromUser;
	public roleList: Object;
	public userHierarchyList: Object;
	panelOpenState = false;
	public roleId;
  
	public contactShow = true;
	public chatShow = false;
	public meetingShow = false;
	public callShow = false;
	public taskShow = false;
	public notificationsShow = false;
	public groupShow = false;
	public deviceShow = false;
	public roleName;
	private message;
	isMapActive = false;
	isSendMessage = true;
	latitude = 51.678418;
	longitude = 7.809007;
	loadMoreButton;
	test = true;
	globalValue;
	profile_pic;
	public isAttachMentOpen = false;
	uploadProgress = false;
	public imageLink;
	test1 = 'hi';
	sUser: any;
	private subscriptions: Array<Subscription> = [];
    
    @Input() subject: any
    @Input() people: any

    constructor(private xmppChatService: XmppChatService,
        private breakpointObserver: BreakpointObserver,
        private spinner: NgxSpinnerService){ }

	events: string[] = [];
	users: string[] = [];
	opened: boolean;
	dummyUser = [];
	groups = [];
	group;
	isProgress = false;
	isOpened = false;
	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches));

    ngOnInit(): void {
        // this.selectedGroup.isgroup = true;
        // this.selectedGroup.profile_pic = '';
        // this.setXamppChatSelectedGroup();

        this.sUser = JSON.parse(localStorage.getItem('sessionUser'));
        // if (!this.selectedGroup) {
        //     this.selectedGroup = JSON.parse(localStorage.getItem('selected_subject'));
        //     // this.selectedGroup = this.chatService.selectedGroup;
        //     console.log('select', this.selectedGroup);
        // }

        let clearIntervalid: any;
        userStore = JSON.parse(localStorage.getItem('sessionUser'));
        console.log(this.xmppChatService.connection);
        if (!userStore) {
            clearIntervalid = setInterval((x) => {
                userStore = JSON.parse(localStorage.getItem('sessionUser'));
            }, 1000);
        } else {
            if (clearIntervalid) {
                clearInterval(clearIntervalid);
            }
            this.xmppChatService.checkConnection(userStore);
        }

        this.setAllSubscriptions();
        // this.selectchatuser(this.xmppChatService.selectedGroup);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!!changes.subject && !!changes.subject.currentValue) {
            this.subject = changes.subject.currentValue
            console.log(this.subject)
            this.spinner.show();
            setTimeout(() => {
                this.loadChatWindowForSubject();
            }, 1000);
            
        }

        if (!!changes.people && changes.people.currentValue !== undefined) {
            this.people = changes.people.currentValue
            console.log(this.people)
            this.selected_user(this.people);
        }
    }

    loadChatWindowForSubject() {
        this.selectedGroup.isgroup = true;
        this.selectedGroup.profile_pic = '';
        this.setXamppChatSelectedGroup();
        if (!this.selectedGroup) {
            this.selectedGroup = this.subject;
            // this.selectedGroup = this.chatService.selectedGroup;
            console.log('select', this.selectedGroup);
        }
        
        this.selectchatuser(this.xmppChatService.selectedGroup);
    }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  urlify(text) {
    const urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
  }

  showInfo() {
    alert('Comming Soon..');
  }

  setAllSubscriptions() {
    // Chat
    this.xmppChatService.onChatHistory$.subscribe((chat) => {
        var userStore = JSON.parse(localStorage.getItem("sessionUser"));
        if (chat.isgroup) {
            // if(chat.username){
    
            if (userStore.user_name != chat.username) {
            chat.isnew = true;
            console.log("from left panel add history group")
            this.xmppChatService.AddtoHistory(chat);
            if (this.selectedGroup.user_name != chat.username) {
            //   this.playSound();
            }
            }
            else {
            this.xmppChatService.AddtoHistory(chat);
            }
            // }
        } else {
            if (chat.username) {
            if (userStore.user_name != chat.username) {
                chat.isnew = true;
                console.log("from left panel add history")
                this.xmppChatService.AddtoHistory(chat);
                if (this.selectedGroup.user_name != chat.username) {
                // this.playSound();
                }
            }
            }
        }
        // this.callsComponent.ShowHistory();
    
    });

	this.subscriptions.push(
        this.xmppChatService.onStatusChange$.subscribe((status) => {
            connectionStatus = status;
        })
	);
	
	// this.xmppChatService.subscribeSendRequest();
    if (this.xmppChatService.getConnection() != null) {
        if (this.xmppChatService.getConnection().connected === true) {
            this.isConnected = true;
        }
	}
	
	// on selected change
    this.subscriptions.push(
        this.xmppChatService.chatProgress$.subscribe((val) => {
            this.isProgress = val;
        })
	);
	
	this.subscriptions.push(
        this.xmppChatService.onSelectedGroup$.subscribe((group) => {
            this.selectedGroup = group;
            console.log('select', this.selectedGroup);
            // selectedGroup.created_by == sUser.id ? true: (sUser.company_id == globalValue.company_id) ? (!selectedGroup.is_pinned || (selectedGroup.is_pinned && selectedGroup.is_allow_contributor)) : sUser.is_company_admin || !selectedGroup.is_pinned || (selectedGroup.is_pinned && selectedGroup.is_allow_contributor)
        })
	);
	
	this.subscriptions.push(
        this.xmppChatService.chatStatus$.subscribe((chatstatus) => {
            this.chatStatus = chatstatus;
        })
    );

	this.subscriptions.push(
        this.xmppChatService.onConnect$.subscribe((onConnect) => {
            this.isConnected = onConnect;
        })
	);
	
	// when message come
	this.subscriptions.push(
		this.xmppChatService.onMessage$.subscribe((msg) => {
			const userdetails = { profile_pic: '', username: '' };
			let pushMSG;
			const newDate = new Date(parseFloat(msg.stamp));
			let splitHashFromMessage;
			if (msg.isCallSession === true) {
				splitHashFromMessage = msg.message.split('#');
			}

			// const hasLink = linkify.test(msg.message);
			// if (hasLink) {
			//   const linkData = this.urlify(msg.message);
			//   msg.msgWithLink = linkData;
			// }

			if (msg.username === JSON.parse(localStorage.getItem('sessionUser')).user_name) {
				pushMSG = {
					msg: msg.isCallSession ? splitHashFromMessage[0] : msg.message,
					from: '', // "me",
					align: 'right',
					id: msg.id,
					profile_pic: userdetails.profile_pic,
					// "image_url": JSON.parse(localStorage.getItem('sessionUser')).image_url || 'assets/images/icons/user_icon.png',
					stamp: newDate.toLocaleString(undefined, {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					}),
					isFile: msg.isFile === true ? msg.isFile : false,
					fileType: msg.isFile === true ? msg.fileType : null,
					fileShortName: msg.isFile === true ? msg.fileShortName : null,
					thumbnail: msg.isFile === true && msg.fileType === 'image' ? msg.thumbnail : null,
					isLoader: msg.isLoader === true ? true : false,
					isCallSession: msg.isCallSession === true ? msg.isCallSession : false,
					conferenceId: msg.isCallSession === true ? msg.conferenceId : false,
					callSessionId: msg.isCallSession === true ? msg.callSessionId : false,
					conferenceType: msg.isCallSession === true ? msg.conferenceType : false,
					msgWithLink: msg.msgWithLink,
					// "sendingFailed" : this.isConnected ? true : false,
					sendingFailed: msg.room ? (this.isConnected ? true : false) : true,
					sendingFailedText: this.isConnected ? true : false
				};
			} else {
				pushMSG = {
					msg: msg.isCallSession ? splitHashFromMessage[1] : msg.message,
					from: msg.username,
					align: 'left',
					id: msg.id,
					profile_pic: userdetails.profile_pic,
					// "image_url": this.user_image,
					stamp: newDate.toLocaleString(undefined, {
						day: 'numeric',
						month: 'numeric',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit'
					}),
					isFile: msg.isFile === true ? msg.isFile : false,
					fileType: msg.isFile === true ? msg.fileType : null,
					fileShortName: msg.isFile === true ? msg.fileShortName : null,
					thumbnail: msg.isFile === true && msg.fileType === 'image' ? msg.thumbnail : null,
					isLoader: false,
					isCallSession: msg.isCallSession === true ? msg.isCallSession : false,
					conferenceId: msg.isCallSession === true ? msg.conferenceId : false,
					callSessionId: msg.isCallSession === true ? msg.callSessionId : false,
					conferenceType: msg.isCallSession === true ? msg.conferenceType : false,
					msgWithLink: msg.msgWithLink,
					sendingFailed: msg.room ? (this.isConnected ? true : false) : true,
					sendingFailedText: this.isConnected ? true : false
				};
				if (!msg.getDataFromService) {
					// if (this.callScreenSideNavShowData !== 'chat') {
					//     this.openViduChatService.addMessageUnread();
					//     // this.notificationService.xamppNewMessage(msg.username.toUpperCase());
					// }
				}
			}

			// is new message
			let newmessage = true;
			for (let i = 0; i < this.xmppChatService.chats.length; i++) {
				if (this.xmppChatService.chats[i].id === pushMSG.id) {
					newmessage = false;
					break;
				}
			}
			if (newmessage) {
				if (msg.unshift) {
					this.xmppChatService.chats.unshift(pushMSG);
				} else {
					this.xmppChatService.chats.push(pushMSG);
					//this.uiModificationForRoomDetails();
				}
				
			}
		})
	);

	// chat list update
	this.subscriptions.push(
		this.xmppChatService.chatList$.subscribe((chat) => {
			this.chatlist = [];
			let tempChatList = [];
			tempChatList = chat;
			for (let i = 0; i < tempChatList.length; i++) {
				if (tempChatList[i].msg === undefined) {
					tempChatList[i].msg = '';
				}
			}
			this.chatlist = tempChatList;
			console.log('chatList:', this.chatlist);
			// this.UiModification();
		})
	);
  }

//   eventKeyPress(event) {
//     $('#fileUpload').hide(500); // to toggol file picker
//     if (event && event.keyCode === 13) {
//         // this.sendMessage();
//         this.msg.trim();
//         if (this.msg.trim() === '') {
//             this.msg = '';
//             return;
//         }
//         if (this.selectedGroup.isgroup === true) {
//             this.sendgroupmessage();
//         } else {
//             this.sendMSG();
//         }
//     }
//   }

  enter(event) {
    $('#fileUpload').hide(500); // to toggol file picker
    if (event. keyCode === 13) {
        this.msg.trim();
        if (this.msg.trim() === '') {
            this.msg = '';
            Swal.fire({
                title: 'Empty',
                text: 'Message field can not be empty',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        if (this.selectedGroup.isgroup === true) {
            this.sendgroupmessage();
        } else {
            this.sendMSG();
        }
    }
  }

  send() {
    $('#fileUpload').hide(500); // to toggol file picker
    if (this.msg.trim() === '') {
        this.msg = '';
        Swal.fire({
            title: 'Empty',
            text: 'Message field can not be empty',
            timer: 2000,
            showConfirmButton: false
        });
        return;
    }
    if (this.selectedGroup.isgroup === true) {
        this.sendgroupmessage();
    } else {
        this.sendMSG();
    }
  }

  sendMSG() {
    this.sentUser = this.selectedGroup.user_name + "@" + environment.host;
    var userStore = JSON.parse(localStorage.getItem("sessionUser"));
    if (this.msg == undefined) {
      this.msg = "";
    }
    // this.chatService.checkConnection(userStore);
    console.log(this.xmppChatService.connection);
    if (this.msg != undefined && this.msg.trim().length > 0) {
      // this._chatService.sendMessage("admin3@ums132.einfochips.com", this.msg);
      var timestamp = new Date().getTime();
      var d = new Date(timestamp); // The 0 there is the key, which sets the date to the epoch

      if (this.xmppChatService.connection != null) {
        this.xmppChatService.sendMessage(this.sentUser, this.msg.trim(), userStore.user_name + "@" + environment.host, timestamp);
      } else if (this.xmppChatService.connection == null) {
        // this.saveChatDataLocally_When_User_Offline(this.sentUser, this.msg.trim(), userStore.user_name + "@" + GlobalValue.host, timestamp, 'chat');
      }

      //d.setUTCSeconds(timestamp);
      var randomId = Math.random();
      var pushMSG = {
        "from": "",//"me",
        "msg": this.msg,
        "align": "right",
        "image_url": "",
        "stamp": d.toLocaleString(undefined, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        id: randomId,
        sendingFailedText: this.isConnected ? true : false,
      };
      this.xmppChatService.chats.push(pushMSG);
      this.xmppChatService.chatListAdd(this.xmppChatService.chats);
      // for bind recent history
      var historyMsg = {
        stamp: timestamp,
        user_id: this.sentUser,
        message: pushMSG.msg,
        username: this.selectedGroup.user_name,
        profile_pic: this.selectedGroup.profile_pic,
        group_type: 'friend'

      };
      console.log("from friend com add history")
      this.xmppChatService.AddtoHistory(historyMsg, "fromSelect_seen");
      // this.callsComponent.ShowHistory();
    }
    this.msg = "";
  }

  sendMSGWithFile(contentType, fileLink, thumbnailLink?, toUserName?) {
    // this.sentUser = this.selectedGroup.user_name + "@" + GlobalValue.host;

    this.sentUser = toUserName + '@' + environment.host;
    const userStore = JSON.parse(localStorage.getItem('sessionUser'));
    if (this.msg == undefined) {
        this.msg = '';
    }
    console.log(this.xmppChatService.connection);
    // if (this.msg != undefined && this.msg.trim().length > 0) {
    // this._chatService.sendMessage("admin3@ums132.einfochips.com", this.msg);
    const timestamp = new Date().getTime();
    // if(this.chatService.connection != null){
    //   this.chatService.sendMessage(this.sentUser, this.msg.trim(), userStore.user_name + "@" + GlobalValue.host, timestamp, null, contentType, fileLink, thumbnailLink);
    // } else if(this.chatService.connection == null){
    //   this.saveChatDataLocally_When_User_Offline(this.sentUser, this.msg.trim(), userStore.user_name + "@" + GlobalValue.host, timestamp, 'chat', null, contentType, fileLink, thumbnailLink);
    // }
    this.xmppChatService.sendMessage(
        this.sentUser,
        this.msg.trim(),
        userStore.user_name + '@' + environment.host,
        timestamp,
        null,
        contentType,
        fileLink,
        thumbnailLink
    );
    const d = new Date(timestamp); // The 0 there is the key, which sets the date to the epoch
    // d.setUTCSeconds(timestamp);
    const randomId = Math.random();
    const splitFilename = fileLink.split('/');
    const fileShortName = splitFilename[splitFilename.length - 1];
    if (toUserName === this.selectedGroup.user_name) {
        const pushMSG = {
            from: '', // "me",
            msg: fileLink,
            align: 'right',
            image_url: '',
            stamp: d.toLocaleString(undefined, {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            id: randomId,
            isFile: true,
            fileType: contentType,
            fileShortName: fileShortName,
            thumbnail: thumbnailLink,
            // sendingFailedText : this.isConnected ? true : false,
            sendingFailedText: true
        };
        this.xmppChatService.chats.push(pushMSG);
        this.xmppChatService.chatListAdd(this.xmppChatService.chats);
    }
  }

  sendgroupmessage() {
    const ms = this.msg.trim();
    if (this.xmppChatService.connection != null) {
        this.xmppChatService.connectChatRoom(this.selectedGroup.group_id);
        const res = this.xmppChatService.sendMessageToRoom(this.selectedGroup.group_id + '@conference.' + environment.host, ms);
    } else if (this.xmppChatService.connection == null) {
        // const timestamp = new Date().getTime();
        // this.saveChatDataLocally_When_User_Offline(
        //     this.selectedGroup.group_id + '@conference.' + GlobalValue.host,
        //     ms,
        //     null,
        //     timestamp,
        //     'groupChat'
        // );
        // const d = new Date(timestamp); // The 0 there is the key, which sets the date to the epoch
        // const randomId = Math.random();
        // const pushMSG = {
        //     from: '', // "me",
        //     msg: this.msg,
        //     align: 'right',
        //     image_url: '',
        //     stamp: d.toLocaleString(undefined, {
        //         day: 'numeric',
        //         month: 'numeric',
        //         year: 'numeric',
        //         hour: '2-digit',
        //         minute: '2-digit'
        //     }),
        //     id: randomId,
        //     sendingFailed: this.isConnected ? true : false,
        //     sendingFailedText: this.isConnected ? true : false
        // };
        // this.chatService.chats.push(pushMSG);
        // this.chatService.chatListAdd(this.chatService.chats);
    }
    this.msg = '';
  }

  sendgroupmessageWithFile(fileUrl, contantType, thumbnailLink, toGroup) {
    this.xmppChatService.connectChatRoom(toGroup); // here user_name = groupid
    const ms = fileUrl;
    const res = this.xmppChatService.sendMessageToRoom(toGroup + '@conference.' + environment.host, ms, contantType, thumbnailLink);
    this.msg = '';
    fileUrl = '';
  }

  retry() {
    const user = JSON.parse(localStorage.getItem('sessionUser'));
    const data = { user_name: user.user_name, password: user.password };
    this.xmppChatService.checkConnection(data);
  }

  selectUser(roleName) {
    this.roleName = roleName;
  }

  composing(event) {
    // if (event.type === 'keypress') {
    //     // this.isAttachMentOpen = false
    //     $('#fileUpload').hide(500);
    // }
    // this.xmppChatService.onSelectedGroup$.subscribe((group) => {
    //     this.selectedGroup = group;
    // });
    // if (this.selectedGroup.isgroup) {
    // 	var chat = { user_name: this.selectedGroup.group_id + '@conference.' + environment.host, status: 'composing', isgroup: true };
    // 	this.xmppChatService.sendChatStatus(chat);
    // } else {
    // 	var chat = { user_name: this.selectedGroup.user_name + '@' + environment.host, status: 'composing', isgroup: false };
    // 	this.xmppChatService.sendChatStatus(chat);
    // }
  }

  composingOut(event) {
    // $('#fileUpload').hide(500); // to toggol file picker
    // this.xmppChatService.onSelectedGroup$.subscribe((group) => {
    //     this.selectedGroup = group;
    // });
    // if (this.selectedGroup.isgroup) {
    // 	var chat = { user_name: this.selectedGroup.group_id + '@conference.' + environment.host, status: 'paused', isgroup: true };
    // 	this.xmppChatService.sendChatStatus(chat);
    // } else {
    // 	var chat = { user_name: this.selectedGroup.user_name + '@' + environment.host, status: 'paused', isgroup: false };
    // 	this.xmppChatService.sendChatStatus(chat);
    // }
  }

  fileTypeOpen() {
    // if(!this.uploadProgress){
    const e: any = $('#fileUpload');

    const x = document.getElementById('callChat');
    if (x) {
        if (x.querySelector('#fileUpload')) {
            // x.querySelector("#fileUpload").classList.toggle("show");
            // x.querySelector("#fileUpload").classList.toggle("hideCallViewFileupload");
            // var none = document.getElementById("fileUpload").style.display == "none";
            // var block = document.getElementById("fileUpload").style.display == "block";
            // if(document.getElementById("fileUpload").style.display == "none")
            // {
            //   x.querySelector("#fileUpload").setAttribute("style","display:block !important;display: flex;    position: absolute;top: -33px;left: 40px;")
            // } else {
            //   x.querySelector("#fileUpload").setAttribute("style","display:none !important;display: flex;    position: absolute;top: -33px;left: 40px;")
            // }
        }
    } else {
        $('#fileUpload').toggle(500);
    }
  }

  getFiles(e) {
    // document.getElementById('attachment').click();
    const filesArray = e.target.files;
    uploadingFileQueue = [];
    if (filesArray.length > 0) {
      for (let i = 0; i < filesArray.length; i++) {
        this.uploadProgress = true;
        let fileType = filesArray[i].type.substring(0, filesArray[i].type.indexOf('/'));
        let fileUploadIdentifiedId;

        if (fileType === 'application') {
            fileType = 'file';
        }
        // =================================

        const randomId = Math.floor(Math.random() * 100);
        fileUploadIdentifiedId = 'randomId_' + filesArray[i].lastModified + randomId;
        filesArray[i].fileUploadIdentifiedId = fileUploadIdentifiedId;

        const toUser = {
            user_name: this.selectedGroup.isgroup == true ? this.selectedGroup.user_id : this.selectedGroup.user_name,
            user_id: this.selectedGroup.user_id
        };

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const timestamp = new Date().getTime();
            const d = new Date(timestamp);

            let pushMSG: any;
            if (fileType === 'image') {
                pushMSG = {
                    from: '', // "me",
                    msg: e.target.result,
                    align: 'right',
                    image_url: '',
                    stamp: d.toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    thumbnail: e.target.result,
                    isFile: true,
                    fileType: fileType,
                    correctOrientation: true,
                    id: filesArray[i].fileUploadIdentifiedId,
                    isLoader: true,
                    fileShortName: filesArray[i].name,
                    // sendingFailedText : this.isConnected ? true : false,
                    sendingFailedText: true
                };
            } else {
                pushMSG = {
                    from: '', // "me",
                    msg: e.target.result,
                    align: 'right',
                    image_url: '',
                    stamp: d.toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    thumbnail: e.target.result,
                    isFile: true,
                    fileType: fileType,
                    id: filesArray[i].fileUploadIdentifiedId,
                    isLoader: true,
                    fileShortName: filesArray[i].name,
                    // sendingFailedText : this.isConnected ? true : false,
                    sendingFailedText: true
                };
            }

            this.xmppChatService.chats.push(pushMSG);
            this.xmppChatService.chatListAdd(this.xmppChatService.chats);
            this.onChange.emit(filesArray[i]);

            const currentUploadFiledata = {
                toUser: this.selectedGroup.user_name,
                fileType: fileType,
                fileId: fileUploadIdentifiedId,
                fileData: {
                    lastModified: filesArray[i].lastModified,
                    lastModifiedDate: filesArray[i].lastModifiedDate,
                    name: filesArray[i].name,
                    size: filesArray[i].size,
                    type: filesArray[i].type
                }
            };

            // push uploading queue data
            // uploadingFileQueue.push(currentUploadFiledata);
            // console.log(uploadingFileQueue)
            // localStorage.setItem("uploadingFileQueue", JSON.stringify(uploadingFileQueue))
        };
        reader.readAsDataURL(filesArray[i]);

        // =================================
        // upload file from here
        if (fileType) {
            // for new upload process (Http/Https)
            this.xmppChatService.audioVideoUpload(filesArray[i], fileUploadIdentifiedId, toUser).subscribe(
                (result) => {
                    if (result.status == 'ok') {
                        if (document.getElementById('callChat')) {
                            // this is for on call chat window.
                            const x = document.getElementById('callChat');
                            let uploadFileFind: any;
                            const randomId = result.result.uploading_file_id.toString();
                            uploadFileFind = x.querySelector('#' + randomId); // find uploaded preview and display none
                            console.log(result.result.uploading_file_id + '-' + uploadFileFind);
                            if (uploadFileFind) {
                                uploadFileFind.style.display = 'none';
                            }
                        }

                        let uploadFileFind: any;
                        uploadFileFind = document.getElementById('' + result.result.uploading_file_id); // find uploaded preview and display none
                        console.log(result.result.uploading_file_id + '-' + uploadFileFind);
                        if (uploadFileFind) {
                            uploadFileFind.style.display = 'none';
                        }

                        if (this.selectedGroup.isgroup) {
                            this.sendgroupmessageWithFile(
                                result.result.url,
                                fileType,
                                result.result.thumbnail,
                                result.result.toUser.user_name
                            );
                        } else {
                            this.sendMSGWithFile(
                                fileType,
                                result.result.url,
                                result.result.thumbnail,
                                result.result.toUser.user_name
                            );
                        }
                    }
                },
                (err) => {
                    console.log('from new upload method', err);
                    if (document.getElementById('callChat')) {
                        // this is for on call chat window.
                        const x = document.getElementById('callChat');
                        let uploadFileFind: any;
                        const randomId = fileUploadIdentifiedId.toString();
                        uploadFileFind = x.querySelector('#' + randomId); // find uploaded preview and display none
                        if (uploadFileFind) {
                            uploadFileFind.style.display = 'none';
                        }
                    }
                    let uploadFileFind: any;
                    uploadFileFind = document.getElementById('' + fileUploadIdentifiedId); // find uploaded preview and display none
                    if (uploadFileFind) {
                        uploadFileFind.style.display = 'none';
                    }
                    Swal.fire('Warning', 'Uploading failed, Please try again', 'warning');
                }
            );
        } else {
            // for Old Upload process (Slot request with Xammp) , only image and file
            Swal.fire('Warning', 'File are not supported yet.', 'warning');
        }
      }
    }
  }

  projectImage(file: File) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
          this.profile_pic = e.target.result;
          this.onChange.emit(file);
      };
      reader.readAsDataURL(file);
  }

  imageViewer(imgLink) {
      this.imageLink = null;
      this.imageLink = imgLink;

      const modal = document.getElementById('imageViewModal');
      // const toolbar_header = $('.toolbar_header').height();
      // const room_controller = $('#room-controller').height(); // footer part
      const windowHeight = window.innerHeight;

      // const middleHeight = windowHeight - (toolbar_header + room_controller);
      const middleHeight = windowHeight;
      $('.popUpImageModal').css('height', middleHeight);
      if (modal) {
          $('#imageViewModal').show(500);
          // $('.headerTopLeft').css('z-index', '1');
      }
  }

  closeImage() {
      this.imageLink = null;
      if (document.getElementById('callChat')) {
          // this is for on call chat window.
          let modal: any;
          const x = document.getElementById('callChat');
          modal = x.querySelector('#imageViewModal');
          const sideTab = document.getElementById('sideTab');
          if (modal) {
              $('.headerTopLeft').css('z-index', '1000');
              modal.style.display = 'none';
              sideTab.style.display = 'block';
          }
      } else {
          const modal = document.getElementById('imageViewModal');
          const sideTab = document.getElementById('sideTab');
          if (modal) {
              // $('.headerTopLeft').css('z-index', '1000');
              modal.style.display = 'none';
              // sideTab.style.display = 'block';
          }
      }
  }

  editChat(chatData) {
      this.msg = chatData.msg;
      document.getElementById('msgInput').focus();
  }

  dragOver(ev) {
      ev.preventDefault();
      let chatTextAreaElement: any;
      chatTextAreaElement = document.getElementById('sendInput');
      chatTextAreaElement.style.backgroundColor = '#999';

      // placeholder
      let msgInputElement: any;
      msgInputElement = document.getElementById('msgInput');
      msgInputElement.classList.add('placeholderwhite');
      msgInputElement.placeholder = 'Drop your file here ... ';
  }

  dragLeave(ev) {
      ev.preventDefault();
      let chatTextAreaElement: any;
      chatTextAreaElement = document.getElementById('sendInput');
      chatTextAreaElement.style.backgroundColor = 'white';

      // placeholder
      let msgInputElement: any;
      msgInputElement = document.getElementById('msgInput');
      msgInputElement.classList.remove('placeholderwhite');
      msgInputElement.placeholder = 'Write here ... ';
  }

  drag(ev) {
      // Code here
  }

  drop(ev) {
      ev.preventDefault();
      const dragedFileList = {
          target: ev.dataTransfer // array of file.
      };

      // bysohan this.getFiles(dragedFileList);

      let chatTextAreaElement: any;
      chatTextAreaElement = document.getElementById('sendInput');
      chatTextAreaElement.style.backgroundColor = 'white';

      // placeholder
      let msgInputElement: any;
      msgInputElement = document.getElementById('msgInput');
      msgInputElement.classList.remove('placeholderwhite');
      msgInputElement.placeholder = 'Write here ... ';
  }

  scrollTop(id) {
      let scrollHere: any;
      scrollHere = document.getElementById(id);
      let rect = scrollHere.getBoundingClientRect();
      window.scrollTo(rect.x, rect.y);
      // $("#scrollHere").animate({ scrollTop: 0 }, "fast");
      // let scrollHere: any;
      // scrollHere = document.getElementById('scrollHere');
      // // scrollHere.scrollTop = 0;
      // scrollHere.body.scrollTop = 0; // For Safari
      // scrollHere.documentElement.scrollTop = 0;
  }

  loadMoreChat() {
    this.xmppChatService.pageNo = this.xmppChatService.pageNo + 1;
    this.xmppChatService.getMessages(this.selectedGroup.user_name + '@' + environment.host, this.xmppChatService.pageNo).subscribe((result) => {
        const r = result.resultset;
        // r.sort(function(z, y){
        //   return z.timestamp-y.timestamp;
        //  });
        if (r == null) {
            return;
        }
        if (r.length <= 0 || r.length <= 99) {
            this.xmppChatService.chatLoadMoreButton$.next(false);
        } else {
            this.xmppChatService.chatLoadMoreButton$.next(true);
        }
        r.forEach((element) => {
            //  var forwarded = element.xml.toString().getElementsByTagName('forwarded');
            this.xmppChatService.messageParse(element);
        });
    });

    let topMsgPossition: any;
    for (let i = this.chatlist.length - 1; i >= 0; i--) {
        topMsgPossition = document.getElementById(this.chatlist[i].id);
    }
    if (topMsgPossition) {
        topMsgPossition.scrollIntoView();
    }
  }

	setXamppChatSelectedGroup() {
		let meetingInfo;
		if (!meetingInfo) {
            // meetingInfo = JSON.parse(localStorage.getItem('selected_subject'));
            meetingInfo = this.subject;
			meetingInfo.isgroup = true;
			meetingInfo.user_name = meetingInfo.meeting_name;
			meetingInfo.group_name = meetingInfo.meeting_name;
			meetingInfo.user_id = meetingInfo.id;
			meetingInfo.group_id = meetingInfo.id;
			meetingInfo.is_active = meetingInfo.is_active;
			meetingInfo.conferance_id = meetingInfo.id;
			meetingInfo.conferance_name = meetingInfo.meeting_name;
			meetingInfo.conferance_type = 'group';
			meetingInfo.active_class_name = 'active-listItem';
			meetingInfo.company_id = meetingInfo.company_id;
			// meetingInfo.is_company_admin = this.sUser.is_company_admin;
			meetingInfo.created_by = meetingInfo.created_by;
		}
		this.xmppChatService.selectedGroup = meetingInfo;
	}

	selectchatuser(e) {
		// this.cssdisplay = 'display;';
		// this.xmppChatService.chatProgressListner.next(true);
		this.xmppChatService.pageNo = 1;
		if (e == null) {
			return false;
		}
		if (e.isgroup) {
			this.xmppChatService.chats = [];
			this.xmppChatService.chatListAdd(this.xmppChatService.chats);
			this.selectedGroup.isgroup = true;
			this.selectedGroup.user_name = e.group_name;
			this.selectedGroup.user_id = e.group_id;
			this.selectedGroup.group_id = e.group_id;
			this.xmppChatService.connectChatRoom(e.group_id);
			// this.chatService.ClearUnread(e.group_id + "@conference.alertcircle.com", e.id);
			this.xmppChatService.ClearUnread(e.group_id + '@conference.' + environment.host);
	
			this.xmppChatService.getConferanceMessages(e.group_id + '@conference.' + environment.host, this.xmppChatService.pageNo).subscribe(
				(result) => {
                    this.spinner.hide();
					const r = result.resultset;
					// this.xmppChatService.chatProgressListner.next(false);
					// if (r.length <= 0 || r.length <= 99) {
					// 	this.xmppChatService.chatLoadMoreButton$.next(false);
					// } else {
					// 	this.xmppChatService.chatLoadMoreButton$.next(true);
					// }
	
					// r.sort(function (z, y) {
					//   return z.timestamp - y.timestamp;
					// });
					r.forEach((element) => {
						//  var forwarded = element.xml.toString().getElementsByTagName('forwarded');
						element.getDataFromService = true; // this flag will track that, this data comes from rest api.
						this.xmppChatService.conMessageParse(element);
					});
				}, err => {
                    this.spinner.hide();
                }
				// ,
				// (err) => this.xmppChatService.chatProgressListner.next(false)
			);
		} else {
			const groupInfo = {
				is_active: true
			};
			// this.groupService.groupInfo(groupInfo);
			this.xmppChatService.chats = [];
			this.xmppChatService.chatListAdd(this.xmppChatService.chats);
			this.xmppChatService.ClearUnread(e.user_name + '@' + environment.host);
	
			this.xmppChatService.getMessages(e.user_name + '@' + environment.host, this.xmppChatService.pageNo).subscribe(
				(result) => {
					const r = result.resultset;
					// this.xmppChatService.chatProgressListner.next(false);

					// this.cssdisplay = 'display;';
					// if (r.length === 0 || r.length <= 99) {
					// 	this.xmppChatService.chatLoadMoreButton$.next(false);
					// } else {
					// 	this.xmppChatService.chatLoadMoreButton$.next(true);
					// }
					if (r == null) {
						return;
					}
					r.forEach((element) => {
						//  var forwarded = element.xml.toString().getElementsByTagName('forwarded');
						this.xmppChatService.messageParse(element);
					});
				}
				// ,
				// (err) => this.xmppChatService.chatProgressListner.next(false)
			);
		}
    }
    
    selected_user(e) {
        this.xmppChatService.openChattingWindowChange(true);
        e.conference_name = e.user_name;
        this.xmppChatService.chatProgressListner.next(true);
        // let groupInfo = {
        //   is_active: true
        // }
        let selectedUser = e;
        selectedUser.conferance_type = 'single';
        selectedUser.is_active = true;
        selectedUser.conference_name = e.user_name;
    
        // this.groupService.groupInfo(selectedUser);
    
        this.xmppChatService.chats = [];
        this.xmppChatService.pageNo = 1;
    
        var group = { iselected: true, isgroup: false, user_name: e.user_name, user_id: e.user_id, status: false, fusion_pbx: e.fusion_pbx, profile_pic: e.profile_pic };
        this.xmppChatService.onSelected(group);
        // this.xmppChatService.singleConference$.next(selectedUser) // for selectcd friend
        this.xmppChatService.chatListAdd(this.xmppChatService.chats);
        // this.chatService.gehistory(e.user_name + '@' + GlobalValue.host);
        this.xmppChatService.subscribePresence(e.user_name + '@' + environment.host);
        this.xmppChatService.ClearUnread(e.user_name + "@" + environment.host);
        this.xmppChatService.getMessages(e.user_name + '@' + environment.host, this.xmppChatService.pageNo).subscribe(
          result => {
            var r = result.resultset;
            this.xmppChatService.chatProgressListner.next(false);
            if (r == null) {
              return;
            }
            if (!r || r.length <= 0 || r.length <= 99) {
              this.xmppChatService.chatLoadMoreButton$.next(false)
            } else {
              this.xmppChatService.chatLoadMoreButton$.next(true)
            }
    
            // r.sort(function(z, y){
            //   return z.timestamp-y.timestamp;
            //  });
    
            var msg;
            msg = r[0];
            r.forEach(element => {
              //  var forwarded = element.xml.toString().getElementsByTagName('forwarded');
              this.xmppChatService.messageParse(element);
              // if (element.username == element.to.split('@')[0] && !msg) {
              //   msg = element;
              // }
              // msg = element;
            });
            if (msg != null) {
              msg.stamp = msg.timestamp;
              msg.user_id = e.user_name + "@" + environment.host;
              msg.message = msg.txt;
              msg.username = e.user_name
              msg.isgroup = false;
            //   msg.is_pinned = false;
              msg.is_allow_contributor = false;
              msg.company_id = this.sUser.company_id;
              msg.is_company_admin = this.sUser.is_company_admin;
              msg.group_owner = "";
              msg.profile_pic = e.profile_pic;
              console.log("from friend com add history")
              this.xmppChatService.AddtoHistory(msg, 'fromSelect_seen');
              // this.callsComponent.ShowHistory();
    
            }
          },
          err => {
            this.xmppChatService.chatProgressListner.next(false);
          }
        )
    }



}
