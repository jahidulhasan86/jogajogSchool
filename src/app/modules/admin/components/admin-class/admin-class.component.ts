import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import { AddClassComponent } from '../add-class/add-class.component';
import { InviteClassComponent } from '../invite-class/invite-class.component';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

export interface Class {
  position: number;
  name: string;
  start_time: string;
  end_time: string;
}


@Component({
  selector: 'app-admin-class',
  templateUrl: './admin-class.component.html',
  styleUrls: ['./admin-class.component.css']
})
export class AdminClassComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Class>;
  displayedColumns: string[] = ['position', 'class_name', 'start_time', 'end_time', 'action'];

  branchList: any;
  selectedBranch: any;
  departmentList: any;
  selectedDepartment: any;
  class_list: any;
  component_name_for_child = 'class'
  optionReset = 0
  loader: boolean = false;

  constructor(public adminService: AdminService, private dialog: MatDialog, private spinner: NgxSpinnerService) {
    this.dataSource = new MatTableDataSource(this.class_list);
  }


  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<Class>([]);
  }

  getClassByDeptId() {
    this.spinner.show()
    this.adminService.getClassByDeptId(this.selectedDepartment.id).subscribe(result => {
      if (result) {
        this.spinner.hide()
        this.class_list = result.resultset
        if (!!this.class_list) {
          this.dataSource = new MatTableDataSource<Class>(this.class_list);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
      if (err.code == 404) {
        Swal.fire({
          title: `No class found for ${this.selectedDepartment.name} department`,
          icon: "warning",
          timer: 2000,
        });
      }
    })
  }

  deptReceived(event) {
    console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    this.selectedBranch = event.branch
    this.getClassByDeptId()
  }

  addClassDialog() {
    let addClassDialog = this.dialog.open(AddClassComponent, {
      disableClose: true,
      panelClass: window.innerWidth <= 768 ? 'overflow-dialog-container' : 'incoming-call-dialog-container',
      width: window.innerWidth <= 768 ? '80%' : '50%',
    });

  }

  inviteDialoge(classData) {
    console.log('school', this.selectedBranch.school_id, 'branch', this.selectedBranch, 'dept', this.selectedDepartment, 'class data', classData)
    this.dialog.open(InviteClassComponent, {
      disableClose: true,
      panelClass: 'incoming-call-dialog-container',
      width: window.innerWidth <= 768 ? '80%' : '50%',
      data: {
        school_id: this.selectedBranch.school_id,
        branch_id: this.selectedBranch.id,
        dept_id: this.selectedDepartment.id,
        class_id: classData.id
      }
    });
  }

  clearField() {
    this.optionReset++
  }

}
