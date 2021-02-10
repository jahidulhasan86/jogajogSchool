import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/user_service/account.service';

@Component({
  selector: 'app-instructor-side-nav',
  templateUrl: './instructor-side-nav.component.html',
  styleUrls: ['./instructor-side-nav.component.css']
})
export class InstructorSideNavComponent implements OnInit {
  currentUser: any;
  acServices: AccountService;

  constructor(public acService: AccountService,) {
    this.acServices = acService;
   }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  signOut(){
    
  }

}
