import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AdminService } from 'src/app/shared/services/admin_services/admin.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {
  @ViewChild('startTime') startTime: ElementRef;
  @ViewChild('endTime') endTime: ElementRef;

  public classModel = {
    name: "",
    dept_id: "",
    start_time: "",
    end_time: "",
    timezone: ""
  }

  public loader = false
  selectedDepartment: any;
  component_name_for_child = 'add_class'
  optionReset = 0

  constructor(private adminService: AdminService,public dialogRef: MatDialogRef<AddClassComponent>, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // console.log(this.classModel)
  }

  deptReceived(event) {
    // console.log('receivedDept', event)
    this.selectedDepartment = event.dept
    if (this.selectedDepartment) {
      this.classModel.dept_id = this.selectedDepartment.id
    }
  }

  timezoneSelector(value) {
    this.classModel.timezone = value
  }

  timeSelector(event, src) {
    if (src == 'start_time') this.classModel.start_time = event
    if (src == 'end_time') this.classModel.end_time = event
  }

  insertClass() {
    this.spinner.show()
    this.adminService.insertClass(this.classModel).subscribe(result => {
      if (result.status == 'ok') {
        this.spinner.hide()
        Swal.fire({
          title: "Class added Successfully",
          icon: "success",
          timer: 2000,
        });
        this.findNowBtn()
        this.closeDialog()
        
      }
    }, err => {
      this.spinner.hide()
      console.log(err)
        Swal.fire({
          title: "Error! Please try again later.",
          icon: "warning",
          timer: 2000,
        });
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  findNowBtn(){
    setTimeout(() => {
      const classFindBtn = document.getElementById('class-find-btn')
      if (!!classFindBtn) classFindBtn.click()
    }, 500);
  }

  resetField() {
    Object.keys(this.classModel).forEach(key => this.classModel[key] = '');
    this.startTime.nativeElement.value = ''
    this.endTime.nativeElement.value = ''
    this.optionReset ++
  }

}
