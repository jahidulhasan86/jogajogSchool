import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Iuser } from '../../interfaces/Iuser';
import { AccountService } from '../../services/user_service/account.service';
import { XmppChatService } from '../../services/xmpp-chat/xmpp-chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Output() userEvtEmitter = new EventEmitter<any>();

  @Input() usersObj: Iuser

  selected_user_id: any;

  list_name: string

  userFilter: any = { user_name: '' };

  sessionUser: any;

  constructor(private accountService: AccountService, private xmppChatService: XmppChatService) { }

  ngOnInit(): void {
    this.getSessionUserInfo()
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (!!this.usersObj && this.usersObj.users.length > 0) {
        this.usersObj.users.reverse()
        this.selectedUser(this.usersObj.users[0])
        this.currentUrl(this.usersObj.currentUrl)
        this.getPresence()
      }
    }, 1000);
  }

  selectedUser(user) {
    this.selected_user_id = user.user_id
    this.userEvtEmitter.emit(user);
  }

  currentUrl(url) {
    this.list_name = url === '/instructor/teacher' ? 'Teachers' : url === '/instructor/student' ? 'Students' : ''
  }

  getSessionUserInfo() {
    this.sessionUser = this.accountService.getSessionUserInfo()
  }

  getPresence() {
    this.xmppChatService.getPresence().subscribe((result) => {
      if (!!result) {
        if (!!this.usersObj) {
          this.usersObj = this.getUserWithPresence(this.usersObj)
        }
      }
    })
  }

  getUserWithPresence(userObj): Iuser {
    return this.xmppChatService.getUserWithPresence(userObj)
  }

}
