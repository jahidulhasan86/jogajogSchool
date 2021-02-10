import { Injectable } from '@angular/core';
//import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../../../environments/environment'
import { Observable, throwError, Subject, BehaviorSubject, of, from } from "rxjs";
import { map, catchError, flatMap, mergeMap, toArray, tap, ignoreElements, find, filter, switchMap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  //private getByIdURL = `${GlobalValue.alert_skool_url}/teacher/getById`;
  private addCompanyUrl = `${environment.alert_circel_Service_Url}/companies/addCompany`

  currentUser: any;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem("sessionUser"));
  }

  
  addCompany(companyData, access_token) {
    console.log("<======== add company service called ========>");
    
    console.log(JSON.stringify(companyData));
1111111111111111111111111111111111111111111111111111111111111
    /* let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", access_token); */
    //  this.addCompanyUrl = 'http://localhost:4002/api/v1/companies/addCompany'
    this.addCompanyUrl = environment.alert_circel_Service_Url + "/companies/addCompany";
    /* let options = new RequestOptions({ headers: headers });
 */    companyData.auth_base_url= `${environment.auth_base_url}`;
    companyData.console_base_url= `${environment.console_base_url}`;
    companyData.app_id =`${environment.app_id}`;
    const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: JSON.parse(localStorage.getItem('token'))
			})
		};

    return this.http.post(this.addCompanyUrl, companyData, httpOptions).pipe(
      map((x:any) => x.json()),
      map((x) => {
        return x;
      }),
      catchError((error: Response) => {
        return throwError(error.json());
      })
    );
  }
}
