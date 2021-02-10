import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProfileComponent } from 'src/app/shared/components/profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any;
  teacherRole: boolean;
  flag: boolean = true;
  @Output() clickToggleBtn = new EventEmitter<any>();

  constructor(private router: Router, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    if(this.currentUser.role.role_name === "Teacher"){
      this.teacherRole = true;
    }
  }

  goToAdminPanel(){
    this.router.navigate(['/admin']);
  }

  openProfile(): void {
    const profileDialogRef = this.dialog.open(ProfileComponent, {
      width: '40%',
    });
  }
  sideBarToogle(){
    this.flag = !this.flag
   this.clickToggleBtn.emit(this.flag)  
  }

}
