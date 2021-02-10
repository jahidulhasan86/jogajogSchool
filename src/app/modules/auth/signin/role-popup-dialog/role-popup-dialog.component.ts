import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
/* import { AccountService } from 'src/app/services/user_service/account.service';
import { TeacherService } from 'src/app/services/teacher_service/teacher.service';
import { StudentService } from 'src/app/services/student_service/student.service' */;
import { MatRadioChange } from '@angular/material/radio'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-role-popup',
  templateUrl: './role-popup-dialog.component.html',
  styleUrls: ['./role-popup-dialog.component.css']
})
export class RolePopupDialogComponent implements OnInit {
  selected_role
  roles = [{ role_type: '1', role_name: 'Admin' }, { role_type: '2', role_name: 'Teacher' }, { role_type: '3', role_name: 'Student' }]
  model: any = {};
  create = false;
  teacher = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    /* public dialogRef: MatDialogRef<RolePopupDialogComponent>, public acService: AccountService
    , private teacherService: TeacherService, private studentService: StudentService */
  ) {

  }

  ngOnInit() {
    console.log('RolePopupDialogComponent')
    /////admin role er user kibhabe login korbe onno ap theke
    ///// l2t te teacher/student hishebe join korte gele check korte hobe na 
    /////she already teacher/student hishe be declared kina. jodi declared thake tobei na take login korte debo
    ///// nathukle ki hobe?
    ////onno app/company er user ke kamne teacher/student declare korben
  }

  setRoleToLogin() {
    if (!this.model.selected_role) return

    let obj = this.roles.find(q => q.role_type == this.model.selected_role)
    //let obj={role_name:'Teacher'};
    this.model.selected_role = obj;


   /*  this.dialogRef.close(this.model); */
  }

  setData(obj) {
   /*  localStorage.removeItem('tokenRole');
    localStorage.setItem('tokenRole', obj.role_name.toLowerCase());
    obj.role_name === 'teacher' ? this.acService.isTeacher = true : this.acService.isTeacher = false;
    this.acService.roleChecker.next(this.acService.isTeacher); */
  }
  selectionChange(event: MatRadioChange) {
    let value = event.value;
    if (value == '2') {
      this.teacher = true;
    } else {
      this.teacher = false;
      this.model.skoolModel = null;
      this.create = false
    }
    console.log(value);
  }
  companySelectionChange(event: MatRadioChange) {
    let value = event.value;
    if (value == '2') {
      this.create = true;
    } else {
      this.create = false;
      this.model.skoolModel = null;
    }
    console.log(value);
  }
}
