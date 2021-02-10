import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
// import { Class } from "../class/class.component";
// import { exam_type_name } from "../add-exam/exam_type_name";
import * as $ from "jquery";
// import { QuestionViewComponent } from '../question-view/question-view.component';
// import { GroupService } from 'src/app/group.service';
import { ExamService } from 'src/app/shared/services/exam_services/exam.service';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuestionViewComponent } from '../question-view/question-view.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {
  public deleteButtonUrl = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Output() examDataEvent = new EventEmitter<any>()

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['position', 'name', 'exam_type', 'subject_name', 'teacehr_name', 'exam_date', 'start_time', 'end_time', 'action'];

  private subscriptions: Array<Subscription> = [];
  classes: any;
  selectedBranch: any;
  selectedDepartment: any;
  loader: boolean;

  query = {
    branch_id: '',
    dept_id: '',
    class_id: ''
  }
  selectedClass: any;
  sUser: any;
  editExamBtn: any;

  component_name_for_child = 'class'
  optionReset = 0
  examList: any;

  constructor(private examService: ExamService,
              private adminService: AdminService, 
              public dialog: MatDialog,
              private spinner: NgxSpinnerService
              ) {
                this.dataSource = new MatTableDataSource<any>(this.classes);
         }

  ngOnInit() {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  deptReceived(event) {
    this.sUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    if (this.selectedBranch && this.selectedDepartment){
      this.query.branch_id = this.selectedBranch.id
      this.query.dept_id = this.selectedDepartment.id;
      let teacher_id: any;
      if (this.sUser.role.role_name === 'Teacher') {
        teacher_id = this.sUser.teacher_info.user_id;
      }
      if (this.query.dept_id){
        this.getClassByDeptId(this.query.dept_id, teacher_id);
      } 
    }
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>([]);
  }


  classSelector(value) {
    console.log('sclass',value)
    this.selectedClass = value
    this.dataSource = new MatTableDataSource<any>([]);
    this.query.class_id = value.id
  }

  getClassByDeptId(id, teacher_id?) {
    this.spinner.show()
      this.adminService.getClassByDeptId(id, teacher_id).subscribe(
        (result) => {
          if (result.status == 'ok') {
             this.spinner.hide()
              this.classes = result.resultset
              console.log('classes',this.classes)
              this.selectedClass = this.classes[0];
              this.classSelector(this.classes[0])
              
          if (!!this.selectedClass) {
            const examFindBtn = document.getElementById('exam-find-btn')
            if (!!examFindBtn) examFindBtn.click()
          }
          }
        },
        (err) => {
          this.spinner.hide()
          this.classes = []
          console.log(err);
          if (err.code == 404) {
            Swal.fire({
              title: `No class found for ${this.selectedDepartment.name} department`,
              icon: "warning",
              timer: 2000,
            });
          }
        }
      )
 
  }

  getExamByBranchDeptAndYear() {
    this.spinner.show()
    this.examService.getExamByBranchDeptAndYear(this.query).subscribe((result) => {
      if (result.status == 'ok') {
        this.spinner.hide()
        console.log('examList',result.resultset)
        this.examList = result.resultset
        this.dataSource = new MatTableDataSource<any>(this.examList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
      if (err.error.code == 404) {
        Swal.fire({
          title: err.error.message.en,
          icon: "info",
          timer: 2500,
        });
      }
    })
  }


  examDeleteDialoge(exam) {
    if (!exam.is_started_for_stds) {
      Swal.fire({
        title: `Do you want to delete the ${exam.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#F49D23",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(result => {
        if (result.value) {
          this.deleteExam(exam);
        }
      });
    }
  }

  examEditDialoge(exam) {
    if (!!exam) {
      this.examDataEvent.emit(exam)
      const setupExam = document.getElementById('setupExam')
      if (!!setupExam) setupExam.click()
    }
  }

  examQuestionDialoge(exam) {
    this.dialog.open(QuestionViewComponent, {
      disableClose: true,
      panelClass: window.innerWidth <= 768  ? 'overflow-dialog-container' : "incoming-call-dialog-container",
      data: exam,
      width: '90%'
    });
  }

  deleteExam(exam) {
    this.examService.deleteExam(exam).subscribe(
      result => {
        if (result.status == 'ok') {
          console.log(result)
          document.getElementById("exam-find-btn").click();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  resetField() {
    this.optionReset++
  }

}