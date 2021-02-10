// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
"use strict";
let http = "http://";
let https = "https://";

// if you want to switch you server jst comment/uncomment below 2 line

// let serverDomain = 'api.protect2gether.com/';
let serverDomain = "api.jogajog.com.bd/";
let serverUrl = https + serverDomain;
let profilePhotoUpload_ServerUrl =
 serverDomain == "hub.sensor.buzz/" ? "http://103.78.248.70:4002/" : serverUrl;

 const aws_chatServerDomain = 'ejabberd.jogajog.com.bd/';

export const environment = {
  production: false,
  vchub: "https://api.jogajog.com.bd/vsb/api/v1",
  alert_skool: "https://api.jogajog.com.bd/alertskool/api/v1",
  chatService: "https://api.jogajog.com.bd/chat/api/v1",
  notification: "https://api.jogajog.com.bd/notifier/api/v1",
  chatwss: 'wss://' + aws_chatServerDomain + 'chatserver/websocket/',
  profilePhotUrl: serverUrl + "uploader/api/v1",
      
  api3_end_point: "",
  video_hub_Service_Url:

   serverUrl + "vsb/api/v1",
   alert_circel_Service_Url:
           serverUrl + "iuser/api/v1",
           default_company_name: "Technuf LLC.",
  default_company_logo: require("src/assets/images/Technuf-Logo.gif").default,
  company_logo_when_no_logo_found: require("src/assets/images/logo-default.png").default,
  app_id: "e21bf49f-40d8-4f1a-a23a-49980e8917ae", //"81e1bf45-fac4-4c07-8c56-a9d62abd9d74" ,  //Airline Connect (Technuf build)
  app_name: "Learn Together",
  app_logo: "" + serverUrl + "assets/images/ic_launcher.png", 
  alert_skool_url:
     "" + serverUrl + "alertskool/api/v1",
     auth_base_url: "https://hub.sensor.buzz/iuser",
     console_base_url: "https://learn.protect2gether.com/", 
     host: "alertcircle.com",
     company_id: "d17b5d3f-565a-4d5b-8815-e556b7cf90ed", //Technuf LLC.  

profilePhotoUrl: serverUrl + "uploader/api/v1",

 constcircleYellowImage: require('src/assets/images/Circle_Yellow.png').default,
 constcircleRedImage: require('src/assets/images/Circle_Red.png').default,
 constgroupsImage : require('src/assets/images/Group Icons/Group-Icon.png').default,
 constgeoGroupsIcon : require('src/assets/images/Group Icons/Geo-Groups.png').default,
 constflightsIcon :require('src/assets/images/Group Icons/flights.png').default,
 constpinnedGroupIcon:require('src/assets/images/Group Icons/Pinned-group.png').default,
 constprofileDummyImage: require('src/assets/images/default_profile icon.png').default,
 constlistDropdownIcon : require('src/assets/images/list_dropdown_icon.png').default,
 conststatusGreenImage: require('src/assets/images/list_dropdown_icon.png').default,
          

};

export let group_type = {
	GROUP_TYPE_GENERAL: 0,
	GROUP_TYPE_PINNED: 1,
	GROUP_TYPE_FLIGHT: 2,
	GROUP_TYPE_GEO: 3
};

export let online_status_xmpp = {
	online: 'chat', /////// https://xmpp.org/rfcs/rfc3921.html  ------2.2.2.1.  Show
	away: 'away',
	busy: 'dnd',
	invisible: 'xa'
};

export var online_status_display = {
  online : 'Available',
  away : 'Away',
  busy : 'Do not disturb',
  invisible : 'Invisible'
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
