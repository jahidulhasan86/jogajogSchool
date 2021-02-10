import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
	@Output() clickToggleBtn = new EventEmitter<any>();
  flag: boolean = true;
  currentUser: any;
  teacherRole: boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    if(this.currentUser.role.role_name === "Teacher"){
      this.teacherRole = true;
    }
  }

  sideBarToogle(){
    this.flag = !this.flag
   this.clickToggleBtn.emit(this.flag)  
  }

  goToInstructorPanel(){
    this.router.navigate(['/instructor']);
  }

}
