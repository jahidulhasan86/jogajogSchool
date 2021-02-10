import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  // @ViewChild('fromInput', {read: MatInput }) fromInput: MatInput;
  component_name_for_child = 'add_class'
  selectedDepartment: any;

  public model: any = {
    school_id: "",
    branch_id: "",
    class_id: "",
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    email: "",
    // address: "",
    gender: "",
    contact: "",
    date_of_birth: "",
    // profile_pic: ""
  };
  loader: boolean = false;
  classList: any;
  selectedClass: any;
  subjects: any;
  selectedBranch: any;
  subjectsLength: any;
  optionReset = 0

  constructor(private adminService: AdminService, public dialogRef: MatDialogRef<AddStudentComponent>, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  getClassByDeptId(id) {
    this.spinner.show()
    this.adminService.getClassByDeptId(id).subscribe(result => {
      if (result) {
        this.spinner.hide()
        if (result.status == "ok") {
          this.classList = result.resultset
          if(this.classList.length > 0){
            this.selectedClass = this.classList[0];
            this.classSelector(this.classList[0]);
          } else {
            this.classList = [{id : '0',name:'No Classes Found'}];
            this.selectedClass = this.classList[0];
            this.classSelector(this.classList[0]);
          }
          // console.log('classList', result.resultset)
         
        }
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }
  
  classSelector(classObj) {
    this.model.class_id = classObj.id
    if (this.model.class_id) {
      this.getClassWiseSubjectsAndTeachersByClassId(this.model.class_id)
    }
  }
  getClassWiseSubjectsAndTeachersByClassId(id) {
    this.spinner.show()
    let query = 'class_id=' + id;
    this.adminService.getClassWiseSubjectsAndTeachersByClassId(query, true).subscribe(result => {
      if (result.status == 'ok') {
        this.spinner.hide()
        this.subjects = result.result
        this.subjectsLength = this.subjects.length
        if ( this.subjectsLength == 0) {
          Swal.fire({
            title: "Note: There are no subject assign for this class",
            icon: "warning",
            timer: 2000,
          });
        }
        console.log(result)
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
    })
  }

  // dateOfBirthSelector(value) {
  //   this.model.date_of_birth = ((new Date(value)).getTime()) /1000;
  // }

  insertStudent() {
    console.log('model',this.model)
    this.model.branch_id = this.selectedBranch.id
    this.model.school_id = this.selectedBranch.school_id
    this.model.date_of_birth = ((new Date(this.model.date_of_birth)).getTime()) /1000;
    this.spinner.show()
    this.adminService.insertStudent(this.model).subscribe(result => {
      if (result) {
        this.spinner.hide()
        Swal.fire({
          title: "Successfully Assign.",
          icon: "success",
          timer: 2000,
        });
        console.log(result)
        this.closeDialog();
        document.getElementById('student-find-btn').click()
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
      if (err.code == 404 || err.code == 400) {
        Swal.fire({
          title: err.message.en,
          icon: "warning",
          timer: 2000,
        });
      } else {
        Swal.fire({
          title: "Error! Please try again later.",
          icon: "warning",
          timer: 2000,
        });
      }
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  deptReceived(event) {
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    if (this.selectedDepartment) {
      this.getClassByDeptId(this.selectedDepartment.id)
    }
  }

  resetField(){
     this.optionReset ++
    Object.keys(this.model).forEach(key => this.model[key] = '');
    // this.fromInput.value = '';
  }
  
}
