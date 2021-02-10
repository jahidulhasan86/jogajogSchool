import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/user_service/account.service';

@Component({
  selector: 'app-student-side-nav',
  templateUrl: './student-side-nav.component.html',
  styleUrls: ['./student-side-nav.component.css']
})
export class StudentSideNavComponent implements OnInit {
  currentUser: any;
  acServices: AccountService;
  constructor(public acService: AccountService) 
   {
    this.acServices = acService;
   }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log(this.acServices.currentUser)
  }

}
