import { Component, OnInit, HostListener } from '@angular/core';
import * as $ from 'jquery';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../../../shared/services/user_service/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

//import { GlobalValue } from '../../global'
/* import { ConferenceService } from '../../../shared/services/conference_service/conference.service'; */
/* import { ChatService } from '../../../chat.service'; */
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';
//import { DialogPublicPrivate, HeaderComponent } from '../header/header.component';
import { MatDialog, MatDialogConfig, MatDialogRef, /* TOOLTIP_PANEL_CLASS */ MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { RolePopupDialogComponent } from '../signin/role-popup-dialog/role-popup-dialog.component';

import { TeacherService } from 'src/app/shared/services/teacher_service/teacher.service';
import { StudentService } from 'src/app/shared/services/student_service/student.service';
import { style } from '@angular/animations';
//import { AddTeacherComponent } from '../../components/admin/teachers/teachers.component';
import { SkoolService } from '../../../shared/services/skool_service/skool.service'
import { CompanyService } from '../../../shared/services/company_service/company.service';
import { AdminService } from '../../../shared/services/admin_services/admin.service';
import { JwtHelperService } from '@auth0/angular-jwt';


import {environment} from '../../../../environments/environment';
import { XmppChatService } from 'src/app/shared/services/xmpp-chat/xmpp-chat.service';
// import{RegisterComponent} from 'src/app/components/register/register.component'

//const constL2TogetherLogo = require('../../../ assets/images/lg/Login/LearnToLogo.png');

const constL2TogetherLogo = require('../../../../assets/images/lg/Login/LearnToLogo.png').default;

const constcreateAccountButtomImage = require('../../../../assets/images/createAccount-Button.png').default;
const constLoginSignUpVectorImage = require('../../../../assets/images/lg/Login/Login_Signup_Vector_Illustrationn.png').default;
const constuserIcon = require('../../../../assets/images/lg/Login/username_icon_Default.png').default;
const constpasswordIcon = require('../../../../assets/images/lg/Login/password_icon_Default.png').default;
const constpasswordShowIcon = require('../../../../assets/images/lg/Login/passwordShowEyeIcon.png').default;
@Component({
  //providers: [DialogPublicPrivate],
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  public L2TogetherLogoUrl = '';
  public createAccountButtomImageUrl = '';
  public loginSignUpVectorImageUrl = '';
  public userIconUrl = '';
  public passwordIconUrl = '';
  public passwordShowIconUrl = '';
  model: any = {};
  inProgress = false;
  isLoginActive = true;
  isRecoveryActive = false;
  public acServices;
  globalValue;
  allConference: any = [];
  cookieValue: string;
  currentCompanyInfo: any;
  currentCompanyId: any;
  sUser: any;
  allContactWithStatusByUserIdCast: any;
  companyId: any;
  queryObject: any;
  queryUrl: any;
  getJagTokenfromUrl: any;
  passwordFromUrl: any;
  keys = '$Ue0ugMTAAARrNokdEEiaz';
  helper: JwtHelperService;
  registerForm: FormGroup;
  submitted = false;



  constructor(public acService: AccountService,
    public router: Router,
    public route: ActivatedRoute, 
    /* public chatService: ChatService, */
    private cookieService: CookieService,
    public dialog: MatDialog,
   // private dialogPublicPrivate: DialogPublicPrivate,
    public dialogSignUp: MatDialog,
    private teacherService: TeacherService, private studentService: StudentService, private skoolService: SkoolService, private companyService: CompanyService, private adminService: AdminService, private xmppChatService: XmppChatService,private formBuilder: FormBuilder
  ) {
    this.acServices = acService;
   // this.globalValue = GlobalValue;
    this.L2TogetherLogoUrl = constL2TogetherLogo;
    this.createAccountButtomImageUrl = constcreateAccountButtomImage;
    this.loginSignUpVectorImageUrl = constLoginSignUpVectorImage;
    this.userIconUrl = constuserIcon;
    this.passwordIconUrl = constpasswordIcon;
    this.passwordShowIconUrl = constpasswordShowIcon;
  }

  ifEmailok;
  ifEmailisnotok;
  public isRememberChecked;
  public clientHeight

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.signinUIModification();
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      
      password: ['', [Validators.required]],
     
  }, {
      //validator: MustMatch('password', 'confirmPassword')
  });


    this.signinUIModification();
    setTimeout(() => {
      this.signinUIModification();
    }, 500);  
    this.acService.appNameChange('Video Collaboration Hub');
    this.currentCompanyInfo = JSON.parse(localStorage.getItem('companyInfo'));
    if (this.currentCompanyInfo) {
      this.currentCompanyId = this.currentCompanyInfo.id;
    }
    //this.globalValue = GlobalValue;
    this.rememberMe()
    this.clientHeight = document.documentElement.clientHeight

    this.route.queryParamMap.subscribe((result: any) => {
      if (Object.keys(result.params).length > 0 && result.params.constructor === Object) {
        if (result.params.type == 'class_invitation') {
          this.queryObject = result.params
          console.log(this.queryObject)
          if (this.queryObject.user_name) {
            this.model.user_name = this.queryObject.user_name
          }
        }
      }

      if (result.params.type == "cross_launch") {
        this.queryUrl = result
        this.getJagTokenfromUrl = this.queryUrl.params.access_token
        this.passwordFromUrl = this.decrptPass(this.queryUrl.params.p)
        // console.log('ppp',this.queryUrl.params.p)
        // console.log('pppp',this.passwordFromUrl)
        const decodeResult = this.tokenDecoder(this.getJagTokenfromUrl)
        let model = { user_name: decodeResult.user_name, password: this.passwordFromUrl }

        this.acService.checkAuthorize(this.getJagTokenfromUrl).subscribe(
          (result) => {
            console.log(result.result)
            this.userAuthorizationHandler(result.result, model)
            if (result.status == "ok") {
              // console.log(result)
            }
          },
          (err) => {
            console.log(err)
          }
        );

      }
    })
  }
  get f() { return this.registerForm.controls; }
  private tokenDecoder(token) {
    this.helper = new JwtHelperService();
    return this.helper.decodeToken(token);
  }

  decrptPass(value) {
    var key = CryptoJS.enc.Utf8.parse(this.keys);
    var iv = CryptoJS.enc.Utf8.parse(this.keys);
    var decrypted = CryptoJS.DES.decrypt(value, key, {
      keySize: 128 / 8,
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Author: Tonmoy Rudra
   * Login flow Docs.:
   * Login 1st with username & password
   * Then get company info with login token
   * then get token by call a service with login token and any companyId nad Appid from getCompany.
   * then other task as usual
   *
   * @memberof SigninComponent
   */


  userAuthorizationHandler(result, loginModel) {
    if (result.authorized) {
      // if modify loginModel with role_name, role_type (obj)
      if (!!this.queryObject && this.queryObject.type == 'class_invitation') {
        loginModel.role = { role_name: 'Student', role_type: '3' }
      }
      return this.authorize(result, loginModel, null)
    } else {
      return this.continueWithUserPopup(result, loginModel)
    }
  }
  continueWithUserPopup(x, loginModel) {
    return new Promise((resolve, reject) => {
      let appname_en = "Jogajog";
      let appname_bn = ""
      if (localStorage.getItem('selected_lang') === 'bn') {
        appname_en = "Jogajog";
        appname_bn = 'যোগাযোগ';
      }
      Swal.fire({
        title: (!!localStorage.getItem('selected_lang') && localStorage.getItem('selected_lang') === 'bn') ? 'আপনি বর্তমানে ' + loginModel.user_name + ' হিসাবে ' + appname_bn + ' এ লগ ইন করেছেন, আপনি কি একই ব্যবহারকারী আইডির সাথে ' + appname_bn + ' শ্রেণিকক্ষে চালিয়ে যেতে চান?' : 'You are currently logged in to  ' + appname_en + ' as ' + loginModel.user_name + ', would you like to continue to Jogajog classrooms with the same user id?',
        imageUrl: 'assets/images/continue-png.png',
        showCancelButton: true,
        confirmButtonColor: '#F4AD20',
        cancelButtonColor: '#d33',
        imageWidth: 65,
        padding: 10,
        width: 300,
        confirmButtonText: (!!localStorage.getItem('selected_lang') && localStorage.getItem('selected_lang') === 'bn') ? 'হ্যাঁ' : 'Yes',
        cancelButtonText: (!!localStorage.getItem('selected_lang') && localStorage.getItem('selected_lang') === 'bn') ? 'না' : 'No, Thanks'
      }).then((result) => {
        if (result.value) {
          const roleDialog = this.dialog.open(RolePopupDialogComponent, {
            disableClose: true,
            width: "400px",
            height: "350px"
          });

          roleDialog.afterClosed().subscribe(y => {
            if (y) {
              loginModel.role = y.selected_role;
              if (y.orgType == '2') {
                let company = { company_name: y.Organization };
                this.companyService.addCompany(company, x.access_token).subscribe(q => {
                  if (q.result) {
                    this.companyId = q.result.company_id;
                  }
                  let skool = {
                    name: y.Organization,
                    isDefaultBrDept: '1',
                    id: this.companyId
                  }
                  this.skoolService.insertSkool(skool, x.access_token).subscribe(r => {
                    if (r.result) {
                      // this.companyId = r.result.id;
                      this.doAuthorization(y, x, loginModel, this.companyId);
                    }
                  });
                })

              } else {
                if (y.selected_role.role_name == 'Student') {
                  let obj = {
                    company_id: environment.company_id,
                    branch_id: 'cde41a70-0c74-11eb-9dbf-9663dca59a38',
                    class_id: '5a0c5240-0c86-11eb-ae00-d335f841c590'
                  }
                  this.queryObject = obj
                }
                this.doAuthorization(y, x, loginModel, null);
              }


              /* this.authorize(x, loginModel).then((res : any )=>{  
                let token = res.result.access_token;
             
                if(y.selected_role == 'Teacher')
                {
                    let obj = {
                    user_name : res.result.user_name,
                    user_id : res.result.id,
                    contact : res.result.contact,
                    first_name : res.result.first_name,
                    last_name : res.result.last_name,                    
                    school_id : res.result.company_id,//////this is default school. need to change if new school created
                  }     
                  return this.teacherService.insertTeacherForSingleLogin(obj, res.result.access_token).subscribe()
                }
                if(y.role_name == 'Student'){}
              })
              .catch((err) => {
                reject(err)
              }) */

            }
          })

        } else {
          // dismiss can be 'cancel', 'overlay', 'close', 'timer'
          reject(result.dismiss)
        }
      });
    })
  }
  doAuthorization(y, x, loginModel, companyId) {
    this.authorize(x, loginModel, companyId).then((res: any) => {
      //let token = res.result.access_token;

      if (y.selected_role.role_name == 'Teacher') {
        let obj = {
          user_name: res.result.user_name,
          user_id: res.result.id,
          contact: res.result.contact,
          first_name: res.result.first_name,
          last_name: res.result.last_name,
          school_id: res.result.company_id,//////this is default school. need to change if new school created
        }
        return this.teacherService.insertTeacherForSingleLogin(obj, res.result.access_token).subscribe()
      }
      if (y.selected_role.role_name == 'Student') {
       
      }
    })
      .catch((err) => {
        //reject(err)
      });
  }

  tokenInfo = null

  authorize(result, loginModel, companyId) {

    return new Promise((resolve, reject) => {
      this.acService.authorize(result, loginModel, companyId).subscribe((result) => {
        if (result) {
          console.log('result of authorize')
          console.log(result)

          if (result._body) result = JSON.parse(result._body)

          this.tokenInfo = result.result;

          this.acService.getCompanyInfoById(this.tokenInfo.company_id)
            .subscribe(companyInfo => {

              this.acService.schoolInfo = companyInfo

              localStorage.setItem('schoolInfo', JSON.stringify(companyInfo))
              this.acService.userSchoolCompany$.next(companyInfo)
              if (this.isRememberChecked == true) {
                // localStorage.setItem('remember_me', JSON.stringify(remember_me)) // local storage
                this.createCookies(this.model.user_name, this.model.password)
              } else {
                // localStorage.removeItem("remember_me") // local storage
                this.deleteCookies();
              }

             
              this.tokenInfo.password = loginModel.password
              this.acService.currentUser = this.tokenInfo
              localStorage.setItem('sessionUser', JSON.stringify(this.tokenInfo));
              localStorage.setItem('profile_pic', JSON.stringify(this.tokenInfo.profile_pic));

              // for get company feature /Permission data
              this.companyFeatures();
              // Tonmoy

              this.pubsubAndXamppRegistration()
              
              if (this.tokenInfo.role.role_name == 'Teacher') {
                this.getTeacherInfoById().then(x=>{
                  this.saveUserSession()
                  this.router.navigate(['/instructor']);

                }

                );
               
              }
              if (this.tokenInfo.role.role_name == 'Student') {
                if (!!this.queryObject) {
                  this.assignUserToClass().then((x) => {
                    if (!!x) {
                      this.getStudentInfoById();
                      this.saveUserSession()
                      this.router.navigate(['/student']);
                    }
                  }).catch((e) => {
                    console.log(e)
                  })
                } else {
                  this.getStudentInfoById().then(x=>{
                    this.saveUserSession()
                    this.router.navigate(['/student']);
                  });
                  
                }
              }

              if (this.tokenInfo.role.role_name.toLowerCase() == 'admin') this.router.navigateByUrl('/Dashboard')

              // else this.router.navigate(['/Main']);

             /*  this.acService.pubsubRegistration(this.acService.currentUser.id, this.model.password)
                .subscribe(r => {
                  console.log(r);
                  setTimeout((x) => {

                    console.log("chat connect for conference count: call after 1 sec")
                    this.connectXampp();
                    this.acService.getContactWithFriendsStatus().subscribe()
                    this.getAllConferenceByUserId();
                    this.getRecentChatHistory();

                  }, 1000)
                }) */
            },
              err => {
                console.log(err)
              })

          // get all company list by this user.
          this.acService.getCompanyByUserList(this.tokenInfo.access_token).subscribe();
          localStorage.removeItem('history');


          resolve(result)

        }
      }, err => {
        console.log(err)
        reject(err)
      })
    })
  }
  login() {
    this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

    this.inProgress = true;
    var loginData;
    this.acService.token0Auth(this.model.user_name, this.model.password)
      .subscribe(result => {
        console.log(result);
        this.userAuthorizationHandler(result.result, this.model).then((result) => {
          console.log('after call authorization handler')
          console.log(result)
        })
          .catch((err) => {
            console.log(err)
          })

      },
        err => {
          if (err.status === 400) {
            this.inProgress = false;
            Swal.fire({
              title: "Invalid login name or password"
            });
          } else if (err.status === 404) {
            this.inProgress = false;
            Swal.fire({
              title: "No such user found"
            });
          }
          else {
            Swal.fire({
              title: "Server not found"
            });
            this.inProgress = false;
          }
        });
  }

  /* connectXampp() {
    //chat connection
    setTimeout(() => {
      var userStore = JSON.parse(localStorage.getItem("sessionUser"));
      var user = { username: userStore.user_name, password: userStore.password, user_id: userStore.id };
      this.chatService.checkConnection(user);
      var globalRetryValue = 0;
      this.chatService.onConnect$.subscribe((onConnect) => {
        console.log(onConnect);
        console.log("globalRetryValue: ", globalRetryValue)
        if (onConnect == false) {
          globalRetryValue++;
          if (globalRetryValue <= 5) {
            this.chatService.checkConnection(user);
          }
        }
        else {
          globalRetryValue = 0;
        }
      });
    }, 3000);
  } */
  // Verto
  //loginVerto_PTT(loginNumber, loginPass) {
    //this.vertoService.loginVerto(loginNumber, loginPass);
  //}


/*   getRecentChatHistory() {
    this.acService.allContactWithStatusByUserIdCast.subscribe(friendList => {
      this.allContactWithStatusByUserIdCast = friendList;
    });

    this.conferenceService.allConferenceListCast.subscribe(result => {
      this.allConference = result;
    });

    console.log("call recent")
    this.sUser = JSON.parse(localStorage.getItem('sessionUser'));
    this.chatService._getRecentChatHistory()
      .subscribe(result => {
        var recentChatHistory = [];
        var oldModelArray = [];
        recentChatHistory = result.result.value;



        for (let i = 0; i < recentChatHistory.length; i++) {
          if (!recentChatHistory[i].is_group) { // for one to one
            for (let j = 0; j < this.allContactWithStatusByUserIdCast.length; j++) {
              if (this.allContactWithStatusByUserIdCast[j].user_name == recentChatHistory[i].display_name) {
                recentChatHistory[i].profile_pic = this.allContactWithStatusByUserIdCast[j].profile_pic;
                recentChatHistory[i].group_type = 'friend';

              }
              else {
                // if not found
                recentChatHistory[i].group_type = 'friend';
              }
            }
          } else {
            // if it is group
            for (let j = 0; j < this.allConference.length; j++) {
              if (this.allConference[j].id == recentChatHistory[i].jabber_username) {
                if (this.allConference[j].is_pinned) {
                  recentChatHistory[i].group_type = group_type.GROUP_TYPE_PINNED;
                } else if (this.allConference[j].geofences) {
                  recentChatHistory[i].group_type = group_type.GROUP_TYPE_GEO;
                }
                // else if (Object.keys(this.allConference[j].conference_timing).length != 0) {
                //   recentChatHistory[i].group_type = group_type.GROUP_TYPE_FLIGHT;
                // }
                else {
                  recentChatHistory[i].group_type = group_type.GROUP_TYPE_GENERAL;
                }
              } else {

              }
            }
          }

          var myOldRecentModelObj = {
            "allow_contributor": false,
            "callSessionId": "", //
            "company_id": "",
            "conferenceId": "",//
            "conferenceType": "",//
            "count": 0,
            "group_id": "",
            "group_name": "",
            "group_owner": "",
            "id": "",//
            "inOnline": false,//
            "isCallSession": false,//
            "is_admin": false,
            "is_pinned": false,
            "isnew": "",//
            "isviewed": false,//
            "msg": "",
            "name": "",
            "onlinestatus": "",//
            "room": "",
            "stamp": "",
            "style": "",//
            "time": null,
            "user_id": "",
            "profile_pic": "",
            "group_type": "",
            'is_ptt_enabled': ""
          }
          var d = new Date(parseFloat(recentChatHistory[i].timestamp));
          var time = d.toLocaleString(undefined, {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          myOldRecentModelObj.allow_contributor = recentChatHistory[i].allow_contributor;
          myOldRecentModelObj.company_id = recentChatHistory[i].company_id;
          myOldRecentModelObj.count = recentChatHistory[i].badge_count;
          myOldRecentModelObj.group_id = recentChatHistory[i].is_group ? recentChatHistory[i].jabber_username : null;
          myOldRecentModelObj.group_name = recentChatHistory[i].is_group ? recentChatHistory[i].display_name : null;
          myOldRecentModelObj.group_owner = recentChatHistory[i].is_group ? recentChatHistory[i].group_owner : null;
          myOldRecentModelObj.is_admin = recentChatHistory[i].is_admin;
          myOldRecentModelObj.is_pinned = recentChatHistory[i].is_pinned;
          myOldRecentModelObj.msg = recentChatHistory[i].text;
          myOldRecentModelObj.name = recentChatHistory[i].is_group == false ? recentChatHistory[i].display_name : null;
          myOldRecentModelObj.room = recentChatHistory[i].is_group == true ? recentChatHistory[i].jabber_username + "@conference." + environment.host : null;
          myOldRecentModelObj.stamp = recentChatHistory[i].timestamp;
          myOldRecentModelObj.time = time;
          myOldRecentModelObj.user_id = recentChatHistory[i].is_group == true ? recentChatHistory[i].jabber_username + "@conference." + environment.host : recentChatHistory[i].jabber_username + "@" + environment.host;
          myOldRecentModelObj.profile_pic = recentChatHistory[i].profile_pic;
          myOldRecentModelObj.group_type = recentChatHistory[i].group_type;
          myOldRecentModelObj.is_ptt_enabled = recentChatHistory[i].is_ptt_enabled;

          // connect all group if they are not in same company
          if (myOldRecentModelObj.company_id != this.sUser.access_token.company_id) {
            if (recentChatHistory[i].is_group) {
              this.chatService.connectChatRoom(recentChatHistory[i].jabber_username)
            }
          }
          oldModelArray.push(myOldRecentModelObj)
          this.chatService.latestMessage[myOldRecentModelObj.user_id] = myOldRecentModelObj;
        }

      }, err => {
        console.log("error from get recent chat history", err);
      })
  }
 */
  forgotPasswordActive() {
    this.isLoginActive = false;
    this.isRecoveryActive = true;

  }

  loginActive() {
    this.isLoginActive = true;
    this.isRecoveryActive = false;
  }

  Forgetpassword() {
    this.inProgress = true;
    this.acService.forgetpassword(this.model.PasswordResetEmail)
      .subscribe(result => {
        this.ifEmailok = true;
        this.ifEmailisnotok = false;
        this.inProgress = false;
      },
        err => {
          console.log('sign in Forgetpassword error resp')
          this.ifEmailisnotok = true;
          this.ifEmailok = false;
          this.inProgress = false;
        });
  }

  showImage(e) {
    // Get the modal
    var modal = document.getElementById('myModal');
    var captionText = document.getElementById("caption");
    modal.style.display = "block";
    captionText.innerHTML = "Video Collaboration Hub Diagram";
  }

  closeImage() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }

  onChange(e) {
    this.isRememberChecked = e.checked
  }

  // rememberMe(){ //local storage
  //   if(localStorage.getItem('remember_me')){
  //     var remember_me = JSON.parse(localStorage.getItem('remember_me'))
  //     this.model.user_name = remember_me.user_name
  //     this.model.password = remember_me.password
  //     this.isRememberChecked = true
  //   }else  {
  //     this.isRememberChecked = false
  //   }
  // }

  rememberMe() { // cookies
    if (this.cookieService.check('remember_me')) {
      const encrypted_pass: string = this.cookieService.get('remember_me');
      var bytes = CryptoJS.AES.decrypt(encrypted_pass.toString(), 'securityKey')
      var remember_me = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.model.user_name = remember_me.user_name
      this.model.password = remember_me.password
      this.isRememberChecked = true
    } else {
      this.isRememberChecked = false
    }
  }
/* 
  getAllConferenceByUserId() {
    this.conferenceService._getAllConferenceByUserId("2")   // 2  for group
      .subscribe((result) => {
        if (result.status == 'ok') {
          this.conferenceService.allConferenceListCast.subscribe(result => {
            this.allConference = result;
          });
          return result.resultset;
        }
      }, err => {
        this.allConference = []
        // this.selected_group(this.allConference);
        // this.conferenceMembers(this.allConference)
        console.log("Error from getAll conference : not found")
      });
  }
 */
  createCookies(user_name, password) {
    let remember_me = {
      user_name: user_name,
      password: password
    }
    var remember_me_encrypted = CryptoJS.AES.encrypt(JSON.stringify(remember_me), 'securityKey')
    this.cookieService.set('remember_me', remember_me_encrypted, 7)
  }

  deleteCookies() {
    if (this.cookieService.check('remember_me')) {
      this.cookieService.delete('remember_me')
    }
  }

  companyFeatures() {
    this.acServices._companyFeatures()
      .subscribe(result => {
        if (result.status == 'ok') {
        }
      }, err => {
        console.log(err)
      })
  }

  openSignUpDialog(isModalClick): void {
    var sentReceiveDialog = this.dialog.open(SignupComponent, {
      disableClose: true,
      // height: '500px',
      width: '400px',
      data: {
        dataKey: isModalClick
      }
    });
  }

  async getTeacherInfoById() {
    await this.teacherService.getById().toPromise()
  }

  async getStudentInfoById() {
    await this.studentService.getStudentById().toPromise();
  }

  signinUIModification() {
    setTimeout(() => {
      $('.mainPart').css("height", window.innerHeight);
    }, 500);

  }

  passwordToggle() {
    var x = (<HTMLInputElement>document.getElementById("password"));
    if (x.type === "password") {
      x.type = "text";
      document.getElementById('hide').style.display = "none"
      document.getElementById('show').style.display = "inline-block";
    } else {
      x.type = "password";
      document.getElementById('hide').style.display = "inline-block";
      document.getElementById('show').style.display = "none";
    }
  }

  assignUserToClass() {
    return new Promise((resolve, reject) => {
      this.adminService.assignUserToClass(this.queryObject).subscribe((result) => {
        if (result.status == 'ok') {
          console.log(result)
          resolve(result)
        }
      }, err => {
        console.log(err)
        reject(err)
      })
    })
  }

  saveUserSession() {
    this.acService.saveUserSession({ last_company_id: JSON.parse(localStorage.getItem('sessionUser')).company_id }).subscribe((result) => {
      if (result.status == 'ok') {
        console.log('last company id', result)
      }
    }, err => {
      console.log(err)
    })
  }

  async pubsubAndXamppRegistration() {
		// Rules: 1st call chatRegistration, then call pubsubRegistration, dont change the flow.
		await this.chatRegistration(this.acServices.currentUser.user_name, this.acServices.currentUser.password);
		await this.pubsubRegistration(this.acServices.currentUser.id, this.acServices.currentUser.password);
	}

	async chatRegistration(user_name, password): Promise<any> {
		this.xmppChatService.chatRegistration(user_name, password).subscribe(
			(result) => {
				if (result.status === 'ok') {
					console.log('working chat registration', result);
				}
			},
			(error) => {
				console.log('error in working chat registration', error);
			}
		);
	}

	async pubsubRegistration(user_id, password): Promise<any> {
		this.xmppChatService.pubsubRegistration(user_id, password).subscribe(
			(result) => {
				if (result.status === 'ok') {
          console.log('pubsub registration', result);
				}
			},
			(error) => {
				console.log(error);
			}
		);
  }
}
