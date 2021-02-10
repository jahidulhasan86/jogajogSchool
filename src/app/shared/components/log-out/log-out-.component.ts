import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/user_service/account.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogoutComponent implements OnInit {

  
  subject: any;

  constructor(private router: Router, private route: ActivatedRoute, private accService: AccountService) { }

  ngOnInit(): void {
    
  }
  logOut(e) {
    //var accessToken = JSON.parse(localStorage.getItem("token"));
    //var currentUserId = this.accService.currentUser.id;

    Swal.fire({
      title: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F49D23",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No, Thanks"
    }).then(result => {
      if (result.value) {
        /* this.messagingService.unregisteredDevice(currentUserId).subscribe(
          result => {
            console.log(result);
          },
          err => {
            console.log(err);
          }
        ); */
       /*  this.chatService.latestMessage = [];
        this.chatService.recentChatHistoryListListner.next(
          this.chatService.latestMessage
        ); */

        var res = this.accService.logOut();
        if (res) {
          this.router.navigate([""]);
          //this.chatService.disconnect();

          /*
          the below code is for : when run on desktop
          */
          
          //
        }
      }
    });
  }

  

}
