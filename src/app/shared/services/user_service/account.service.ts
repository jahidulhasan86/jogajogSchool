import { Injectable } from '@angular/core';

/* import { Http, Headers, Response, RequestOptions, Jsonp } from '@angular/http'; */

import { HttpClient, HttpHeaders } from '@angular/common/http';
import {SignupModel  } from '../../../../app/modules/auth/signup/signup.model';
import { Observable, throwError, observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, concatMap, mergeMap } from 'rxjs/operators';
import{environment} from '../../../../environments/environment'
// import { CallHelper } from '../../services/call/call-helper'
//import { HomeNavbarComponent } from '../../components/home-navbar/home-navbar.component';
//import { LogsService } from '../logs/logs.service'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public schoolInfo: any

  public friendList;
  public totalPendingNotif = 0;
  public totalAcceptNotif = 0;
  public totalFriendNotif = 0;
  public pendingFriendList;
  isTeacher = false;
  public profileInfo = new BehaviorSubject<any>('')
  profileCast = this.profileInfo.asObservable();

  public appName$ = new BehaviorSubject<any>("Protect Together")
  appNameCast = this.appName$.asObservable();
  showView: any;
  appNameChange(appname) {
    this.appName$.next(appname)
  }

  public joinTextShowHide$ = new BehaviorSubject<any>(false)
  joinTextShowHideCast = this.joinTextShowHide$.asObservable();
  joinTextShowHideChange(isShow) {
    this.joinTextShowHide$.next(isShow)
  }

  public taskShow$ = new BehaviorSubject<any>(false)
  taskShowCast = this.taskShow$.asObservable();
  isTaskShow(isShow) {
    this.taskShow$.next(isShow)
  }


  public gridViewShowHide$ = new BehaviorSubject<any>(false)
  gridViewShowHideCast = this.gridViewShowHide$.asObservable();

  model: any;

  private loginUrl = environment.alert_circel_Service_Url + '/account/signin';
  private signupUrl = environment.alert_circel_Service_Url + '/account/signup';
  private forgetpasswordUrl = environment.alert_circel_Service_Url + '/account/forgotpassword';
  private ResetPasswordUrl = environment.alert_circel_Service_Url + '/account/ResetPassword';
  private getCompanyInfoByIdURL = environment.alert_circel_Service_Url + '/companies';
  private createApplicationUrl = environment.alert_circel_Service_Url + '/companies/applications';
  private usersByComByAppUrl = environment.alert_circel_Service_Url + '/companies/applications/users';
  private userRegisterUrl = environment.alert_circel_Service_Url + '/companies/users/register'
  
  private profileUpdateURL = environment.alert_circel_Service_Url + '/user/update';
  private friendRequestSentURL = environment.alert_circel_Service_Url + '/friends/request';
  private acceptFriendRequestURL = environment.alert_circel_Service_Url + '/friends/accept';
  private getAllFriendsByUserIdURL = environment.alert_circel_Service_Url + '/friends/getAllFriendsByUserId';
  private getContactWithFriendsStatusURL = environment.alert_circel_Service_Url + '/friends/contactwithfriendsstatus';
  private unFriendURL = environment.alert_circel_Service_Url + '/friends/unfriend';
  private cancelFriendURL = environment.alert_circel_Service_Url + '/friends/cancel';
  private getAllRequestByUserIdURL = environment.alert_circel_Service_Url + '/friends/getAllRequestByUserId';
  private declineFriendRequestURL = environment.alert_circel_Service_Url + '/friends/decline';
  private getAllPendingFriendRequestURL = environment.alert_circel_Service_Url + '/friends/getAllPendingByUserId'
 
  private updateInviteLogForJoinUrl = environment.alert_circel_Service_Url + '/account/updateInviteLogForJoin';
  private getAllUsersByCompanyByAppUrl = environment.alert_circel_Service_Url + '/companies/applications/users';
  private getCompanyByUserListUrl = environment.alert_circel_Service_Url + '/user/companies';
  private getTokenUrl = environment.alert_circel_Service_Url + '/account/token';
  private inviteCompanyUrl = environment.alert_circel_Service_Url + '/companies/invite';
  private saveUserSessionUrl = environment.alert_circel_Service_Url + '/session/saveUserSession';
  private getSessionByUserUrl = environment.alert_circel_Service_Url + '/session/getSessionByUser';
  private companyFeaturesUrl = environment.alert_circel_Service_Url + '/config';
  private CompanyBaseUrl = environment.alert_circel_Service_Url + '/baseurl';
  private getUserListByIdsUrl = environment.alert_circel_Service_Url + '/user/list';
  private getUserByUserNameUrl = environment.alert_circel_Service_Url + '/user/getUserByUserName';
  private profilePicUploadUrl = `${environment.profilePhotUrl}/files/upload`

  public currentUser = null;
  public companyInfo: any;
  // private chatService;
  selectedConference;

  acceptFriendNotifArr = []
  pendingFriendNotifArr = []

  private allFriendListByUserId$ = new BehaviorSubject<boolean>(false);
  allFriendListByUserIdCast = this.allFriendListByUserId$.asObservable();

  public allContactWithStatusByUserId$ = new BehaviorSubject<any>([]);
  allContactWithStatusByUserIdCast = this.allContactWithStatusByUserId$.asObservable();

  private getAllRequestByUserId$ = new BehaviorSubject<boolean>(false);
  getAllRequestByUserIdCast = this.getAllRequestByUserId$.asObservable();

  private getAllPendingRequest$ = new BehaviorSubject<any>([]);
  getAllpendingRequestCast = this.getAllPendingRequest$.asObservable();

  public getAllUsersByComByApp$ = new BehaviorSubject<any>([]);
  getAllUsersByComByAppCast = this.getAllUsersByComByApp$.asObservable();

  public showUserByCompanyList$ = new BehaviorSubject<boolean>(true);
  showUserByCompanyListCast = this.showUserByCompanyList$.asObservable();

  public getAllCompanyByUserList$ = new BehaviorSubject<any>([]);
  getAllCompanyByUserListCast = this.getAllCompanyByUserList$.asObservable();

  public friendMenuNameChange$ = new BehaviorSubject<string>('');
  friendMenuNameChangeCast = this.friendMenuNameChange$.asObservable();


  private userFeature = new BehaviorSubject<any>(null);
  userFeatureCast = this.userFeature.asObservable();


  public userSchoolCompany$ = new BehaviorSubject<any>(null);
  userSchoolCompanyCast = this.userSchoolCompany$.asObservable();

  public sent_receiveRequestFlag$ = new BehaviorSubject<string>('receiveRequest');
  sent_receiveRequestFlagCast = this.sent_receiveRequestFlag$.asObservable();

  public roleChecker = new BehaviorSubject<boolean>(false);
  roleCheckerObserver = this.roleChecker.asObservable();

  public getUserListIds$ = new BehaviorSubject<any>([]);
  getUserListIdsCast = this.getUserListIds$.asObservable();

  public routerOutShow = new BehaviorSubject<boolean>(false);
  routerOutletShowCast = this.routerOutShow.asObservable();

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    this.companyInfo = JSON.parse(localStorage.getItem("companyInfo"));
     let tRole = localStorage.getItem('tokenRole');
    if (tRole) {
      tRole === 'teacher' ? this.isTeacher = true : this.isTeacher = false;
      this.roleChecker.next(this.isTeacher);
    }

    // this.companyInfo={
    //   company_name : JSON.parse(localStorage.getItem("companyInfo")) == null ? environment.default_company_name:this.companyInfo.company_name,
    //   logo : JSON.parse(localStorage.getItem("companyInfo")) == null ? environment.default_company_logo:this.companyInfo.logo
    // }

    // this.chatService = chat;

    if (this.companyInfo == null) {
      this.companyInfo = {
        company_name: environment.default_company_name,
        logo: environment.default_company_logo
      }
    }
    else if (this.companyInfo != null) {
      this.companyInfo = {
        id: this.companyInfo.id == null || this.companyInfo.id == "" ? environment.company_id : this.companyInfo.id,
        company_name: this.companyInfo.company_name == null || this.companyInfo.company_name == "" ? environment.default_company_name : this.companyInfo.company_name,
        logo: this.companyInfo.logo == null || this.companyInfo.logo == "" ? environment.default_company_logo : this.companyInfo.logo
      }
    }
   /*  this.conferenceService.singleConferenceCast.subscribe(result => {
      this.selectedConference = result
    }) */
  }
  updateInviteLogForJoin() {
    /* console.log("<========updateInviteLogForJoin Service isTecherRoleed========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
    let options = new RequestOptions({ headers: headers }); // Create a request option
    let invitedInfoObj = JSON.parse(localStorage.getItem('invitedInfo'))
    invitedInfoObj.app_id = environment.app_id
    invitedInfoObj.company_id = environment.company_id

  

    let body = JSON.stringify(invitedInfoObj)
    return this.http.post(this.updateInviteLogForJoinUrl, body, htt)
      .pipe(
        map(user => {
          let userData = user;
          localStorage.removeItem('invitedInfo')
          return userData;

        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
 */
  }


  login(email: string, password: string): Observable<any> {
    console.log("<========Login Service isTecherRoleed========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
   // let options = new RequestOptions({ headers: headers }); // Create a request option
   const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: JSON.parse(localStorage.getItem('token'))
    })
  };
    
   let body = JSON.stringify({ user_name: email, password: password, app_id: environment.app_id })

    return this.http.post(this.loginUrl, body, httpOptions)
      .pipe(
        map((x: Response) => x),
        
        map((x: any) => {
          
          let userData =x ;
          //this.chatRegistration(userData.result.user_name, password);
          if (userData && userData.result.access_token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            userData.result.password = password;

            // localStorage.setItem('sessionUser', JSON.stringify(userData.result));
            // localStorage.setItem('profile_pic', JSON.stringify(userData.result.profile_pic));
            // localStorage.setItem('token', JSON.stringify(userData.result.access_token)); // move on getToken().
            var offlineMessage = JSON.parse(localStorage.getItem('offline_message'));
            if (!offlineMessage) {
              localStorage.setItem('offline_message', JSON.stringify([]));
            }

            // this.currentUser = userData.result; //Store currentUser Globally
            let userStore = userData.result;
            return userData;
          }

        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }



  getToken(body, loginUserData) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Get Token service Service isTecherRoleed========>");
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
       // Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };
      
    // headers.append('Authorization', token);
    // Create a request option

    return this.http.post(this.getTokenUrl, body, httpOptions)
      .pipe(
        map((x: Response) => x),

        map((result:any) => {
          var response = result;
          if (response.result.role) {
            let tokenRole = response.result.role.role_name.toLowerCase();
            localStorage.setItem('tokenRole', tokenRole);
            tokenRole === 'teacher' ? this.isTeacher = true : this.isTeacher = false;
            this.roleChecker.next(this.isTeacher);
          }
          loginUserData.access_token = response.result.access_token;
          loginUserData.app_id = response.result.app_id;
          loginUserData.company_id = response.result.company_id;
          loginUserData.is_company_admin = response.result.is_company_admin;
          loginUserData.role = response.result.role;
          localStorage.setItem('sessionUser', JSON.stringify(loginUserData));
          localStorage.setItem('profile_pic', JSON.stringify(loginUserData.profile_pic));
          localStorage.setItem('token', JSON.stringify(response.result.access_token));

         /*  if (response.result.role.role_name.toLowerCase() == 'admin') {
            localStorage.setItem('showView', JSON.stringify('admin'));
            
          } if (response.result.role.role_name.toLowerCase() != 'admin') {
            localStorage.setItem('showView', JSON.stringify('communication'));
            
          } */

          this.currentUser = loginUserData; //Store currentUser Globally
          return response;
        }),
        catchError((error: Response) => {
          console.log("Get Token error: " + error)
          return throwError(error);
        })
      )
  }

  getToken_without_change_any_storage(body) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Get Token without change any storage service Service isTecherRoleed========>");
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.getTokenUrl, body, options)
      .pipe(
        map(result => {
          var response = result;
          return response.result;
        }),
        catchError((error: Response) => {
          console.log("Get Token without change any storage error: " + error)
          return throwError(error);
        })
      )
 */  }

  /* chatRegistration(username: string, password: string) {
    console.log("<========chatRegistration troleed========>" + username + " " + password)
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers }); // Create a request option

    let body = JSON.stringify({ name: username, host: environment.host, password: password, app_id: environment.app_id, company_id: environment.company_id })

    return this.http.post(this.chatRegistrationURL, body, options)
      .pipe(
        map(user => {
          console.log('working chat registration');
          console.log(user)
        }),
        catchError((error: Response) => {
          console.log('error in working chat registration');

          console.log(error);

          return throwError(error)
        })
      )
  } */


  /* pubsubRegistration(user_id: string, password: string) {
    console.log("trole pubsubreg")
    let req = {
      "user_id": user_id,
      "device_id": "",
      "reg_token": ""
    }
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
    var url = environment.notification_url + "/notifications/pubsub/register";
    let options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.post(url, req, options)
      .pipe(
        map(x => {
          let res = x
          var resObj = res.result;
          if (resObj != null && resObj) console.log('Update Token to server is finished.');
          localStorage.setItem('pubsub', JSON.stringify(res.result));
          return res;
        }),
        catchError((error: Response) => {
          console.log('error in working chat registration');

          console.log(error);

          return throwError(error)
        })
      )
  } */

  getCompanyInfoById(company_id, comDetailsShow?) {
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let company;
    console.log("<========Get CompanyInfo by company_id Service troleed========>")

  /*   let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
   */  
  //let options = new RequestOptions({ headers: headers });
    // Create a request option
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};


    return this.http.get(this.getCompanyInfoByIdURL + "?id=" + company_id, httpOptions)
      .pipe(
        map((x: Response) => x),

        map(companyInfo => {
          company = companyInfo;
          console.log(company);
          // localStorage.setItem('companyInfo', JSON.stringify(company.result));
          if (!comDetailsShow) {
            if (company.result.id == environment.company_id) {
              //company.result.company_name = 'Private';
              company.result.company_name = 'Mentors'
            }
            if (company.result.logo == null || company.result.logo == '') {
              company.result.logo = environment.company_logo_when_no_logo_found
            }
            localStorage.setItem('companyInfo', JSON.stringify(company.result));
            this.companyInfo = company.result;
          }
          return company.result;
        }),
        catchError((error: Response) => {
          console.log("getCompanyInfoById error: " + error)
          return throwError(error);
        })
      )
  }

  getCompanyInfoById_withOut_change_LocalStorage(company_id) {
   /*  this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let company;
    console.log("<========Get CompanyInfo by company_id Service troleed========>")

    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

  

    return this.http.get(this.getCompanyInfoByIdURL + "?id=" + company_id, options)
      .pipe(
        map(companyInfo => {
          company = companyInfo;
          console.log(company);
          return company.result;
        }),
        catchError((error: Response) => {
          console.log("getCompanyInfoById error: " + error)
          return throwError(error);
        })
      ) */
  }

  signup(body: any, overlapping?): Observable<SignupModel[]> {
    console.log("<========SignUp Service troleed========>")
/* 
    var overlappingFlag = overlapping ? true : false;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers }); */
    var overlappingFlag = overlapping ? true : false;
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};



    console.log(body);

    if (!body.email || !body.user_name || !body.password || !body.company_id || !body.company_name || !body.role) return throwError({ message: { en: 'Please fill in all required fields' } })

    if (body.password !== body.repeatPassword) return throwError({ message: { en: 'Password not match with repeat password' } })

    delete body.repeatPassword

    return this.http.post(this.signupUrl + "?overlapping=" + overlappingFlag, body, httpOptions)
      .pipe(
        map((response: any) => {
          let result = response;
          return result
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }

  validateUser(user) {
    console.log(user)
/*     var headers = new Headers();
    headers.append('Content-Type', 'application/json'); */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.post(environment.alert_circel_Service_Url + '/account/validateuser', JSON.stringify(user), httpOptions)
      .pipe(
        map((response: Response) => response),
        catchError(this.handleError)
      )

  }

  logOut() {
    let res = false;
    this.currentUser = null;
    // troleHelper.prototype.sipUnRegister();

    /* this.logService.openUsersConferenceChange(false);
    this.logService.openConferenceSummaryChange(false);
    this.logService.openDashboardChange(false);
    this.logService.openRecordingsChange(false);
    this.chatService.openChattingWindowChange(false);
  */   var companyInfoBackup = JSON.parse(localStorage.getItem('companyInfo'));
    var offlineMessage = JSON.parse(localStorage.getItem('offline_message'));
    var recentMessage = JSON.parse(localStorage.getItem('recentMessage'));
    // var remember_me = localStorage.getItem('remember_me') // local storage
    if (localStorage.getItem('sessionUser') != null) {
      localStorage.clear();
      res = true;
      localStorage.setItem('companyInfo', JSON.stringify(companyInfoBackup));
      localStorage.setItem('offline_message', JSON.stringify(offlineMessage));
      localStorage.setItem('recentMessage', JSON.stringify(recentMessage));
      // if(remember_me != null){ // local storage
      //   localStorage.setItem('remember_me', remember_me)
      // }
    }
    return res
  }


  forgetpassword(PasswordResetEmail: string) {
    console.log("<========ForgetPasswordUrl Service troleed========>")
  /*   let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json'); */

    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				//Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};    
    let body = JSON.stringify({ email: PasswordResetEmail, app_name: environment.app_name })

    return this.http.post(this.forgetpasswordUrl, body, httpOptions)
      .pipe(
        map((response: Response) => {
          let result = response;
          console.log(result);
          return result
        }),
        catchError(this.handleError)
      )

  }

  resetpassword(modelbody, token): Observable<boolean> {
    console.log("<========ResetPasswordUrl Service isteced========>")
    /* let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json'); */

    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

   // let options = new RequestOptions({ headers: headers }); // Create a request option
    // let user = JSON.parse(this.currentUser);
    let body = JSON.stringify({ password: modelbody.confirmPassword });
    let proResetPasswordUrl = this.ResetPasswordUrl + '/' + token;

    return this.http.post(proResetPasswordUrl, body, httpOptions)
      .pipe(
        map((response: any) => {
          let result = response;
          console.log(result);
          return result
        })
      )

  }

  ProfileUpdate(body) {
    console.log("<========ProfileUpdate Service isteced========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		}; // Create a request option

    let profileUpdateBody = {
      first_name: body.first_name,
      last_name: body.last_name,
      gender: body.gender,
      date_of_birth: body.date_of_birth,
      profile_pic: body.profile_pic,
      address: body.address,
      contact: body.contact,
    }

    return this.http.post(this.profileUpdateURL, profileUpdateBody, httpOptions)
      .pipe(
        map((x: any) => x ),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }
  profilePicUpload(files) {
    console.log("<========Profile picture Upload Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    var formData = new FormData();
    formData.append('file', files);
    formData.append('Content-Type', 'multipart/form-data');
    const httpOptions = {
			headers: new HttpHeaders({
				// 'Content-Type': 'application/json',
				Authorization: this.currentUser.access_token
			})
		}; // Create a request option


    return this.http.post(this.profilePicUploadUrl, formData, httpOptions)
      .pipe(
        map((x: any) => x),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }

  ProfileUpdateForIsPublic(body) {
    console.log("<========ProfileUpdateForIsPublic Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    /* let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
 */

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))
  })
};

    return this.http.post(this.profileUpdateURL, body, httpOptions)
      .pipe(
        map((response: Response) => {
          let result = response;
          //this.profileInfo.next(result.result.profile_pic)
          return result
        })
      )
  }

  friendRequestSent(body) {
    /* console.log("<========Friend Request Sent Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    /* let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
/* const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))
  })
};

     
   let friendRequestSentBody = {
      user_id: this.currentUser.id,
      friends_user_id: body.user_id,
      friends_email: "",
      friends_first_name: "",
      friends_last_name: "",
      friends_username: body.user_name,
      is_request_accept: false,
      IsInviteByMailOrPhone: body.IsInviteByMailOrPhone ? true : false
    }

    return this.http.post(this.friendRequestSentURL, friendRequestSentBody, httpOptions)
      .pipe(
        map((response: Response) => {
          let result = response;
          console.log('from friend request', result)
          if (!body.IsInviteByMailOrPhone) {
            this.getContactWithFriendsStatus().subscribe()
          }
          return result
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */ 
  }

  getAllFriendsByUser() {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Get All Friends by user_id Service Called========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.getAllFriendsByUserIdURL + "?user_id=" + this.currentUser.id, options)
      .pipe(
        map(friends => {
          this.friendList = friends;
          this.allFriendListByUserId$.next(this.friendList.resultset); //send data on B.subject
          return this.friendList;
        }),
        catchError((error: Response) => {
          console.log("getAllFriendsByUser error: " + error)
          return throwError(error);
        })
      ) */
  }

  getAllPendingFriendRequest() {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Get All Pending Friends by user_id Service Called========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.getAllPendingFriendRequestURL, options)
      .pipe(
        map(x => {
          this.pendingFriendList = x;
          // this.allFriendListByUserId$.next(this.friendList.resultset); //send data on B.subject
          /* if(this.pendingFriendList && this.pendingFriendList.resultset)
            this.getAllPendingRequest$.next(this.pendingFriendList.resultset); 
          console.log("from pending service", this.pendingFriendList);
          return this.pendingFriendList;
        }),
        catchError((error: Response) => {
          console.log("getAllFriendsByUser error: " + error)
          return throwError(error);
        })
      ) */
  }

  getContactWithFriendsStatus() {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<======== getContactWithFriendsStatus by user_id Service Called========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.get(this.getContactWithFriendsStatusURL + "?user_id=" + this.currentUser.id, options)
      .pipe(
        map(friends => {
          this.friendList = friends;
          console.log("getContactWithFriendsStatus", this.friendList.resultset);
          this.allContactWithStatusByUserId$.next(this.friendList.resultset); //send data on B.subject
          return this.friendList;
        }),
        catchError((error: Response) => {
          console.log("getAllFriendsByUser error: " + error)
          return throwError(error);
        })
      ) */
  }

  unfriendFriend(friend) {
    /* console.log("<======== Un-Friend Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let unFriendBody = {
      id: friend.friends_id
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({
      headers: headers,
      body: unFriendBody
    }); // Create a request option

    return this.http.delete(this.unFriendURL, options)
      .pipe(
        map((response: Response) => {
          let result = response;
          this.getContactWithFriendsStatus().subscribe()
          return result

        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */
  }

  cancelFriendRequest(friend) {
    /* console.log(friend.id)
    console.log("<======== Cancel Friend Request Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let cancelFriendReqBody = {
      //user_id: this.currentUser.id,
      id: friend.id
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({
      headers: headers,
      body: cancelFriendReqBody
    }); // Create a request option

    return this.http.delete(this.cancelFriendURL, options)
      .pipe(
        map((response: Response) => {
          let result = response;
          this.getContactWithFriendsStatus().subscribe()
          return result
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */
  }

  getAllRequestByUserId() {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log("<======== getContactWithFriendsStatus by user_id Service Called========>")

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.getAllRequestByUserIdURL + "?user_id=" + this.currentUser.id, options)
      .pipe(
        map(friends => {
          this.friendList = friends;
          this.getAllRequestByUserId$.next(this.friendList.resultset); //send data on B.subject
          return this.friendList;
        }),
        catchError((error: Response) => {
          console.log("getAllRequestByUserId error: " + error)
          return throwError(error);
        })
      ) */
  }

  // acceptFriendRequest(body) {
  //   console.log("<========Friend Request Sent Service Called========>")
  //   this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  //   let acceptFriendRequestBody ={
  //     user_id: this.currentUser.id,
  //     id : body.id
  //   }
  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   headers.append('Authorization',this.currentUser.access_token);
  //   let options = new RequestOptions({
  //     headers: headers
  //   }); // Create a request option

  //   return this.http.patch(this.friendRequestSentURL, acceptFriendRequestBody, options)
  //     .pipe(
  //       map((response: Response) => {
  //         let result = response;
  //         return result
  //       }),
  //       catchError((error: Response) => {
  //         return throwError(error);
  //       })
  //     )
  // }

  acceptFriendRequest(body) {
    /* console.log("<========Friend Request accept Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let acceptFriendRequestBody = {
      //user_id: body.user_id,
      id: body.id,
      ref_notification_id: body.notification_id,
      IsInviteByMailOrPhone: body.IsInviteByMailOrPhone ? true : false

    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({
      headers: headers
    }); // Create a request option

    return this.http.patch(this.acceptFriendRequestURL, acceptFriendRequestBody, options)
      .pipe(
        map((response: Response) => {
          let result = response;
          let arr = []
          arr.push(result.result)
          if (!body.IsInviteByMailOrPhone) {
            this.getContactWithFriendsStatus().subscribe()
          }
          // this.allContactWithStatusByUserId$.next(arr)
          return result
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */
  }

  declineFriendRequest(friend) {
    /* console.log("<======== Decline Friend Request Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    let declineFrnrequestdbody = {
      // user_id: friend.user_id,
      id: friend.id,
      ref_notification_id: friend.notification_id
    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({
      headers: headers,
      // body: declineFrnrequestdbody
    }); // Create a request option

    return this.http.patch(this.declineFriendRequestURL, declineFrnrequestdbody, options)
      .pipe(
        map((response: Response) => {
          let result = response;
          // this.getContactWithFriendsStatus().subscribe()
          return result

        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */
  }

 
  getAllUsersByCompanyByApps() {
    console.log("<======== Get All Users By Company By Apps Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

   /*  let headers = new Headers();
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers });  */// Create a request option
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    
    return this.http.get(this.getAllUsersByCompanyByAppUrl + '?all=true', httpOptions)
      .pipe(
        map((response: any) => {
          let result = response;
          this.getAllUsersByComByApp$.next(result.resultset);
          return result.resultset
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      )
  }

  private handleError(error: any) {
    console.log(error);
    return Observable.throw(error);
  }

  createCompany(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Create company service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); */ // Create a request option
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.post(this.getCompanyInfoByIdURL, data, httpOptions)
      .pipe(

        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  createAppByCom(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Create application service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.createApplicationUrl, data, options)
      .pipe(
        map(x => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      ) */
  }

  userRegister(data) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
 /*    console.log("<========User register service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token); */
   // let options = new RequestOptions({ headers: headers }); // Create a request option
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
  
    return this.http.post(this.userRegisterUrl, data, httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  usersByComByApp(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Users by com by app service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
    
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: JSON.parse(localStorage.getItem('token'))
    })
  };

   return this.http.post(this.usersByComByAppUrl, data, httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  getCompanyByUserList(token?) {
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    /* console.log("<======== getCompanyByUserList Service Called========>")

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', token);
    } else {
      headers.append('Authorization', JSON.parse(localStorage.getItem('token')));
    } */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: token?token:JSON.parse(localStorage.getItem('token'))
			})
		};

    //let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.get(this.getCompanyByUserListUrl, httpOptions)
      .pipe(
        map((result:any) => {
          var response = result;
          this.getAllCompanyByUserList$.next(response.resultset.sort((a, b) => a.company_name > b.company_name ? 1 : -1));

          return response.resultset;
        }),
        catchError((error: Response) => {
          console.log("getCompanyByUserList error: " + error)
          return throwError(error);
        })
      )
  }

  inviteCompany(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Invite company by email service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

 
   return this.http.post(this.inviteCompanyUrl, data, httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  _acceptCompanyInvitation(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Accept company invitation service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    
    return this.http.post(this.inviteCompanyUrl + '/accept', data, options)
      .pipe(
        map(x => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      ) */
  }

  _declineCompanyInvitation(data) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Decline company invitation service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.inviteCompanyUrl + '/decline', data, options)
      .pipe(
        map(x => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
 */  }

  /**
   *
   *
   * @param {*} data
   * all field are optional
   * data = {
      "last_company_id": "6f2bc528-19e3-4cf6-89d0-21e3b6d10197",
      "is_access_is_public": false,
      "is_access_location_track": false,
      }
   * @returns
   * @memberof AccountService
   */
  saveUserSession(data) {
    let access_token = JSON.parse(localStorage.getItem("token"));
    console.log("<======== Save User Session service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    /* headers.append('Content-Type', 'application/json');
    headers.append('Authorization', access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.post(this.saveUserSessionUrl, data, httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  getSessionByUser() {
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    /* console.log("<======== Get User Session service called========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    // headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
     */
    
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

     return this.http.get(this.getSessionByUserUrl + '?token=' + JSON.parse(localStorage.getItem('token')), httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result;
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  _companyFeatures() {
     console.log("<======== User features Service Called========>")
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    //let headers = new Headers();
    // headers.append('Authorization', this.currentUser.access_token);
    //let options = new RequestOptions({ headers: headers }); // Create a request option
    
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.get(this.companyFeaturesUrl + '?resource_id=' + this.currentUser.company_id + '&token=' + this.currentUser.access_token, httpOptions)
      .pipe(
        map((response: any) => {
          let result = response;
          localStorage.setItem('Company_Feature', JSON.stringify(result.result))
          if (Object.keys(result.result).length == 0) {
            this.userFeature.next('no_features')
          } else {
            this.userFeature.next(result.result)
          }
          return result
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) 
  }

  _companyFeaturesOnly_withOutChangeLocalStorage(token, companyId) {
    /* console.log("<======== User features Service Called========>")
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    let headers = new Headers();
    // headers.append('Authorization', this.currentUser.access_token);
    let options = new RequestOptions({ headers: headers }); // Create a request option
    return this.http.get(this.companyFeaturesUrl + '?resource_id=' + companyId + '&token=' + token, options)
      .pipe(
        map((response: Response) => {
          let result = response;
          if (companyId == this.currentUser.company_id) {
            localStorage.setItem('Company_Feature', JSON.stringify(result.result))
            if (Object.keys(result.result).length == 0) {
              this.userFeature.next('no_features')
            } else {
              this.userFeature.next(result.result)
            }
          }
          return result.result;
        }),
        catchError((error: Response) => {
          return throwError(error);
        })
      ) */
  }

  getCompaniesBaseUrl(token?) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Get company Base Url========>")
    let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', token);
    } else {
      headers.append('Authorization', this.currentUser.access_token);
    }
  ///let options = new RequestOptions({ headers: headers }); // Create a request option

    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.get(this.CompanyBaseUrl, httpOptions)
      .pipe(
        map((x:any) => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
  }

  saveCompaniesBaseUrl(authbaseurl: any, consolebaseurl: any, PrivateauthUrl: any, PrivateconsoleUrl: any, currentCompanyData, token?) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Save company Base Url========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', token);
    } else {
      headers.append('Authorization', this.currentUser.access_token);
    }

    let options = new RequestOptions({ headers: headers }); // Create a request option

    let urlList = {
      auth_base_url: authbaseurl,
      console_base_url: consolebaseurl,
      private_auth_base_url: PrivateauthUrl,
      private_console_base_url: PrivateconsoleUrl,
      company_logo: currentCompanyData.logo,
      app_logo: environment.app_logo,
    }
    return this.http.post(this.CompanyBaseUrl, urlList, options)
      .pipe(
        map(x => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
 */  }

  saveComapnyAppFeatures(data: object, companyId, token?) {
    /* this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
    console.log("<========Save company Base Url========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('Authorization', token);
    } else {
      headers.append('Authorization', this.currentUser.access_token);
    }

    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.companyFeaturesUrl + "?resource_id=" + companyId, data, options)
      .pipe(
        map(x => {
          var result = x
          return result
        }),
        catchError((error: Response) => {
          return throwError(error)
        })
      )
 */  }

  getUserListByIds(ids) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log("<======== getUserListByIds Service Called========>")

    /* let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))
  })
};

   return this.http.get(this.getUserListByIdsUrl + '?ids=' + ids, httpOptions)
      .pipe(
        map((result:any) => {
          var response = result;
          this.getUserListIds$.next(response.resultset);
          // this.getUserListIds$.next(response.resultset.sort((a, b) => a.company_name > b.company_name ? 1 : -1));
          return response;
        }),
        catchError((error: Response) => {
          console.log("getCompanyByUserList error: " + error)
          return throwError(error);
        })
      )
  }

  getUserByUserName(user_name) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));

    console.log("<======== getUserByUserName Service Called========>")

    /* let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.currentUser.access_token);

    let options = new RequestOptions({ headers: headers }); // Create a request option
 */
    
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: JSON.parse(localStorage.getItem('token'))
  })
};

   return this.http.get(this.getUserByUserNameUrl + '?user_name=' + user_name, httpOptions)
      .pipe(
        map((result:any) => {
          var response = result;
          return response;
        }),
        catchError((error: Response) => {
          console.log("getCompanyByUserList error: " + error)
          return throwError(error);
        })
      )
  }

  /** single sign in */
  token0AuthURL = environment.alert_circel_Service_Url + '/oauth/token'// 'http://localhost:4002/api/v1/oauth/token' //environment.alert_circel_Service_Url + '/oauth/token'
  checkAuthorizedURL = environment.alert_circel_Service_Url + '/oauth/check-authorized'//'http://localhost:4002/api/v1/oauth/check-authorized' //environment.alert_circel_Service_Url + '/oauth/check-authorized'
  authorizeURL = environment.alert_circel_Service_Url + '/oauth/authorize' //'http://localhost:4002/api/v1/oauth/authorize' //environment.alert_circel_Service_Url + '/oauth/authorize'
  // token0AuthURL = 'http://localhost:4002/api/v1/oauth/token';
  // checkAuthorizedURL = 'http://localhost:4002/api/v1/oauth/check-authorized';
  // // Oauth implementations start here
  // authorizeURL = 'http://localhost:4002/api/v1/oauth/authorize';
  token0Auth(user_name: string, password: string): Observable<any> {
    console.log('<========Token 0Auth wtih (grant_type: password) service called========>');
    /* let headers = new Headers();
    headers.append('Content-Type', 'application/json');
 */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        //Authorization: JSON.parse(localStorage.getItem('token'))
      })
    };

    const body = JSON.stringify({ user_name: user_name, password: password, grant_type: "password" });
    //let options = new RequestOptions({ headers: headers }); // Create a request option

    return this.http.post(this.token0AuthURL, body, httpOptions).pipe(
      map((x: Response) => x),
      map((x: any) => {
        //let obj = JSON.parse(x._body)
        return x.result
      }),
      concatMap((x) => {
        return of(x).pipe(
          mergeMap((x) => {
            const { access_token } = x

            console.log('<========Check authorized 0Auth service called========>');

            /* headers.append('Authorization', access_token);
            options = new RequestOptions({ headers: headers }); // Create a request option
 */
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: access_token
              })
            };

            return this.http.post(this.checkAuthorizedURL, { app_id: environment.app_id }, httpOptions).pipe(
              map((x: any) => {
                if (!!x) {
                  //x = JSON.parse(x._body)

                  Object.assign(x.result, { access_token: access_token })
                  //this.chatRegistration(user_name, password);    
                  // store user details and jwt token in local stjorage to keep user logged in between page refreshes
                  x.result.password = password;

                  // var offlineMessage = JSON.parse(localStorage.getItem('offline_message'));
                  // if(!offlineMessage){
                  //   localStorage.setItem('offline_message', JSON.stringify([]));
                  // }      

                }
                return x
              }),
            );
          })
        );
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }


  authorize(result, loginModel, companyId): Observable<any> {
    console.log('<========Authorize 0Auth service called========>');

    /* let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', result.access_token);
 */
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: result.access_token
			})
		};

    //const httpOptions = new RequestOptions({ headers: headers }); // Create a request option
    let company_id = null;
    if (companyId) {
      company_id = companyId;
    } else {
      company_id = result.user_session ? result.user_session.last_company_id != null ? result.user_session.last_company_id : environment.company_id : environment.company_id;
    }
    let body = {
      app_id: environment.app_id,
      company_id: company_id,
      role: null
    }
    if (loginModel.role) body.role = loginModel.role

    return this.http.post(this.authorizeURL, body, httpOptions).pipe(
      map((x: Response) => {
        return x
      }),
      map((x: any) => {
        return x;
      }),
      concatMap((x) => {
        return of(x).pipe(
          mergeMap((x) => {
            console.log('<========Token 0Auth with (grant_type: authorization_code) service called========>');

            let headers = new Headers();
            headers.append('Content-Type', 'application/json');

            return this.http.post(this.token0AuthURL, { grant_type: 'authorization_code', authorization_code: x.result.authorization_code }, httpOptions).pipe(
              map((x: Response) => {
                console.log(x);
                return x;
              }),
              tap((x: any) => {
               // x = JSON.parse(x._body)
                x.result.created ? delete x.result.created : null
                x.result.updated ? delete x.result.updated : null
                x.result.permissions.length == 0 ? delete x.result.permissions : null

                Object.assign(x.result, {
                  is_company_admin: !x.result.is_company_admin ? false : x.result.is_company_admin,
                  role: !x.result.role ? { role_name: "individual", role_type: "1" } : x.result.role,
                  password: loginModel.password
                });

                if (x.result.role) {
                  let tokenRole = x.result.role.role_name.toLowerCase();
                  localStorage.setItem('tokenRole', tokenRole);
                  tokenRole === 'teacher' ? this.isTeacher = true : this.isTeacher = false;
                  this.roleChecker.next(this.isTeacher);
                }

                localStorage.setItem('token', JSON.stringify(x.result.access_token));
                //this.chatRegistration(loginModel.user_name, loginModel.password);
                var offlineMessage = JSON.parse(localStorage.getItem('offline_message'));
                if (!offlineMessage) {
                  localStorage.setItem('offline_message', JSON.stringify([]));
                }


                /////this.currentUser = x.result; /////do not open it. unless admin/teacher panel willnot work properly
                return x

              })
            );
          })
        );
      }),
      catchError((error: Response) => {
        return throwError(error);
      })
    );
  }

  /** */

  checkAuthorize(token){
    // this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
   /*  console.log("<========checkAuthorize Servic called========>")
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    let options = new RequestOptions({ headers: headers }); */ // Create a request option
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};
    return this.http.post(this.checkAuthorizedURL, { app_id: environment.app_id }, httpOptions).pipe(
      map((x: any) => {
        if (!!x) {
          //x = JSON.parse(x._body)
        
          Object.assign(x.result, { access_token: token })
          //this.chatRegistration(user_name, password);    
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // x.result.password = password;

          // var offlineMessage = JSON.parse(localStorage.getItem('offline_message'));
          // if(!offlineMessage){
          //   localStorage.setItem('offline_message', JSON.stringify([]));
          // }      
    
        }
        return x
      }),
    );
  }  

  getUserRole(){
    return JSON.parse(localStorage.getItem('sessionUser')).role.role_name
  }

  getSessionUserInfo(){
    return JSON.parse(localStorage.getItem('sessionUser'))
  }


	loggedIn() {
		return !!localStorage.getItem('sessionUser');
	}


}
