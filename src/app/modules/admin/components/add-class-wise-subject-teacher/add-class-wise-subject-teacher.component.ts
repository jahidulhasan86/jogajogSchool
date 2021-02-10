import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-class-wise-subject-teacher',
  templateUrl: './add-class-wise-subject-teacher.component.html',
  styleUrls: ['./add-class-wise-subject-teacher.component.css']
})
export class AddClassWiseSubjectTeacherComponent implements OnInit {
  public model: any = {
    class_id: "",
    class_name: "",
    subject_name: "",
    sub_pic: "",
    teacher_id: "",
    teacher_user_name: "",
    description: ""
  };
  component_name_for_child = 'add_class'
  selectedDepartment: any;
  selectedBranch: any;
  teacherList: any;
  selectedTeacher: any;
  classList: any;
  selectedClass: any;
  teachers = new FormControl();
  optionReset = 0

  constructor(public dialogRef: MatDialogRef<AddClassWiseSubjectTeacherComponent>,
    public adminService: AdminService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // setTimeout(() => {
    //   if (this.selectedDepartment) {
    //     this.getAllteachersBySchoolAndDept();
    //     this.getAllClassByDeptId();
    //   }
    // }, 1000)
  }

  getAllteachersBySchoolAndDept() {
    this.spinner.show()
    this.adminService.GetTeacherByDeptIdSchoolId(this.selectedDepartment.id, this.selectedBranch.school_id)
      .subscribe(
        (result) => {
          this.spinner.hide()
          if (result.status == "ok") {
            this.teacherList = result.resultset;
            if (this.teacherList.length > 0) {
              this.selectedTeacher = this.teacherList[0];
            } else {
              this.teacherList = [{ id: '0', name: 'No Teachers Found' }];
              this.selectedTeacher = this.teacherList[0];
            }
          }
        },
        (err) => {
          this.spinner.hide()
          console.log("error from get teacher,", err);
        }
      );
  }

  getAllClassByDeptId() {
    this.spinner.show()
    this.adminService.getClassByDeptId(this.selectedDepartment.id).subscribe(
      (result) => {
        this.spinner.hide()
        if (result.status == "ok") {
          this.classList = result.resultset;
          if (this.classList.length > 0) {
            this.selectedClass = this.classList[0];
          } else {
            this.classList = [{ id: '0', name: 'No Classes Found' }];
            this.selectedClass = this.classList[0];
          }
        }
      },
      (err) => {
        this.spinner.hide()
        console.log("error from get teacher,", err);
      }
    );
  }

  deptReceived(event) {
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    if (this.selectedDepartment) {
      this.getAllteachersBySchoolAndDept();
      this.getAllClassByDeptId();
    }
  }


  onSubmit() {
    this.model.class_id = this.selectedClass.id;
    this.model.class_name = this.selectedClass.name;
    this.model.subject_name = this.model.subject_name;
    this.model.sub_pic = "";
    let selectedTeachers = this.teachers.value;
    if (!selectedTeachers) {

    }
    let teachers = {};
    selectedTeachers.forEach(element => {
      teachers[element.user_id] = element.user_name;

    });
    this.model.teachers = teachers;

    console.log('add suject model ', this.model)
     this.spinner.show()
    this.adminService.insertClassWiseSubjectTeacher(this.model).subscribe(
      (result) => {
        this.spinner.hide()
        if (result.status === "ok") {
          Swal.fire({
            title: "Successfully Assign.",
            icon: "success",
            timer: 2000,
          });
          console.log('classInserted res', result.result);
          this.closeDialog();
          const conferenceId = result.result.id; // subject id is a new conference id;
          const conferenceName = this.model.class_name + ": " + this.model.subject_name;
          result.result.student_list.push({
            user_id: this.model.teacher_id,
            user_name: this.model.teacher_user_name,
          });
          const tag = "my_group";
          this.createConferenceWithSubjectId(
            conferenceId,
            conferenceName,
            result.result.student_list,
            "2",
            tag
          );
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

  createConferenceWithSubjectId(
    conferenceId,
    conferenceName,
    usersList,
    conferenceType,
    tag
  ) {
    this.adminService
      ._addConference_forLearn2Gether(
        conferenceName,
        conferenceId,
        tag,
        usersList,
        conferenceType
      )
      .subscribe(
        (result) => {
          console.log(
            "Conference Create Successfully with subject id",
            result.result
          );
          const subject_find_btn = document.getElementById('subject-find-btn')
          if (!!subject_find_btn) subject_find_btn.click()
        },
        (err) => {
          console.log(err);
        }
      );
  }


  resetField() {
    this.optionReset ++
    console.log(this.teachers.value);
    this.model = {
      class_id: "",
      class_name: "",
      subject_name: "",
      sub_pic: "",
      teacher_id: "",
      teacher_user_name: "",
      description: ""
    };
  
    this.selectedTeacher = '';
    this.selectedClass = '';
    this.teacherList = [];
    this.classList = [];
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
