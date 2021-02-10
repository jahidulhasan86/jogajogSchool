import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit {

  public model: any = {
    first_name: "",
    last_name: "",
    user_name: "",
    password: "",
    email: "",
    address: "",
    gender: "",
    dept_id: "",
    branch_id: "",
    school_id: "",
  };
  selectedBranch: any;
  selectedDepartment: any;
  component_name_for_child = 'add_class'
  optionReset = 0

  constructor( public dialogRef: MatDialogRef<AddTeacherComponent>, public adminService: AdminService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  deptReceived(event) {
    console.log(event)
    this.selectedBranch = event.branch
    this.selectedDepartment = event.dept
  }

  insertTeacher() {
    let currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    this.model.school_id = this.selectedBranch.school_id;
    this.model.branch_id = this.selectedBranch.id;
    this.model.dept_id = this.selectedDepartment.id;
    this.model.company_id = currentUser.company_id;
    this.model.app_id = currentUser.app_id;
    this.model.company_name = environment.default_company_name;
    this.model.app_name = environment.app_name;
     this.spinner.show()
    this.adminService.insertTeacher(this.model).subscribe(
      (result) => {
        if (result.status == "ok") {
          this.spinner.hide()
          Swal.fire({
            title: "Teacher add successfully. ",
            icon: "success",
            timer: 2000,
          });

          this.closeDialog();
        }
      },
      (err) => {
        this.spinner.hide()
        console.log(err);
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
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }

  resetField() {
    this.optionReset ++
    this.model = {
      first_name: "",
      last_name: "",
      user_name: "",
      password: "",
      email: "",
      address: "",
      gender: "",
      dept_id: "",
      branch_id: "",
      school_id: "",
    };
  }

}
