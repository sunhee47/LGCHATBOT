let imgBaseUrl = 'https://storage.googleapis.com/singlex-ai-chatbot-contents/774d1a29-5bb2-421a-a8f1-49b1df17c9d1';

// Event
let employeeQueryEvent = "employeeQueryEvent";
let scheduleDeleteEvent = "scheduleDeleteEvent";
let scheduleAttendEvent = "scheduleAttendEvent";
let saveNotificationEvent = "saveNotificationEvent";
let readNotificationEvent = "readNotificationEvent";
let employeeSmsQueryEvent = "employeeSmsQueryEvent";
let teamSmsQueryEvent = "teamSmsQueryEvent";
let scheduleRegEvent = "scheduleRegEvent";
let dictDetailQueryEvent = "dictDetailQueryEvent";
let groupQueryEvent = "groupQueryEvent";
let employeeEmailQueryEvent = "employeeEmailQueryEvent";

// Employee URL
let messengerUrl = "https://www.lgucap.com:9097/uCapLog/sso/ssoTalkId/GUC005/";
let profileUrl = "http://gportalapp.lgensol.com/support/profile/getProfile.do?docPopup=true&targetUserId=";//프로필 조회 url (변경완료)
let smsUrl = "http://gportal.lgensol.com/support/sms/sms.do?gubun=1&receiverId=";

// G-포탈 URL
let gportalEmployeeUrl = "http://gportalapp.lgensol.com/portal/main/listUserPopup.do?viewMode=main&searchWord=%searchWord%&searchColumn=all";//임직원토탈검색 (변경완료)
let gportalTotalUrl = "http://gsearch.lgensol.com/totalsearch/search.jsp?query=%query%&Language=ko";//통합검색(변경완료)
let gportalScheduleUrl = "http://gportalapp.lgensol.com/lightpack/planner/calendar/viewSchedule.do?scheduleId=";//일정 상세 url (변경완료)
let hasExecutiveDevAPI = "https://gportaldev.lgensol.com/ikep-webapp/rest/planner/checkExecutive"
let hasExecutiveAPI = "https://gportalapp.lgensol.com/rest/planner/checkExecutive"



/**********  Common Function **************/

//쿠키저장
function setCookie(cKey, cValue, cDateAdd) {
 var date = new Date();

 date.setDate(date.getDate() + cDateAdd);
 document.cookie = cKey + '=' + escape(cValue) + '; path=/; expires=' + date.toGMTString() + ";";
}

function setMailCookie(cKey, cValue) {
	var date = new Date();
   
	date.setTime(date.getTime() + 1000 * 5);
	document.cookie = cKey + '=' + escape(cValue) + '; path=/; expires=' + date.toGMTString() + ";";
}

//쿠키값 얻기
function getCookie(cKey) {
 var allcookies = document.cookie;
 var cookies = allcookies.split("; ");

 for (var i = 0; i < cookies.length; i++) {
     var keyValues = cookies[i].split("=");

     if (keyValues[0] == cKey) {
         return unescape(keyValues[1]);
     }
 }
 return "";
}

//쿠키값 삭제
function delCookie(cKey) {
	var today = new Date();

	today.setDate(today.getDate() - 1);
	document.cookie = cKey + "=; path=/; expires=" + today.toGMTString() + ";";
}

//글자수 제한
function getTextLen(str) {
 let len = 0;

 for (var i = 0; i < str.length; i++) {
     if (escape(str.charAt(i)).length == 3) {
         len++;
     }
     len++;
 }

 return len;
}

//Feedback Check Message Length
function checkFeedback(btn) {
 var maxLen = 20;
 var $pop = $(btn).closest(".popup")
 var $inputEl = $pop.find("textarea");
 var elVal = $inputEl.val();

 if (getTextLen(elVal) <= maxLen) {
     $pop.find(".input-notice").addClass("show");
     return false;
 } else {
     $pop.find(".input-notice").removeClass("show");
     return true;
 }
}

//일정등록,일정조회 시간 SelectBox Option 세팅 함수
function hourSelectBox(){
	var options = "";
	
	for(var i = 0; i < 24; i ++){
		var value = i;
		if(i < 10){
			value = "0" + i;
		}
		
		options += '<option value="'+ value +'">'+ value +'</option>';
	}
	
	return options;
}

//일정등록,일정조회 분 SelectBox Option 세팅 함수
function minSelectBox(){
	var options = "";
	
	for(var i = 0; i < 60; i += 30){ // 30분단위로 조정 하고싶다
		var value = i;
		
		options += '<option value="'+ value +'">'+ value +'</option>';
	}
	
	return options;
}


// 리스트 카드 아이템 클릭 시 Intent Event 호출 함수
function intentEvent(btn,type,param,param2){
	
	switch(type){
	
		// 임직원 조회 동명이인
		case "employee" :{
			
			chatui.sendEventMessage(employeeQueryEvent, {"targetId" : param });
			break;
		} 
		
		// 일정 조회 동명이인
		case "schedule" :{
			
			var loginUserId = $(btn).closest(".dprofile").attr("data-loginUserId");
			var date = $(btn).closest(".dprofile").attr("data-date");
			
			chatui.sendEventMessage("scheduleQueryEvent", {"targetId" : param , "loginUserId" : loginUserId , "date" : date});
			break;
		}
		
		// SMS 발송
		case "sms" :{
			chatui.sendEventMessage(employeeSmsQueryEvent, {"targetId" : param });
			break;
		} 
		
		// 용어검색
		case "dict" :{
			$('.chat-panel').prepend('<div id="popBlank"></div>')
            var sessionId = $(btn).closest(".dp-list-wrap").attr("data-sessionId");
        	var requestParam = {
        		    query: {
        				"event": dictDetailQueryEvent
        			},
        			payload: {
        				"termId": param ,
        			}
        	    };

    	    sendChatApi(requestParam, sessionId, function(payload){
    	    	
    	    	var messages= payload.queryResult.messages[0];
		    	var response = messages.response;
		    	var result= JSON.parse(response);
		    	result.dictDesc = result.dictDesc.replace(/\n/gi, "\\n")
		    	
		    	pop.open('create', this, 'Pop_Dictionary', 'loadEl.pop_dictionary("' + result.dictNm + '", "' + result.dictNmEn + '", "' + result.dictNmCh + '", "' + result.dictAbbr + '", "' + result.dictDesc + '", "' + result.dictDescEn + '", "' + result.dictDescCh + '", "' + result.category + '", "' + result.registNm + '", "' + result.registDate + '")');
				$('#popBlank').remove()
		    	//pop.open('create', this, 'Pop_Dictionary', 'loadEl.pop_dictionary("열매유보일러", "Hot Oil boiler", "热媒油炉","","열매유를 가열하는 보일러 (건조 오븐의 열원)▶ 열매(체)유 : 장치를 일정한 온도로 가열하기 위해 사용하는 특수 Oil (끓는점이 300℃ 이상) ", "A boiler that heats the hot oil (a heat source of drying oven)▶ Hot oil : Special oil used to heat equipments to a certain temperature (boiling point is above 300℃)", "加热热媒油的锅炉 (干燥箱的热源)▶ 热媒油 : 为了把装置加热到一定温度而使用的特殊油(沸点在 300℃ 以上) ", "전지", "", "2014-05-25")');
		    	
				
    	    });
			
			break;
		} 
		
		// 팀 SMS 발송
		case "team" :{
		    var userId = $(btn).closest(".teamSms_List").attr("data-loginUserId");
		    var deptNm = $(btn).closest(".teamSms_List").attr("data-title");
			chatui.sendEventMessage(teamSmsQueryEvent, {"deptId" : param , "deptNm": deptNm, "userId" : userId });
			break;
		} 
		
		case 'group' :{
			chatui.sendEventMessage(groupQueryEvent, {"targetId" : param });
			break;
		}
		
		// 임직원 카드 메일 발송
		case 'email' :{
		    chatui.sendEventMessage(employeeEmailQueryEvent, {"Uid" : param, "userName" : param2 });
		    break;
		}
	}	
}

function feedbackPopOpen(){
	$(".chat-feedback").css("display","block");
}

/** 
 * 메일 연결
 * @param {string} receiverMail 수신자메일
 *        {string} mailServer 수신자 메일서버
**/
function connectEmail(message) {
	if(getCookie('mailCookie') == "Y"){
    	window.open(message.items, "_blank", "top=10, left=10, width=1100, height=800, status=no, menubar=no, toolbar=no, resizable=no");  
	}  
}

/**
 * 메일 AJAX 연결 함수 (API 사용X) 
 **/
function sendingMail(Uid) {

    $.ajax({
        url: "http://gmobcas.lgchem.com/eW/Application/eWM/Mail/UserWebService.asmx?op=getUserInfo",
        type : "post",
        dataType : 'jsonp',
        contentType : "application/json; charset=UTF-8",
        crossDomain : true,
        // jsonpCallback: "JsonCallback", // 콜백함수를 서버에서 찾을 수 없음
        data :  "Uid="+Uid,
        success : function(data) {
            if ( data.d === 'bpmaildev' || data.d === 'bpmail' || data.d === 'djmail' ) {
                window.open("http://"+data.d+".lgchem.com/eW/eWM/Mail/Write/WriteMail.aspx?PopupYN=Y&mailCmd=OTHER&emailAddr="+Uid, "_blank", "top=10, left=10, width=1100, height=800, status=no, menubar=no, toolbar=no, resizable=no");
            } else {
                window.open("http://"+data.d+".lgchem.com/eW/eGW/Mail/MailSend/WriteMail.aspx?mailadd="+Uid, "_blank", "top=10, left=10, width=1100, height=800, status=no, menubar=no, toolbar=no, resizable=no");
            }
        },
        error : function(request,status,error) {
            pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("메일 주소를 찾을 수 없습니다.")');
        }
    
    });
}


// 메일 다이렉트 연결
function directMail(email) {

    window.open("http://bpmail.lgchem.com/eW/eWM/Mail/Write/WriteMail.aspx?PopupYN=Y&mailCmd=OTHER&emailAddr="+email, "_blank", "top=10, left=10, width=1100, height=800, status=no, menubar=no, toolbar=no, resizable=no");
 
}



/**
 * '메신저 연결' 함수
 * @param {string} userId 수신자 아이디
 * 		   {string} targerId 발신자 아이디
 */
function connectMessenger(userId, targetId){
    
    // if (userId===targetId) {
    //     pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("본인에게 메신저 메시지를 보낼 수 없습니다.")');
    //     return;
    // }
    
    var e = window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    var uCapUri = 'LGUCAPL://';
    uCapUri += 'GUC057;CHAT;'+userId+';'+targetId+'@GUC057';
    window.protocolCheck( uCapUri, function() {
 		window.open("http://www.lgucap.com", "width=1100,height=800, resizable=1,scrollbars=1");
	});
    // return false;
    
}


// 수신측 소스 (custom javascript)
//window.postMessage() 메시지 수신
window.addEventListener("message", function(event) {
	var data = event.data;
	var origin = event.origin;
	var source = event.source;
	
	if (data && data.command == "search") {
		chatui.sendMessage(data.text);
	}
	
}, false);

window.addEventListener("message", function (e) {
  if(e.data === 'bot_close') {
    $('#caas-chatbot-container').remove();
  };
},false);

/********** Modules ***********/

//Loading Bar Modeule
var loadingBar = {
 open: function() {
     $(document).ready(function(){
         let loader = '<div class="loading-bar">' +
                 '   <div class="loader"></div>' +
                 '</div>';
         $("body").append(loader);
     });

     // var loadingWrap = document.createElement('div');
     // var loader = document.createElement('div');

     // loadingWrap.className = "loading-bar";
     // loader.className = "loader";
     // document.body.append(loadingWrap);
     // document.querySelector(".loading-bar").append(loader);
 },
 close: function() {
     $(document).ready(function(){
         $(".loading-bar").remove();
     });
     //document.querySelector(".loading-bar").remove();
 }
};


//Popup Module
const popup = function() {
 var $pop;
 var $btn;
 var popMode;

 function createPopup(popId) {
     var popWrap = '<div id="'+ popId +'" class="pop-modal" data-mode="create"><div class="pop-overlay"></div></div>';
     $("body").append(popWrap);
 }

 var popupFn = {
     open: function(mode, btn, target, callback) {
         if (mode == "inline") {
             $btn = $(btn);
             popMode = mode;
             $pop = $(target);

             $pop.attr("data-mode","inline");

             $pop.stop().fadeIn('fast', function(){
                 if (callback){
                     eval(callback);
                 }
             });

         } else if (mode == "create") {
             $btn = $(btn);
             popMode = mode;

             if (target) {
                 createPopup(target);

                 $pop = $('#' + target);

                 $pop.attr("data-mode","create");

                 if (callback) {
                     var html = eval(callback);

                     $pop.find(".pop-overlay").append(html);

                     $pop.stop().fadeIn('fast', function(){

                     });
                 }
             }

         }
     },
     close: function(closeBtn, target, callback) {

         if (closeBtn) {
             $pop = $(closeBtn).closest(".pop-modal");
         } else if (target) {
             $pop = $(target);

         } else {
             $pop = $(".pop-modal:visible:last-child");
         }

         $pop.stop().fadeOut('fast', function() {
             if (popMode == "create") {
                 $pop.remove();
             }

             if (callback){
                 eval(callback);
             }
         });
     }
 }

 $(document).on('click', '.btn-pop-open', function(e) {
     e.preventDefault();
 });

 $(document).on('click', '.btn-pop-close', function(e) {
     var $closePop = $(this).closest(".pop-modal");

     popupFn.close(this, $closePop);
 });

 // Click Overlay
 $(document).on('click', '.pop-modal', function(e){
     if ($(this).find(".pop-wrapper").has(e.target).length === 0){
         popupFn.close();
     };
 });

 // Esc Key Popup Close
 $(document).keydown(function(e){
     if (e.keycode == 27 || e.which == 27) {
         popupFn.close();
     }
 });

 return {
     open: popupFn.open,
     close: popupFn.close
 }
};
window.pop = popup();

//Popup Event
jQuery(document).ready(function(e){


    // Popup Open
     $(document).on('click', '[data-popup-open]', function(e) {
         var targeted_popup = $(this).attr('data-popup-open');
         var popup = $('[data-popup="' + targeted_popup + '"]');
    
         $(".chat-discussion").addClass("popmode");
    
         popup.fadeIn(350);
         popup.find('textarea').focus();
         e.preventDefault();
     });

     $(document).on('click', '[data-popup-close]', function(e) {
         var targeted_popup = $(this).attr('data-popup-close');
    // 여기
         $('[data-popup="' + targeted_popup + '"]').fadeOut(350, function(){
             $(".chat-discussion").removeClass("popmode");
         });
         e.preventDefault();
     });

     // Feedback Popup
     var feedbackEl = $('.feedback');
     feedbackEl.each(function (index, item) {
         var feedbackPop = $(item).find('.popup');
         $(item).find('.negative').attr('data-popup-open', 'feedback_popup_' + index);
         feedbackPop.attr('data-popup', 'feedback_popup_' + index);
         feedbackPop.find('[data-popup-close]').attr('data-popup-close', 'feedback_popup_' + index);
    
         index++;
     });

     // Images Popup
     var imageEl = $('.images');
     imageEl.each(function (index, item) {
         var imagePop = $(item).find('.popup');
         $(item).find('.img-container').attr('data-popup-open', 'image_' + index);
         imagePop.attr('data-popup', 'image_' + index);
         imagePop.find('.btn-close').attr('data-popup-close', 'image_' + index);
         imagePop.find('img').attr('id', 'image_' + index)
    
         index++;
     });

     // Video Popup
     var videoEl = $('.video');
     videoEl.each(function (index, item) {
         var videoPop = $(item).find('.popup');
         $(item).find('#video_overlays .btn-play').attr('data-popup-open', 'player_' + index);
         videoPop.attr('data-popup', 'player_' + index);
         videoPop.find('.btn-close').attr('data-popup-close', 'player_' + index);
         videoPop.find('video').attr('id', 'player_' + index)
    
         index++;
     });

     //video
     $("#video_overlays .btn-play").click(function() {
         var targeted_vid= $(this).attr('data-popup-open');
         var vid = $('[data-popup="' + targeted_vid + '"]').find('video').get(0);
    
         if (vid.paused) {
             vid.play();
             $('.video #video_overlays').fadeOut(350);
         } else {
             vid.pause();
         }
    
         vid.onended = function(e) {
             vid.load();
             $('.video #video_overlays').fadeIn(350);
         };
     });

     // Popup Notification Select All
     $(document).on('change','.pop-notification .check-alim-all', function(e){
         if ($(this).prop("checked") == true) {
             $(".check-alim").prop("checked", true);
         } else {
             $(".check-alim").prop("checked", false);
         }
     });
     $(document).on('change','.pop-notification .check-push-all', function(e){
         if ($(this).prop("checked") == true) {
             $(".check-push").prop("checked", true);
         } else {
             $(".check-push").prop("checked", false);
         }
     });
     $(document).on('change','.pop-notification .check-alim', function(e){
         $(".pop-notification .check-alim-all").prop("checked", false);
     });
     $(document).on('change','.pop-notification .check-push', function(e){
         $(".pop-notification .check-push-all").prop("checked", false);
     });
     
     $(document).on('change keyup keypress', 'textarea', function(){

         var $wrap;
         
         if ($(this).closest(".popup").length > 0) {
             $wrap = $(this).closest(".popup");
         } else if ($(this).closest(".pop-wrapper").length > 0) {
             $wrap = $(this).closest(".pop-wrapper");
         } else {
             $wrap = $(this).closest(".message");
         }

         if ($wrap) {
             var $btn = $wrap.find(".btn-primary, .btn.trans");
             var $rating = $wrap.find(".rating");
             var $notice = $wrap.find(".pop-error");

             if ($(this).val().length > 0) {
                 $btn.attr('disabled', false);
             } else {
                 $btn.attr('disabled', true);
             }

             if ($rating.length > 0 && $notice.length > 0) {
                 $notice.find("span").removeClass("show");

                 if ($(this).val().length > 0 && $rating.find('input[type=radio]:checked').length == 0) {
                     $notice.find("span.no-star").addClass("show");
                 } else if ($(this).val().length == 0 && $rating.find('input[type=radio]:checked').length > 0){
                     $notice.find("span.no-text").addClass("show");
                 } else {
                     $notice.find("span").removeClass("show");
                 }
             }
         }
     });

     // Rating Checking

     $(document).on('click', '.rating input[type=radio]', function(){
         var $wrap;

         if ($(this).closest(".popup").length > 0) {
             $wrap = $(this).closest(".popup");
         } else if ($(this).closest(".pop-wrapper").length > 0) {
             $wrap = $(this).closest(".pop-wrapper");
         }

         if ($wrap) {
             var $btn = $wrap.find(".btn-primary, .btn.trans");
             var $textarea = $wrap.find("textarea");
             var $rating = $wrap.find(".rating");
             var $notice = $wrap.find(".pop-error");

             if ($(this).prop("checked") == true) {
                 $btn.attr('disabled', false);
             } else {
                 $btn.attr('disabled', true);
             }

             if ($rating.length > 0 && $notice.length > 0) {
                 $notice.find("span").removeClass("show");

                 if ($textarea.val().length == 0 && $rating.find('input[type=radio]:checked').length > 0) {
                     $notice.find("span.no-text").addClass("show");
                 }
             }
         }
     });
});

// 모바일 감지 이벤트
jQuery(document).ready(function($) {
	var isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints;

	if (isTouchDevice) {
		$('.search-btn').css({visibility :'hidden'});
	}
});

//Datepicker Module
const setDatepicker = function() {
 var $initEl;

 // 날짜 한글 변환
 function fullDate(val, target) {
     var today;
     var strWeek = ["일요일","월요일","화요일", "수요일","목요일","금요일","토요일"]
     var fullDate;

     if (target) {
         today = new Date($(target).val());
     } else {
         today = new Date(val);
     }

     fullDate = today.getFullYear() +'년 ' + (today.getMonth() + 1) + '월 ' + today.getDate() + '일 ' + strWeek[today.getDay()]

     return fullDate;
 }

 // open
 function dpOpen(btn, target, callback){
     var $input;

     if ($(btn).closest(".schedule-input-wrap").length > 0) {
         $initEl = $(btn).closest(".schedule-input-wrap").find(".datepicker");

         $(".datepicker:visible").not($initEl).fadeOut('fast', function(){
             $(this).removeClass("show");
         });
     } else {
         $initEl = $(btn).closest(".ui-input-date").find(".datepicker");
     }

     if (target) {
         $input = $(target);
     } else {
         if ($(btn).closest(".schedule-wrap")) {
             $input = $(btn).closest(".schedule-input-wrap").find(".input-schedule-date");
         } else {
             $input = $(btn).prev("input[type=text]");
         }
     }

     if ($initEl.is(':visible')) {
         dpClose();
     } else {
         $initEl.datepicker({
             formatDate: "ATOM",
             dateFormat: "yy-mm-dd",
             defaultDate: $input.val(),
             // changeMonth: true,
             // changeYear: true,
             // yearRange: "-100:+10",
             showOn: "",
             buttonImageOnly: true,
             showMonthAfterYear: true,
             monthNames: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
             monthNamesShort: ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
             //dayNamesMin: ['일','월','화','수','목','금','토'],
             dayNamesMin: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
             altField: target,
             showButtonPanel: true,
             closeText: "close",
             beforeShow: function() {
             },
             onChangeMonthYear: function() {

             },
             onSelect: function() {
                if ($(btn).closest(".schedule-wrap").length > 0) {
                     var $schDate = $(btn).closest(".schedule-date-wrap").find(".schedule-date");
                     var $inputDate = $(btn).closest(".schedule-date-wrap").find(".input-schedule-date");
					 
					 if($(btn).closest(".meetingRoom-person").length == 1){
						 setMeetingRoomDate(btn, this.value)
					 }
                     else if ($(btn).closest(".schedule-person").length == 1) {
                         setScheduleDate(btn, this.value);
                     }

                     if ($schDate.length == 1) {
                         $schDate.text(fullDate(this.value));
                         $inputDate.val(this.value);
                     }
                 } else if ($(btn).closest(".ui-input-date").length > 0) {
                     var $date = $(btn).closest(".ui-input-date").find(".input-date");
                     $date.val(this.value);
                     
                  
                  // 일정 등록   
                 } else if ($(btn).closest(".form-schedule").length > 0 ){
                	  var $schDate = $(btn).closest(".schedule-date-wrap").find(".schedule-date");
                	  $schDate.text(fullDate(this.value));
                	  
                	  var $date = $(btn).closest(".schedule-date-wrap").find(".input-schedule-date");
                      $date.val(this.value);
                 }

                 dpClose();

                 if (callback){
                     eval(callback);
                 }
             },
             onClose: function() {
                 $(btn).focus();
             }
         });

         $initEl.fadeIn('fast', function(){
             $(this).addClass("show");
         })
     }
 }



 function dpClose() {
     $(".datepicker").fadeOut('fast', function(){
         $(this).removeClass("show");
     })
 }

 return {
     open: dpOpen,
     close: dpClose,
     fulldate: fullDate
 }
};

//Autocomplete Module
const setAutocomplete = function() {
 // Reset Input Message
 function resetInputMsg() {
 // activeAutoComplete('N');
     $(".chat-footer-form").removeClass('search-where search-dict search-person search-total');
     $(".autocomplete-wrap .search-title").removeClass("keyword person on");
     $(".autocomplete-wrap .btn-goSearch").removeClass("show");
     $(".autocomplete-wrap .btn-goSearch span").text('');
     $(".chat-footer-form").attr('data-mode','message');
     $(".test-sentence-input").val('');
 }
 
 // Set Autocomplete
 var keyword = [];

 $(".test-sentence-input").on('keyup', function(e) {
	 
     var $frmWrap = $(".chat-footer-form");
     var inputVal = $(this).val();
     var searchVal = "'" + inputVal + "'";
	 if ($frmWrap.hasClass("search-where") || $frmWrap.hasClass("search-dict")) {
		if ($.trim(inputVal) == "") {
			resetInputMsg();
			$(".autocomplete-wrap").find(".search-title").css("display","");
		}
	} else if (!$frmWrap.hasClass("search-total") || !$frmWrap.hasClass("search-total")) {
         if ($.trim(inputVal) == "") {
             $(".autocomplete-wrap .search-title").removeClass("keyword person on");
             searchVal = "";
         }

         $(".btn-goSearch:visible").find("span").text(searchVal);
     }
     
 
     // 임직원 검색
     var options = {
    	 keyword: inputVal,
         limit: 10   
     };
     
     chatui.searchEmployees(options)
         .then(function (employees) {
        	 if(employees.length > 0){
        		 // autoComplete는 Label 기준으로 세팅하기 때문에 Label 값을 insert
        		 $.each(employees, function(index) {
        			 var employee = employees[index]
        			 var userKorName = employee.userKorName;
        			 employee.label = userKorName;
        			 employee.type = "person";
        		 });
        	     
	             keyword = employees;
        		 $(".test-sentence-input").autocomplete("option", "source", keyword);
	             $(".test-sentence-input").autocomplete("option", "appendTo", $(".test-sentence-input").closest(".form-group").find(".autocomplete-wrap"));
        	 }else{
        		 $.each(window.phrases, function(index) {
        		     keyword.push({
        		         "type": "keyword",
        		         "label": window.phrases[index]
        		     });
        		     
    		     	if(index > 2000){
    		     		return false;
    		     	}
        		 });
        		 keyword = [];
        	 }
     });
     
 }).autocomplete({
     appendTo: ".form-group .autocomplete-wrap",
     autofocus: true,
     delay: 300,
     source: keyword,
     create: function() {
         var htmlTit = '<div class="search-title"></div>';

         var htmlStr = '<dl class="search-guide search-guide-where">' +
                     '    <dt>Command</dt>' +
                     '    <dd>' +
                     '        <span>/where /어디 [장소]</span> 원하시는 장소를 찾아드립니다.' +
                     '    </dd>' +
                     '</dl>' +
                     '<dl class="search-guide search-guide-dict">' +
                     '    <dt>Command</dt>' +
                     '    <dd>' +
                     '        <span>/dict /용어 [검색어]</span> 용어사전에서 검색합니다.' +
                     '    </dd>' +
                     '</dl>';
                     //'<a href="#" class="btn-goSearch"><span></span>통합검색</a>';

         $(".chat-footer-form .autocomplete-wrap").prepend(htmlTit)
         $(".chat-footer-form .autocomplete-wrap").append(htmlStr);
     },
     open: function(event, ui) {
         $('.ui-autocomplete').scrollTop();
     },
     focus: function(event, ui){
         //$(this).val(ui.item.label);
         return false;
     },
     select: function(event, ui){
         if (!($(".chat-footer-form").hasClass("search-person") || $(".chat-footer-form").hasClass("search-total"))) {
             resetInputMsg();
         }
         $(".search-title").removeClass("on");
         
         if(ui.item.type == "keyword"){
        	 chatui.sendMessage(ui.item.label);
         }else{
        	 chatui.sendEventMessage(employeeQueryEvent, {"targetId" : ui.item.emailId  });
         }
         
         
         
         return false;
     }
 }).focus(function(){
     $(".autocomplete-wrap .search-title").removeClass("keyword person on");
     $(".autocomplete-wrap .btn-goSearch").removeClass("show");

     $(this).data("uiAutocomplete").search($(this).val());

 }).autocomplete("instance")._renderItem = function( ul, item ) {
     var searchMask = this.element.val();
     var regEx = new RegExp(searchMask, "ig");
     var replaceMask = "<strong>$&</strong>";
     var labelStr = item.label.replace(regEx, replaceMask);
     var htmlStr;

     $(".autocomplete-wrap .search-title").removeClass("keyword person on");
     $(".autocomplete-wrap .btn-goSearch").removeClass("show");

     if (item.type == "keyword") {
         htmlStr = '<div class="keyword-info">'+ labelStr +'</div>';

         if (!$(".chat-footer-form").hasClass("search-person")) {
             $(".autocomplete-wrap .search-title").addClass("keyword");
         }
         $(".autocomplete-wrap .btn-goSearch").removeClass("show");

         if (searchMask.length >= 1) {
             $(".autocomplete-wrap .search-title.keyword").addClass("on");

             if ($(".chat-footer-form").hasClass("search-total") || $(".chat-footer-form").hasClass("search-person")) {
                 $(".autocomplete-wrap .btn-goSearch").removeClass("show");
             } else {
                 $(".autocomplete-wrap .btn-goSearch").addClass("show");
             }
         }

     } else if (item.type == "person") {
    	 
         var nameStr = item.label.split(' ');
         var searchStr = labelStr.split(' ');

         $(".autocomplete-wrap .search-title").addClass("person");

         if (searchMask.length >= nameStr[0].length) {
             $(".autocomplete-wrap .search-title.person").addClass("on");

             if ($(".chat-footer-form").hasClass("search-total") || $(".chat-footer-form").hasClass("search-person")) {
                 $(".autocomplete-wrap .btn-goSearch").removeClass("show");
             } else {
                 //$(".autocomplete-wrap .btn-goSearch").addClass("show");
             }
         }

         if ($.trim(item.imgUrl) == "") {
        	 item.imgUrl = imgBaseUrl+"/icon/img_user_none.png";
         }

         htmlStr = '<dl class="person-info">' +
                 '    <dt>'+ item.userKorName +' '+ item.jobTitle +' <span>'+ item.deptKorName +'</span></dt>' +
                 '    <dd class="photo"><img src="'+ item.imgUrl +'" alt="'+ item.userKorName +'"></dd>' +
                 '    <dd class="phone">'+ item.mobilePhoneNo +'</div></dd>' +
                 '</dl>';
     }

     var listItem;

     if (item.type == "person" && searchMask.length < nameStr[0].length) {
		listItem = '<li style="display:none"></li>';
	} else if (item.type == "keyword" && $(".chat-footer-form").hasClass("search-person")) {
		listItem = '<li style="display:none"></li>';
	} else {
		listItem = '<li></li>';
	}

     return $(listItem)
             .data( "ui-autocomplete-item", item )
             .append(htmlStr)
             .appendTo(ul);
 };

 $(".btn-search-where").on('click', function(e){
     resetInputMsg();
     $(".chat-footer-form").addClass("search-where");
     $(".test-sentence-input").val('/where '); //공백추가
     $(".test-sentence-input").focus();

 });
 $(".btn-search-dict").on('click', function(e){
     resetInputMsg();
     $(".chat-footer-form").addClass("search-dict");
     $(".test-sentence-input").val('/dict '); //공백추가
     $(".test-sentence-input").focus();
 });
 
 $(".btn-call-gpt").on('click', function(e){
     activeGptBot(``);
 });

 // Close Autocomplete
 $(document).on('click', function(e){
     var $frmWrap = $(".chat-footer-form");

     if (!($frmWrap.hasClass("search-person") || $frmWrap.hasClass("search-total"))) {
    	 // 위치검색, 용어검색 메뉴 위치 변경으로 ".small-menu" 클래스로 변경.
         if ($(".form-group, .small-menu").has(e.target).length == 0) {
             resetInputMsg();
         }
     } else {
         $(".search-title").removeClass("on");
     }
 });

 $(".btn-person-search").on('click', function(e){
     resetInputMsg();
     $(".chat-footer-form").attr('data-mode','search').addClass("search-person");
     $(".test-sentence-input").focus();
 });

 $(".btn-total-search").on('click', function(e){
     resetInputMsg();
     $(".chat-footer-form").attr('data-mode','search').addClass("search-total");
     $(".test-sentence-input").focus();
 });

 $(".btn-form-reset").on('click', function(){
     resetInputMsg();
 });
};

// 일정등록 자동 완성 모듈
const setAutocompleteJoinMember = function(input) {

    // Test Item
    var keyword = [];   

    //var $autocompleteWrap;
    $(input).on('keyup', function(e) {
        var inputVal = $(input).val();
        var searchVal = "'" + inputVal + "'";
        var sessionId = $(input).closest(".form-schedule").attr("data-sessionId");
        
	     // 임직원 검색
	     var options = {
	    	 keyword: inputVal, // 이름 또는 전화번호 (Ex. "홍길동", "1234")
	         limit: 10    // default 30, max 100
	     };
	     
	     chatui.searchEmployees(options)
	         .then(function (employees) {
	        	 if(employees){
		             
	        		 // autoComplete는 Label 기준으로 세팅하기 때문에 Label 값을 insert
	        		 $.each(employees, function(index) {
	        			 var employee = employees[index]
	        			 var userKorName = employee.userKorName;
	        			 employee.label = userKorName;
	        			 employee.type = "person";
	        		 });
	        	     
		             keyword = employees;
	        		 $(input).autocomplete("option", "source", keyword);
		             $(input).autocomplete("option", "appendTo", $(input).closest(".form-schedule").find(".autocomplete-member"));
	        	 }
	         });
        
    }).autocomplete({
        appendTo: ".form-schedule .autocomplete-member",
        autofocus: true,
        delay: 300,
        source: keyword,
        create: function() {
        	
        },
        open: function(event, ui) {
            $('.form-schedule .ui-autocomplete').scrollTop();
        },
        focus: function(event, ui){
            $(this).val(ui.item.label);
           // return false;
        },
        select: function(event, ui){
            var $memList = $(this).closest(".form-schedule").find(".schedule-join-member");
            var htmlStr;

            $(this).val('').focus();

            htmlStr = '<div class="person-info">'+
                        	ui.item.userKorName + ' '+ ui.item.jobTitle +
                        	' <span>'+ ui.item.deptKorName +'</span>' +
	                        '<button type="button" class="btn btn-delete">' +
	                            '<i class="icon icon-lg-close icon-only"><span>삭제</span></i>' +
	                        '</button>' +
	                        '<input type="hidden" value="'+ui.item.emailId+'" class="person-userId"/>' +
                        '</div>';

            $memList.append(htmlStr);

            return false;
        }
    }).focus(function(){
        $(this).data("uiAutocomplete").search($(this).val());

    }).autocomplete("instance")._renderItem = function( ul, item ) {
        var searchMask = this.element.val();
        var regEx = new RegExp(searchMask, "ig");
        var replaceMask = "<strong>$&</strong>";
        var labelStr = item.label.replace(regEx, replaceMask);
        var htmlStr;

        if (item.type == "person") {
            htmlStr = 	'<div class="person-info">'+ item.userKorName +' '+ item.jobTitle +' <span>'+ item.deptKorName +'</span></div>';
        }

        var listItem;

        if (item.type == "keyword") {
            listItem = '<li style="display:none"></li>';
        } else {
            listItem = '<li></li>';
        }

        return $(listItem)
                .data( "ui-autocomplete-item", item )
                .append(htmlStr)
                .appendTo(ul);
    };

    $(document).on('click','.form-schedule .check-allDay', function() {
        var $schWrap = $(this).closest(".form-schedule");
        var $select = $schWrap.find("select");

        if ($(this).prop("checked")) {
            $select.prop("disabled", true);
        } else {
            $select.prop("disabled", false);
        }
    })
    
    // Delete Schedule Join Member
    $(document).on('click', '.person-info .btn-delete', function(){
        $(this).closest(".person-info").remove();
    })
};

// 채팅UI 로딩
// chatui.onLoad = function() {
jQuery(document).ready(function(e){
    
	// Logo 제거
    $(".custom-logo").remove();
    
    //Feedback Icon 제거
    $(".m-right").children(".chat-feedback").remove();
    
    var hamburgerMenu = "<div class='hamburger-menu'>"+
    						"<button type='button' class='btn-header smooth btn-header-menu'>"+
    							"<img src='"+imgBaseUrl+"/assets/icon_header_menu3.png' alt='상단 메뉴'>"+
    						"</button>"+
    						"<div class='chat-header-menu'>"+
    				        	"<ul class='header-menu-list'>"+
	    				            "<li><a href='#' onclick='chatui.sendMessage(\"도움말\")' class='help'>도움말</a></li>"+
	    				            "<li><a href='#' onclick='pop.open(\"create\", this, \"Pop_Notification\",\"loadEl.pop_notification()\")' class='notification btn-pop-open'>알림설정</a></li>"+
	    				            "<li><a href='#' onclick='deleteChatHistory();' class='btn-header-trash'>대화이력 삭제</a></li>"+
	    				            "<li><a href='#' onclick='activeGptBot(``);' class='call-gpt'>ChatGPT Mode</a></li>"+
	    				           // "<li><a href='#' onclick='window.close();' class='btn-header-trash'>챗봇 창 종료</a></li>"
	    				        "</ul>"+
	    				    "</div>"+
    					"</div>";
    $(".bot-profile").prepend(hamburgerMenu);
    
    var html = "";
    html += "<div class='btn-wrap'>"+
    			"<ul class='chat-header-nav'>" +
    			"<li><button type='button' data-popup-open='chat-feedback' class='btn-header smooth btn-header-feedback'>챗봇 문의/요청</button></li>"+
    			"</ul>";
    		"</div>";
    $(".m-right").append(html);
    
 // Header Menu

    $(".btn-header-menu").on('click', function(e){
        if ($(".chat-header-menu").is(":hidden")) {
			$(".chat-discussion").removeClass("popmode");
            $(".chat-header-menu").stop().slideDown('fast');
        } else {
            $(".chat-header-menu").stop().slideUp('fast');
        }
    });

    $(document).on('click', function(e) {
        if ($(".hamburger-menu").has(e.target).length === 0) {
            $(".chat-header-menu").stop().slideUp('fast');
        }

        if ($(e.target).hasClass("notification")) {
            $(".chat-header-menu").stop().slideUp('fast');
        }
    });

    $(document).on('click', '.header-menu-list a', function(e){
        var $list = $('.header-menu-list');

        if ($list.is(":visible")) {
            $(".chat-header-menu").stop().slideUp('fast');
        }
    });

    $(".btn-menu-fold").on('click', function(e){
        var $menuList = $(".test-panel .menu-list");
        var $menuWrap = $(this).closest(".menu.fixed");
        
        $menuWrap.removeAttr("style");
        
        if ($menuList.prop("scrollHeight") > 29 && $(this).hasClass("expanded") == false) {
            $(this).addClass("expanded");
            $menuList.addClass("expanded");
        } else {
            $(this).removeClass("expanded");
            $menuList.removeClass("expanded");
        }
    });     

	// 챗봇창 로딩시 퀵메뉴 아이템 전부 보일수 있게 해야함
	$(".test-panel .panel-wrapper .chat-panel .menu.fixed .btn-menu-fold.more i.icon-lg-unfold_less_horizontal").css("display", "")
	$(".test-panel .panel-wrapper .chat-panel .menu.fixed .btn-menu-fold.less i.icon-lg-unfold_more_horizontal").css("display", "none")
	$(".btn-menu-fold").trigger("click")

    // Footer Form
    $(".form-group").empty();
    var formGroup = $("<div data-mode='message' class='chat-footer-form'><input type='text' class='form-control test-sentence-input caas-input-placeholder-font-color caas-input-font-color chat-input-msg ui-autocomplete-input' placeholder='메시지를 입력해주세요' autocomplete='off'><div class='autocomplete-wrap'></div><div class='chat-footerForm-btn'><span class='search-btn'><button type='button' class='btn btn-person-search'>?</button><p class='person-hover'>임직원 검색</p><button type='button' class='btn btn-total-search'>#</button><p class='total-hover'>통합 검색</p></span><button type='reset' class='btn btn-form-reset'><i class='icon icon-lg-close icon-only'><span>초기화</span></i></button><button class='btn btn-form-send caas-input-send-icon-color hide' aria-label='전송'><i class='icon icon-lg-send' aria-hidden='true'></i></button></div></div>");
    formGroup.find("input").on("keyup",function(e){
        if(e.keyCode==13) {
        	
        	// 용어 검색 Event
        	if($(e.target).val().indexOf("/dict") != -1){
        		var searchTerm = $(e.target).val().replace("/dict ","");
        		chatui.sendEventMessage("dictQueryEvent",{"searchTerm": searchTerm});
			}else if($(e.target).val().indexOf("/용어") != -1){
				var searchTerm = $(e.target).val().replace("/용어 ","");
				chatui.sendEventMessage("dictQueryEvent",{"searchTerm": searchTerm});

        	// 임직원 포탈 검색	
        	}else if($(e.target).parent().hasClass("search-person")){
        		var url = gportalEmployeeUrl.replace("%searchWord%", encodeURIComponent($(e.target).val()));
        		window.open(url, "gportalEmployeeSearch", "width=1024,height=550,resizable=1,scrollbars=1");
        		
        	// 통합 검색	
        	}else if($(e.target).parent().hasClass("search-total")){
        		var url = gportalTotalUrl.replace("%query%", encodeURIComponent($(e.target).val()));
        		window.open(url, "gportalTotalSearch", "width=1024,height=550,resizable=1,scrollbars=1");
        	}else{
        		
        		chatui.sendMessage($(e.target).val());
        	}
    	    
            $(".search-title").removeClass("on");
            $(".btn-form-reset").click();
    	    $(e.target).val("");
    	    
    	    $('#divScroll').find('div.left input').attr("disabled", true);
    	    $('#divScroll').find('div.left textarea').attr("disabled", true);
    	    $('#divScroll').find('div.left select').attr("disabled", true);
    	    $('#divScroll').find('div.left button.btn-regdatepicker').attr("disabled", true);
    	    
    	    $('#divScroll').find('.sch_start_hour').removeClass();
    		$('#divScroll').find('.sch_start_min').removeClass();
    		$('#divScroll').find('.sch_end_hour').removeClass();
    		$('#divScroll').find('.sch_end_min').removeClass();
    	    
    	    $('#divScroll').find(".btn-delete").css("display", "none");
    	    $('#divScroll').find("div.left .btn-wrap .btn-primary").css("display", "none");
    	    
        }
    });
    $(".form-group").append(formGroup);
    
    // ** Shortcut 버튼 추가
    var $smallMenu = $(".menu.fixed > .small-menu");
    if ($smallMenu.length > 0 && $smallMenu.children("button").length === 0) {
        var html = "";
        html += "    <button class='btn btn-small btn-search-where'>위치검색</button>";
        html += "    <button class='btn btn-small btn-search-dict'>용어검색</button>";
        html += "    <button class='btn btn-small btn-call-gpt' style='border: 1px solid #12a6be; color: #12a6be;' >ChatGPT</button>";
 
        $(html).appendTo($smallMenu);        
    }
 
    // ** QuickLink 버튼 스타일 변경
    var menuList = $(".menu-list li a");
    // menuList.eq(3).addClass("em-hot");
    for( var i = 0; i < menuList.length; i++ ){
    	menuList.eq(i).addClass("em-nml");
    }

    setAutocomplete();
    
    // Datepicker Module
    window.datepicker = setDatepicker();

    $(document).on('click', function(e) {
        if ($(".ui-input-date, .schedule-input-wrap").has(e.target).length == 0 && $(e.target).hasClass("ui-corner-all") == false) {
           datepicker.close();
        }
    });

    sendWelcomeEvent();

});

function deleteChatHistory(){
	
	//이전 대화 삭제
	chatui.deleteChatHistory()
	    .then(function () {
	        if(confirm('대화 목록을 삭제하시겠습니까?\n삭제하신 대화는 다시 보실 수 없습니다.')==true) {
    	        $("#divScroll").empty();
	        }
	    })
	    .catch(function (error) {
	   });
} 

function sendWelcomeEvent() {
	
	 var requestParam = {
			    query: {
					"event": readNotificationEvent
				},
	 
	 			payload:{
	 				"userId" : chatui.getSetting("userId"),
	 				"type" :""
	 			}
		 };

	    sendChatApi(requestParam,getCookie((chatui.getSetting("userId") ? chatui.getSetting("userId") : "") + "_chatSessionId"), function(payload){
	    	var key = chatui.getSetting("userId") ? chatui.getSetting("userId").replace(/=/gi, "") : "";
	    	var lastAccessDate = getCookie(key + "_lastAccessDate");
	    	
	    	var messages= payload.queryResult.messages[0];
	    	
	    	// 푸시 설정 Read 성공일 경우
	    	if(messages.panelType != 'basic'){
		    	var response = messages.response;
		    	var result= JSON.parse(response);
		    	var pushData = result.template.outputs[0].data;
		    	
		 
		    	
				var data = {
						"weather": pushData.weather,
						"anniversary": pushData.anniversary,
						"schedule": pushData.schedule,
						"message": pushData.message,
						"planner": pushData.planner,
						"birthInfo": pushData.birthInfo,
						"lastAccessDate": lastAccessDate
					}
				setNotification(data);
				chatui.sendEventMessage("Welcome", data);
				
		    // 푸시 설정 Empty일 경우
	    	}else{
	    		var data = {
						"weather": "Y",
						"anniversary": "Y",
						"schedule": "Y",
						"message": "Y",
						"planner": "Y",
						"birthInfo": "Y",
						"lastAccessDate": lastAccessDate
				}
				setNotification(data);
	    		chatui.sendEventMessage("Welcome", data);
	    	}
			
	    	// 마지막 접근 일자 오늘로 갱신
			var date = new Date();
			var year = date.getFullYear();
			var month = ("0" + (1 + date.getMonth())).slice(-2);
			var day = ("0" + date.getDate()).slice(-2);
			var today = year + "-" + month + "-" + day;
			setCookie(key + "_lastAccessDate", today , 9999);
			
	    });
	    
}

// 응답 메시지 클릭
chatui.onMessageClick = function(chatEvent) {

	var type = chatEvent.type; // employee, schedule, work

	switch(type) {
	case "employee":
		var item = chatEvent.item; // profile, name, department, email, mobilePhoneNo
	    var employee = chatEvent.employee;
		
		if (item == "department") {
			var department = employee.deptKorName;
			
			if (!department || department == "-") {
				department = employee.assignCompany;
			}
			
			var url = "http://gportal.lginnotek.com/portal/main/listGroupPopup.do?searchWord=" + encodeURIComponent(department) + "&searchColumn=team";

			window.open(url, "employeePopup", "width=1024,height=550,resizable=1,scrollbars=1");
//		} else if (item == "email") {
//			window.location.href = "mailto:" + employee.email;
//		} else if (item == "mobilePhoneNo") {
		} else {
			var emailId = employee.emailId;
			var url = "http://gportal.lginnotek.com/support/profile/getProfile.do?docPopup=true&targetUserId=" + emailId;

			window.open(url, "employeePopup", "width=1025,height=770,resizable=1,scrollbars=1");
	    }
		break;

	case "schedule":
		var schedule = chatEvent.schedule;
		if (schedule.ACTION) {
			window.open(schedule.ACTION, "schedulePopup", "width=700,height=500,resizable=1,scrollbars=1");
		}
		break;

	case "todo":
	    var todo = chatEvent.todo;
	    var url = null;
	    
	    if (todo.url && todo.url.toLocaleLowerCase().substr(0, 4) == "http") {
	        url = todo.url;
	    } else {
	        url = "http://gportal.lginnotek.com/lightpack/todo/todoView.do";
	    }

	    if (url) {
	        window.open(url, "todoPopup", "width=1200,height=600,resizable=1,scrollbars=1");
	    }
	    
		break;
	}
}

//버튼 클릭 이벤트.
chatui.onButtonClick = function(chatEvent) {
	
	// 버튼 이벤트 사용자 함수 실행
	var button = chatEvent.button;

	// 일정 자동 알림설정
	if ( button.type == "quick" && button.value != undefined ) {
		if ( button.value.indexOf("#chatbotNotificationOpen") > -1 ) {
			pop.open("create", $(".notification"), "Pop_Notification","loadEl.pop_notification()");
			chatEvent.isHandled = true;
		}
	}  
}

var contentsInterval = 1000;
/**
 * '화면 스크롤 최하단으로 내리기' 함수
 */
function descendScroll() {
	setTimeout(function() {
        var e = document.getElementById("divScroll");
        e.scrollTop = e.scrollHeight
    }, 50)
}

/////////////////////////////////////////// Messae 생성 함수 ///////////////////////////////////////////

/**
 * '응답시간 생성' 함수
 * @param {string} time 텍스트형 응답 데이터
 */
function makeMsgDate(time) {
	return $('<span class="message-date">' + (time ? moment(time) : moment()).format("a h:mm") + '</span>');
}





/**
 * '문자열 카드 생성' 함수
 * @param {string} text 텍스트형 응답 데이터
 */
function makeText(text, isHistory) {
	var textCon = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color"></div>');

	var textBox = $('<div class="basic"></div>');
	textCon.append(textBox);

	var textContent = $('<div class="message-content" style="white-space: pre-line"></div>');
	textBox.append(textContent);
	
	textContent.html(text);

	return textCon;
}

/**
 * '리스트 카드 생성' 함수
 * @param {list} items 리스트형 응답 데이터
 */
function makeListCard(items, titleBoldYn, type){
	//var listCon = $('<div class="message bubble-list"></div>');
	var listCon = $('<div class="message caas-message-color caas-message-font-color bubble-list"></div>');
	
	var listWrap = $('<div class="dp-list-wrap"></div>');
	listCon.append(listWrap);
	
	var listUl = $('<ul></ul>');
	listWrap.append(listUl);
	
	var moreItemList = [];
	if (items instanceof Array && items.length > 0) {
		items.forEach(function(item,index) {
			if( index < 5 ){
				makeListItem(listUl, item, titleBoldYn,type);
			} else {
				moreItemList.push(item);
			}
		});
		
		if( items.length > 5 ){
			var listLi = $('<li class="view-more"><span class="arrow-down"><img src="' + imgBaseUrl + '/assets/arrow-down.png" alt=""></span> 더보기</li>');
			listUl.append(listLi);
			
			listLi.click(function() {
				listLi.remove();
				moreItemList.forEach(function(item,index) {
					makeListItem(listUl, item, titleBoldYn,type);
				});
				descendScroll();
	        });			
		}
    }

	return listCon;
}


/**
 * '리스트 아이템 항목 생성' 함수
 * @param {object} item 형 응답 데이터
 */
function makeListItem(listUl, item, titleBoldYn, type){
	
	var listLi = $('<li></li>');
	if(type = "teamList"){
		listLi = $('<li class="teamSms_List" onClick="intentEvent(this,\'team\',\''+item.deptId+'\')" data-loginUserId="'+item.userId+'" data-title="'+item.title+'"></li>');
	}
	
	listUl.append(listLi);
	
	var title = $('<span class="title">' + item.title + '</span>');
	if( titleBoldYn == 'Y' ){		
		title.addClass('font-bold');
	}
	listLi.append(title);
	
	if (item.hasOwnProperty('description')) {
		var desc = $('<span class="p-text">' + item.description + '</span>');
		listLi.append(desc);
	}
	
	if (item.hasOwnProperty('button')) {
		listLi.click(function() {
	        if (item.button.type == 'url') {
	        	window.open(item.button.link, '_blank');
	        } else if (item.button.type == 'phases') {
	        	chatui.sendMessage(item.button.message);
	        } else {
	        }
	    });

	}
	var btn = $('<span class="arrow-right"><img src="' + imgBaseUrl + '/assets/arrow-right.png" alt=""></span>');
	listLi.append(btn);
}

/**
 * '리스트 카드(용어검색) 생성' 함수
 * @param {list} items 리스트형 응답 데이터
 */
function makeListDictCard(data, isHistory){
	var listCon = $('<div class="message bubble-list"></div>');
	
	
	var listWrap = $('<div class="dp-list-wrap"></div>');
	listWrap.attr("data-sessionId", data.chatSessionId.split("sessions/")[1]);
	listCon.append(listWrap);
	
	var listUl = $('<ul></ul>');
	listWrap.append(listUl);
	
	var moreItemList = [];
	if (data.items instanceof Array && data.items.length > 0) {
		data.items.forEach(function(item,index) {
			if( index < 5 ){
				makeListDictItem(listUl, item);
			} else {
				moreItemList.push(item);
			}
		});

		if(data.items.length > 5 ){
			var listLi = $('<li class="view-more"><span class="arrow-down"><img src="' + imgBaseUrl + '/assets/arrow-down.png" alt=""></span> 더보기</li>');
			listUl.append(listLi);
			
			listLi.click(function() {
			    listLi.remove();
				moreItemList.forEach(function(item,index) {
					makeListDictItem(listUl, item);
				});
				descendScroll();
	        });			
		}
    }

	return listCon;
}

/**
 * '리스트(용어검색) 아이템 항목 생성' 함수
 * @param {object} item 형 응답 데이터
 */
function makeListDictItem(listUl, item){
	var listLi = $('<li></li>');
	listUl.append(listLi);

	var listAtag = $('<a href="#" onClick="intentEvent(this,\'dict\',\''+item.termId+'\')" class="dictionary btn-pop-open"></a>');
	listLi.append(listAtag);

	var title = $('<span class="title font-bold">' + item.dictNm + '</span>');
	listAtag.append(title);
	
	if (item.hasOwnProperty('dictDesc')) {
		var desc = $('<span class="p-text dict-description">' + item.dictDesc + '</span>');
		listAtag.append(desc);
	}

	var btn = $('<span class="arrow-right"><img src="' + imgBaseUrl + '/assets/arrow-right.png" alt=""></span>');
	listAtag.append(btn);
}

/**
 * '시스템 업무 담당자 카드 생성' 함수
 * @param {list} items 리스트형 응답 데이터
 */
function makeSystemCard(items, isHistory){
	var listCon = $('<div class="message dprofile manager"></div>');
	
	var listWrap = $('<div class="dp-list-wrap"></div>');
	listCon.append(listWrap);
	
	var listUl = $('<ul></ul>');
	listWrap.append(listUl);
	
	if (items instanceof Array && items.length > 0) {
		items.forEach(function(item,index) {
			var title = $('<li class="list-headline caas-title-font-color system-dp-manager"><span>' + item.sysName + '</span></li>');
			listUl.append(title);

			if (item.userList instanceof Array && item.userList.length > 0) {
				item.userList.forEach(function(user,index) {
					var listLi = $('<li class="system-dp-list system-dp-manager"></li>');
					listUl.append(listLi);
					
					var userId = user.empMail.split("@");
					var userInfo = $('<div class="dp-wrap system-dp-manager "></div>');
					listLi.append(userInfo);

					userInfo.append($('<span class="dp-rank caas-title-font-color"></span>').text(user.contactType));
					userInfo.append($('<span class="dp-name"></span>').text(user.userName + ' ' + user.jobTitle));
					userInfo.append($('<span class="dp-team"></span>').text(user.depthNm));
					userInfo.append($('<span></span>').text(user.empMail ? user.empMail : "No Email Address"));
					if (user.empTelNo=="--") {user.empTelNo=""}
					userInfo.append($('<span></span>').text(user.empTelNo ? user.empTelNo : "-"));
				});
			}
		});
    }

	return listCon;
}

/**
 * '일정 조회 공통 카드 생성' 함수
 * @param {object} scheduleCard 형 응답 데이터
 */
function makeScheduleCard(scheduleCard, isHistory){
	var welcomeYn;
	
	// 웰컴 인텐트 구분. 인텐트에 등록된 파라미터 "Welcome" 로 구분처리.
	if(scheduleCard.hasOwnProperty('welcomeYn')){
		welcomeYn = scheduleCard.welcomeYn;
	} else {
		welcomeYn = "N";
	}
	
	if( welcomeYn == "Y" ){
		var scheduleCon = $('<div class="message todo caas-message-color caas-message-font-color"></div>');

		//accordian-header
		var accordianHeader = $('<div class="accordian-header collapsed" data-toggle="collapse" data-target="#collapseSchedule" aria-expanded="false" aria-controls="collapseSchedule"></div>');
		scheduleCon.append(accordianHeader);

		var accordianHeaderDpWrap = $('<div class="dp-wrap"></div>');
		accordianHeader.append(accordianHeaderDpWrap);

		var accordianHeaderMessage = $('<div class="message-content"></div>');
		accordianHeaderMessage.text("금일 " + scheduleCard.items.length + "건의 일정이 있습니다.");
		accordianHeaderDpWrap.append(accordianHeaderMessage);

		var accordianHeaderDpWrap = $('<button class="btn btn-trans">' + 
										'<span class="arrow-down"><img src="' + imgBaseUrl + '/assets/arrow-down.png" alt=""></span>' + 
										'<span class="arrow-up"><img src="' + imgBaseUrl + '/assets/arrow-up.png" alt=""></span>' + 
										'</button>');
		accordianHeader.append(accordianHeaderDpWrap);
		
		//accordion-content	
		var accordianContent = $('<div class="accordion-content collapse" id="collapseSchedule" style=""></div>');
		scheduleCon.append(accordianContent);
		
		var scheduleWrap = $('<div class="schedule-wrap"></div>');
		scheduleWrap.attr("data-sessionId", scheduleCard.chatSessionId.split("sessions/")[1]);
		scheduleWrap.attr("data-userId", scheduleCard.userId);
		scheduleWrap.attr("data-loginUserId", scheduleCard.loginUserId);
		scheduleWrap.attr("data-mySelf", scheduleCard.mySelf);
		accordianContent.append(scheduleWrap);
	} else {
		var scheduleCon = $('<div class="message caas-message-color caas-message-font-color"></div>');
		
		var scheduleWrap = $('<div class="schedule-wrap schedule-person"></div>');
		scheduleWrap.attr("data-sessionId", scheduleCard.chatSessionId.split("sessions/")[1]);
		scheduleWrap.attr("data-userId", scheduleCard.userId);
		scheduleWrap.attr("data-loginUserId", scheduleCard.loginUserId);
		scheduleWrap.attr("data-mySelf", scheduleCard.mySelf);
		scheduleCon.append(scheduleWrap);
	}
	
	// schedule-header
	var scheduleHeader = $('<div class="schedule-date-wrap schedule-header" data-target="schedule-list-wrap"></div>');
	scheduleWrap.append(scheduleHeader);
	
	var scheduleInputWrap = $('<div class="schedule-input-wrap schedule-header-date"></div>');
	scheduleHeader.append(scheduleInputWrap);
	
	var scheduleDate = $('<span class="schedule-date"></span>');
	scheduleDate.text(moment(scheduleCard.date).format('YYYY년 M월 DD일 dddd'));
	scheduleInputWrap.append(scheduleDate);
	
	var inputScheduleDate = $('<input type="text" name="schedule-date" value="" class="input-schedule-date">');
	inputScheduleDate.val(scheduleCard.date); 
	scheduleInputWrap.append(inputScheduleDate);
	
	var btnScheduleDate = $('<button type="button" onclick="datepicker.open(this)" class="btn btn-datepicker"><span>날짜선택</span></button>');
	scheduleInputWrap.append(btnScheduleDate);
	
	var datepicker = $('<div class="datepicker"></div>');
	scheduleInputWrap.append(datepicker);
	
	var btnSchedulePrev = $('<a href="#" class="btn-schedule-nav btn-schedule-prev">이전 날짜</a>');
	btnSchedulePrev.click(function() {
        var $input = $(this).closest(".schedule-header").find(".input-schedule-date");
        var $listWrap = $(this).closest(".schedule-wrap").find(".schedule-list-wrap");
        var cDate = new Date($input.val());
        var tDate;

        $listWrap.removeClass("show");
        
        cDate.setDate(cDate.getDate() - 1);
        tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
        $input.val(tDate);
        setScheduleDate($(this), tDate);
    });
	scheduleHeader.append(btnSchedulePrev);
	
	var btnScheduleNext = $('<a href="#" class="btn-schedule-nav btn-schedule-next">다음 날짜</a>');
	btnScheduleNext.click(function() {
        var $input = $(this).closest(".schedule-header").find(".input-schedule-date");
        var $listWrap = $(this).closest(".schedule-wrap").find(".schedule-list-wrap");
        var cDate = new Date($input.val());
        var tDate;

        $listWrap.removeClass("show");
        
        cDate.setDate(cDate.getDate() + 1);
        tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
        $input.val(tDate);
        setScheduleDate($(this), tDate);
    });
	scheduleHeader.append(btnScheduleNext);

	// schedule-body
	var scheduleBody = $('<div class="schedule-body"></div>');
	scheduleWrap.append(scheduleBody);

	// schedule-list-header
	if( scheduleCard.mySelf == 'Y' ){
		var scheduleListHeader = $('<div class="schedule-list-header"></div>');
		scheduleBody.append(scheduleListHeader);
		
		var scheduleListHeaderLabel = $('<label>참석 여부 보기</label>');
		scheduleListHeader.append(scheduleListHeaderLabel);
		
		var scheduleListHeaderSwitch = $('<span class="ui-switch ui-switch-small ui-switch-attend"></span>');
		scheduleListHeader.append(scheduleListHeaderSwitch);
		
		var switchCheckbox = $('<input type="checkbox" name="attendView" class="check-attendView">');
		scheduleListHeaderSwitch.append(switchCheckbox);
		scheduleListHeaderSwitch.append($('<span></span>'));
		
		scheduleListHeaderSwitch.click(function() {
	        var $scheduleWrap = $(this).closest(".schedule-wrap");
	        
	        $(this).find(".check-attendView").prop("checked", !$(this).find(".check-attendView").prop("checked"));
	        if ($(this).find(".check-attendView").prop("checked") == true) {
	            $scheduleWrap.find(".schedule-btn").addClass("show");
	        } else {
	            $scheduleWrap.find(".schedule-btn").removeClass("show");
	        }
	    });
		
		if( welcomeYn == "Y" ){ 
// 			scheduleListHeader.css( "display", "none" );
			switchCheckbox.prop("checked", true);
		}
	} 

	// schedule-list-wrap
	var scheduleListWrap = $('<div class="schedule-list-wrap show"></div>');
	scheduleBody.append(scheduleListWrap);
	
	var scheduleList = $('<ul class="schedule-list"></ul>');
	scheduleListWrap.append(scheduleList);
		
	makeScheduleItem(scheduleCard, scheduleList, welcomeYn == "Y" ? true : false);

	return scheduleCon;
}

/**
 * '스케줄 셋팅' 함수
 */
function makeScheduleItem(scheduleCard, scheduleList, checkBtnShow){
    var $listWrap = scheduleList.closest(".schedule-wrap").find(".schedule-list-wrap");
    var showBtn;
    
    if (checkBtnShow == true) {
        showBtn = " show";
    } else {
        showBtn = "";
    }
    
    var today = new Date();
    var cDate = new Date(scheduleCard.date);
    today = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth()+1, cDate.getDate());
    
    var dataDisabled;

    if (cDate < today) {
        dataDisabled = ' data-disabled="disabled"';
    } else {
        dataDisabled = "";
    }
		
	if (scheduleCard.items instanceof Array && scheduleCard.items.length > 0) {
		scheduleCard.items.forEach(function(item,index) {
		    if (scheduleCard.loginUserId==scheduleCard.userId) {
			    var scheduleItem = $( item.wholeDay == '1' ? '<li class="schedule-item schedule-wholeTime" onclick="scheduleDetail(this)"></li>' : '<li class="schedule-item schedule-notwholeTime" onclick="scheduleDetail(this)"></li>' );
			} else {
			    // var scheduleItem = $( item.wholeDay == '1' ? '<li class="schedule-item schedule-wholeTime schedule-not-me"></li>' : '<li class="schedule-item schedule-notwholeTime schedule-not-me")"></li>' );
			    var scheduleItem = $( item.wholeDay == '1' ? '<li class="schedule-item schedule-wholeTime" onclick="scheduleDetail(this)"></li>' : '<li class="schedule-item schedule-notwholeTime" onclick="scheduleDetail(this)"></li>' );
			}
			scheduleItem.attr("data-scheduleId", item.scheduleId);
			scheduleItem.attr("data-repeatYn", item.repeatYn);
			scheduleList.append(scheduleItem);
			
			var scheduleDl = $('<dl class="schedule"></dl>');
			scheduleItem.append(scheduleDl);
			
			var scheduleTime = $('<dd class="schedule-time"></dd>');
			scheduleTime.append( item.wholeDay == '1' ? '종일' : item.stTime + ' ~ ' + item.edTime );
			scheduleDl.append(scheduleTime);
			
			var scheduleTodo = $('<dt class="schedule-todo"></dd>');
			scheduleTodo.text( (item.publicYn == 'N' ? '(비공개) ' : '') + item.title );
			scheduleDl.append(scheduleTodo);
			
			var schedulePlace = $('<dd class="schedule-place"></dd>');
			schedulePlace.text( item.place );
			scheduleDl.append(schedulePlace);
			
			var scheduleBtn = $('<dd class="schedule-btn' + showBtn + '"></dd>');
			scheduleDl.append(scheduleBtn);
			
			// registFg ( 1:내가 등록한 일정일 경우, 2:참여자로 등록된 경우이지만 참여여부 미정일 경우, 3:참여일정인 경우, 4:불참일정인 경우 )
			// registFg가 Empty인 경우 '참여요청' 없이 일정을 등록했기 때문에 렌더링 X
			// 웰컴의 경우 registFn로 오고있음
			if( item.registFg == '1' || item.registFn == '1'){
                
				var attendGroup = $('<div class="radio-attend-group"'+ dataDisabled + '></div>');
				scheduleBtn.append(attendGroup);
			
				// 본인이 등록한  일정일 경우 무조건 일정 삭제 이벤트 (scheduleDeleteEvent)
				var deleteBtn = $('<div class="delete-btn"><button type="button" class="btn btn-todo-delete" onclick="event.cancelBubble=true;">삭제</button></div>');
				deleteBtn.find('.btn-todo-delete').click(function(){
                    
					if( item.repeatYn == "Y" ){
						
						pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("반복일정은 엔솔봇에서 삭제하실 수 없습니다.")');
						
					} else {

		            	pop.open('create', $(this), 'Pop_Delete_Schedule', 'loadEl.pop_del_confirm("일정을 삭제하시겠습니까?")');
		            	
		            	$("#btnDelete").click(function(){
		            	
		            		// 본인이 등록한 일정에 한해서만 일정 삭제 이벤트로 설정
		                    var sessionId = deleteBtn.closest(".schedule-wrap").attr("data-sessionId");
		                    var userId = deleteBtn.closest(".schedule-wrap").attr("data-userId");
		                	var requestParam = {
		                		    query: {
		                				"event": scheduleDeleteEvent
		                			},
		                			payload: {
		                				"scheduleId": item.scheduleId ,
		                				"deleteTarget" : 0, // ( 일정 삭제 : 0 / 회의실 삭제 : 1)
		                				"isAccept" : 3,     // ( 일정 참여 : 1/ 일정 불참 : 2 )
		                				"userId" : userId
		                			}
		                	    };

		            	    sendChatApi(requestParam, sessionId, function(payload){
		        				scheduleItem.remove();

		            	    	pop.close($("#btnDelete"));
		        				
		        				if( scheduleList.closest(".schedule-wrap").find(".schedule-item").length < 1 ){
		        					$listWrap.html('<div class="schedule-noData">등록된 일정이 없습니다.</div>');
		        				}
		            	    });
		    		    });
						
					}
					
			    });
				scheduleBtn.append(deleteBtn);

				
			} else {
				
				var attendGroup = $('<div class="radio-attend-group"'+ dataDisabled + '></div>');
				scheduleBtn.append(attendGroup);
				
				// attendanceRequest = 1 (타인등록 일정인데 참여확인 O)
				// attendanceRequest = 0 (타인등록 일정인데 참여확인 X) 
				if(item.attendanceRequest != 0){
					
					var attendY, attendN;
	            	
	                if (item.registFg == '3') {
	                    attendY = " checked";
	                    
	                } else if (item.registFg == '4') {
	                    attendN = " checked";
	                    
	                }
	                
	                var radioIdx = Math.floor(Math.random() * 10000000000);
	                var radioBtton = $('<label class="ui-radio-attend" onclick="event.cancelBubble=true;"><input type="radio" name="attendYN_' + radioIdx + '" value="Y" class="radio-attend radio-attendY"'+ attendY + ' ><span>참석</span></label><label class="ui-radio-attend" onclick="event.cancelBubble=true;"><input type="radio" name="attendYN_' + radioIdx + '" value="N" class="radio-attend radio-attendN"'+ attendN + '><span>불참</span></label>');
	                attendGroup.append(radioBtton);
					/*var attendGroup = $('<div class="radio-attend-group"'+ dataDisabled + '>'
							+ '<label class="ui-radio-attend"><input type="radio" name="attendYN_' + radioIdx + '" value="Y" class="radio-attend radio-attendY"'+ attendY + '><span>참석</span></label>'
							+ '<label class="ui-radio-attend"><input type="radio" name="attendYN_' + radioIdx + '" value="N" class="radio-attend radio-attendN"'+ attendN + '><span>불참</span></label>'
							+ '</div>');*/
					
					//if(attendY == null){
						attendGroup.find('.ui-radio-attend input').click(function(){
						    
					        var $radioWrap = $(this).closest(".radio-attend-group");
			                var sessionId = $(this).closest(".schedule-wrap").attr("data-sessionId");
			                var userId = deleteBtn.closest(".schedule-wrap").attr("data-userId");
	
			                $(this).prop("checked", false);
					        if ($radioWrap.data("disabled") !== "disabled") {
					            if($(this).hasClass("radio-attendN")) {
					            	pop.open('create', $(this), 'Pop_Meeting_Reason', 'loadEl.pop_reason()');
					            	
					            	$("#reason").keyup(function () {
					            		if($(this).val().replace(/\s|　/gi, "").length != 0){
					            			$("#reasonSave").prop("disabled", false);
					            		} else {
					            			$("#reasonSave").prop("disabled", true);
					            		} 
					                });
					            	
					            	$("#reasonSave").click(function(){
					            		var requestParam = {
						            		    query: {
						            				"event": scheduleAttendEvent
						            			},
						            			payload: {
						            				"scheduleId": item.scheduleId,
						            				"isAccept": 2,
						            				"reason" : $("#reason").val(),
						            				"userId" : userId
						            			}
						            	    };
	
					            	    sendChatApi(requestParam, sessionId, function(payload){
					            	    	attendGroup.find(".radio-attend").removeAttr("disabled").attr("checked", true);
					            	    	attendGroup.find("input.radio-attendN").prop("checked", true);
	
					            	  //  	attendGroup.find('.ui-radio-attend input.radio-attendY').attr("disabled", false);
					            	    	pop.close($("#reasonSave"));
					            	    	attendGroup.find('.ui-radio-attend input.radio-attendN').off("click");
				            	    	    attendGroup.find('.ui-radio-attend input.radio-attendY').on("click");
					            	    	
					            	    });

					    		    });
					            } else if($(this).hasClass("radio-attendY")) {
					            	var requestParam = {
					            		    query: {
					            				"event": scheduleAttendEvent
					            			},
					            			payload: {
					            				"scheduleId": item.scheduleId,
					            				"isAccept": 1,
					            				"userId" : userId
					            			}
					            	    };
	
				            	    sendChatApi(requestParam, sessionId, function(payload){
				            	    	attendGroup.find(".radio-attend").removeAttr("disabled").attr("checked", true);
				            	    	attendGroup.find("input.radio-attendY").prop("checked", true);
	
				            	   // 	attendGroup.find('.ui-radio-attend input.radio-attendN').attr("disabled", false)
				            	    	attendGroup.find('.ui-radio-attend input.radio-attendY').off("click");
				            	    	attendGroup.find('.ui-radio-attend input.radio-attendN').on("click");
				            	    });
					            }
					        }
					    });
				 	}
    			    	var deleteBtn = $('<div class="delete-btn"><button type="button" class="btn btn-todo-delete" onclick="event.cancelBubble=true;">삭제</button></div>');
    					deleteBtn.find('.btn-todo-delete').click(function(){
    						
    						if( item.repeatYn == "Y" ){
    							
    							pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("반복일정은 엔솔봇에서 삭제하실 수 없습니다.")');
    							
    						} else {
    
    			            	pop.open('create', $(this), 'Pop_Delete_Schedule', 'loadEl.pop_del_confirm("일정을 삭제하시겠습니까?")');
    			            	
    			            	$("#btnDelete").click(function(){
    			            	
    			            		// 본인이 등록한 일정에 한해서만 일정 삭제 이벤트로 설정
    			                    var sessionId = deleteBtn.closest(".schedule-wrap").attr("data-sessionId");
    			                    var userId = deleteBtn.closest(".schedule-wrap").attr("data-userId");
    			                	var requestParam = {
    			                		    query: {
    			                				"event": scheduleAttendEvent
    			                			},
    			                			payload: {
    			                				"scheduleId": item.scheduleId ,
    			                				"deleteTarget" : 0, // ( 일정 삭제 : 0 / 회의실 삭제 : 1)
    			                				"isAccept" : 3,     // ( 일정 참여 : 1/ 일정 불참 : 2 )
    			                				"userId" : userId
    			                			}
    			                	    };
    
    			            	    sendChatApi(requestParam, sessionId, function(payload){
    			        				scheduleItem.remove();
    
    			            	    	pop.close($("#btnDelete"));
    			        				
    			        				if( scheduleList.closest(".schedule-wrap").find(".schedule-item").length < 1 ){
    			        					$listWrap.html('<div class="schedule-noData">등록된 일정이 없습니다.</div>');
    			        				}
    			            	    });
    			    		    });
    							
    						}
    						
    				    });	
                    scheduleBtn.append(deleteBtn);
			} 
			// '종일' 인 경우 스케쥴 맨 상단에 위치하도록 함
            $(this).closest(".schedule-wholeTime").prependTo(".schedule-list");
		});
    } else {
    	$listWrap.html('<div class="schedule-noData">등록된 일정이 없습니다.</div>');
    }

}

/**
 * '일자별 스케줄 셋팅' 함수
 */
function setScheduleDate(btn, date) {
    var checkBtnShow = $(btn).closest(".schedule-wrap").find(".check-attendView").prop("checked");
    var $schDate = $(btn).closest(".schedule-header").find(".schedule-date");
    var $listWrap = $(btn).closest(".schedule-wrap").find(".schedule-list-wrap");
    var $list;
    var sessionId = $(btn).closest(".schedule-wrap").attr("data-sessionId");
    var userId = $(btn).closest(".schedule-wrap").attr("data-userId");
    var loginUserId = $(btn).closest(".schedule-wrap").attr("data-loginUserId");
    
    $schDate.text(datepicker.fulldate(date));

    $listWrap.html('<ul class="schedule-list"></ul>');
    $list = $(btn).closest(".schedule-wrap").find(".schedule-list");

    /**********************************************************/
    var requestParam = {
	    query: {
			"event": "scheduleQueryEvent"
		},
		payload: {
			"date": date.replace(/-/g,""),
			"targetId" : userId,
			"loginUserId" : loginUserId
		}
    };
    
    sendChatApi(requestParam, sessionId, function(payload){
    	
	    var data = JSON.parse(payload.queryResult.messages[0].response).template.outputs;
	    
        var count = 0;

        $.each(data, function(index) {
            if (data[index].type == 'schedule') {
                if (data[index].data.date == date) {
        			makeScheduleItem(data[index].data, $list, checkBtnShow);
        			
                    count = count + 1;
                }
            }
        });

        $listWrap.addClass("show");

        if (count < 1) {
            $listWrap.html('<div class="schedule-noData">등록된 일정이 없습니다.</div>');
        }
    });
    /**********************************************************/
}

/**
 * 스케줄 상세 보기 화면 
 **/
function scheduleDetail(btn) {
    let scheduleId = $(btn).closest(".schedule-item").attr("data-scheduleid");
    window.open(gportalScheduleUrl+scheduleId,'width=1100,height=800, resizable=1,scrollbars=1'); 
   
    
}


/**
 * '회의실 취소 카드 생성' 함수
 * @param {object} scheduleCard 형 응답 데이터
 */
function makeMeetingRoomCard(data, isHistory){
	var meetingRoomCon = $('<div class="message caas-message-color caas-message-font-color"></div>');
	var meetingRoomWrap = $('<div class="schedule-wrap schedule-person meetingRoom-person"></div>');
	meetingRoomWrap.attr("data-sessionId", data.chatSessionId.split("sessions/")[1]);
	meetingRoomWrap.attr("data-userId", data.userId);
	meetingRoomCon.append(meetingRoomWrap);

	
	// schedule-header
	var meetingRoomHeader = $('<div class="schedule-date-wrap schedule-header" data-target="schedule-list-wrap"></div>');
	meetingRoomWrap.append(meetingRoomHeader);
	
	var meetingRoomInputWrap = $('<div class="schedule-input-wrap schedule-header-date"></div>');
	meetingRoomHeader.append(meetingRoomInputWrap);
	
	var meetingRoomDate = $('<span class="schedule-date"></span>');
	meetingRoomDate.text(moment(data.date).format('YYYY년 M월 DD일 dddd'));
	meetingRoomInputWrap.append(meetingRoomDate);
	
	var inputMeetingRoomDate = $('<input type="text" name="schedule-date" value="" class="input-schedule-date">');
	inputMeetingRoomDate.val(data.date);
	meetingRoomInputWrap.append(inputMeetingRoomDate);
	
	var btnMeetingRoomDate = $('<button type="button" onclick="datepicker.open(this)" class="btn btn-datepicker"><span>날짜선택</span></button>');
	meetingRoomInputWrap.append(btnMeetingRoomDate);
	
	var datepicker = $('<div class="datepicker"></div>');
	meetingRoomInputWrap.append(datepicker);
	
	var btnMeetingRoomPrev = $('<a href="#" class="btn-schedule-nav btn-schedule-prev">이전 날짜</a>');
	btnMeetingRoomPrev.click(function() {
        var $input = $(this).closest(".schedule-header").find(".input-schedule-date");
        var $listWrap = $(this).closest(".schedule-wrap").find(".schedule-list-wrap");
        var cDate = new Date($input.val());
        var tDate;

        $listWrap.removeClass("show");
        
        cDate.setDate(cDate.getDate() - 1);
        tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
        $input.val(tDate);
        setMeetingRoomDate($(this), tDate);
    });
	meetingRoomHeader.append(btnMeetingRoomPrev);
	
	var btnMeetingRoomNext = $('<a href="#" class="btn-schedule-nav btn-schedule-next">다음 날짜</a>');
	btnMeetingRoomNext.click(function() {
        var $input = $(this).closest(".schedule-header").find(".input-schedule-date");
        var $listWrap = $(this).closest(".schedule-wrap").find(".schedule-list-wrap");
        var cDate = new Date($input.val());
        var tDate;

        $listWrap.removeClass("show");
        
        cDate.setDate(cDate.getDate() + 1);
        tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
        $input.val(tDate);
        setMeetingRoomDate($(this), tDate);
    });
	meetingRoomHeader.append(btnMeetingRoomNext);

	// schedule-body
	var meetingRoomBody = $('<div class="schedule-body"></div>');
	meetingRoomWrap.append(meetingRoomBody);

	// schedule-list-wrap
	var meetingRoomListWrap = $('<div class="schedule-list-wrap show"></div>');
	meetingRoomBody.append(meetingRoomListWrap);
	
	var meetingRoomList = $('<ul class="schedule-list"></ul>');
	meetingRoomListWrap.append(meetingRoomList);
		
	makeMeetingRoomItem(data, meetingRoomList);

	return meetingRoomCon;
}

/**
 * '회의실 항목 셋팅' 함수
 */
function makeMeetingRoomItem(data, meetingRoomList){
    var $listWrap = meetingRoomList.closest(".schedule-wrap").find(".schedule-list-wrap");
    
    var today = new Date();
    var cDate = new Date(data.date);
    today = new Date(today.getFullYear(), today.getMonth()+1, today.getDate());
    cDate = new Date(cDate.getFullYear(), cDate.getMonth()+1, cDate.getDate());
    
    var dataDisabled;

    if (cDate < today) {
        dataDisabled = ' data-disabled="disabled"';
    } else {
        dataDisabled = "";
    }
		
	if (data.items instanceof Array && data.items.length > 0) {
		data.items.forEach(function(item,index) {
			var meetingRoomItem = $('<li class="schedule-item"></li>');
			meetingRoomItem.attr("data-scheduleId", item.scheduleId);
			meetingRoomItem.attr("data-repeatYn", item.repeatYn);
			meetingRoomList.append(meetingRoomItem);
			
			var meetingRoomDl = $('<dl class="schedule"></dl>');
			meetingRoomItem.append(meetingRoomDl);
			
			var meetingRoomTime = $('<dd class="schedule-time"></dd>');
			meetingRoomTime.append( item.wholeDay == 'Y' ? '종일' : item.stTime + ' ~ ' + item.edTime );
			meetingRoomDl.append(meetingRoomTime);
			
			var meetingRoomTodo = $('<dt class="schedule-todo"></dd>');
			meetingRoomTodo.text( (item.publicYn == 'N' ? '(비공개) ' : '') + item.title );
			meetingRoomDl.append(meetingRoomTodo);
			
			var meetingRoomPlace = $('<dd class="schedule-place"></dd>');
			meetingRoomPlace.text( item.place );
			meetingRoomDl.append(meetingRoomPlace);
			
			var meetingRoomBtn = $('<dd class="schedule-btn show"></dd>');
			meetingRoomDl.append(meetingRoomBtn);
						
			var deleteBtn = $('<div class="delete-btn"><button type="button" class="btn btn-todo-delete btn-meet-delete">회의실 삭제</button></div>');
			deleteBtn.find('.btn-todo-delete').click(function(){
            	pop.open('create', $(this), 'Pop_Delete_Schedule', 'loadEl.pop_del_confirm("회의실을 삭제하시겠습니까?")');
            	
            	$("#btnDelete").click(function(){
            	    
            	    
            	    
                    var sessionId = deleteBtn.closest(".schedule-wrap").attr("data-sessionId");
                    var userId = deleteBtn.closest(".schedule-wrap").attr("data-userId");
                    
                	var requestParam = {
                		    query: {
                				"event": "meetingRoomDeleteEvent"
                			},
                			payload: {
                				"userId" : userId,
                				"scheduleId": item.scheduleId,
                				"deleteTarget" : 1 // ( 일정 삭제 : 0 / 회의실 삭제 : 1)
                				
                				
                			}
                	    };

            	    sendChatApi(requestParam, sessionId, function(payload){
        				meetingRoomItem.remove();
            	    	pop.close($("#btnDelete"));
        				
        				if( meetingRoomList.closest(".schedule-wrap").find(".schedule-item").length < 1 ){
        					$listWrap.html('<div class="schedule-noData">취소가능한 회의실이 없습니다.</div>');
        				}
            	    });
    		    });
		    });
			meetingRoomBtn.append(deleteBtn);
		});
    } else {
    	$listWrap.html('<div class="schedule-noData">취소가능한 회의실이 없습니다.</div>');
    }
}

/**
 * '일자별 회의실 셋팅' 함수
 */
function setMeetingRoomDate(btn, date) {
    var $schDate = $(btn).closest(".schedule-header").find(".schedule-date");
    var $listWrap = $(btn).closest(".schedule-wrap").find(".schedule-list-wrap");
    var $list;
    var sessionId = $(btn).closest(".schedule-wrap").attr("data-sessionId");
    var userId = $(btn).closest(".schedule-wrap").attr("data-userId");
    
    $schDate.text(datepicker.fulldate(date));

    $listWrap.html('<ul class="schedule-list"></ul>');
    $list = $(btn).closest(".schedule-wrap").find(".schedule-list");

    /**********************************************************/
    var requestParam = {
	    query: {
			"event": "meetingRoomQueryEvent"
		},
		payload: {
			"date": date,
			"userId":userId
		}
    };
    
    sendChatApi(requestParam, sessionId, function(payload){
	    var data = JSON.parse(payload.queryResult.messages[1] ? payload.queryResult.messages[1].response : payload.queryResult.messages[0].response).template.outputs;
        var count = 0;

        $.each(data, function(index) {
            if (data[index].type == 'meetingRoom') {
                if (data[index].data.date == date) {
        			makeMeetingRoomItem(data[index].data, $list);
        			
                    count = count + 1;
                }
            }
        });

        $listWrap.addClass("show");

        if (count < 1) {
            $listWrap.html('<div class="schedule-noData">취소가능한 회의실이 없습니다.</div>');
        }
    });
    /**********************************************************/
}

/**
 * '임직원 조회 카드' 생성 함수
 * @param {JSON} item 임직원 조회 응답 데이터
 */
function makeEmployeeCard(data, isHistory){
	
	var dprofile = $('<div class="message dprofile"></div>');
	
	var img =  data.profilePicture ? $('<a href="#상세정보팝업"><img class="img-circle" src="'+ data.profilePicture +'" alt=""></a>') : $('<a href="#상세정보팝업"><img class="img-circle" src="'+imgBaseUrl+'/icon/img_user_none.png" alt=""></a>');
	dprofile.append(img);
	
	// dpWrap
	var dpWrapHtml  = '<div class="dp-wrap">';
		dpWrapHtml += 	'<span class="dp-name"><a href="#상세정보팝업">'+data.userNm + ' ' + data.titleNm +'</a></span>';
		dpWrapHtml += 	'<span class="dp-team"><a href="#팀 페이지로">'+data.deptNm+'</a></span>';
		dpWrapHtml += '</div>';
	var dpWrap = $(dpWrapHtml);
	dprofile.append(dpWrap);
	////

	// dpDesc
	var dpDescHtml = '<div class="dp-desc">';
		if (data.empMail=="-" || data.empMail=="---") {data.empMail = ""};
		dpDescHtml += 	'<div class="email"><span>E-mail</span><span>'+( data.empMail ? data.empMail : 'No Email Address')+'</span></div>';
		if (data.empMobile=="-" || data.empMobile=="---") {data.empMobile = ""};
		dpDescHtml += 	'<div class="tel"><span>Phone</span><span>'+( data.empMobile ? data.empMobile : 'No Mobile Number')+'</span></div>';
		if (data.empTelNo=="-" || data.empTelNo=="---") {data.empTelNo = ""};
		dpDescHtml += 	'<div class="address"><span>Office</span><span>'+( data.empTelNo ? data.empTelNo : 'No Office Number') +'</span></div>';
	    // 파일럿 퍼블 스마트오피스
        if (data.location === undefined || data.location.code === "0" || data.location.code === "") {data.location = ""};
		dpDescHtml +=    data.location ? '<div class="seat"><span>좌석위치</span>'+data.location.result.center+' '+data.location.result.floor+' / '+data.location.result.seat+/*'<a href="http://esl.lgensol.com/index.do"><img class="arrow-right" src="' + imgBaseUrl + '/assets/arrow-right.png" alt=">"></a>*/'</div>' : ''
		dpDescHtml += '</div>';
	var dpDesc = $(dpDescHtml);
	dprofile.append(dpDesc);
	///
	
	var userId = data.empMail.split("@");
	
	if ( data.isMobile != 'Y' && data.group != 'Y' ) {
		// dpContact
		var dpContactHtml = '<ul class="dp-contact">';
			dpContactHtml += 	'<li class="employ_list"><a href="#;" onClick="connectMessenger(\''+data.userId+'\',\''+userId[0]+'\');"><img class="employee_mouseouut" src="' + imgBaseUrl + '/assets/messenger.png" alt=""><img class="employee_mouseover" src="' + imgBaseUrl + '/assets/messenger_mouseover.png" alt=""><span>메신저</span></a></li>';
 			// dpContactHtml +=	'<li class="employ_list"><a href="#;" onClick="intentEvent(null, \'email\', \''+UidMail[0]+'\');"><img class="employee_mouseouut" src="' + imgBaseUrl + '/assets/mail.png" alt=""><img class="employee_mouseover" src="' + imgBaseUrl + '/assets/mail_mouseover.png" alt=""><span>메일</span></a></li>';
            dpContactHtml +=	'<li class="employ_list"><a href="#;" onClick="console.log(\'>>>>>>>>>mail\');intentEvent(null, \'email\', \''+data.empMail+'\', \''+data.userNm+'\');setMailCookie(\'mailCookie\',\'Y\');"><img class="employee_mouseouut" src="' + imgBaseUrl + '/assets/mail.png" alt=""><img class="employee_mouseover" src="' + imgBaseUrl + '/assets/mail_mouseover.png" alt=""><span>메일</span></a></li>';
            // 메일 인텐트 연결 함수 : onClick="intentEvent(null, \'email\', \''+data.empMail+'\');"
			// onClick="directMail(\''+data.empMail+'\');"
			dpContactHtml +=	'<li class="employ_list"><a href="#;" onClick="window.open(\''+ profileUrl + userId[0] +'\', \'_blank\', \'top=10, left=10, width=1100, height=800, status=no, menubar=no, toolbar=no, resizable=1, scrollbars=1\');"><img class="employee_mouseouut" src="' + imgBaseUrl + '/assets/blog.png" alt=""><img class="employee_mouseover" src="' + imgBaseUrl + '/assets/blog_mouseover.png" alt=""><span>프로필</span></a></li>';
			dpContactHtml +=	'<li class="employ_list"><a href="#;" onClick="intentEvent(null,\'sms\',\''+userId[0]+'\')"><img class="employee_mouseouut" src="' + imgBaseUrl + '/assets/message.png" alt=""><img class="employee_mouseover" src="' + imgBaseUrl + '/assets/message_mouseover.png" alt=""><span>SMS</span></a></li>';
			dpContactHtml +='</ul>';
    		
    	var dpContact = $(dpContactHtml);
    	dprofile.append(dpContact);
		////
	
	}

	return dprofile;
}

/**
 * '임직원 리스트' 함수 (일정조회 동명이인)' 생성 함수
 * @param {JSON List} item 임직원 리스트 응답 데이터
 */
function makeEmployeeListCard(data,isHistory){
	
	var dList = $('<div class="message dprofile d-list">');
	dList.attr("data-sessionId", data.chatSessionId.split("sessions/")[1]);
	
	//일정조회 동명이인 전용 파라미터
	dList.attr("data-loginUserId", data.loginUserId);
	dList.attr("data-date", data.date);
	
	var dpListWrap = $('<div class="dp-list-wrap">');
	dList.append(dpListWrap);
	
	var ul = $('<ul>');
	dpListWrap.append(ul);
	
	if (data.items instanceof Array && data.items.length > 0) {
		data.items.forEach(function(item,index) {

			var type = data.type;
			var empMail = item.empMail.split('@');
			var userId = empMail[0];
			var display = (index > 4)? "none":"";
			
			var liHtml = '<li style="display:'+display+'"onClick="intentEvent(this , \''+ type +'\', \''+ userId +'\')">';
			
			if(data.group == 'Y'){
				liHtml = '<li style="display:'+display+'"onClick="intentEvent(this , \'group\', \''+ item.empMail +'\')">';
			}
			
				liHtml += 	'<img class="img-circle" src="'+imgBaseUrl+'/icon/img_user_none.png" alt="">'; // item.profilePicture => 호환 문제로 임시 디폴트 이미지로 대체
				liHtml += 	'<div class="dp-wrap">';
				liHtml +=			'<span class="dp-name">'+ item.userNm + ' ' + item.titleNm +' </span>';
				liHtml +=			'<span class="dp-team">'+ item.deptNm +'</span>';
				liHtml +=			'<span>'+ item.empMail +'</span>';
				if (item.empMobile=="-") {item.empMobile=""};
				if (item.empTelNo=="-") {item.empTelNo=""};
				liHtml +=			'<span>'+ ( item.empMobile ? item.empMobile : '-' ) +' / '+ ( item.empTelNo ? item.empTelNo : '-' )+'</span>';
				liHtml +=			'<span class="arrow-right"><img src="'+imgBaseUrl+'/assets/arrow-right.png" alt=""></span>';
				liHtml += 	'</div>';
				liHtml += '</li>';
			var li = $(liHtml);
			ul.append(li);
		});
		
		if(data.items.length > 4){
			var btnHtml = 	'<button type="button" id="" class="btn view-more">';
				btnHtml += 		'<span class="arrow-down"><img src="'+imgBaseUrl+'/assets/arrow-down.png" alt=""></span> 더보기';
				btnHtml += 	'</button>';
			var btn = $(btnHtml);
			btn.click(function() {
			    $(this).prev().find("li").css("display","");
			    $(this).css({"display":"none"});
		    });
			dpListWrap.append(btn);
		}
		
	}

	return dList;
}

/**
 * '기념일 카드' 생성 함수
 * @param {List} item 리스트형 응답 데이터
 */
function makeAnniversaryCard(items){
	
	var messageTodo = $('<div class="message todo"></div>');
	
	// 기념일 Header
	var accordionHtml = '<div class="accordian-header collapsed" data-toggle="collapse" data-target="#collapseToDo" aria-expanded="false" aria-controls="collapseToDo">';
		accordionHtml +=  	'<div class="dp-wrap">';
		
		if(items.length == 1){ 
			accordionHtml +=		'<span class="dp-name">'+items[0].userNm +' '+items[0].titleNm +'</span>의 생일을 축하해주세요!';
		}else{
			accordionHtml +=		'<span class="dp-name">'+items[0].userNm +' '+items[0].titleNm +' 외 ' +(items.length - 1) +' 명의 </span>생일을 축하해주세요!';
		}
		accordionHtml +=  	'</div>';
		accordionHtml +=  	'<button class="btn btn-trans">';
		accordionHtml +=  		'<span class="arrow-down"><img src="' + imgBaseUrl + '/assets/arrow-down.png" alt=""></span>';
		accordionHtml +=  		'<span class="arrow-up"><img src="' + imgBaseUrl + '/assets/arrow-up.png" alt=""></span>';
		accordionHtml +=  	'</button>';
		accordionHtml += '</div>';
	var accordion = $(accordionHtml);
	messageTodo.append(accordion);
	//
	
	// 기념일 Contents
	var accordionContent = $('<div class="accordion-content collapse" id="collapseToDo" style=""></div>');
	messageTodo.append(accordionContent);
	
	var dpListWrap = $('<div class="dp-list-wrap"></div>');
	accordionContent.append(dpListWrap);
	
	var ul = $('<ul></ul>');
	dpListWrap.append(ul);
	
	if (items instanceof Array && items.length > 0) {
		items.forEach(function(item,index) {
			var liHtml = '<li>';
				liHtml += 	'<div class="dp-wrap welcome birthday">';
				liHtml +=		'<span class="dp-rank caas-title-font-color">'+ item.date.slice(0, 2)+ "월 " + item.date.slice(-2) + "일" +'</span>';
				liHtml +=		'<span class="dp-name">'+ item.userNm + ' '+ item.titleNm +'</span>';
				liHtml +=		'<span class="dp-team">'+ item.deptNm + '</span>';
				liHtml += 	'</div>';
				liHtml += '</li>';
			var li = $(liHtml);
			ul.append(li);
	
		});
	}
	//

	return messageTodo;
}

function makeGptBotModeCard(data) {
  var learningBotCard = $('<div class="message simple-text"></div>');
  var learingBotText = $('<p>'+data.text+'</p>');
  learningBotCard.append(learingBotText);
//   var regBtnWrap = $('<div class="btn"></div>');
  var regBtnWrap = $('<div"></div>');
  var regBtn = $('<button type="button" class="btn btn-default caas-chat-button-back-color caas-chat-button-font-color caas-chat-button-border-color">ChatGPT Mode</button>');
  regBtn.on('click', function() {
    activeGptBot("");
    
    // $('body').append('<div id="caas-chatbot-container"><iframe id="caas-chatbot-chat-iframe" name="caas-chatbot-chat-iframe" src="about:blank" allow="microphone; autoplay" allowusermedia="true" style="position: relative!important;height:100%!important;width: 100%!important;border: none!important;"></iframe></div>');
    
    // if (!document.getElementById("caas-chatbot-chat-iframe").isLoaded) {
    //   document.getElementById("caas-chatbot-chat-iframe").isLoaded = true;
    //   openChatFrame();
    // };
  });
  regBtnWrap.append(regBtn);
  learningBotCard.append(regBtnWrap);
  
  return learningBotCard;
}

function makeScheduleRegCard(data, isHistory){
	// 일정등록 하는 사람이 임원일시 data.hasExcutive = "Y" 아니면 "N"
	
	var scheduleMessge = $('<div class="message message-form-schedule caas-message-color caas-message-font-color"></div>');
	var formSchedule = $('<div class="form-schedule"></div>');
	formSchedule.attr("data-sessionId", data.chatSessionId.split("sessions/")[1]);
	formSchedule.attr("data-userId", data.userId);
	formSchedule.attr("data-hasExcutive", data.hasExcutive);

	
	scheduleMessge.append(formSchedule);
	
	var formTable = $('<table class="form-table form-table-schedule"></table>');
	formSchedule.append(formTable);
	
	var tbody = $('<tbody></tbody>');
	formTable.append(tbody);
	
	// 일정 제목 
	var trTitleHtml = '<tr>';
		trTitleHtml += 	'<th>';
		trTitleHtml +=		'제목';
		trTitleHtml +=		'<span class="required">*</span>';		
		trTitleHtml +=	'</th>';
		trTitleHtml +=	'<td>';
		trTitleHtml +=		'<input type="text" name="sch_title" id="sch_title" max-length="50" placeholder="일정제목">';
		trTitleHtml +=		'<label class="ui-check">';
		if (data.hasExcutive === "Y") {
			trTitleHtml += '<input type="checkbox" name="private" value="Y" class="check-private" checked disabled><span></span>';
			trTitleHtml +=			'<span class="ui-check-label"> 비공개 </span>';
			trTitleHtml += 			"<img class='tooltipicon' src='"+imgBaseUrl+"/icon/ToolTip.png' alt='상단 메뉴'>";
			trTitleHtml += 			'<span class="tooltip-hover">특정인원이 있을 경우 비공개 등록이며,<br />변경은 틍록완료 후 지포탈에서 가능합니다.</span>'
		} else {
			trTitleHtml += '<input type="checkbox" name="private" value="Y" class="check-private"><span></span>';
			trTitleHtml +=			'<span class="ui-check-label"> 비공개 </span>';
		}
		trTitleHtml +=		'</label>';
		trTitleHtml +=	'</td>';
		trTitleHtml += '</tr>';
	var trTitle = $(trTitleHtml);
	tbody.append(trTitle);
	//
		
	// 일정 날짜
	var trDate = $('<tr></tr>');
	tbody.append(trDate);
	
	var thDate = $('<th>날짜<span class="required">*</span></th>');
	trDate.append(thDate);
	
	var tdDate = $('<td></td>');
	trDate.append(tdDate);
	
	var scheduleWrap = $('<div class="schedule-date-wrap schedule-date-reg-wrap"></div>');
	tdDate.append(scheduleWrap);
	
	var scheduleInputWrap = $('<div class="schedule-input-wrap schedule-reg-input-wrap"></div>');
	scheduleWrap.append(scheduleInputWrap);
		
	var btnScheduleDate = $('<button type="button" onclick="datepicker.open(this)" class="btn btn-datepicker btn-regdatepicker"><span>날짜선택</span></button>');
	scheduleInputWrap.append(btnScheduleDate);
	
	var scheduleDate = $('<span class="schedule-date"></span>');
	scheduleDate.text(moment(data.date).format('YYYY.MM.DD'));
	scheduleInputWrap.append(scheduleDate);
	
	var inputScheduleDate = $('<input type="text" name="schedule-date" value="'+ data.date +'" class="input-schedule-date">');
	scheduleInputWrap.append(inputScheduleDate);

	
	var datepicker = $('<div class="datepicker"></div>');
	scheduleInputWrap.append(datepicker);
	
// 	var btnSchedulePrev = $('<a href="#" class="btn-schedule-nav btn-schedule-prev">이전 날짜</a>');
// 	btnSchedulePrev.click(function() {
// 		var $input = $(this).closest(".schedule-date-wrap").find(".input-schedule-date");
//         var cDate = new Date($input.val());
//         var tDate;

//         cDate.setDate(cDate.getDate() - 1);
//         tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
//         $input.val(tDate);
        
//         var $schDate = $(this).closest(".schedule-date-wrap").find(".schedule-date");
//         $schDate.text(window.datepicker.fulldate( tDate ));
//     });
// 	scheduleWrap.append(btnSchedulePrev);
	
// 	var btnScheduleNext = $('<a href="#" class="btn-schedule-nav btn-schedule-next">다음 날짜</a>');
// 	btnScheduleNext.click(function() {
// 		var $input = $(this).closest(".schedule-date-wrap").find(".input-schedule-date");
//         var cDate = new Date($input.val());
//         var tDate;

//         cDate.setDate(cDate.getDate() + 1);
//         tDate = $.datepicker.formatDate($.datepicker.ATOM, cDate);
//         $input.val(tDate);
        
//         var $schDate = $(this).closest(".schedule-date-wrap").find(".schedule-date");
//         $schDate.text(window.datepicker.fulldate( tDate ));
//     });
// 	scheduleWrap.append(btnScheduleNext);
	//
	
	// 일정 시간
	var trTimeHtml = '<tr>';
		trTimeHtml += 	'<th>시간<span class="required">*</span></th>';
		trTimeHtml +=	'<td>';
		trTimeHtml +=		'<div class="form-divide-wrap">';
		trTimeHtml +=			'<div class="form-divide-item">';
		trTimeHtml +=				'<span class="ui-select">';
		trTimeHtml +=					'<select name="sch_start_hour" class="sch_start_hour">';
		trTimeHtml +=						hourSelectBox();
		trTimeHtml +=					'</select>';		
		trTimeHtml +=				'</span>';
		trTimeHtml +=				'<span class="ui-select">';
		trTimeHtml +=					'<select name="sch_start_min" class="sch_start_min">';
		trTimeHtml +=						minSelectBox();
		trTimeHtml +=					'</select>';		
		trTimeHtml +=				'</span>';
		trTimeHtml +=			'</div>';
		trTimeHtml +=			'<div class="form-divide-dash">-</div>';
		
		trTimeHtml +=			'<div class="form-divide-item">';
		trTimeHtml +=				'<span class="ui-select">';
		trTimeHtml +=					'<select name="sch_end_hour" class="sch_end_hour">';
		trTimeHtml +=						hourSelectBox();
		trTimeHtml +=					'</select>';		
		trTimeHtml +=				'</span>';
		trTimeHtml +=				'<span class="ui-select">';
		trTimeHtml +=					'<select name="sch_end_min" class="sch_end_min">';
		trTimeHtml +=						minSelectBox();
		trTimeHtml +=					'</select>';		
		trTimeHtml +=				'</span>';
		trTimeHtml +=			'</div>';
		trTimeHtml +=		'</div>';
		trTimeHtml +=	'</td>'
		trTimeHtml += '</tr>';
	var trTime = $(trTimeHtml);
	tbody.append(trTime);
	//
	
	trTime.find(".sch_end_hour option:eq(1)").attr("selected","selected");
	
	 // 일정 등록 시간 Select Box Change Event
	trTime.find(".sch_start_hour").on("change", function(){
		var startHour = $(".sch_start_hour").prop('selectedIndex');
		var index = (startHour == 23) ? startHour : parseInt(startHour)+1; 
		
		$(".sch_end_hour option:eq("+index+")").attr("selected","selected"); 
    });

	// 일정 참여자 
	var trMember = $('<tr></tr>');
	tbody.append(trMember);
	
	var thMember = $('<th>참여자</th>');
	trMember.append(thMember);
	
	var tdMember = $('<td></td>');
	trMember.append(tdMember);
	
	var inputWrap = $('<div class="input-wrap"></div>');
	tdMember.append(inputWrap);
	
	var inputJoinMember = $('<input type="text" name="join" maxlength="5" placeholder="이름을 검색해주세요." class="input-join-member ui-autocomplete-input" autocomplete="off">');
	inputWrap.append(inputJoinMember);
	
	var autocompleteMember = $('<div class="autocomplete-member"><ul id="ui-id-2" tabindex="0" class="ui-menu ui-widget ui-widget-content ui-autocomplete ui-front" style="display: none;"></ul></div>');
	inputWrap.append(autocompleteMember);
	
	var scheduleJoinMember = $('<div class="schedule-join-member"></div>');
	tdMember.append(scheduleJoinMember);
	//
        
	// 등록 버튼
	var btnWrapHtml = 	'<div class="btn-wrap">';
		btnWrapHtml += 		'<button type="button" onclick="RegScheduleDate($(this));" class="btn btn-primary">등록</button>';
		btnWrapHtml += 	'</div>';
	var btnWrap = $(btnWrapHtml);
	formSchedule.append(btnWrap);
	//
   
	setAutocompleteJoinMember(inputJoinMember);
	
	return scheduleMessge;
}

/**
 * '스케줄 등록' 함수
 */
function RegScheduleDate(btn) {

	var userExecutive = $(btn).closest(".form-schedule").attr("data-hasExcutive"); // 등록자가 임원인지 아닌지 체크

	// 참여자
	var shareList = [];
	var personList = $(btn).closest(".form-schedule").find(".person-userId");
	$.each(personList, function(index){

		var participant = $(btn).closest(".form-schedule").find(".person-userId").eq(index);
		
		if(!shareList.indexOf(participant.val()) != -1){
			shareList.push(participant.val());	
		}
	});

	// 참여자중 임직원 찾기
	// shareList 여기에 참여자의 email.id가 배열로 생성됨
	var shareData = {
		elements: []
	};

	for(let i = 0; i < shareList.length; i++){
		shareData.elements.push({empId: shareList[i]})
	}

	/**
 * '스케줄 등록시 정보 reading & send' 함수
 * @param {string} btnreg 해당 버튼의 id값
 * @param {boolean} public true 일 경우 비공개로 강제 할당
 */
	 function scheduleSend (btnreg, public) {
		var title = $(btn).closest('.form-schedule').find('#sch_title').val();
		var sessionId = $(btn).closest(".form-schedule").attr("data-sessionId");
		var userId = $(btn).closest(".form-schedule").attr("data-userId");
		

		
		// 날짜 및 시간 
		var date = $(btn).closest('.form-schedule').find('.input-schedule-date').val();
		var stHour = $(btn).closest('.form-schedule').find('.sch_start_hour option:selected').val();
		var stMin = $(btn).closest('.form-schedule').find('.sch_start_min option:selected').val();
		var edHour = $(btn).closest('.form-schedule').find('.sch_end_hour option:selected').val();
		var edMin = $(btn).closest('.form-schedule').find('.sch_end_min option:selected').val();
		var startDate = date.replace(/-/g,"") + stHour + stMin;
		var endDate = date.replace(/-/g,"") + edHour + edMin;
		
		// 종일 여부
		//var wholeDay = $(btn).closest(".form-schedule").find(".check-allDay").prop("checked");
		var publicYn = $(btn).closest(".form-schedule").find(".check-private").prop("checked");
		//wholeDay = (wholeDay)? "Y":"N";
		publicYn = public ? "N" : publicYn ? "N" : "Y";
		
		
		
		
		// Validation
		if(!title){
			 pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("일정 제목을 입력해주세요.")');
			 pop.close($(btnreg));
			return;
		}
		
		if(!stHour || !stMin || !edHour || !edMin) {
			 pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("올바른 시간으로 설정해주세요.")');
			 pop.close($(btnreg));
			return;

		}
		
		if(startDate > endDate){
			 pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("올바른 시간으로 설정해주세요.")');
			 pop.close($(btnreg));
			return;
		}
		
		if(shareList.indexOf(userId) != -1) {
		    pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("자기자신은 참여자로 등록할 수 없습니다.")')
		    pop.close($(btnreg));
		    return;
		}
	    
	    var payload =  {
			"userId" : userId,
			"title": title,
			"startDate" : startDate,
			"endDate" : endDate,
			"wholeDay" : "N",
			"publicYn" : publicYn,
			"shareList": shareList.join(",")
		};

		
	    chatui.sendEventMessage(scheduleRegEvent, payload );
	    pop.close($(btnreg));
		scheduleReset()
	}

	function scheduleReset () {
		$(btn).closest('.form-schedule').find('#sch_title').attr("disabled", true);
		$(btn).closest('.form-schedule').find('.input-schedule-date').attr("disabled", true);
		$(btn).closest('.form-schedule').find('.sch_start_hour').attr("disabled", true);
		$(btn).closest('.form-schedule').find('.sch_start_min').attr("disabled", true);
		$(btn).closest('.form-schedule').find('.sch_end_hour').attr("disabled", true);
		$(btn).closest('.form-schedule').find('.sch_end_min').attr("disabled", true);
		$(btn).closest(".form-schedule").find(".check-private").attr("disabled", true);
		$(btn).closest(".form-schedule").find(".input-join-member").attr("disabled", true);
		$(btn).closest(".form-schedule").find(".btn-regdatepicker").attr("disabled", true);
		$(btn).closest(".form-schedule").find(".input-join-member").removeAttr('placeholder');
	
		$(btn).closest('.form-schedule').find('.sch_start_hour').removeClass();
		$(btn).closest('.form-schedule').find('.sch_start_min').removeClass();
		$(btn).closest('.form-schedule').find('.sch_end_hour').removeClass();
		$(btn).closest('.form-schedule').find('.sch_end_min').removeClass();
	
		$(btn).closest(".form-schedule").find(".btn-wrap").css("display", "none");
		$(btn).closest(".form-schedule").find(".btn-delete").css("display", "none");
	}
	function scheduleSendNormal () {
		scheduleSend("#btnReg", false)
	}
	function scheduleSendExecutive () {
		scheduleSend("#btnRegSchedule", true)
	}

	// 1월추가
	// https://gportaldev.lgensol.com/ikep-webapp/rest/planner/checkExecutive(개발)
	// https://gportalapp.lgensol.com/rest/planner/checkExecutive(운영)
	$.ajax({
		type: 'POST',
		url: (window.location.href.indexOf("chatclient-stg.ai.lgstation.com")>0) ? hasExecutiveDevAPI : hasExecutiveAPI,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		cache: false,
		data: JSON.stringify(shareData),
	}).done(function (data, textStatus, xhr) {
		// 참여자가 없을경우 body = {}
		// 참여자가 있는데 임원이 아닌경우 body = {hasExecutive : "N"}
		// 참여자가 있는데 임원인 경우 body = {hasExecutive : "Y"}
		if (data.body.hasExecutive === "Y" || userExecutive === "Y") {
			pop.open('create', $(this), 'Pop_Reg_Schedule_Confirm', 'loadEl.pop_reg_schedule_confirm("특정 인원이 있을경우 일정은 비공개 처리됩니다.<br/>일정을 등록하시겠습니까?")');
		} else {
			pop.open('create', $(this), 'Pop_Reg_Schedule', 'loadEl.pop_reg_confirm("일정을 등록하시겠습니까?")');
		}
		
		$("#btnReg").click(scheduleSendNormal);
		$("#btnRegSchedule").click(scheduleSendExecutive);

	}).fail(function(data, textStatus, errorThrown){
		console.log('hasExecutive API 통신 실패')
		pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("네트워크가 응답하지 않습니다.<br />잠시후에 시도해 주세요.")');
		// pop.open('create', $(this), 'Pop_Reg_Schedule', 'loadEl.pop_reg_confirm("일정을 등록하시겠습니까?")');
		// $("#btnReg").click(() => scheduleSend("#btnReg"));
	})


}

/**
 * '날씨 정보 조회' 생성 함수 
 * @param {JSON} data 날씨 정보 조회 데이터
 */
function makeWeatherCard(data, isHistory){
	//var messageWeather = $('<div class="message weather"></div>');
	var messageWeather = $('<div class="message caas-message-color caas-message-font-color weather"></div>');
	
	// wInfo
	var wInfoHtml = '<div class="w-info">';
	    wInfoHtml += 	'<a href="#" onClick="window.open(\''+ data.url +'\', \'width=1024,height=550, resizable=1,scrollbars=1\');"><i class="icon icon-ic_info_24_l_600"></i> 출처</a>'
	    wInfoHtml += 	'<button class="btn btn-trans" data-toggle="collapse" data-target="#collapseW6" aria-expanded="true" aria-controls="collapseW6">'
	    wInfoHtml +=		'<span class="arrow-down"><img src="'+imgBaseUrl+'/assets/arrow-down.png" alt=""></span>'
	    wInfoHtml +=		'<span class="arrow-up"><img src="'+imgBaseUrl+'/assets/arrow-up.png" alt=""></span>'
	    wInfoHtml +=	'</button>'
	    wInfoHtml += '</div>';
	var wInfo = $(wInfoHtml);
	messageWeather.append(wInfo);
	
	var wLocation = $('<div class="w-location"><span></span>' + data.local1 + ' ' + data.local2 + '</div>');
	messageWeather.append(wLocation);
	////////
	
	// wtTemp
	var wtTemp = $('<div class="w-t-temp"></div>');
	messageWeather.append(wtTemp);
	
	var wTempHtml = '<div class="w-temp">';
		wTempHtml +=	'<div class="w-img">'
		wTempHtml +=		'<img src="'+ weatherIcon(data.todaySky,"main")+'" alt="흐림">'
		wTempHtml +=	'</div>'
		wTempHtml +=	'<div class="w-temp-box">'
		wTempHtml +=		'<span class="temperature">' + data.t1h + ' °</span>'
		wTempHtml +=	'</div>'
		wTempHtml +='</div>'
		wTempHtml +='<div class="w-sub-temp">'
		wTempHtml +=	'<div class="w-t-hl">'
		wTempHtml +=		'<span class="high">' + data.tmx +' °</span> / <span class="low">' + data.tmn + ' °</span>'
		wTempHtml +=  	'</div>'
		wTempHtml +=  	'<div class="w-rain">강수확률 : <span>' + data.todayPop + '</span>%</div>'
		wTempHtml +='</div>'
	var wTemp = $(wTempHtml);
	wtTemp.append(wTemp);

	// wtTemp
	var wtWrap = $('<div class="w-t-wrap collapse show" id="collapseW6"></div>');
	messageWeather.append(wtWrap);
	
	if(data.weatherList){
		data.weatherList.forEach(function(item,index){
			
			if(item.fcstTime != 6){
			var  wYtTempHtml = 	'<div class="w-yt-temp">';
				 wYtTempHtml +=		'<div class="w-text">'+ item.fcstTime +'시</div>';
				 wYtTempHtml +=		'<div class="w-t-hl"><img src="'+ weatherIcon(item.sky,"sub")+'" alt=""></div>';
					 wYtTempHtml += 	'<div>'+ item.t3h +'°</div>';
				 wYtTempHtml += '</div>';
				 wYtTemp = $(wYtTempHtml);
				 wtWrap.append(wYtTemp);
			}
		});
	}

            
	return messageWeather;
}


/**
 * 'SMS발송 공통 카드 생성' 함수
 * @param {object} SMS 형 응답 데이터
 */
function makeSmsSendCard(smsSendCard, isHistory){
	
	var smsSendCon = $('<div class="message message-form-sms caas-message-color caas-message-font-color"></div>');
	
	var smsSendWrap = $('<div class="form-sms"></div>');
	smsSendWrap.attr("data-sessionId", smsSendCard.chatSessionId.split("sessions/")[1]);
	smsSendWrap.attr("data-userId", smsSendCard.loginUserId);
	if (smsSendCard.items[0].deptId) {
	    smsSendWrap.attr("data-deptId", smsSendCard.items[0].deptId);
	} else {
	    smsSendWrap.attr("data-empMobile", smsSendCard.items[0].empMobile);
	}
	smsSendCon.append(smsSendWrap);
	
	//sms-content
	var smsSendContent = $('<div class="sms-content"></div>');
	smsSendWrap.append(smsSendContent);
	
	var smsSendTextarea = $('<textarea name="smsMessage" id="smsMessage" rows="6" placeholder="내용을 작성해주세요." style="resize:none;"></textarea>');
	smsSendContent.append(smsSendTextarea);
	
	
	//btn-wrap
	var smsSendBtnWrap = $('<div class="btn-wrap"></div>');
	smsSendWrap.append(smsSendBtnWrap);
	
	var smsSendButton = $('<button type="button" id="smsBtnSend" onClick="sendSms(this);" class="btn btn-primary" disabled>발송</button>');
	smsSendBtnWrap.append(smsSendButton);

	return smsSendCon;
}

/**
* 캐로셀 이미지 클릭 이벤트 비활성화
*/
function disableCarouselImageLink() {
	$(".message.carousel:not([linkDisabled])").each(function(index) {
	$(this).attr("linkDisabled", true);
	
	$(this).find(".carousel-message .img-container img").off("click").css("cursor", "default");
	});
}
	
// 응답 수신 이벤트
chatui.onReceiveResponse = function(chatEvent) {
	console.log("chatui.onReceiveResponse()", chatEvent);
	
// 	캐로셀에서 이미지 클릭 이벤트 비활성화
	setTimeout(disableCarouselImageLink);
}

function activeGptBot(text) {
    var useDiv = text.indexOf("popUp")>-1?"2":"1";
    
    if(useDiv == "1"){
        $('body').append('<div id="caas-chatbot-container"><iframe id="caas-chatbot-chat-iframe" name="caas-chatbot-chat-iframe" src="about:blank" allow="microphone; autoplay" allowusermedia="true" style="position: relative!important;height:100%!important;width: 100%!important;border: none!important;"></iframe></div>');
        if (!document.getElementById("caas-chatbot-chat-iframe").isLoaded) {
          document.getElementById("caas-chatbot-chat-iframe").isLoaded = true;
          openGptBotFrame(text);
        //   setTimeout(function() { sendGptMsg("테스트"); }, 3000);
        }
    } else{
        // console.log("activeGptBot : "+text);
        // var paramForm = document.createElement("form");
        // var url = "https://chatclient-stg.ai.lgstation.com/88a39d64-0e9a-4ea7-ac57-de5783a3e937/chat";
        // window.open("", "chatGptBot", "top=500, left=500, width=500, height=700, toolbar=1, scrollbars=1, resizable=1");
        
        // $(paramForm).attr('action', url);
        // $(paramForm).attr('target', "chatGptBot");
        // $(paramForm).attr('method', 'post');
        // // paramForm.setAttribute('action', url);
        // // paramForm.setAttribute('target', "chatGptBot");
        // // paramForm.setAttribute('method', 'post');
    
        // paramForm.append('<input type="hidden" name="reqText" value='+text+'>');
        // document.body.appendChild(paramForm);
        // paramForm.submit();
    
    }
};

function openGptBotFrame(queryText) {
  var languageCode = "ko";
  var token = "test";
  var userId = chatui.getSetting('userId');

  var url = "https://chatclient-stg.ai.lgstation.com/bf2202b9-e942-4d82-9fb3-9c809d0e8973/chat";

  var form = document.createElement("form");
  form.setAttribute("target", "caas-chatbot-chat-iframe");
  form.setAttribute("method", "POST");
  form.setAttribute("action", url);

  var param = null;

  obj = document.createElement("input");
  obj.setAttribute("type", "hidden");
  obj.setAttribute("name", "languageCode");
    obj.setAttribute("value", languageCode);
    form.appendChild(obj);

  obj = document.createElement("input");
  obj.setAttribute("type", "hidden");
  obj.setAttribute("name", "token");
    obj.setAttribute("value", token);
    form.appendChild(obj);

    if (queryText != "") {
    obj = document.createElement("input");
    obj.setAttribute("type", "hidden");
    obj.setAttribute("name", "queryText");
      obj.setAttribute("value", queryText);
      form.appendChild(obj);
    }

    if (userId) {
    obj = document.createElement("input");
    obj.setAttribute("type", "hidden");
    obj.setAttribute("name", "userId");
      obj.setAttribute("value", userId);
      form.appendChild(obj);

      document.body.appendChild(form);
    }
    
//   document.body.appendChild(form);
  form.submit();

  setTimeout(function() { form.parentNode.removeChild(form); }, 1000);
  
}

function sendGptMsg(text) { 
    // iframe으로 메시지 전송 
    var targetWindow = document.getElementById("caas-chatbot-chat-iframe").contentWindow;
    console.log("targetWindow : "+targetWindow)
    var param = { 
        command: "search", 
        text: text 
    };
    targetWindow.postMessage(param, "*");
}

/////////////////////////////////////////// Message 생성 함수 ///////////////////////////////////////////

/**
 * '대화 처리 API' 함수
 * @param {object} requestParam 텍스트형 응답 데이터
 *  {
	  "query": {  // text와 event 둘 중 하나는 필수
				  "text": "string", // 사용자 대화 문장
				  "event": "string" // 사용자 이벤트명
				},
	  "payload": {JSON}, // chatflow로 전달되는 파라미터 정보 (전달할 파라미터는 key, value 형태로 전달해야 합니다.)
	  "parameters": {JSON}, // Dialogflow event에 전달되는 파라미터 정보 (전달할 파라미터는 key, value 형태로 전달해야 합니다.)
	  "tags": {JSON}, // 로그성 정보 (key, value 형태로 전달해야 합니다.)
	  "requestSentimentYn": "string" //감성분석 사용 여부 (챗봇이 감성분석 사용 설정이 되어 있어야 합니다.)
	}
 * @param {string} sessionId 텍스트형 대화 세션 아이디
 * @param {object} callback
 */
function sendChatApi(requestParam, sessionId_notused, callback) {
   
    chatui.getSetting("languageCode") && (requestParam.query.languageCode = chatui.getSetting("languageCode"));
    chatui.getSetting("userId") && (requestParam.userId = chatui.getSetting("userId"));

    if (chatui.getSetting("userId")) {
        if (!requestParam.tags) {
            requestParam.tags = {};
        }
        requestParam.tags.userId = chatui.getSetting("userId");
    }
    
    var sessionId = chatui.getSessionId();
   
    var reqHeader = {};
    reqHeader["Content-Type"] = "application/json",
    reqHeader.Authorization = "Bearer " + chatui.getSetting("apiToken"),
    sessionId && (reqHeader["X-CHATBOT-SESSION"] = sessionId);
   
    $.ajax({
        type: 'POST'
      , url: chatui.getSetting("chatApiUrl") + "/gateway"
      , headers: reqHeader
      , dataType: 'json'
      , contentType: "application/json"
      , data: JSON.stringify(requestParam)
      , success: function(payload, textStatus, jqXHR) {
            var sessionIdNew = jqXHR.getResponseHeader("X-CHATBOT-SESSION");
            if (sessionIdNew && sessionIdNew != sessionId) {
                chatui.setSessionId(sessionIdNew);
            }

            if (callback) {
                callback(payload);
            }
        }
    });
}

/**
 * '피드백 생성' 함수
 * @param {string} time 텍스트형 응답 데이터
 */
function makeFeedback(requestId) {
	var feedback = null;
    requestId && ((feedback = $("<div class='feedback'><ul><li><button class='btn btn-trans positive' aria-label='positive'><i class='icon icon-lg-face-positive' aria-hidden='true'></i></button></li><li><button class='btn btn-trans negative' aria-label='negative'><i class='icon icon-lg-face-negative' aria-hidden='true'></i></button></li></ul></div>")).data("id", requestId),
    feedback.find("button.positive").click(function() {
    	sendFeedback(requestId, "Y", 5, null)
    }),
    feedback.find("button.negative").click(function() {
        var e, t;
        e = requestId,
        t = 1,
        $(".popup.feedback").data("id", e),
        $(".popup.feedback").data("feedbackScore", t),
        0 < $(".popup.feedback textarea").val().length ? $(".popup.feedback button.btn-send").attr("disabled", !1) : $(".popup.feedback button.btn-send").attr("disabled", !0),
        (t = $(".popup.feedback")).fadeIn(350),
        t.find("textarea").focus()
    }));
    return feedback
}

/**
 * '피드백 전송' 함수
 * @param {String} requestId 텍스트형 응답 데이터
 * @param {String} singleFeedbackYn 텍스트형 응답 데이터
 * @param {String} score 텍스트형 응답 데이터
 * @param {String} content 텍스트형 응답 데이터
 */
function sendFeedback(requestId, singleFeedbackYn, score, content) {
    var requestParam = {
        singleFeedbackYn: singleFeedbackYn,
        feedbackScore: score,
        feedbackContent: content
    };
    
    requestId && (requestParam.requestId = requestId),
    chatui.getSetting("userId") && (requestParam.userId = chatui.getSetting("userId"));
    
    var reqHeader = {};
//    r && (reqHeader["X-CHATBOT-SESSION"] = r);
    reqHeader["Content-Type"] = "application/json",
    reqHeader.Authorization = "Bearer " + chatui.getSetting("apiToken");
    
	$.ajax({
	    type: 'POST'
	  , url: chatui.getSetting("chatApiUrl") + "/feedback"
	  , headers: reqHeader
	  , dataType: 'json'
	  , contentType: "application/json"
	  , data: JSON.stringify(requestParam)
//	  , cache: false
	  , success: function(payload) {
			if( "Y" == singleFeedbackYn ){
				$(".chat-message > .feedback").filter(function() {
					return $(this).data("id") == requestId
				}).find("button.btn.btn-trans").attr("disabled", !0).addClass("inactive");
			} else {
				var popupChatFeedback = $(".popup.chat-feedback");
				popupChatFeedback.find("input[name='rating']").prop("checked", !1);
				popupChatFeedback.find("textarea").val("");
				popupChatFeedback.fadeOut(350);
			}
	    }
	});
}

/**
 * '퀵버튼 태그 생성' 함수
 * @param {object} quickReplies 빠른 답변 데이터
 */
function makeQuickReplies(quickReplies) {
    var answerCon = $('<div class="quick-list"></div>');

    var answer = $("<slick class='quick-carousel'/>");
    answerCon.append(answer);

    quickReplies.forEach(function(data, idx) {
        
        if(data.value == "ChatGPT Mode"){
            var reply = $("<span class='btn btn-fallback caas-chat-quickreply-item-back-color caas-chat-quickreply-item-font-color caas-chat-quickreply-item-border-color'/>");
            reply.text(data.label).attr("data-label", data.label).attr("data-type","").attr("onclick","activeGptBot(``);");
        } else {
            var reply = $("<span class='btn btn-default caas-chat-quickreply-item-back-color caas-chat-quickreply-item-font-color caas-chat-quickreply-item-border-color'/>");
        	reply.text(data.label).attr("data-label", data.label).attr("data-type", "quick").attr("data-value", data.value);

        }
        
        answer.append(reply);
    });
    return answerCon;
}


/**
 * '알림설정' 함수
 * @param {object} data
 */
function setNotification(data){
	var key = chatui.getSetting("userId") ? chatui.getSetting("userId").replace(/=/gi, "") : "";
	//if(data.hasOwnProperty('chatSessionId')) setCookie(key + "_chatSessionId", data.weather, 9999);
	if(data.hasOwnProperty('weather')) setCookie(key + "_weather", data.weather, 9999);
	if(data.hasOwnProperty('anniversary')) setCookie(key + "_anniversary", data.anniversary, 9999);
	if(data.hasOwnProperty('schedule')) setCookie(key + "_schedule", data.schedule, 9999);
	if(data.hasOwnProperty('message')) setCookie(key + "_message", data.message, 9999);
	if(data.hasOwnProperty('planner')) setCookie(key + "_planner", data.planner, 9999);
	if(data.hasOwnProperty('birthInfo')) setCookie(key + "_birthInfo", data.birthInfo, 9999);
	if(data.hasOwnProperty('lastAccessDate')) setCookie(key + "_lastAccessDate", data.lastAccessDate, 9999);
}

/**
 * '알림설정 저장' 함수
 * @param {object} data
 */
function saveNotification(){
	
	var weather = $("#alim_weather").is(":checked") ? "Y" : "N";
	var anniversary = $("#alim_celebration").is(":checked") ? "Y" : "N";
	var schedule = $("#alim_schedule").is(":checked") ? "Y" : "N";
	var message = $("#alim_notice").is(":checked") ? "Y" : "N";
	var planner = $("#push_planner").is(":checked") ? "Y" : "N";
	var birthInfo = $("#push_celebration").is(":checked") ? "Y" : "N";
	
	var data = {
			"weather": weather,
			"anniversary": anniversary,
			"schedule": schedule,
			"message": message,
			"planner": planner,
			"birthInfo": birthInfo
		}

    var requestParam = {
	    query: {
			"event": saveNotificationEvent
		},
		payload: {
			"userId"  : chatui.getSetting("userId"),
			"weather" : weather,
			"anniversary" : anniversary,
			"schedule" : schedule,
			"message" : message,
			"planner" : planner,
			"birthInfo" : birthInfo,
			
		}
    };
	
    sendChatApi(requestParam, getCookie((chatui.getSetting("userId") ? chatui.getSetting("userId") : "") + "_chatSessionId"), function(payload){
    	setNotification(data);
    	pop.close($("#Pop_Notification .btn-secondary"));
    });
}

chatui.createCustomResponseMessage = function(response, isHistory) {
    
    try {
        
        var customPayload = JSON.parse(response.response);
        
        if (customPayload.template.outputs instanceof Array && customPayload.template.outputs.length > 0) {
            var messages = customPayload.template.outputs;
            
            var messageCard = null;
            messages.forEach(function(message){
            
            	if (message.type == 'text') { // 메시지타입_기본형
            		messageCard = makeText(message.data.text);
    			} else if (message.type == 'list' || message.type == 'teamList' ) { // 메시지타입_리스트형 
    				var titleBoldYn = 'N';
    				if (message.data.hasOwnProperty('bold')) {
    					titleBoldYn = message.data.bold;
    				}
    				messageCard = makeListCard(message.data.items, titleBoldYn ,message.type);
    			} else if (message.type == 'dict') { // 메시지타입_리스트형_용어갬색
    				messageCard = makeListDictCard(message.data);
    			} else if (message.type == 'system') { // 메시지타입_시스템 업무 담당자 검색
    				messageCard = makeSystemCard(message.data.items);
    			} else if(message.type == 'employee') { // 메시지타입_임직원검색(단일)
    				messageCard = makeEmployeeCard(message.data.items[0]);
    			} else if (message.type == 'schedule') { // 메시지타입_일정조회_공통
    				if (message.data.hasOwnProperty('items')) {
    					messageCard = makeScheduleCard(message.data);
    				}
    				
    			} else if (message.type == 'meetingRoom') { // 메시지타입_회의실취소
    				messageCard = makeMeetingRoomCard(message.data);							
    			} else if(message.type == 'scheduleReg') { // 메시지타입_일정등록
    				messageCard = makeScheduleRegCard(message.data);
    			} else if(message.type == 'weather') { // 메시지타입_날짜조회
    				if (message.data.hasOwnProperty('weatherList')) {
    					messageCard = makeWeatherCard(message.data);
    				}
    				
    			}else if(message.type == 'employeeList') { // 메시지타입_임직원검색(동명이인)
    				messageCard = makeEmployeeListCard(message.data);
    			}else if(message.type == 'anniversary'){ // 메시지타입_기념일
    				if (message.data.items instanceof Array && message.data.items.length > 0) {
    					messageCard  = makeAnniversaryCard(message.data.items);
    		        }
    				
    			} else if(message.type == 'push') { // 알림설정
    				var weatherCard = setNotification(message.data);
    			}else if(message.type == 'sms') { // sms발송
    				messageCard  = makeSmsSendCard(message.data);
    			}else if(message.type == 'email') { // 메일 발송
    			    var sendMail = connectEmail(message.data);
    			} else if(message.type == 'gptBotMode') {
                  messageCard = makeGptBotModeCard(message.data);
                }
            });
        }

        // quick replies
        if (customPayload.template.quickReplies instanceof Array && customPayload.template.quickReplies.length > 0) {
            messageCard = makeQuickReplies(customPayload.template.quickReplies);
        }
        
    } catch (e) {
        console.error(e);
    }

    return messageCard;
}

/**
 * '날씨카드 > 하늘 상태에 따른 닐씨 아이콘 세팅' 함수
 * @param {string} sky 
 */
function weatherIcon(sky, type){
	var weatherIcon = null;
	
	if(type == "main"){
	
		switch(sky){
			case "1":
			{	
				weatherIcon = imgBaseUrl + '/assets/weather_sun2.gif';
				break;
			}
			case "2":
			{
				weatherIcon = imgBaseUrl + '/assets/weather_suncloud2.gif';
				break;
			}
			case "3":
			{
				weatherIcon = imgBaseUrl + '/assets/weather_cloud2.gif';
				break;
			}
			case "4":
			{
				weatherIcon = imgBaseUrl + '/assets/weather_rain.gif';
				break;
			}
			case "5":
			{
				weatherIcon = imgBaseUrl + '/assets/weather_snow.gif';
			}
			default :
				break;
		}
	}else{
		switch(sky){
		case "1":
		{	
			weatherIcon = imgBaseUrl + '/assets/weather_s_sun.png';
			break;
		}
		case "2":
		{
			weatherIcon = imgBaseUrl + '/assets/weather_s_suncloud.png';
			break;
		}
		case "3":
		{
			weatherIcon = imgBaseUrl + '/assets/weather_s_cloud.png';
			break;
		}
		case "4":
		{
			weatherIcon = imgBaseUrl + '/assets/weather_s_rain.png';
			break;
		}
		case "5":
		{
			weatherIcon = imgBaseUrl + '/assets/weather_s_snow.png';
		}
		default :
			break;
	}
		
	}
	
	return weatherIcon; 
}

function sendSms(btn){
    pop.open('create', $(this), 'Pop_Reg_Sms', 'loadEl.pop_reg_sms("문자를 발송하시겠습니까?")');
    
    $("#btnRegSms").click(function(){
        
       
    	var sessionId = $(btn).closest(".form-sms").attr("data-sessionId");
    	var userId = $(btn).closest(".form-sms").attr("data-userId");
        var deptId = $(btn).closest(".form-sms").attr("data-deptId");
    	var empMobile = $(btn).closest(".form-sms").attr("data-empMobile");
        var message = $(btn).closest(".form-sms").find("#smsMessage").val();
    	 
    	var payload = 
		{
		    "deptId" : deptId,
			"receivers" : empMobile,
			"userId" : userId,
			"message": message
		};
    	    
     	
    
        chatui.sendEventMessage('smsSendEvent', payload );
// 		$(btn).closest(".form-sms").find("#smsMessage").val("");
// 		pop.open('create', $(this), 'Pop_Alert', 'loadEl.pop_alert("SMS 발송을 완료하였습니다.")');
		$(btn).closest(".form-sms").find("#smsMessage").attr("disabled", true);
		$(btn).closest(".form-sms").find(".btn-wrap").css("display", "none");
		pop.close($("#btnRegSms"));
    		
 
    });
}

/********************************************************** element *************************************************************************************/
var loadEl = {
	    'pop_notification' : function() {
			var key = chatui.getSetting("userId") ? chatui.getSetting("userId").replace(/=/gi, "") : "";
	        var html = '<div class="pop-wrapper pop-fullscreen pop-notification">' +
	                        '<div class="pop-header">' +
	                            '<h2>알림설정</h2>' +
	                        '</div>' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">'+
	                                '<!-- Daily 및 알림 설정 -->' +
	                                '<section class="section section-notification">' +
	                                    '<div class="section-header">' +
	                                        '<h3>Daily 및 알림 설정</h3>' +
	                                        '<div class="section-header-desc">' +
	                                            '매일 받아보고 싶은 정보를 설정하세요.<br>' +
	                                            '비활성화시 해당항목의 알림은 보여주지 않습니다.' +
	                                        '</div>' +
	                                    '</div>' +
	                                    '<div class="section-body">' +
	                                        '<dl class="notiList-item notiList-all">' +
	                                            '<dt>전체</dt>' +
	                                            '<dd class="switch">' +
	                                                '<label class="ui-switch">' +
	                                                    '<input type="checkbox" name="alim_all" id="alim_all" value="" class="check-alim-all">' +
	                                                    '<span></span>' +
	                                                '</label>' +
	                                            '</dd>' +
	                                        '</dl>' +
	                                        '<ul class="notiList">' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                    '<dt>오늘의 날씨</dt>' +
	                                                    '<dd class="desc">' +
	                                                        '매일 챗봇 최초 접속시에 G-Portal에 설정한 근무지 기준의 날씨를 알려줍니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="alim_weather" id="alim_weather" value="" class="check-alim" ' + (getCookie(key + "_weather") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                    '<dt>축하합니다</dt>' +
	                                                    '<dd class="desc">' +
	                                                        '매일 챗봇 최초 접속시에 팀원의 생일 알림을 보내줍니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="alim_celebration" id="alim_celebration" value="" class="check-alim" ' + (getCookie(key + "_anniversary") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                    '<dt>오늘 일정 조회</dt>' +
	                                                    '<dd class="desc">' +
	                                                        '매일 챗봇 최초 접속시에 오늘 나의 전체 일정 리스트를 보여줍니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="alim_schedule" id="alim_schedule" value="" class="check-alim" ' + (getCookie(key + "_schedule") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                ' <dt>미확인 메시지 알림</dt>' +
	                                                    '<dd class="desc">' +
	                                                        '놓쳤던 공지를 알려줍니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="alim_notice" id="alim_notice" value="" class="check-alim" ' + (getCookie(key + "_message") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                        '</ul>' +
	                                    '</div>' +
	                                '</section>' +
	                                '<!--// Daily 및 알림 설정 -->' +

	                                '<!-- Push 알림 설정 -->' +
	                                '<section class="section section-notification">' +
	                                    '<div class="section-header">' +
	                                        '<h3>Push 알림 설정</h3>' +
	                                        '<div class="section-header-desc">' +
	                                            '실시간 알림 서비스를 제공합니다.' +
	                                        '</div>' +
	                                    '</div>' +
	                                    '<div class="section-body">' +
	                                        '<dl class="notiList-item notiList-all">' +
	                                            '<dt>전체</dt>' +
	                                            '<dd class="switch">' +
	                                                '<label class="ui-switch">' +
	                                                    '<input type="checkbox" name="push_all" id="push_all" value="" class="check-push-all">' +
	                                                    '<span></span>' +
	                                                '</label>' +
	                                            '</dd>' +
	                                        '</dl>' +
	                                        '<ul class="notiList">' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                    '<dt>Planner</dt>' +
	                                                    '<dd class="desc">' +
	                                                        'Planner에 등록된 일정 시작 15분 전에 챗봇이 일정 알림을 보내줍니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="push_planner" id="push_planner" value="" class="check-push" ' + (getCookie(key + "_planner") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                            '<li>' +
	                                                '<dl class="notiList-item">' +
	                                                    '<dt>생일 정보 활용 동의</dt>' +
	                                                    '<dd class="desc">' +
	                                                        '생일 정보 제공에 동의합니다. <br>비활성화할 경우 팀원이 나의 생일 알림을 받을 수 없습니다.' +
	                                                    '</dd>' +
	                                                    '<dd class="switch">' +
	                                                        '<label class="ui-switch">' +
	                                                            '<input type="checkbox" name="push_celebration" id="push_celebration" value="" class="check-push" ' + (getCookie(key + "_birthInfo") == "Y" ? "checked" : "") + '>' +
	                                                            '<span></span>' +
	                                                        '</label>' +
	                                                    '</dd>' +
	                                                '</dl>' +
	                                            '</li>' +
	                                        '</ul>' +
	                                    '</div>' +
	                                '</section>' +
	                                '<!--// Push 알림 설정 -->' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="saveNotification();" class="btn btn-primary">저장</button>' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                            '</div>' +
	                        '</div>' +
	                        '<button type="button" class="btn btn-pop-close">' +
	                            '<i class="icon icon-lg-close icon-only"><span>팝업닫기</span></i>' +
	                        '</button>' +
	                    '</div>'

	        return html;
	    },
	    'pop_reason': function() {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-header">' +
	                                        '불참사유를 입력해주세요.' +
	                                    '</div>' +
	                                    '<div class="section-body">' +
	                                        '<textarea name="reason" id="reason" class="ui-textarea" placeholder="불참사유를 입력해주세요."></textarea>' +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                                '<button type="button" id="reasonSave" class="btn btn-primary" disabled="disabled">저장</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },
	    'pop_del_confirm': function(msg) {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-message">' +
	                                    	msg +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" id="btnDelete" class="btn btn-primary">삭제</button>' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },'pop_reg_confirm': function(msg) {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-message">' +
	                                    	msg +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                                '<button type="button" id="btnReg" class="btn btn-primary">등록</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },'pop_reg_sms': function(msg) {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-message">' +
	                                    	msg +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                                '<button type="button" id="btnRegSms" class="btn btn-primary">발송</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },
	    'pop_alert': function(msg) {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-message">' +
	                                    	msg +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-primary">확인</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },
	    'pop_dictionary': function(dictNm, dictNmEn, dictNmCh, dictAbbr, dictDesc, dictDescEn, dictDescCh, category, registNm, registDate){

	        var html =  '<div class="pop-wrapper pop-fullscreen pop-dictionary">' +
	                        '<div class="pop-header" style="text-align:center;margin-top:20px;">' +
	                            '<h3>' + dictNm + '</h3>' +
	                        '</div>' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<!-- 임자박스 테이블 -->' +
	                                '<div class="pop-dictionary-wrap">' +
	                                    '<table class="pop-dictionary-table">' +
	                                        '<caption>' + dictNm + '표</caption>' +
	                                        '<colgroup>' +
	                                            '<col width="72px">' +
	                                            '<col width="auto">' +
	                                            '<col width="72px">' +
	                                            '<col width="auto">' +
	                                        '</colgroup>' +
	                                        '<tbody>' +
	                                            '<tr>' +
	                                                '<th scope="row">영어명</th>' +
	                                                '<td colspan="3">' + dictNmEn + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">중문명</th>' +
	                                                '<td colspan="3">' + dictNmCh + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">약어</th>' +
	                                                '<td colspan="3">' + dictAbbr + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">내용</th>' +
	                                                '<td colspan="3">' + dictDesc + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">내용<br>(영문)</th>' +
	                                                '<td colspan="3">' + dictDescEn + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">내용<br>(중문)</th>' +
	                                                '<td colspan="3">' + dictDescCh + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">카테고리</th>' +
	                                                '<td colspan="3">' + category + '</td>' +
	                                            '</tr>' +
	                                            '<tr>' +
	                                                '<th scope="row">등록자</th>' +
	                                                '<td>' + registNm + '</td>' +
	                                                '<th scope="row">등록일</th>' +
	                                                '<td>' + registDate + '</td>' +
	                                            '</tr>' +
	                                        '</tbody>' +
	                                    '</table>' +
	                                '</div>' +
	                            '</div>' +
	                        '</div>' +
	                        '<button type="button" class="btn btn-pop-close">' +
	                            '<i class="icon icon-lg-close icon-only"><span>팝업닫기</span></i>' +
	                        '</button>' +
	                    '</div>'


	        return html;
	    }, 'pop_blank' : function (){
			var popBlankHtml = '<div id="popBlank" ></div>'
			return popBlankHtml;
		}, 'pop_reg_schedule_confirm': function(msg) {
	        var html = '<div class="pop-wrapper pop-round pop-noHead pop-reason">' +
	                        '<div class="pop-container">' +
	                            '<div class="pop-content">' +
	                                '<section class="section">' +
	                                    '<div class="section-message">' +
	                                    	msg +
	                                    '</div>' +
	                                '</section>' +
	                            '</div>' +
	                            '<div class="pop-footer">' +
	                                '<button type="button" onclick="pop.close(this);" class="btn btn-secondary">취소</button>' +
	                                '<button type="button" id="btnRegSchedule" class="btn btn-primary">등록</button>' +
	                            '</div>' +
	                        '</div>' +
	                    '</div>';

	        return html;
	    },
	}

    // Message 생성시 Carousel이 있는 경우 slick-slide에 inline style제거
    jQuery(document).ready(function(){
        var obsTarget = document.querySelector(".chat-discussion");
        var observer = new MutationObserver(function(mutations){
            mutations.forEach(function(mutation){
                var html = mutation.addedNodes[0];

                if (mutation.addedNodes.length > 0 && $(html).find(".slick_carousel").length > 0) {
                    
                    setTimeout(function() {
                        $(html).find(".slick-slide").removeAttr("style");
                    },150);
                }
                
                if ($(html).find(".chosen-select").length > 0) {
                    setTimeout(function(){
                        $(html).find(".chosen-select").each(function(index, element) {
                            $(this).next(".chosen-container").remove();
                            var $select = $(this).removeClass(".chosen-select").removeAttr("style").clone();
                            
                            $(this).before('<span class="ui-select"></span>');
                            $(this).prev(".ui-select").append($select);
                            $(this).remove();
                        });
                    },50);                    
                }
            })
        });
        var obsConfig = {
            childList: true
        }
        observer.observe(obsTarget, obsConfig);
        
        $(window).bind("load resize scroll", function() {
            setTimeout(function(){
                $(".slick_carousel").find(".slick-slide").removeAttr("style");
            }, 150);
        });
    });
    
/********************************************************** controller *************************************************************************************/
function checkMsgForm() {
    if ($.trim($(".chat-input-msg").val()) == "")  {
        alert("메세지를 입력해 주세요!");
        $(".chat-input-msg").focus();
        return false;
    }
}

// Messenger 미 설치일 경우 콜백함수 처리 js파일
/********************************************************** protocolcheck.js *************************************************************************************/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.protocolCheck = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	function _registerEvent(target, eventType, cb) {
	    if (target.addEventListener) {
	        target.addEventListener(eventType, cb);
	        return {
	            remove: function () {
	                target.removeEventListener(eventType, cb);
	            }
	        };
	    } else {
	        target.attachEvent(eventType, cb);
	        return {
	            remove: function () {
	                target.detachEvent(eventType, cb);
	            }
	        };
	    }
	}

	function _createHiddenIframe(target, uri) {
	    var iframe = document.createElement("iframe");
	    iframe.src = uri;
	    iframe.id = "hiddenIframe";
	    iframe.style.display = "none";
	    target.appendChild(iframe);

	    return iframe;
	}

	function openUriWithHiddenFrame(uri, failCb, successCb) {

	    var timeout = setTimeout(function () {
	        failCb();
	        handler.remove();
	    }, 1000);

	    var iframe = document.querySelector("#hiddenIframe");
	    if (!iframe) {
	        iframe = _createHiddenIframe(document.body, "about:blank");
	    }

	    var handler = _registerEvent(window, "blur", onBlur);

	    function onBlur() {
	        clearTimeout(timeout);
	        handler.remove();
	        successCb();
	    }

	    iframe.contentWindow.location.href = uri;
	}

	function openUriWithTimeoutHack(uri, failCb, successCb) {
	    
	    var timeout = setTimeout(function () {
	        failCb();
	        handler.remove();
	    }, 1000);

	    //handle page running in an iframe (blur must be registered with top level window)
	    var target = window;
	    while (target != target.parent) {
	        target = target.parent;
	    }

	    var handler = _registerEvent(target, "blur", onBlur);

	    function onBlur() {
	        clearTimeout(timeout);
	        handler.remove();
	        successCb();
	    }

	    window.location = uri;
	}

	function openUriUsingFirefox(uri, failCb, successCb) {
	    var iframe = document.querySelector("#hiddenIframe");

	    if (!iframe) {
	        iframe = _createHiddenIframe(document.body, "about:blank");
	    }

	    try {
	        iframe.contentWindow.location.href = uri;
	        successCb();
	    } catch (e) {
	        if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
	            failCb();
	        }
	    }
	}

	function openUriUsingIEInOlderWindows(uri, failCb, successCb) {
	    if (getInternetExplorerVersion() === 10) {
	        openUriUsingIE10InWindows7(uri, failCb, successCb);
	    } else if (getInternetExplorerVersion() === 9 || getInternetExplorerVersion() === 11) {
	        openUriWithHiddenFrame(uri, failCb, successCb);
	    } else {
	        openUriInNewWindowHack(uri, failCb, successCb);
	    }
	}

	function openUriUsingIE10InWindows7(uri, failCb, successCb) {
	    var timeout = setTimeout(failCb, 1000);
	    window.addEventListener("blur", function () {
	        clearTimeout(timeout);
	        successCb();
	    });

	    var iframe = document.querySelector("#hiddenIframe");
	    if (!iframe) {
	        iframe = _createHiddenIframe(document.body, "about:blank");
	    }
	    try {
	        iframe.contentWindow.location.href = uri;
	    } catch (e) {
	        failCb();
	        clearTimeout(timeout);
	    }
	}

	function openUriInNewWindowHack(uri, failCb, successCb) {
	    var myWindow = window.open('', '', 'width=0,height=0');

	    myWindow.document.write("<iframe src='" + uri + "'></iframe>");

	    setTimeout(function () {
	        try {
	            myWindow.location.href;
	            myWindow.setTimeout("window.close()", 1000);
	            successCb();
	        } catch (e) {
	            myWindow.close();
	            failCb();
	        }
	    }, 1000);
	}

	function openUriWithMsLaunchUri(uri, failCb, successCb) {
	    navigator.msLaunchUri(uri,
	        successCb,
	        failCb
	    );
	}

	function checkBrowser() {
	    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	    var ua = navigator.userAgent.toLowerCase();
	    return {
	        isOpera   : isOpera,
	        isFirefox : typeof InstallTrigger !== 'undefined',
	        isSafari  : (~ua.indexOf('safari') && !~ua.indexOf('chrome')) || Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
	        isIOS     : /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
	        isChrome  : !!window.chrome && !isOpera,
	        isIE      : /*@cc_on!@*/false || !!document.documentMode // At least IE6
	    }
	}

	function getInternetExplorerVersion() {
	    var rv = -1;
	    if (navigator.appName === "Microsoft Internet Explorer") {
	        var ua = navigator.userAgent;
	        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null)
	            rv = parseFloat(RegExp.$1);
	    }
	    else if (navigator.appName === "Netscape") {
	        var ua = navigator.userAgent;
	        var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null) {
	            rv = parseFloat(RegExp.$1);
	        }
	    }
	    return rv;
	}

	module.exports = function(uri, failCb, successCb, unsupportedCb) {
	    function failCallback() {
	        failCb && failCb();
	    }

	    function successCallback() {
	        successCb && successCb();
	    }

	    if (navigator.msLaunchUri) { //for IE and Edge in Win 8 and Win 10
	        openUriWithMsLaunchUri(uri, failCb, successCb);
	    } else {
	        var browser = checkBrowser();

	        if (browser.isFirefox) {
	            openUriUsingFirefox(uri, failCallback, successCallback);
	        } else if (browser.isChrome || browser.isIOS) {
	            openUriWithTimeoutHack(uri, failCallback, successCallback);
	        } else if (browser.isIE) {
	            openUriUsingIEInOlderWindows(uri, failCallback, successCallback);
	        } else if (browser.isSafari) {
	            openUriWithHiddenFrame(uri, failCallback, successCallback);
	        } else {
	            unsupportedCb();
	            //not supported, implement please
	        }
	    }
	}

	},{}]},{},[1])(1)
	});

////////// custom-protocol-check.min.js
!function(e,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("customProtocolCheck",[],n):"object"==typeof exports?exports.customProtocolCheck=n():e.customProtocolCheck=n()}(window,(function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){e.exports=t(1)},function(e,n){var t,o={getUserAgent:function(){return window.navigator.userAgent},userAgentContains:function(e){return e=e.toLowerCase(),this.getUserAgent().toLowerCase().indexOf(e)>-1},isOSX:function(){return this.userAgentContains("Macintosh")},isFirefox:function(){return this.userAgentContains("firefox")},isInternetExplorer:function(){return this.userAgentContains("trident")},isIE:function(){var e=this.getUserAgent().toLowerCase();return e.indexOf("msie")>0||e.indexOf("trident/")>0},isEdge:function(){return this.getUserAgent().toLowerCase().indexOf("edge")>0},isChrome:function(){var e=window.chrome,n=window.navigator,t=n.vendor,o=void 0!==window.opr,r=n.userAgent.indexOf("Edge")>-1,i=n.userAgent.match("CriOS");return null!=e&&"Google Inc."===t&&!1===o&&!1===r||i},isOpera:function(){return this.userAgentContains(" OPR/")}},r=function(e,n,t){return e.addEventListener?(e.addEventListener(n,t),{remove:function(){e.removeEventListener(n,t)}}):(e.attachEvent(n,t),{remove:function(){e.detachEvent(n,t)}})},i=function(e,n){var t=document.createElement("iframe");return t.src=n,t.id="hiddenIframe",t.style.display="none",e.appendChild(t),t},u=function(e,n,o){var u=setTimeout((function(){n(),a.remove()}),t),c=document.querySelector("#hiddenIframe");c||(c=i(document.body,"about:blank")),onBlur=function(){clearTimeout(u),a.remove(),o()};var a=r(window,"blur",onBlur);c.contentWindow.location.href=e},c=function(e,n,o){for(var i=setTimeout((function(){n(),c.remove()}),t),u=window;u.parent&&u!=u.parent;)u=u.parent;onBlur=function(){clearTimeout(i),c.remove(),o()};var c=r(u,"blur",onBlur);window.location=e},a=function(e,n,t){var o=document.querySelector("#hiddenIframe");o||(o=i(document.body,"about:blank"));try{o.contentWindow.location.href=e,t()}catch(e){"NS_ERROR_UNKNOWN_PROTOCOL"==e.name&&n()}},f=function(e,n,t){navigator.msLaunchUri(e,t,n)},s=function(){var e,n=window.navigator.userAgent,t=n.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];return/trident/i.test(t[1])?(e=/\brv[ :]+(\d+)/g.exec(n)||[],parseFloat(e[1])||""):"Chrome"===t[1]&&null!=(e=n.match(/\b(OPR|Edge)\/(\d+)/))?parseFloat(e[2]):(t=t[2]?[t[1],t[2]]:[window.navigator.appName,window.navigator.appVersion,"-?"],null!=(e=n.match(/version\/(\d+)/i))&&t.splice(1,1,e[1]),parseFloat(t[1]))};e.exports=function(e,n,i){var d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:2e3,l=arguments.length>4?arguments[4]:void 0,m=function(){n&&n()},v=function(){i&&i()},p=function(){l&&l()},g=function(){o.isFirefox()?s()>=64?u(e,m,v):a(e,m,v):o.isChrome()?c(e,m,v):o.isOSX()?u(e,m,v):p()};if(d&&(t=d),o.isEdge()||o.isIE())f(e,n,i);else if(document.hasFocus())g();else var h=r(window,"focus",(function(){h.remove(),g()}))}}])}));




// ============================================================
// G-Mobile(WMO) 챗봇 연동 설정
// ============================================================
$(document).ready(function() {
    /**
     * G-Mobile 챗봇 초기 설정
     */
    if (chatui.getSetting("isWmo")) {
        // webmo.bundle.js 로딩 (webmo.bundle.js에서 $.ajax를 변경하기 때문에 원본 백업하고 webmo.bundle.js 로딩 후 복원한다.)
        $.ajaxOrigin = $.ajax;
        $.getScript("https://g.lgchem.com/cdn/js/webmo.bundle.js", function(data, textStatus,jqxhr) {
            // webmo.bundle.js에서 변경한 $.ajax 복원
            $.ajax = $.ajaxOrigin;

            // window.open()을 _emsWebUtil.openWebDialogSimple()으로 변경
            window.open_org = window.open;
            window.open = function(url, windowName, windowFeatures) {
                if (_emsWebUtil) {
                    // 리턴받을게 없는 웹창 '상단 no Title' 띄우기
                    _emsWebUtil.openWebDialogSimpleNoTitle(url);
                    return null;
                } else {
                    return window.open_org(url, windowName, windowFeatures);
                }
            }
        });

        // device APIs are available
        function onDeviceReady() {
            // 뒤로가기 버튼 이벤트 처리
            $(document).unbind("backbutton");
            $(document).bind("backbutton", function() {
                // 현재창 닫기 (Web view 닫기)
                _emsUIAction.closeMultiWebView();
            });
        }

        // Wait for device API libraries to load
        document.addEventListener("deviceready", onDeviceReady, true);
    }
});




