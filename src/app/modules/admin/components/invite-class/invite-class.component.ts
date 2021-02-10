import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from "sweetalert2";
@Component({
  selector: 'app-invite-class',
  templateUrl: './invite-class.component.html',
  styleUrls: ['./invite-class.component.css']
})
export class InviteClassComponent implements OnInit {

  @ViewChild('chipList') chipList: MatChipList;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
  members: Member[] = []

  constructor(public dialogRef: MatDialogRef<InviteClassComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminService) { }

  ngOnInit(): void {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add member
    // Add our fruit
    if ((value || '').trim()) {
      this.members.push({ email: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    console.log(this.members)
  }

  remove(member: Member) {
    const index = this.members.indexOf(member);
    if (index >= 0) {
      this.members.splice(index, 1);
    }
  }

  resetField() {
    this.members = []
  }

  closeDialog() {
    this.dialogRef.close()
  }

  invite() {
    if (this.members.length > 0) {
      let emails = []
      this.members.forEach((x) => {
        emails.push(x.email)
      })
      this.data.emails = emails
      this.adminService.classInvite(this.data).subscribe((result) => {
        if (result.status == 'ok') {
          Swal.fire({
            title: "Invitation has been sent",
            icon: "success",
            timer: 2000,
          });
        }
      }, err => {
        console.log(err)
      })
    } else {
      Swal.fire({
        title: "Please enter email address",
        icon: "info",
        timer: 2000,
      });
    }
  }

}

export interface Member {
  email: string;
}
