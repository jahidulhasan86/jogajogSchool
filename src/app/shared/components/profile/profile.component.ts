import { Component, OnInit, Output, EventEmitter, } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../services/user_service/account.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  @Output() onChange: EventEmitter<File> = new EventEmitter<File>()

  public acServices;
  public files: any;
  inProgress;
  error;
  public user;
  imageCaution = false;
  public selectedGender;
  isInEditMode;
  allGenders = [
    { "id": 1, "name": "male" },
    { "id": 2, "name": "female" }
  ]
  sanitizedUrl;
  public test = JSON.parse(localStorage.getItem('sessionUser'))

  date = new FormControl(new Date(this.test.date_of_birth));

  public dateOfBirth

  constructor(public acService: AccountService) {
    this.acServices = acService;
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('sessionUser'))
    this.user.first_name = this.user.first_name;
    this.user.last_name = this.user.last_name;
    this.user.address = this.user.address;
    this.user.contact = this.user.contact;
    if (this.user.profile_pic) {
      this.user.profile_pic = this.user.profile_pic
    } else {
      this.user.profile_pic = this.user.profile_pic;
    }
    this.user.gender = this.user.gender;
    $('#profilePageContent').find('input, textarea, button, select').attr('disabled', 'disabled');
    this.isInEditMode = false;
  }

  dateInput(event) {
    console.log(event.value)
    this.dateOfBirth = Number(event.value)
    console.log(this.dateOfBirth)
  }

  getFiles(event) {
    this.files = event.target.files[0];
    if (this.files.size <= 1000000) {  // 1 MB maximum size
      this.projectImage(this.files);
    }
    else {
      this.imageCaution = true
      setTimeout(() => {
        this.imageCaution = false
      }, 3000);
    }
  }

  enableAttr() {
    this.isInEditMode = true;
    $('#profilePageContent').find('input, textarea, button, select').removeAttr("disabled");
  };

  disableAttr() {
    this.isInEditMode = false;
    $('#profilePageContent').find('input, textarea, button, select').attr('disabled', 'disabled');
  };

  doUpdate() {
    this.inProgress = true;
    this.user.date_of_birth = this.dateOfBirth
    this.acService.ProfileUpdate(this.user)
      .subscribe(result => {
        console.log(result)
        if (result.status == "ok") {
          let cuser = JSON.parse(localStorage.getItem('sessionUser'));
          cuser.first_name = result.result.first_name;
          cuser.last_name = result.result.last_name;
          cuser.date_of_birth = result.result.date_of_birth;
          cuser.gender = result.result.gender;
          cuser.contact = result.result.contact;
          cuser.address = result.result.address;
          if (this.files) {
            if (this.files.size <= 1000000) {  // 1 MB maximum size
              this.acService.profilePicUpload(this.files).subscribe(result => {
                console.log('profile photo update response....', result)
                cuser.profile_pic = result.result.url;
                this.user.profile_pic = result.result.url;
                localStorage.removeItem('sessionUser');
                localStorage.setItem('sessionUser', JSON.stringify(cuser));
                this.acServices.currentUser = cuser
                this.acService.ProfileUpdate(cuser).subscribe();
                this.ngOnInit();
                this.inProgress = false;
              }, err => {
                console.log('profile upload err....', err)
              })
            } else {
              let errMessage = "Photo size should be less then 1 MB";
              this.error = errMessage;
              setTimeout(() => {
                this.error = false;
              }, 4000);
            }
          } else {
            localStorage.removeItem('sessionUser');
            localStorage.setItem('sessionUser', JSON.stringify(cuser));
            this.acServices.currentUser = cuser
            this.ngOnInit();
            this.inProgress = false;
          }
        }
      },
        err => {
          if (err) {
            let errMessage = err._body != undefined ? JSON.parse(err._body) : err;
            this.error = errMessage.message != undefined ? errMessage.message : errMessage;
            setTimeout(() => {
              this.error = false;
            }, 3000);
            this.inProgress = false;
          }
          console.log(err)
          this.ngOnInit();
        });
  }
  projectImage(file: File) {
    let reader = new FileReader;
    reader.onload = (e: any) => {
      document.getElementById('btnUpdate').style.display = "";
      this.imageCaution = false;
      this.user.profile_pic = e.target.result;
      this.onChange.emit(file);
    };
    reader.readAsDataURL(file);
  }
}
