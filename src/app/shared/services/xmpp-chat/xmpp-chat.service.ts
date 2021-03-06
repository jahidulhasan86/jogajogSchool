import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment, group_type, online_status_xmpp, online_status_display } from 'src/environments/environment';
import { map, catchError, tap } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { Subject, Observable, BehaviorSubject, throwError } from 'rxjs';
import { GlobalService } from '../global/global.service';
import { Iuser } from '../../interfaces/Iuser';

declare var $: any;
declare var Strophe: any;
declare var $msg: any;
declare var $iq: any;
declare var $pres: any;
let isChatWindowOpen: boolean = false;

@Injectable({
	providedIn: 'root'
})
export class XmppChatService implements OnInit {
	// For Resource Services
	postRecording = `${environment.vchub}/recording`;
	getRecording = `${environment.vchub}/recording/getRecordings`;
	chatRegistrationURL: string = `${environment.chatService}/chat/register`;
	pubsubRegistrationURL: string = `${environment.notification}/notifications/pubsub/register`;
	subject_id: any;
	subjects = [];
	private fileUploadURl = `${environment.vchub}/files`;
	private getFileHistoryUrl = `${environment.vchub}/files/resources`;
	private recentChatUrl = `${environment.vchub}/recent`;
	// End Resources
	public connection = null;
	public chats = [];
	// public pageNo = 1;
	public notifications = [];
	// public notification_count = 0;
	// public notification_count_group = 0;
	// public notification_count_Total = 0;
	public chatHistory = [];
	public latestMessage: any = [];
	public presenceList = {};
	public selectedGroup;
	public domain;
	public admin_user;
	public username;
	public muc_service;
	public notifier_user_node;
	public ciphertext;
	public token;
	public userStore;
	// public isChatConnected = false;
	// public pubsubConnectedTime;

	onMessage$: Observable<any>;
	onPresence$: Observable<any>;
	onConnect$: Observable<any>;
	onStatusChange$: Observable<any>;
	onDisconnect$: Observable<any>;
	onNotification$: Observable<any>;
	onChatHistory$: Observable<any>;
	onTgChatUserPresence$: Observable<any>;
	onFriendUpddateMessage$: Observable<any>;
	onSelectedGroup$: Observable<any>;
	chatList$: Observable<any>;
	chatStatus$: Observable<any>;
	chatProgress$: Observable<any>;
	recentChatHistoryList$: Observable<any>;

	private myMessageListner = new Subject<any>();
	private presenseListner = new Subject<any>();
	private disconnectListner = new Subject<any>();
	public connectListner = new Subject<any>();
	private connectStatusListner = new Subject<any>();
	private onNotificationListner = new Subject<any>();
	private onChatHistoryListner = new Subject<any>();
	private tgChatUserPresenceListner = new Subject<any>();
	private friendUpdateListener = new Subject<any>();
	private selectedGroupListner = new Subject<any>();
	private chatListListner = new Subject<any>();
	private chatStatusListner = new Subject<any>();
	public chatProgressListner = new Subject<any>();
	public recentChatHistoryListListner = new Subject<any>();
	public chatconnectedTime = new Date();

	isChatSelected: boolean = false;

	public protocol;

	chatLoadMoreButton$ = new BehaviorSubject<boolean>(false);
	chatLoadMoreButtonCast = this.chatLoadMoreButton$.asObservable();
	public allContactWithStatusList = [];

	public openChattingWindow$ = new BehaviorSubject<boolean>(false);
	openChattingWindowCast = this.openChattingWindow$.asObservable();

	public xmMenuSelected = new BehaviorSubject<boolean>(false);
	xmMenuSelectedObserver = this.xmMenuSelected.asObservable();

	public liveXmMenuSelected = new BehaviorSubject<boolean>(false);
	liveXmMenuSelectedObserver = this.liveXmMenuSelected.asObservable();

	public viewXmMenuSelected = new BehaviorSubject<boolean>(false);
	viewXmMenuSelectedObserver = this.viewXmMenuSelected.asObservable();

	public teacherXmMenuSelected = new BehaviorSubject<boolean>(false);
	teacherXmMenuSelectedObserver = this.teacherXmMenuSelected.asObservable();

	public teacherViewXmMenuSelected = new BehaviorSubject<boolean>(false);
	teacherViewXmMenuSelectedObserver = this.teacherViewXmMenuSelected.asObservable();

	public dashboard$ = new BehaviorSubject<boolean>(false);
	dashboardObserver = this.dashboard$.asObservable();

	public isAnyClassCallActivities = new BehaviorSubject<object>(null);
	isAnyClassCallActivitiesObserver = this.isAnyClassCallActivities.asObservable();

	public chatMessages = new BehaviorSubject<object>(null);
	chatMessagesObserver = this.chatMessages.asObservable();

	public isChatTabSelected = new BehaviorSubject<boolean>(false);
	isChatTabSelectedObserver = this.isChatTabSelected.asObservable();

	private openGeoFenceManagementWindow$ = new BehaviorSubject<boolean>(false);
	openGeoFenceManagementWindowsCast = this.openGeoFenceManagementWindow$.asObservable();

	private currentUser = null;
	currentTab;
	sUser: any;
	allUserByComByApp: any[];
	public pageNo = 1;

	public notification_count = 0;
	public notification_count_group = 0;
	public notification_count_Total = 0;
	public isChatConnected = false;
	public pubsubConnectedTime;

	public stdClassSummaryViewSelected = new BehaviorSubject<boolean>(false);
	stdClassSummaryViewObserver = this.stdClassSummaryViewSelected.asObservable();

	public fileUploadActivities = new BehaviorSubject<object>(null);
	fileUploadActivitiesObserver = this.fileUploadActivities.asObservable();

	private pushMessage = new BehaviorSubject<any>(null)

	private presence = new BehaviorSubject<any>(null)

	imgSrc: any;

	currentStatusName: any;

	arrow_down = "../../../../assets/images/chat-status/profile_arrow_icon_down.png"

	openChattingWindowChange(isShow, is_recent?) {
		isChatWindowOpen = isShow;
		if (is_recent === true) {
			this.openChattingWindow$.next(isShow);
		}
	}


	constructor(private http: HttpClient,
		private gSS: GlobalService) {
		this.onMessage$ = this.myMessageListner.asObservable();
		this.onPresence$ = this.presenseListner.asObservable();
		this.onConnect$ = this.connectListner.asObservable();
		this.onStatusChange$ = this.connectStatusListner.asObservable();
		this.onDisconnect$ = this.disconnectListner.asObservable();
		this.onNotification$ = this.onNotificationListner.asObservable();
		this.onChatHistory$ = this.onChatHistoryListner.asObservable();
		this.onTgChatUserPresence$ = this.tgChatUserPresenceListner.asObservable();
		this.onFriendUpddateMessage$ = this.friendUpdateListener.asObservable();
		this.onSelectedGroup$ = this.selectedGroupListner.asObservable();
		this.chatList$ = this.chatListListner.asObservable();
		this.chatStatus$ = this.chatStatusListner.asObservable();
		this.chatProgress$ = this.chatProgressListner.asObservable();
		this.recentChatHistoryList$ = this.recentChatHistoryListListner.asObservable();
	}

	ngOnInit(): void {
	}

	connect(user) {
		if (user.user_name) {
			user.username = user.user_name;
		}
		let WEBSOCKET_SERVICE = environment.chatwss;
		if (this.connection != null) {
			this.connection.reset();
		} else {
			// this.connection = null;
			this.connection = new Strophe.Connection(WEBSOCKET_SERVICE);
		}
		this.username = user.username;
		this.userStore = user;
		try {
			this.connection.connect(user.username + '@' + environment.host, user.password, this.onConnect.bind(this));
		} catch (error) {
			this.connectListner.next(false);
			console.log('connection error: ' + error);
		}
	}

	onSelected(selected) {
		this.selectedGroup = selected;
		try {
			// this.getPresence(selected.user_name+"@"+GlobalValue.host);
			let statusobj = this.presenceList[selected.user_name];
			if (statusobj === 'online' || statusobj === online_status_xmpp.online) {
				this.selectedGroup.status = true;
			}
			console.log(this.presenceList);
		} catch (ex) {
			console.log(ex);
		}
		this.selectedGroupListner.next(selected);
	}

	chatListAdd(chat) {
		this.chatListListner.next(chat);
	}
	chatNotificationAdd(notification) {
		this.onNotificationListner.next(notification);
	}
	getConnection() {
		return this.connection;
	}

	Connectpubsub(tokenObj) {
		let gSSRef = this.gSS;
		let iq = $iq({
			type: 'set',
			from: tokenObj.user_name + '@' + tokenObj.ejabberd_host,
			to: tokenObj.pubsub_host
		})
			.c('pubsub', { xmlns: 'http://jabber.org/protocol/pubsub' })
			.c('subscribe', {
				node: '/home/' + tokenObj.ejabberd_host + '/' + tokenObj.user_name + '/notifications',
				jid: tokenObj.user_name + '@' + tokenObj.ejabberd_host
			});
		this.connection.addHandler(this.on_connect, null, 'message', null, null, null);
		this.connection.sendIQ(
			iq.tree(),
			function (sucess) {
				// console.log('Sucess: PUBSUB'); // off by jahid
				// console.log(sucess);
				gSSRef.pubsubNodeServer.next(true);
			},
			function (error) {
				console.log('Error: PUBSUB ');
				console.log(error);
				gSSRef.pubsubNodeServer.next(false);
			}
		);
	}
	on_connect(message) {
		// console.log(message); // off by jahid
	}
	onConnect(status) {
		if (status === Strophe.Status.CONNECTING) {
			console.log('Strophe is connecting.');
		} else if (status === Strophe.Status.AUTHFAIL) {
			console.log('Strophe failed to connect.AUTHFAIL');
			this.connectListner.next(false);
			this.gSS.xmppAuth.next(false);
		} else if (status === Strophe.Status.ERROR) {
			console.log('Strophe failed to connect.ERROR');
			this.connectListner.next(false);
			this.gSS.xmppAuth.next(false);
		} else if (status === Strophe.Status.CONNFAIL) {
			console.log('Strophe failed to connect.');
			this.connectListner.next(false);
			this.gSS.xmppAuth.next(false);
		} else if (status === Strophe.Status.DISCONNECTING) {
			console.log('Strophe is disconnecting.');
			this.connectListner.next(false);
			this.gSS.xmppAuth.next(false);
		} else if (status === Strophe.Status.DISCONNECTED) {
			console.log('Strophe is disconnected.');
			this.connection.reset();
			// Reconnect if session is alive
			if (localStorage.getItem('sessionUser')) {
				console.log('reconnecting...');
				// this.connection = null;
			}
			localStorage.setItem('stroph_connection', 'false');
			this.connectListner.next(false);
			this.gSS.xmppAuth.next(false);
		} else if (status === Strophe.Status.CONNECTED) {
			this.connectListner.next(true);
			//Set xmppAuth Server Status
			this.gSS.xmppAuth.next(true);
			setTimeout(() => {
				console.log('connected..........');
				this.connectListner.next(true);
			}, 6000);

			console.log('Strophe is connected.');
			this.chatconnectedTime.setSeconds(this.chatconnectedTime.getSeconds() + 1);
			console.log('connected time:' + this.chatconnectedTime);
			// this.subscribeSendRequest();
			this.subscribePresence(this.connection.authzid);
			let tokenObj = JSON.parse(localStorage.getItem('pubsub'));
			this.Connectpubsub(tokenObj);
			this.connection.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);

			//  this.connection.addHandler(this.onOwnMessage.bind(this), null, 'iq', 'set', null, null);
			this.connection.addHandler(this.onPresence.bind(this), null, 'presence');
			this.connection.addHandler(this.onSubscriptionRequest.bind(this), null, 'presence', 'subscribe');

			this.connection.muc.init(this.connection);
			this.connection.send($pres({ priority: 10 }).tree());

			let sta = new Strophe.Builder('presence').c('status').t('be right  back').up().c('show').t('away');
			this.connection.send(sta.tree());
			localStorage.setItem('stroph_connection', 'true');
			//test
			this.connection.roster.init(this.connection);

			this.connection.send($pres());

			//test
			//   this.connection.chatstates.init(this.connection);
			this.connection.chatstates.init(this.connection);
			this.connection.mam.init(this.connection);
			this.connection.archive.init(this.connection);
		} else {
			this.connectListner.next(false);
		}
	}

	onNotificationRecive(message) {
		console.log(message);
		return true;
	}

	groupOnMessage(msg) {
		console.log(msg);
	}
	//send chat status to show composing
	sendChatStatus(chat) {
		if (chat.isgroup) {
			let msg = $msg({ to: chat.user_name, type: 'groupchat' })
				.c('body')
				.t()
				.up()
				.c('x', { xmlns: 'jabber:x:delay', stamp: 124578787 })
				.t(124578787);
			if (this.connection != null) {
				this.connection.muc.composing(chat.user_name, chat.status, chat.status);
			}
			return;
		}
		if (chat.status === 'paused' && chat.isgroup === false) {
			this.connection.chatstates.sendPaused(chat.user_name, chat.status);
		} else if (chat.status === 'composing' && chat.isgroup === false) {
			this.connection.chatstates.sendComposing(chat.user_name, chat.status);
		}
	}

	subscribeSendRequest() {
		// Tonmoy Comment
		// this.accountService.allContactWithStatusByUserIdCast.subscribe((friendlist) => {
		// 	this.allContactWithStatusList = friendlist;
		// });
		this.allContactWithStatusList = JSON.parse(localStorage.getItem('friendlist'));
		try {
			if (this.allContactWithStatusList) {
				for (var i = this.allContactWithStatusList.length - 1; i >= 0; i--) {
					if (this.connection != null) {
						this.connection.send(
							$pres({
								to: this.allContactWithStatusList[i].name + '@' + environment.host, // buddy jid
								type: 'subscribe'
							})
						);
						return true;
					}
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	}

	singleSubscribeSendRequest(friendUserName) {
		if (this.connection != null) {
			setTimeout((x) => {
				this.connection.send(
					$pres({
						to: friendUserName + '@' + environment.host, // buddy jid
						type: 'subscribe'
					})
				);
				console.log('roster done');
				return true;
			}, 200);
		}
	}

	onPresence(presence) {
		this.sUser = JSON.parse(localStorage.getItem('sessionUser'));
		// const accService = this.moduleRef.injector.get(AccountService);
		//  try {
		// console.log('presence: ') // off by jahid
		// console.log(presence)

		let presence_type = presence.getAttribute('type'); // unavailable, subscribed, etc...
		let from = presence.getAttribute('from').split('@')[0]; // the jabber_id of the contact
		if (presence.getElementsByTagName('show').length > 0) {
			presence_type = Strophe.getText(presence.getElementsByTagName('show')[0]);
			/* if (Strophe.getText(presence.getElementsByTagName('show')[0])  === 'unavailable') {
				presence_type = 'unavailable'
			} */
		}
		//   // console.log('Presence type before' ,presence_type)
		//   var presenceData;
		if (!presence_type) { presence_type = online_status_xmpp.online; }
		let val = { user_name: from, presence_type: presence_type };
		try {
			if (this.presenceList === null) {
				this.presenceList = {};
			} else {
				this.presenceList[from] = presence_type;
			}

			if (this.sUser.company_id === environment.company_id) {
				// default or Private company or friend
				// Tonmoy Comment
				// this.accountService.allContactWithStatusByUserIdCast.subscribe((friendlist) => {
				// 	this.allContactWithStatusList = friendlist;
				// });

				if (this.allContactWithStatusList) {
					for (let i = this.allContactWithStatusList.length - 1; i >= 0; i--) {
						let statusobj = this.presenceList[this.allContactWithStatusList[i].user_name];
						this.allContactWithStatusList[i].onlineStatus = statusobj;
						if (statusobj === online_status_xmpp.online) {
							this.allContactWithStatusList[i].isOnline = true;
						} else {
							this.allContactWithStatusList[i].isOnline = false;
						}
					}
				}
			} else {
				// Other company / Colleague
				let resultList;
				// Tonmoy Comment
				// this.accountService.getAllUsersByComByAppCast.subscribe((result) => {
				// 	resultList = result;
				// });
				this.allUserByComByApp = [];

				resultList.forEach((friend) => {
					let friendObj = {
						user_id: friend.user_id,
						user_name: friend.user_name,
						friends_id: '',
						is_accept: true,
						onlineStatus: '',
						isOnline: null
					};

					let currentOnlineUser = this.presenceList;
					//   console.log("Current Online") // off by jahid
					//   console.log(currentOnlineUser);
					// for (var i = this.allUserByComByApp.length - 1; i >= 0; i--) {
					let statusobj = currentOnlineUser[friendObj.user_name];
					friendObj.onlineStatus = statusobj;
					if (statusobj === online_status_xmpp.online) {
						friendObj.isOnline = true;
					} else {
						friendObj.isOnline = false;
					}
					this.allUserByComByApp.push(friendObj);
					// }
				});
				resultList = this.allUserByComByApp;
				// Tonmoy Comment
				// this.accountService.getAllUsersByComByApp$.next(resultList);
			}

			///// this area is used for selected chat user's online status change
			this.presenseListner.next(val);
			this.setPresence(val)
			/////////
		} catch (ex) { }
		return true;
	}
	onSubscriptionRequest(stanza) {
		if (stanza.getAttribute('type') === 'subscribe') {
			let from = stanza.getAttribute('from');
			if (this.connection != null) {
				this.connection.send(
					$pres({
						to: from,
						type: 'subscribed'
					})
				);
			}
		}
		return true;
	}

	subscribePresence(jid) {
		if (this.connection != null && this.connection.connected === true) {
			this.connection.send(
				$pres({
					to: jid,
					type: 'subscribe'
				})
			);
			return true;
		} else {
			return false;
		}
	}

	onMessage(msg) {
		this.sUser = JSON.parse(localStorage.getItem('sessionUser'));
		// console.log(msg); // off by jahid
		if (this.chatconnectedTime > new Date()) {
			console.log('previews message. Discard!!!');
			return true;
		} else {
			try {
				let to = msg.getAttribute('to');
				let id = msg.getAttribute('id');
				let from = msg.getAttribute('from');
				let type = msg.getAttribute('type');
				let elems = msg.getElementsByTagName('body');
				let room = msg.getElementsByTagName('room');
				let delay = msg.getElementsByTagName('delay');
				let x = msg.getElementsByTagName('x');
				let content = msg.getElementsByTagName('content');
				let txt = msg.getElementsByTagName('txt');
				let contentType;
				let fileShortName;
				let conferenceId;
				let callSessionId;
				let conferenceType;
				let fileLink;
				let splitFilename;
				if (content.length > 0) {
					contentType = content[0].getAttribute('type');
					fileLink = content[0].innerHTML;
					splitFilename = fileLink.split('/');
					fileShortName = splitFilename[splitFilename.length - 1];
				}

				let callSession = msg.getElementsByTagName('CallSession');
				if (callSession.length > 0) {
					conferenceId = callSession[0].getAttribute('ConferenceId');
					callSessionId = callSession[0].getAttribute('CallSessionId');
					conferenceType = callSession[0].getAttribute('ConferenceType');
				}
				let forwarded = msg.getElementsByTagName('forwarded');

				let fromUser = from.split('@')[0];
				let stamp;
				// var history = false;
				if (delay.length > 0) {
					stamp = new Date(delay[0].getAttributeNode('stamp').nodeValue).getTime();
					//  history = true;
					//stamp = Strophe.getText(msg.getElementsByTagName('x')[0]);
				} else if (x.length > 0) {
					// stamp = msg.getElementsByTagName('x')[0].getAttribute('stamp');
					stamp = Strophe.getText(x[0]);
				} else {
					stamp = new Date().getTime();
				}

				if (forwarded.length > 0) {
					//  this.messageParse(msg,forwarded);
				} else if (type === 'chat' && elems.length > 0) {
					let archivedid = msg.getElementsByTagName('archived')[0].id;
					let body = elems[0];
					let msgData = {
						priority: 'NORMAL',
						// message: Strophe.getText(body),
						message: body.textContent,
						username: from.split('@')[0],
						to: to, // from.split("/")[0],
						from: from,
						type: type,
						stamp: stamp,
						user_id: from.split('/')[0],
						id: archivedid,
						isnew: true,
						isFile: content.length > 0 ? true : false,
						fileType: content.length > 0 ? contentType : null,
						fileShortName: content.length > 0 ? fileShortName : null,
						thumbnail: content.length > 0 && contentType === 'image' ? fileLink : null,
						isCallSession: callSession.length > 0 ? true : false,
						conferenceId: callSession.length > 0 ? conferenceId : false,
						callSessionId: callSession.length > 0 ? callSessionId : false,
						conferenceType: callSession.length > 0 ? conferenceType : false,

						is_admin: this.sUser.is_company_admin ? true : false,
						company_id: this.sUser.company_id,
						is_pinned: this.selectedGroup.is_pinned,
						allow_contributor: this.selectedGroup.is_allow_contributor,
						group_owner: this.selectedGroup.owner ? this.selectedGroup.owner : null
					};
					this.onChatHistoryListner.next(msgData);

					if (isChatWindowOpen) {
						if (this.selectedGroup === null || this.selectedGroup.user_name != fromUser) {
							this.notifications.push(msgData);
							this.onNotificationListner.next(this.notifications);
						} else {
							this.myMessageListner.next(msgData);
						}
					} else {
						this.notifications.push(msgData);
						this.onNotificationListner.next(this.notifications);
					}
				} else if (type === 'groupchat' && elems.length > 0 && !(from === this.admin_user + '@' + this.domain)) {
					let archivedid = id;
					if (msg.getElementsByTagName('archived').length > 0) {
						archivedid = msg.getElementsByTagName('archived')[0].id;
					}
					let body = elems[0];
					let msgTG = {
						room: msg.getAttribute('from').split('/')[0],
						to: to, // from.split("/")[0],
						from: from,
						// message: Strophe.getText(body),
						message: body.textContent,
						username: msg.getAttribute('from').split('/')[1],
						stamp: stamp,
						user_id: msg.getAttribute('from').split('/')[0],
						id: archivedid,
						isnew: false,
						isFile: content.length > 0 ? true : false,
						fileType: content.length > 0 ? contentType : null,
						fileShortName: content.length > 0 ? fileShortName : null,
						thumbnail: content.length > 0 && contentType === 'image' ? fileLink : null,
						isgroup: true,
						isCallSession: callSession.length > 0 ? true : false,
						conferenceId: callSession.length > 0 ? conferenceId : false,
						callSessionId: callSession.length > 0 ? callSessionId : false,
						conferenceType: callSession.length > 0 ? conferenceType : false,

						is_admin: this.sUser.is_company_admin ? true : false,
						company_id: this.sUser.company_id,
						is_pinned: this.selectedGroup.is_pinned,
						allow_contributor: this.selectedGroup.is_allow_contributor,
						group_owner: this.selectedGroup.owner ? this.selectedGroup.owner : null,
						group_name: this.selectedGroup.group_name,
						group_type: this.selectedGroup.group_type
					};
					let room = msg.getAttribute('from').split('@')[0];
					this.onChatHistoryListner.next(msgTG); // chat history object
					// if (this.selectedGroup  === null || this.selectedGroup.group_id != room) {
					//     this.notifications.push(msgTG);
					//     this.onNotificationListner.next(this.notifications); //onNotification
					// }
					// else {
					//     this.myMessageListner.next(msgTG); // onmessage$
					// }
					// this.isChatTabSelectedObserver.subscribe (xd => {
					// 	if (xd) {
					// 		this.isChatSelected = true;
					// 	} else {
					// 		this.isChatSelected = false;
					// 	}
					// });
					// if(isChatWindowOpen){
					if (this.selectedGroup === null || this.selectedGroup.group_id !== room) {
						this.notifications.push(msgTG);
						this.onNotificationListner.next(this.notifications);
					} else {
						this.notifications.push(msgTG);
						this.onNotificationListner.next(this.notifications);
						this.myMessageListner.next(msgTG);
					}
					// } else{
					//     this.notifications.push(msgTG);
					//     this.onNotificationListner.next(this.notifications);
					// }

					// var msgT = {
					//     room: msg.getAttribute('from').split('/')[0],
					//     to: to,// from.split("/")[0],
					//     from: from,
					//     message: Strophe.getText(body),
					//     username: msg.getAttribute('from').split('/')[1],
					//     stamp: stamp,
					//     user_id: msg.getAttribute('from').split('/')[0],
					//     id: archivedid,
					//     isnew: false,
					//     isgroup: true,
					// }
				} else if (type === 'headline') {
					let json = msg.getElementsByTagName('json');
					let isDeley = msg.getElementsByTagName('delay');
					if (json && json.length > 0 && isDeley.length <= 0) {
						if (json[0].textContent) {
							let parse = JSON.parse(json[0].textContent);
							let makePayload = { payload: JSON.stringify(parse.data), type: parse.type };
							let data = { data: makePayload };
							console.log('pubsub message from xmpp chat service', data);
							// this.MessagingService.currentMessage.next(data);
							this.setPushMessage(data)
						}
					}
				}

				//composing
				let composing = msg.getElementsByTagName('composing');
				let error = msg.getElementsByTagName('error');
				if (composing.length > 0 && error != null && error.length <= 0) {
					if (this.selectedGroup.user_name === fromUser && this.selectedGroup.isgroup === false && isChatWindowOpen) {
						let chat = { statusText: this.selectedGroup.user_name, isVisible: true };
						this.chatStatusListner.next(chat);
					} else if (this.selectedGroup.group_id === fromUser && this.selectedGroup.isgroup === true && isChatWindowOpen) {
						let toownid = to.split('@')[0];
						let fromownid = from.split('/')[1];
						if (toownid != fromownid && composing[0].nodeName === 'composing') {
							let chatt = { statusText: 'someone', isVisible: true };
							this.chatStatusListner.next(chatt);
						} else {
							let chatt = { statusText: 'someone', isVisible: false };
							this.chatStatusListner.next(chatt);
						}
					}
				} else {
					let chats = { statusText: '', isVisible: false };
					this.chatStatusListner.next(chats);
				}
			} catch (ex) {
				console.log('error in onmessage');
				console.log(ex);
			}
			return true;
		}
	}
	messageParse(msg) {
		let stamp;
		let xml = msg.xml;
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xml, 'text/xml');
		let content = xmlDoc.getElementsByTagName('content');
		let callSession = xmlDoc.getElementsByTagName('CallSession');
		let fileType;
		let thumbnailLink;
		let conferenceId;
		let callSessionId;
		let conferenceType;
		if (content.length > 0) {
			fileType = content[0].getAttribute('type');
			thumbnailLink = content[0].innerHTML;
		}
		if (callSession.length > 0) {
			conferenceId = callSession[0].getAttribute('ConferenceId');
			callSessionId = callSession[0].getAttribute('CallSessionId');
			conferenceType = callSession[0].getAttribute('ConferenceType');
		}
		let splitFilename = msg.txt.split('/');
		let fileShortName = splitFilename[splitFilename.length - 1];
		let msgHistory = {
			message: msg.txt,
			username: msg.from.split('@')[0],
			to: msg.to, // from.split("/")[0],
			from: msg.from,
			stamp: msg.timestamp, // parseInt((msg.timestamp/1000).toString()),
			user_id: msg.peer.split('/')[0],
			id: msg.id,
			isnew: false,
			unshift: true,
			isFile: content.length > 0 ? true : false,
			fileType: content.length > 0 ? fileType : null,
			fileShortName: content.length > 0 ? fileShortName : null,
			thumbnail: content.length > 0 && fileType === 'image' ? thumbnailLink : null,
			isCallSession: callSession.length > 0 ? true : false,
			conferenceId: callSession.length > 0 ? conferenceId : false,
			callSessionId: callSession.length > 0 ? callSessionId : false,
			conferenceType: callSession.length > 0 ? conferenceType : false
		};
		this.myMessageListner.next(msgHistory);
	}
	conMessageParse(msg) {
		let stamp;
		let xml = msg.xml;
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xml, 'text/xml');
		let content = xmlDoc.getElementsByTagName('content');
		let callSession = xmlDoc.getElementsByTagName('CallSession');
		let fileType;
		let thumbnailLink;
		let conferenceId;
		let callSessionId;
		let conferenceType;
		if (content.length > 0) {
			fileType = content[0].getAttribute('type');
			thumbnailLink = content[0].innerHTML;
		}
		if (callSession.length > 0) {
			conferenceId = callSession[0].getAttribute('ConferenceId');
			callSessionId = callSession[0].getAttribute('CallSessionId');
			conferenceType = callSession[0].getAttribute('ConferenceType');
		}
		let splitFilename = msg.txt.split('/');
		let fileShortName = splitFilename[splitFilename.length - 1];

		let check = msg.peer.split('/');
		let isadd = true;
		if (check.length > 1) {
			if (check[1] === 'composing' || check[1] === 'paused') {
				isadd = false;
			}
		}
		if (isadd) {
			let user = msg.peer.split('@')[0];
			let msgHistory = {
				message: msg.txt,
				username: msg.nick,
				to: msg.bare_peer, // from.split("/")[0],
				from: msg.username + '' + msg.nick,
				room: msg.username,
				stamp: msg.timestamp, // parseInt((msg.timestamp/1000).toString()),
				user_id: msg.username,
				id: msg.id,
				isnew: false,
				unshift: true,
				isFile: content.length > 0 ? true : false,
				fileType: content.length > 0 ? fileType : null,
				fileShortName: content.length > 0 ? fileShortName : null,
				thumbnail: content.length > 0 && fileType === 'image' ? thumbnailLink : null,
				isCallSession: callSession.length > 0 ? true : false,
				conferenceId: callSession.length > 0 ? conferenceId : false,
				callSessionId: callSession.length > 0 ? callSessionId : false,
				conferenceType: callSession.length > 0 ? conferenceType : false,
				getDataFromService: msg.getDataFromService ? msg.getDataFromService : false
			};
			this.myMessageListner.next(msgHistory);
		}
	}
	room_msg_handler(msg, b, c) {
		// console.log("room message handler")
		// console.log(msg);
		// console.log(b);
		// console.log(c);
		return true;
	}

	room_pres_handler(a, b, c) {
		// console.log("room press handler")
		// console.log(a);
		// console.log(b);
		// console.log(c);
		return true;
	}

	listRooms() {
		this.connection.muc.listRooms(
			environment.host,
			function (msg) {
				$(msg)
					.find('item')
					.each(function () {
						let jid = $(this).attr('jid'),
							name = $(this).attr('name');
						console.log('	>room: ' + name + ' (' + jid + ')');
					});
			},
			function (err) {
				console.log('listRooms - error: ' + err);
			}
		);
	}
	setRoomStatus(room, user, showText, status) {
		if (this.connection != null) {
			this.connection.muc.setStatus(room, user, showText, status);
		}
	}

	sendMessageToRoom(room, message, contentType?, thumbnailLink?, callObj?) {
		console.log('send Message To Room');
		if (message && room) {
			if (this.connection != null) {
				this.connection.muc.groupchat(room, message, message, contentType, thumbnailLink, callObj);
			}
		}
	}

	connectChatRoom(room_name) {
		console.log('connect group chat room :', room_name);
		let room = room_name + '@conference.' + environment.host;
		if (this.connection != null && this.connection.connected === true) {
			let msg = this.connection.muc.join(room, this.userStore.username, this.room_msg_handler, this.room_pres_handler, null, null, {
				maxstanzas: 0,
				seconds: 1
			});
		} else {
			console.log('Still not connected with Ej');
		}
	}
	leaveChatRoom(room_name, callFrom?) {
		console.log('Leave chat room: ' + room_name);
		let room = room_name + '@conference.' + environment.host;
		if (this.connection != null) {
			this.connection.muc.leave(room, this.userStore.username);
			console.log('Leave chat');
			if (callFrom != 'multiCompany') {
				this.RemoveHistory(room);
			}
		}
	}
	sendMessage(to, message, from, timestamp, callObj?, contentType?, fileLink?, thumbnailLink?) {
		if (contentType && fileLink) {
			// if file upload !
			message = fileLink;
			let reply = $msg({ to: to, type: 'chat' })
				.c('body')
				.t(message)
				.up()
				.c('x', { xmlns: 'jabber:x:delay', stamp: timestamp })
				.t(timestamp)
				.up()
				.c('content', { xmlns: 'urn:xmpp:content', type: contentType })
				.t(thumbnailLink);

			console.log('SENDING File MESSAGE: ' + message + ' to:' + to);
			let conn = this.getConnection();
			console.log(conn);
			if (this.connection != null) {
				this.connection.send(reply.tree());
				console.log(reply.tree());
			}
		} else {
			if (message && to) {
				let reply;
				if (callObj) {
					reply = $msg({ to: to, type: 'chat' })
						.c('body')
						.t(message)
						.up()
						.c('x', { xmlns: 'jabber:x:delay', stamp: timestamp })
						.t(timestamp)
						.up()
						.c('CallSession', {
							xmlns: 'urn:xmpp:callSession',
							CallSessionId: callObj.callSessionId,
							ConferenceId: callObj.conferenceId,
							ConferenceType: callObj.conferenceType
						});
				} else {
					reply = $msg({ to: to, type: 'chat' })
						.c('body')
						.t(message)
						.up()
						.c('x', { xmlns: 'jabber:x:delay', stamp: timestamp })
						.t(timestamp);
					//.up().c("CallSession", { xmlns: 'urn:xmpp:callSession', CallSessionId : "123" , ConferenceId : "456", ConferenceType : "798" });
				}
				console.log('SENDING MESSAGE: ' + message + ' to:' + to);
				let conn = this.getConnection();
				console.log(conn);
				if (this.connection != null) {
					this.connection.send(reply.tree());
					console.log(reply.tree());
				}
				//self.out( "<strong>" + self.connection.jid + ": </strong>" + message );
			}
		}
	}

	disconnect() {
		console.log('disconnected');
		if (this.connection != null) {
			this.setStatus('away');
			this.connection.disconnect();
			this.connectListner.next(false);
			this.disconnectListner.next(true);
			this.connection = null;
		}
	}

	disconnectWhenNoInternet() {
		console.log('disconnected');
		if (this.connection != null) {
			// this.setStatus('away');
			this.connection.disconnect();
			this.connectListner.next(false);
			this.disconnectListner.next(true);
			this.connection = null;
		}
	}

	setStatus(s) {
		console.log('setStatus: ' + s);

		let status = $pres().c('show').t(s).up().c('priority').t('42');
		//let priority = $pres().c('priority').t('42');

		if (this.connection != null) {
			this.connection.send(status);
		}
	}

	checkConnection(data) {
		// this.connectListner.next(false);
		if (this.connection === null) {
			console.log('connection is nulll..........');
			console.log('reconnecting..........', data);
			this.connect(data);
		} else if (this.connection.authenticated === false) {
			this.connectListner.next(false);
		} else if (this.connection.connected === false) {
			console.log('connected false');
			console.log('reconnecting..........', data);
			this.connect(data);
		} else {
			console.log('else..........', data);
			this.connectListner.next(true);
		}
	}

	//unread message to read
	ClearUnread(user_id) {
		for (let i = this.notifications.length - 1; i >= 0; i--) {
			if (this.notifications[i].user_id === user_id) {
				this.notifications.splice(i, 1);
			}
		}
		this.chatNotificationAdd(this.notifications);
		let msgHistory: any;
		msgHistory = this.latestMessage; // localStorage.getItem('history')
		// var msgHistory= JSON.parse(history);
		if (msgHistory != null) {
			let data = msgHistory[user_id];
			if (data != null) {
				msgHistory[user_id].count = 0;
				msgHistory[user_id].isviewed = true;
				msgHistory[user_id].style = '';
			}
		}
		// var s = JSON.stringify(msgHistory);
		// localStorage.setItem('history', JSON.stringify(msgHistory));
		this.latestMessage = msgHistory;
		this.onNotificationListner.next(msgHistory);
	}

	AddtoHistory(msg, src?) {
		let xml = msg.xml;
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xml, 'text/xml');
		let content = xmlDoc.getElementsByTagName('content');
		let callSession = xmlDoc.getElementsByTagName('CallSession');
		let fileType;
		let thumbnailLink;
		let conferenceId;
		let callSessionId;
		let conferenceType;
		if (content.length > 0) {
			fileType = content[0].getAttribute('type');
			thumbnailLink = content[0].innerHTML;
			let splitFilename = msg.txt.split('/');
			let fileShortName = splitFilename[splitFilename.length - 1];
		}
		if (callSession.length > 0) {
			conferenceId = callSession[0].getAttribute('ConferenceId');
			callSessionId = callSession[0].getAttribute('CallSessionId');
			conferenceType = callSession[0].getAttribute('ConferenceType');

			let splitHashFromMessage = msg.message.split('#');
			if (msg.username === JSON.parse(localStorage.getItem('sessionUser')).user_name) {
				msg.message = splitHashFromMessage[0];
			} else {
				msg.message = splitHashFromMessage[1];
			}
		}

		if (msg.isCallSession) {
			let splitHashFromMessage = msg.message.split('#');
			if (msg.username === JSON.parse(localStorage.getItem('sessionUser')).user_name) {
				msg.message = splitHashFromMessage[0];
			} else {
				msg.message = splitHashFromMessage[1];
			}
		}

		let msgHistory = this.latestMessage; //JSON.parse(localStorage.getItem('history'));
		// console.log(this.latestMessage); // off by jahid
		//room name
		if (msg.room) {
			let groups = JSON.parse(localStorage.getItem('subject_list'));
			let foundGroupOnThis_Company = false;
			let user_id = msg.user_id.split('@')[0];

			for (let i = groups.length - 1; i >= 0; i--) {
				if (groups[i].id === user_id) {
					foundGroupOnThis_Company = true;
					// msg.username = groups[i].conference_name;
					msg.group_name = groups[i].conference_name;
					msg.group_id = user_id;

					if (groups[i].is_pinned) {
						msg.group_type = group_type.GROUP_TYPE_PINNED;
					} else if (groups[i].geofences) {
						msg.group_type = group_type.GROUP_TYPE_GEO;
					} else {
						msg.group_type = group_type.GROUP_TYPE_GENERAL;
					}
				}
			}
			if (foundGroupOnThis_Company === false) {
				msg.group_id = user_id;
			}
		}
		let user_id = msg.user_id;
		let id = msg.id;
		//time parse
		let d = new Date(parseFloat(msg.stamp));
		let time = d.toLocaleString(undefined, {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
		let onlinestatus;
		//presence status
		if (!msg.isgroup) {
			let statusobj = this.presenceList[msg.username];
			onlinestatus = false;
			if (statusobj === 'online' || statusobj === online_status_xmpp.online) {
				onlinestatus = true;
			}
		}

		//object making
		let val = {
			name: msg.username,
			msg: msg.message,
			time: time,
			stamp: msg.stamp,
			room: msg.room,
			user_id: msg.user_id,
			group_id: msg.group_id,
			group_name: msg.group_name,
			onlinestatus: onlinestatus,
			id: id,
			isviewed: false,
			isnew: msg.isnew,
			style: '',
			count: 0,
			// isFile: content.length > 0 ? true : false,
			// fileType: content.length > 0 ? fileType : null,
			// fileShortName: content.length > 0 ? fileShortName : null,
			// thumbnail: content.length > 0 && fileType  === 'image' ? thumbnailLink : null,
			isCallSession: callSession.length > 0 ? true : msg.isCallSession ? true : false,
			conferenceId: callSession.length > 0 ? conferenceId : false,
			callSessionId: callSession.length > 0 ? callSessionId : false,
			conferenceType: callSession.length > 0 ? conferenceType : false,
			is_admin: msg.is_company_admin ? true : false,
			company_id: msg.company_id,
			is_pinned: msg.is_pinned,
			allow_contributor: msg.is_allow_contributor ? msg.is_allow_contributor : msg.allow_contributor,
			group_owner: msg.group_owner ? msg.group_owner : null,
			profile_pic: msg.profile_pic,
			group_type: msg.group_type
		};
		if (msg.isnew === true) {
			val.isviewed = false;
			val.style = 'bold';
		} else {
			val.isviewed = true;
			val.style = '';
		}
		try {
			if (msgHistory === null) {
				msgHistory = [];
			} else {
				let exisitngmessage = msgHistory[user_id];
				if (src != 'fromSelect_seen') {
					if (exisitngmessage != null) {
						if (isChatWindowOpen) {
							if (this.selectedGroup.user_name === val.group_name) {
								val.count = 0;
							} else {
								val.count = exisitngmessage.count + 1;
							}
						} else {
							val.count = exisitngmessage.count + 1;
						}
					} else {
						val.count = 1;
					}
				}
				msgHistory[user_id] = val;
			}
		} catch (ex) {
			console.log(ex);
		}
		localStorage.setItem('history', JSON.stringify(msgHistory));
		this.latestMessage = msgHistory;
		console.log('Add to history:', this.latestMessage);
		if (msg.isgroup) {
			this.chatNotificationAdd('recentChangeOnType'); // recent message change when chatting
		}
	}

	RemoveHistory(room) {
		let msgHistory = this.latestMessage; // JSON.parse(localStorage.getItem('history'));
		delete msgHistory[room];
	}

	getMessages(jid, page = 1) {
		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
		// let options = new RequestOptions({ headers: headers }); // Create a request option
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(environment.chatService + '/chat/messages?bare_peer=' + jid + '&page=' + page, httpOptions).pipe(
			map((x: any) => x),
			tap((x) => {
				console.log(x);
				return x;
			})
		);
	}

	getConferanceMessages(jid, page = 1) {
		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
		// let options = new RequestOptions({ headers: headers }); // Create a request option

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(environment.chatService + '/chat/messages/conferance?bare_peer=' + jid + '&page=' + page, httpOptions).pipe(
			map((x: any) => x)
		);
	}

	pubsubmessage(jid) {
		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
		// let options = new RequestOptions({ headers: headers }); // Create a request option

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(environment.chatService + '/chat/messages?bare_peer=' + jid, httpOptions).pipe(
			map((x: any) => x),
			tap((x) => {
				console.log(x);
				return x;
			})
		);
	}

	getPlugin<T = any>(name: string): T {
		const plugin = this.connection[name];
		if (!plugin) {
			throw new Error(`Plugin ${name} not found`);
		}
		return plugin;
	}

	deleteResource(file) {
		console.log("<========= File delete Service called============>");
		this.currentUser = JSON.parse(localStorage.getItem('sessionUser'));

		const file_delete_url = this.getFileHistoryUrl + '/' + file.resource_id + '/' + file.file_id + '/remove';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		const body = {}

		return this.http.post(file_delete_url, body, httpOptions).pipe(
			map((x: any) => x),
			catchError((error: Response) => {
				return throwError(error);
			})
		);

	}

	_postRecentChatHistory(body, token) {
		this.currentUser = JSON.parse(localStorage.getItem('sessionUser'));
		console.log('<======== Post Recent chat History Service Called========>');

		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// // headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
		// let options = new RequestOptions({ headers: headers }); // Create a request option
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(this.recentChatUrl + '?token=' + token, body, httpOptions).pipe(
			map((result: any) => result),
			map((x) => {
				console.log(' Recent chat history post', x);
				return x;
			}),
			catchError((error: Response) => {
				return throwError(error);
			})
		);
	}

	_getRecentChatHistory(token?) {
		let access_token;
		this.currentUser = JSON.parse(localStorage.getItem('sessionUser'));
		console.log('<======== Get Recent chat History Service Called========>');
		if (token) {
			access_token = token;
		} else {
			access_token = this.currentUser.access_token;
		}
		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// // headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
		// let options = new RequestOptions({ headers: headers }); // Create a request option

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

		return this.http.get(this.recentChatUrl + '?token=' + access_token, httpOptions).pipe(
			map((result: any) => result),
			map((x) => {
				console.log(' Recent chat history get', x.result.value);
				return x;
			}),
			catchError((error: Response) => {
				return throwError(error);
			})
		);
	}

	getFileHistoryByRefernce(reference_id) {
		console.log('<======== Get File History By Refernce Service Called========>');
		this.currentUser = JSON.parse(localStorage.getItem('sessionUser'));
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.get(this.getFileHistoryUrl + '/0/' + reference_id, httpOptions).pipe(
			map((x: any) => x),
			map((x) => {
				return x;
			}),
			catchError((error: Response) => {
				return throwError(error);
			})
		);
	}


	// Chat & pubsub Registration
	chatRegistration(username: string, password: string) {
		console.log('<========Chat registration service called========>');
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		const body = JSON.stringify({
			name: username,
			host: environment.host,
			password: password,
			app_id: environment.app_id,
			company_id: environment.company_id
		});
		return this.http.post(this.chatRegistrationURL, body, httpOptions).pipe(
			map((x: any) => x),
			catchError((error: Response) => {
				return throwError(error);
			})
		);
	}

	pubsubRegistration(user_id: string, password: string) {
		console.log('<========Pubsub registration service called========>');
		const req = {
			user_id: user_id,
			device_id: '',
			reg_token: ''
		};
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
		return this.http.post(this.pubsubRegistrationURL, req, httpOptions).pipe(
			map((x: any) => {
				let res = x;
				localStorage.setItem('pubsub', JSON.stringify(res.result));
				return res;
			}),
			catchError((error: Response) => {
				return throwError(error);
			})
		);
	}

	// For Resource Services
	audioVideoUpload(files, fileUploadIdentifiedId?, toUser?) {
		console.log("<======== File Upload Service Called========>")
		this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
		var formData = new FormData();
		formData.append('file', files);
		if (toUser) {
			if (toUser.user_name === toUser.user_id) {
				formData.append('resource_id', toUser.user_id)
				formData.append('resource_type', 'conference')
			} else {
				let user_array = []
				user_array.push(toUser.user_name)
				user_array.push(this.currentUser.user_name)
				user_array.sort()

				formData.append('resource_id', user_array[0] + user_array[1])
				formData.append('resource_type', 'user')
			}
		}
		else {
			formData.append('resource_id', this.currentUser.user_name)
			formData.append('resource_type', 'company')
		}
		formData.append('company_id', this.currentUser.company_id)
		formData.append('app_id', this.currentUser.app_id)

		formData.append('Content-Type', 'multipart/form-data');

		const httpOptions = {
			headers: new HttpHeaders({
				Authorization: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsInVzZXJfbmFtZSI6ImphaGlkX3QxIiwiZW1haWwiOiJjaWZhaDcxMjQxQHlla3RhcmEuY29tIiwidXNlcl9pZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsImNvbXBhbnlfaWQiOiJkMTdiNWQzZi01NjVhLTRkNWItODgxNS1lNTU2YjdjZjkwZWQiLCJjb21wYW55X25hbWUiOiJKb2dham9nIFNjaG9vbCIsImFwcF9pZCI6ImUyMWJmNDlmLTQwZDgtNGYxYS1hMjNhLTQ5OTgwZTg5MTdhZSIsImFwcF9uYW1lIjoiSm9nYWpvZyBDbGFzc3Jvb20iLCJqdGkiOiIyODhmZTEwMi00Njg4LTQ3N2QtOTVhZC05NDdmMGNkZGRjMjciLCJpYXQiOjE2MDc1MDgzNDIsImlzcyI6Im9hdXRoLnN1cnJvdW5kYXBwcyIsInN1YiI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCJ9.Brm25VRxinNRwRwbAdo-PLMtQz9P0UVfBAVwS-AQnPnAN0sYQmnTnT_13D5qGQcoHs5XUqZvx4YStno1ltJVfmi87P-0hBaWk-lpga_tccqgczVGe9YXYNWpwC7UfMBxMAWw8JgGJrLEygravKRCs0zM6052BBJHUArFZg-Ldy7VAI2SQ94BdLUgOzxN_dwIDO_jrtarEuYa4cufWhMgO--yq55lx215RHKQXorYoCY8mexg1dDxZlr1FP_5NZLcC6huAWKYAnRvQGiRZ3rmZYyxHf_7TW1YYOK8jFRQbtIBHayUOZ6JwdwBKz3qnGFCHQpBFtFW1sw2avWfDVzxlw"
			})
		};

		return this.http.post(this.fileUploadURl, formData, httpOptions)
			.pipe(
				map((response: any) => {
					let result = response;
					result.result.toUser = toUser;
					result.result.uploading_file_id = fileUploadIdentifiedId;
					return result;
				}),
				catchError((error: Response) => {
					return throwError(error);
				})
			)
	}

	getFileHistory(id) {
		console.log("<======== Get flight by user Service Called========>")
		// this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

		const httpOptions = {
			headers: new HttpHeaders({
				// Authorization: JSON.parse(localStorage.getItem('token'))
				Authorization: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsInVzZXJfbmFtZSI6ImphaGlkX3QxIiwiZW1haWwiOiJjaWZhaDcxMjQxQHlla3RhcmEuY29tIiwidXNlcl9pZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsImNvbXBhbnlfaWQiOiJkMTdiNWQzZi01NjVhLTRkNWItODgxNS1lNTU2YjdjZjkwZWQiLCJjb21wYW55X25hbWUiOiJKb2dham9nIFNjaG9vbCIsImFwcF9pZCI6ImUyMWJmNDlmLTQwZDgtNGYxYS1hMjNhLTQ5OTgwZTg5MTdhZSIsImFwcF9uYW1lIjoiSm9nYWpvZyBDbGFzc3Jvb20iLCJqdGkiOiIyODhmZTEwMi00Njg4LTQ3N2QtOTVhZC05NDdmMGNkZGRjMjciLCJpYXQiOjE2MDc1MDgzNDIsImlzcyI6Im9hdXRoLnN1cnJvdW5kYXBwcyIsInN1YiI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCJ9.Brm25VRxinNRwRwbAdo-PLMtQz9P0UVfBAVwS-AQnPnAN0sYQmnTnT_13D5qGQcoHs5XUqZvx4YStno1ltJVfmi87P-0hBaWk-lpga_tccqgczVGe9YXYNWpwC7UfMBxMAWw8JgGJrLEygravKRCs0zM6052BBJHUArFZg-Ldy7VAI2SQ94BdLUgOzxN_dwIDO_jrtarEuYa4cufWhMgO--yq55lx215RHKQXorYoCY8mexg1dDxZlr1FP_5NZLcC6huAWKYAnRvQGiRZ3rmZYyxHf_7TW1YYOK8jFRQbtIBHayUOZ6JwdwBKz3qnGFCHQpBFtFW1sw2avWfDVzxlw"
			})
		};

		return this.http.get(this.getFileHistoryUrl + '/' + id, httpOptions)
			.pipe(
				map((x) => x),
				catchError((error: Response) => {
					return throwError(error);
				})
			)
	}

	downloadFile(fileInfo) {
		return this.http.get(fileInfo.url, { headers: new HttpHeaders({}), responseType: 'blob' }).toPromise()
			.then(response => {
				const fileName = fileInfo.originalname
				saveAs(response, fileName);
			});
	}

	getRecordingByMeetingandSessionId(meetingid, sessionid) {
		const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsInVzZXJfbmFtZSI6ImphaGlkX3QxIiwiZW1haWwiOiJjaWZhaDcxMjQxQHlla3RhcmEuY29tIiwidXNlcl9pZCI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCIsImNvbXBhbnlfaWQiOiJkMTdiNWQzZi01NjVhLTRkNWItODgxNS1lNTU2YjdjZjkwZWQiLCJjb21wYW55X25hbWUiOiJKb2dham9nIFNjaG9vbCIsImFwcF9pZCI6ImUyMWJmNDlmLTQwZDgtNGYxYS1hMjNhLTQ5OTgwZTg5MTdhZSIsImFwcF9uYW1lIjoiSm9nYWpvZyBDbGFzc3Jvb20iLCJqdGkiOiIyODhmZTEwMi00Njg4LTQ3N2QtOTVhZC05NDdmMGNkZGRjMjciLCJpYXQiOjE2MDc1MDgzNDIsImlzcyI6Im9hdXRoLnN1cnJvdW5kYXBwcyIsInN1YiI6IjM5OTAxNDQ3LWYyZWUtNDk3Ni1hOWU1LWU5MzI4OTVlMzk5MCJ9.Brm25VRxinNRwRwbAdo-PLMtQz9P0UVfBAVwS-AQnPnAN0sYQmnTnT_13D5qGQcoHs5XUqZvx4YStno1ltJVfmi87P-0hBaWk-lpga_tccqgczVGe9YXYNWpwC7UfMBxMAWw8JgGJrLEygravKRCs0zM6052BBJHUArFZg-Ldy7VAI2SQ94BdLUgOzxN_dwIDO_jrtarEuYa4cufWhMgO--yq55lx215RHKQXorYoCY8mexg1dDxZlr1FP_5NZLcC6huAWKYAnRvQGiRZ3rmZYyxHf_7TW1YYOK8jFRQbtIBHayUOZ6JwdwBKz3qnGFCHQpBFtFW1sw2avWfDVzxlw";
		// this.sessionUser = JSON.parse(localStorage.getItem('sessionUser'));

		console.log('<========Get Recordings service called========>');
		let headers = new HttpHeaders();
		headers.set('Content-Type', 'application/json');
		//let token = JSON.parse(localStorage.getItem('token'))

		return this.http
			.get(this.getRecording + '?meeting_id=' + meetingid + '&session_id=' + sessionid + '&token=' + token, { headers: headers })
			.pipe(
				map((x) => x),
				catchError((error: Response) => {
					return throwError(error);
				})
			);
	}
	// End Resource Services

	setPushMessage(message) {
		this.pushMessage.next(message)
	}

	getPushMessage() {
		return this.pushMessage.asObservable()
	}

	setPresence(presence) {
		this.presence.next(presence)
	}

	getPresence() {
		return this.presence.asObservable()
	}

	getUserWithPresence(userObj): Iuser {
		var currentOnlineUser = this.presenceList;
		for (var i = userObj.users.length - 1; i >= 0; i--) {
			var statusobj = currentOnlineUser[userObj.users[i].user_name];
			userObj.users[i].onlineStatus = statusobj;
			if (statusobj == online_status_xmpp.online) {
				userObj.users[i].isOnline = true;
			}
			else {
				userObj.users[i].isOnline = false;
			}
		}
		return userObj
	}

	getSessionUserPresence(): any {
		this.currentUser = JSON.parse(localStorage.getItem('sessionUser'));
		let obj = this.presenceList[this.currentUser.user_name];
		if (obj == online_status_xmpp.online) {
			this.currentUser.statusImgSrc = "../../../../assets/images/chat-status/status_green.png";
			this.currentUser.statusName = online_status_display.online;
		} else if (obj == online_status_xmpp.away) {
			this.currentUser.statusImgSrc = "../../../../assets/images/chat-status/Circle_Yellow.png";
			this.currentUser.statusName = online_status_display.away;
		} else if (obj == online_status_xmpp.busy) {
			this.currentUser.statusImgSrc = "../../../../assets/images/chat-status/Circle_Red.png";
			this.currentUser.statusName = online_status_display.busy;
		} else if (obj == online_status_xmpp.invisible) {
			this.currentUser.statusImgSrc = "../../../../assets/images/chat-status/Circle_Red.png";
			this.currentUser.statusName = online_status_display.invisible;
		}
		if (this.currentUser.statusImgSrc) {
			this.imgSrc = this.currentUser.statusImgSrc;
			this.currentStatusName = this.currentUser.statusName
		} else {
			this.imgSrc = "";
			this.currentStatusName = ''
		}
		return { imgSrc: this.imgSrc, currentStatusName: this.currentStatusName }
	}

	
}
