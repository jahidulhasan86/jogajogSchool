export class SignupModel {
    constructor(
      public first_name : string,
      public last_name : string,
      public email : string,
      public phone_no : string,
      public user_name : string,
      public password : string,
      public notify : string,
      public signup_type: string,
      public referral_id: string,
      public role_id: string,
      public role_name: string,
      public company_id: string
    ) {  }
  
  }