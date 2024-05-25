var selectedCategory = '';
var answerFiles = new DataTransfer();
var fileNames = [];
var answerText = '';
var answerUrl = '';
var questionText = '';
var addedFilesName = '';
var targetChatbotId = '3ace0979-8ff0-49f3-814b-84c500f5fbef';
 
var chargeValue = "yes";
var noChargeValue = "useful";
var etcText = '';
var statusSelectTarget = 0;
var selectdStatusValue = "all";

var requesetResultList = [];
var iconPopupClose = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
 + '<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
 + '</svg>';
 
 var imgUrl = "https://chatclient-stg.ai.lgcns.com/singlex-ai-chatbot-contents-stg/459bac85-f58f-48eb-9c75-c6f17b73ac59/images/";
 
function timeFormat(e) {
  let now = (e ? moment(e) : moment()).format("a h:mm");
  now = now.toString();
  if(now.startsWith('am')) {
    now = now.replace('am', convert(eduLang.t_am));
  }
  if(now.startsWith('pm')){
    now = now.replace('pm', convert(eduLang.t_pm));
  }
  return now;
}

function answerReset() {
  selectedCategory = '';
  answerFiles = new DataTransfer();
  fileNames = [];
  answerText = '';
  answerUrl = '';
  questionText = '';
  addedFilesName = '';

  $('#answer-contents').val('');
  $('#answer-url').val('');

  $("input[name='charge-select']").prop('checked', false);
  //$('#yes').prop('checked', true);
  $('input[name="charge-no"]').prop('checked', false);
  $('.etc-text').val('');
  $('.not-charge').removeClass('show');
}

function openAddNewAnswerPopup() {
    $('.plugin-dim').css('display', 'block');
    $('#addNewAnswer').css('display', 'block');
  
    setTimeout(function() {
      $('.plugin-dim').addClass('show');
      $('#addNewAnswer').addClass('show');
    }, 100)
}

function closePopup() {
  $('.plugin-dim').removeClass('show');
  $('.plugins').removeClass('show');

  setTimeout(function() {
    $('.plugin-dim').css('display', 'none');
    $('.plugins').css('display', 'none');
  }, 100)
}

function showFileLimitOverDialog(fileName) {
  $('.plugin-select-dim').css('display', 'block');
  $('.dialog h2').text(' ');
  $('.dialog p').text(fileName + '의 용량이 3M를 초과합니다.');
  $('.dialog .cancel').css('display', 'none');

  setTimeout(function() {
    $('.plugin-select-dim').addClass('show');
    $('.dialog').addClass('show');
  }, 100);
}

function appendQueryText(message) {
  var chatMessage = '<div class="chat-message right">'
  +'<div class="message">' + message + '</div>';
  +'<span class="message-date">' + timeFormat() +'</span>'
  +'</div>';
  
  $('#divScroll').append(chatMessage);
}
var loading = false;
function sendAnswer() {
  loading = true;
  $('#btn-answer').addClass('btn-disabled');
  for(let fileName of fileNames) {
    addedFilesName += fileName + '<br />';
  }
  var answer = '['+convert(eduLang.ans_cont)+']<br />'
  + answerText + '<br /><br />'
  + (answerUrl ? '['+convert(eduLang.ans_url)+']<br />' + answerUrl + '<br /><br />' : '')
  +( addedFilesName ? '['+convert(eduLang.ans_file)+']<br />' + addedFilesName : '');

  
  appendQueryText(answer); 
  closePopup();
  chatui.sendEventMessage('new_answer_request', {"languageCode": languageCode, "text": ""});
}

function showCheckPersonCharge() {
    $('.plugin-dim').css('display', 'block');
    $('#checkPerson').css('display', 'block');
  
    setTimeout(function() {
      $('.plugin-dim').addClass('show');
      $('#checkPerson').addClass('show');
    }, 100)
}

function showConfirmDialog(message) {
  $('.confirm-dialog').html(message);
  $('.confirm-dialog').css('display', 'block');

  setTimeout(function() {
    $('.confirm-dialog').addClass('show');
  }, 100)
            
  setTimeout(function() {
      $('.confirm-dialog').removeClass('show');

      setTimeout(function() {
        $('.confirm-dialog').css('display', 'none');
      }, 100);

  }, 3000);
}

function sendCheckCharge() {
  closePopup();
  console.log("sendCheckCharget");
  var chargeValueSet = $("input[name='charge-select']:checked").val();
  console.log("chargeValueSet"+chargeValueSet);
  var reason = $('input[name="charge-no"]:checked').val();
  console.log("reason"+reason);
  var assigneeYn = 'N';
  if(chargeValueSet == 'yes') {
    assigneeYn = 'Y';
  }
  
  var assigneeReason = reason;
  if(reason == 'etc') {
    assigneeReason = $('.etc-text').val();
    console.log("assigneeReason"+assigneeReason);
  }

  var requestParam = {
    query: {
      "event": "save_answer_confirm"
    },
    payload :{
      "assigneeYn": assigneeYn,
      "category": selectedCategory,
      "relatedUrl": answerUrl,
      "answer": answerText,
      "analogyIntent": '',
      "assigneeReason": assigneeReason,
    //   "file": '',
      "userId": chatui.getSetting('userId'),
      "chatbotId":targetChatbotId,
      "languageCode":languageCode,
      "question": questionText
    }
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
      console.log(payload);
          if(payload && payload.queryResult && payload.queryResult.messages && payload.queryResult.messages.length>0){    
            var response = JSON.parse(payload.queryResult.messages[0].response);
    
            if(response) {
                var data = response.data;
                
                if(data["successYn"] == 'Y') {
                    answerReset();
                    
                    var param = {
                        "languageCode": languageCode, 
                        "questionText": data["questionText"], 
                        "answerText": data["answerText"], 
                        "selectedCategory": data["selectedCategory"], 
                        "answerUrl": data["answerUrl"], 
                        "addedFilesName": data["addedFilesName"]
                    }
                    chatui.sendEventMessage("add_answer_request_end", param);
                }
                else{
                    showConfirmDialog(data["restMessage"]);
                }
                console.log(data["successYn"]+" / "+data["restMessage"]);
            }
          }
      //answerReset();
      //showConfirmDialog(convert(eduLang.requester_input_msg));
    }
	});

  
}

function closeCheckPersonPopup() {
  closePopup();
  //answerReset();    
  console.log("closeCheckPersonPopup");
/*  var requestParam = {
    query: {
      "event": "save_answer_confirm"
    },
    payload :{
      "assigneeYn": '',
      "category": selectedCategory,
      "relatedUrl": answerUrl,
      "answer": answerText,
      "analogyIntent": '',
      "assigneeReason": '',
      "file": '',
      "userId": chatui.getSetting('userId'),
      "chatbotId":targetChatbotId,
      "languageCode":languageCode,
      "question": questionText
    }
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
      console.log(payload);
      answerReset();
      showConfirmDialog(convert(eduLang.requester_end_msg));
    }
	});
	*/
}

function showSelectStatusPopup(selectedRequestId) {
  $('.plugin-dim').css('display', 'block');
  $('#status-select').css('display', 'block');

  setTimeout(function() {
    $('.plugin-dim').addClass('show');
    $('#status-select').addClass('show');
  }, 100)


  statusSelectTarget = selectedRequestId;
}

function sendStatusSelect() {
  var statusListBoxes = $('.request-id-'+statusSelectTarget).find('.list-box');

  $('.request-id-'+statusSelectTarget).find('.see-more').css('display', 'none');
  var selectStatusBtn = $('.request-id-'+statusSelectTarget).find('.status-all');
  
  if(selectdStatusValue == 'all') {
    statusListBoxes.removeClass('disp-none');
    selectStatusBtn.text(convert(eduLang.status_all)+" (" + statusListBoxes.length + ')');
  } else {
   if(selectdStatusValue == 'status-1') {
      var status1 = $('.request-id-'+statusSelectTarget).find('.request-status-1');
      selectStatusBtn.text(convert(eduLang.status_step1)+" (" + status1.length + ')');
    } else if(selectdStatusValue == 'status-2') {
      var status2 = $('.request-id-'+statusSelectTarget).find('.request-status-2');
      selectStatusBtn.text(convert(eduLang.status_step2)+" (" + status2.length + ')');
    } else if(selectdStatusValue == 'status-3') {
      var status3 = $('.request-id-'+statusSelectTarget).find('.request-status-3');
      selectStatusBtn.text(convert(eduLang.status_step3)+" (" + status3.length + ')');
    } else {
      var status0 = $('.request-id-'+statusSelectTarget).find('.request-status-0');
      selectStatusBtn.text(convert(eduLang.status_step0)+" (" + status0.length + ')');
    }
    
    var listStatus = 'request-'+selectdStatusValue;
    console.log(listStatus);
    for(var i=0; i<statusListBoxes.length; i++) {
      if(!(statusListBoxes.eq(i).hasClass(listStatus))) {
        statusListBoxes.eq(i).addClass('disp-none');
      } else {
        statusListBoxes.eq(i).removeClass('disp-none');
      }
    }
  }

  
  closePopup();
}

chatui.onLoad = function(){
    console.log("학습봇 onLoad");
    
    languageCode = chatui.getSetting("languageCode");
    console.log('languageCode : '+languageCode);
    eduLang = (languageCode == 'en')? lang_en:lang_ko;
    
    //console.log('gpt targetParent : '+chatui.getParameter('targetParent'));
    targetChatbotId = chatui.getParameter("targetChatbotId")!==null ? chatui.getParameter("targetChatbotId") : "3ace0979-8ff0-49f3-814b-84c500f5fbef";
    console.log("targetChatbotId: "+targetChatbotId);
    
  var is_mobile = Mobile();
  var recoverBtn =  '<div class="recover" id="chatbot-recover">'
    +'</div>';

  var winopenBtn =  '<div class="winopen" id="chatbot-winopen">'
    +'</div>';

  $(".test-panel .panel-wrapper .chat-panel .info-area").html(
    '<div class="edu-header">'
    +'<h1>'+convert(eduLang.chatbot_title)+'</h1>'
    +'<div class="dot-flashing">'
    +'</div>'
    +'</div>'
    //+'<span class="edu-close" id="eduClose">종료하기</span>'
    // 2023.11.13 추가 (팝업띄우기, 사이즈 원복 버튼...)   
    
   + (!is_mobile? winopenBtn:'')
   
    +'<div class="collapse" id="eduClose">'
    +    '<img src="'+imgUrl+'img_close.png" />'
    +'</div>'
    // 2023.11.13 추가 (팝업띄우기, 사이즈 원복 버튼...)    
  );

  $(".test-panel .panel-wrapper .chat-panel .form-group").empty();

  $(".test-panel .panel-wrapper .chat-panel .form-group").append('<input type="text" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="'+convert(eduLang.msg_input)+'" autocomplete="off">');
  $(".test-panel .panel-wrapper .chat-panel .form-group").append('<button class="btn btn-trans btn-send caas-chat-send-icon-color"><svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.0676 4.79338C26.554 3.3341 25.1657 1.94578 23.7064 2.43221L4.10954 8.96451C2.53186 9.4904 2.37758 11.6613 3.86504 12.405L10.2305 15.5877C10.9042 15.9246 11.7179 15.7925 12.2505 15.2599L20.206 7.30442C20.4794 7.03106 20.9226 7.03106 21.1959 7.30442C21.4693 7.57779 21.4693 8.02101 21.1959 8.29437L13.2403 16.25C12.7077 16.7826 12.5756 17.5964 12.9125 18.2701L16.0948 24.6348C16.8386 26.1222 19.0094 25.968 19.5353 24.3903L26.0676 4.79338Z"></path></svg></button>');


  $('.sendText').on('keyup', function(e) {
    var val = $(this).val();

    if(val.length > 0) {
      $('.btn-send').addClass('active');
    } else {
      $('.btn-send').removeClass('active');
    }

    if(val.length > 0 && (e.code == 'Enter' || e.keyCode == 13)) {
      if(saveQuestion) {
        chatui.sendEventMessage("createChatbotMessage", {"languageCode": languageCode, "chatbotId": targetChatbotId,"chatMsg": val});
        saveQuestion = false;
        questionText = val;
      } else {
        chatui.sendMessage(val);
      }
      $('.sendText').val('');
      $('.btn-send').removeClass('active');
    }
    
  });

  $('.btn-send').on('click', function(e) {
    var val = $('.sendText').val();
    if(val.length > 0) {
      if(saveQuestion) {
        chatui.sendEventMessage("createChatbotMessage", {"languageCode": languageCode, "chatbotId": targetChatbotId, "chatMsg": val});
        saveQuestion = false;
        questionText = val;
      } else {
        chatui.sendMessage(val);
      }
      $('.sendText').val('');
      $('.btn-send').removeClass('active');
    }
  })
  
  
   var pulginDim = $('<div class="plugin-dim"></div>');
   var pluginSelectDim = $('<div class="plugin-select-dim"></div>');
    var addNewAnswerPopup = $('<div class="plugins" id="addNewAnswer">'
     +'<div class="plugin-header">'
      +'<h1>'+convert(eduLang.answer_title)+'</h1>'
      +'<span class="close-plugin" onclick="closePopup()">'
        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
          +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
        + '</svg>          '
      +'</span>'
    +'</div>'
    +'<div class="plugin-contents">'
    +'<form class="add-new-answer-form">'
     + '<div class="input-box">'
        +'<label>'+convert(eduLang.ans_cont)+'<b>*</b></label>'
       +'<textarea id="answer-contents" placeholder="'+convert(eduLang.answer_cont_msg)+'&#13;&#10;&#13;&#10;'

       +convert(eduLang.answer_ex)+')&#13;&#10;'
       +convert(eduLang.answer_ex_1)+'&#13;&#10;&#13;&#10;'
       
       +convert(eduLang.answer_ex_2)+'&#13;&#10;'
       +convert(eduLang.answer_ex_3)+'&#13;&#10;'
       +convert(eduLang.answer_ex_4)+'&#13;&#10;'
       +convert(eduLang.answer_ex_5)
       +'"></textarea>'
      +'</div>'
      +'<div class="input-box">'
        +'<label>'+convert(eduLang.ans_url)+'</label>'
        +'<input type="text" placeholder="'+convert(eduLang.answer_url_msg)+'" id="answer-url" />'  
      +'</div>'
      // +'<div class="input-box">'
      //   +'<label>첨부파일</label>'
      //   +'<div class="file-box">'
      //     +'<div class="file-add"><span class="placeholder">관련 파일을 첨부해 주세요.</span></div>'
      //     +'<div class="added-file"></div>'
      //     +'<input type="file" id="answer-file" class="answer-file" accept="application/vnd.ms-excel, application/vnd.ms-powerpoint, .pptx, .xlsx, image/jpeg"  max-file-size="1024" multiple />'
      //   +'</div>'
      //   +'<p class="small">pptx, jpg, xlsx 파일만 가능, 3MB 이하</p>'
      // +'</div>'
      +'<button type="button" class="btn btn-plugin btn-apply btn-disabled" id="btn-answer" onclick="sendAnswer();">'+convert(eduLang.answer_send_btn)+'</button>'
      +'</form>'
    +'</div>'
    +'</div>');

  
    $('.test-panel').append(pulginDim);
    $('.test-panel').append(addNewAnswerPopup);
    $('.test-panel').append(pluginSelectDim);

    var dialog = $('<div class="dialog" id="confirm-dailog">'
    +'<h2></h2>'
      +'<span class="dialog-close">'
        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
          + '<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
          + '</svg>'
          + '</span>'
          + '<p></p>'
          + '<div class="dialog-btns">'
          + '<span class="cancel">'+convert(eduLang.cancel_btn)+'</span>'
          + '<span class="confirm">'+convert(eduLang.confirm_btn)+'</span>'
          + '</div>'
    +'</div>');

    // LG 화확의 학습봇 종료시 확인창이 보이지 않는 현상 수정.
    //$('.test-panel').append(dialog);


    var checkPersonPopup = $('<div class="plugins" id="checkPerson">'
     +'<div class="plugin-header">'
      +'<h1>'+convert(eduLang.requester_title)+'</h1>'
      +'<span class="close-plugin" onclick="closeCheckPersonPopup()">'
        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
          +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
        + '</svg>          '
      +'</span>'
    +'</div>'
    +'<div class="plugin-contents">'
    +'<div class="select-contents">'
    +'<form name="charge-select-form">'
    +'<p>'+convert(eduLang.requester_ask_a)+'<b>*</b></p>'
    +  '<ul class="select-list">'
    +     '<li>'
    +        '<label class="input-radio">'
    +           convert(eduLang.requester_bogi_a1)
    +           '<input type="radio" name="charge-select" id="yes" value="yes" checked="checked" />'
    +           '<span class="radiomark"></span>'
    +        '</label>'
    +     '</li>'
    +     '<li>'
    +        '<label class="input-radio">'
    +            convert(eduLang.requester_bogi_a2)
    +           '<input type="radio" name="charge-select" id="no" value="no" />'
    +           '<span class="radiomark"></span>'
    +        '</label>'
    +     '</li>'
      +'</ul>'
    +'<div class="not-charge">'
      +'<p>'+convert(eduLang.requester_ask_b)+'<b>*</b></p>'
      +  '<ul class="select-list">'
      +     '<li>'
      +        '<label class="input-radio">'
      +           convert(eduLang.requester_bogi_b1)
      +           '<input type="radio" name="charge-no" id="useful" value="userful" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.requester_bogi_b2)
      +           '<input type="radio" name="charge-no" id="unknown" value="unknown" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.requester_bogi_b3)
      +           '<input type="radio" name="charge-no" id="etc" value="etc" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
        +'</ul>'
        +'<div class="input-box">'
        +'<input type="text" id="etc-text" class="etc-text" placeholder="'+convert(eduLang.requester_reason_text)+'" />'
        +'</div>'
      +'</div>'
      +'<button type="button" class="btn btn-plugin btn-apply" id="btn-charge" onclick="sendCheckCharge();">'+convert(eduLang.confirm_btn)+'</button>'
      +'</div>'
      +'</form>'
    +'</div>'
    +'</div>');

    $('.test-panel').append(checkPersonPopup);

    var confirmDialong = $('<div class="confirm-dialog"></div>');
    $('.test-panel').append(confirmDialong);

    var statusSelectPopup = $('<div class="plugins" id="status-select">'
    +'<div class="plugin-header">'
    +'<h1>'+convert(eduLang.status_title)+'</h1>'
    +'<span class="close-plugin" onclick="closePopup()">'
      +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
      + '</svg>          '
    +'</span>'
  +'</div>'
  +'<div class="plugin-contents">'
  +'<div class="select-contents">'
 
      +'<p>'+convert(eduLang.status_select_text)+'<b>*</b></p>'
      +  '<ul class="select-list">'
      +     '<li>'
      +        '<label class="input-radio">'
      +           convert(eduLang.status_all)
      +           '<input type="radio" name="status-select" id="all" value="all" checked="checked" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.status_step0)
      +           '<input type="radio" name="status-select" id="status-0" value="status-0" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.status_step1)
      +           '<input type="radio" name="status-select" id="status-1" value="status-1" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.status_step3)
      +           '<input type="radio" name="status-select" id="status-3" value="status-3" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            convert(eduLang.status_step2)
      +           '<input type="radio" name="status-select" id="status-2" value="status-2" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
        +'</ul>'
      +'</div>'
      +'<button type="button" class="btn btn-plugin btn-apply" id="btn-status" onclick="sendStatusSelect();">적용</button>'
    +'</div>'
    +'</div>');

    $('.test-panel').append(statusSelectPopup);

    $('.file-add').on('click', function() {
      $('#answer-file').click();
    });

    $('.dialog-close, .dialog .cancel, .dialog .confirm').on('click', function() {
      $('.dialog').removeClass('show');
      $('.plugin-select-dim').removeClass('show');
      
      setTimeout(function() {
        $('.plugin-select-dim').css('display', 'none');
      }, 100);
    });

    // var answrFileInput = document.getElementById('answer-file');
  
    // answrFileInput.onchange = function(){
    //   var inputFiles = answrFileInput.files;
      
    //   const dt = new DataTransfer();

    //   for(let file of inputFiles) {
    //    if(fileNames.length == 0 || fileNames.indexOf(file.name) == -1) {
    //     if(file.size>3145728) {
    //       showFileLimitOverDialog(file.name);
    //     } else {
    //       dt.items.add(file);
    //       answerFiles.items.add(file);
    //       fileNames.push(file.name);
    //     }
    //    }        
    //   };
      
      
    //   if(fileNames.length > 0) {
    //     $('.tag-like').remove();
    //     $('.file-box .placeholder').css('display', 'none');
    //     for(let name of fileNames) {
    //       var fileTagLike = $('<div class="tag-like" data-name="'+ name +'">' + name +'</div>');

    //       fileTagLike.on('click', function() {
    //         var aFiles = answerFiles.files;
    //         const dt2 = new DataTransfer();
            
    //         for(let l=0;l<aFiles.length;l++) { 
    //           if(aFiles[l].name == $(this).data('name')) {
    //             fileNames.splice(l, 1);
    //           } else {
    //             dt2.items.add(aFiles[l]);
    //           }
    //         }

    //         answerFiles = new DataTransfer();
    //         if(fileNames.length == 0) {
    //           $('.file-box .placeholder').css('display', 'block');  
    //         } else {
    //           for(let dFile of dt2.files) {
    //             answerFiles.items.add(dFile);
    //           }
    //         }
    //         $(this).remove();
    //       });

    //       $('.added-file').append(fileTagLike);
    //     };
    //   }
    // };



    var answerContents = $('#answer-contents');


    answerContents.on('change paste keyup', function() {
      answerText = $(this).val();
      if($(this).val()) {
        $('#btn-answer').removeClass('btn-disabled');
      } else {
        $('#btn-answer').addClass('btn-disabled');
      };
    });


    var answerUrlInput = $('#answer-url');
    
    answerUrlInput.on('change paste keyup', function() {
      answerUrl = $(this).val();
    });


    $('input[type=radio][name=charge-select]').change(function() {
      chargeValue = this.value;
      if (this.value == 'no') {
        $('.not-charge').addClass('show');
      } else {
        $('.not-charge').removeClass('show');
      }
    });

    $('input[type=radio][name=charge-no]').change(function() {
      noChargeValue = this.value;
      if (this.value == 'etc') {
        $('.etc-text').addClass('show');
      } else {
        $('.etc-text').removeClass('show');
      }
    });

    $('.etc-text').on('change paste keyup', function() {
      etcText = $(this).val();
    });   



    $('input[type=radio][name=status-select]').change(function() {
      selectdStatusValue = this.value;
    });

  var chatbotCollapse = document.getElementById("eduClose");

  chatbotCollapse.addEventListener('click', function(e) {
    //console.log("eduClose");
    
    if(!window.opener) { 
        pop.open('create', $(this), 'Edu_Bot_Close', 'loadEl.edu_bot_close("학습봇 모드 종료", "모드 종료 시 대화 내용이 저장되지 않습니다.<br />종료할까요?")');    
        $('#btnConfirm').on('click', function() {
          window.parent.postMessage('bot_close', '*');
        });
    } else{
        window.close();
    }    
  });

    // 2023.11.13 추가 (팝업띄우기, 사이즈 원복 버튼...) Start
    
    if(!is_mobile) {
    
        /*  기본사이즈 버튼 나중에 오픈 */    
        //var chatbotRecover = document.getElementById("chatbot-recover");
        var chatbotWinopen = document.getElementById("chatbot-winopen");
        //chatbotRecover.style.display = "none";
        chatbotWinopen.style.display = "none";
       //chatbotCollapse.style.display = "none"; 
        
        //chatbotRecover.addEventListener('click', function(e) {
            
        //   window.parent.parent.postMessage('edu_Recover', '*');
        //}); 
        
        chatbotWinopen.addEventListener('click', function(e) {
        
           window.parent.parent.postMessage('edu_Winopen', '*');
        });   
    
        var paramTargetParent = chatui.getParameter('targetParent');
        if(!window.opener) {            // 케미로 부터 호출 > close 버튼이 필요함. 
            //console.log('edu 팝업 아님.');
            
            //chatbotCollapse.style.display = "block"; 
            
            // 학습봇모드=iframe, 케미=iframe 이면.
            if(paramTargetParent == "F") {
                //chatbotRecover.style.display = "block";
                chatbotWinopen.style.display = "block";
            }        
        }
        else {    console.log('edu 팝업.');    } 
    }
    // 2023.11.13 추가 (팝업띄우기, 사이즈 원복 버튼...) End
};


var saveQuestion = false;

chatui.onReceiveResponse = function(resp) {  
  console.log(resp);
  loading = false;
  $('#btn-answer').removeClass('btn-disabled');
 
  setTimeout(function() {
    if(resp.response.query.event == "add_new_message_step_2") {
      saveQuestion = true;
    } else {
      saveQuestion = false; 
    }

    if(resp.response.query.event == "add_new_message_real_end") {
      selectedCategory = '';
      answerFiles = new DataTransfer();
      fileNames = [];
      answerText = '';
      answerUrl = '';
      questionText = '';
      addedFilesName = '';
    }

    if(resp.response.query.event == '82d91f62-bec2-4ed2-b11f-1a38c149a9ef') {
      answerReset();
    }
     
    for(var i = 0; i < resp.response.queryResult.messages.length; i++) {
      var message = resp.response.queryResult.messages[i];
      if(message.quickReply && message.quickReply.length > 0) {
        console.log(message.quickReply);
        var buttons = $('<div class="btn-list"></div>');
  
        for(var k=0; k<message.quickReply.length; k++) {
          var button = message.quickReply[k];
          if(button.type == 'btn') {
            var sendMessageBtn = $('<span class="btn-custom-reply send-message" data-message="'+ button.value +'">' + button.label + '</span>');
            sendMessageBtn.on('click', function() {
              var mText = $(this).data('message');
              chatui.sendMessage(mText);
            });

            buttons.append(sendMessageBtn);
          }
          else if(button.type == 'callIntent') {
            var callIntentBtn = $('<span class="btn-custom-reply call-intent" data-message="' + button.label + '" data-intent="'+ button.value + '">' + button.label + '</span>');
            callIntentBtn.on('click', function() {
              var callEvent = $(this).data('intent');
              var callMessage = $(this).text();
              chatui.sendEventMessage(callEvent, {"languageCode": languageCode, "text": callMessage});
            });
            buttons.append(callIntentBtn);
          }
          else if(button.type == 'link') {
            var linkBtn = $('<span class="btn-custom-reply web-link" data-weblink="'+ button.value +'">' + button.label + '</span>');
            linkBtn.on('click', function() {
              var weblink = $(this).data('weblink');
              window.parent.location.href = weblink;
            })
            buttons.append(linkBtn);
          }
          else if(button.type == 'outApp') {
          var outlinkBtn = $('<span class="btn-custom-reply out-link" data-outlink="'+ button.value +'">' 
          + button.label
          +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
          + '<path d="M18.0964 6.50024L24.097 6.50066C24.6493 6.5007 25.0969 6.9484 25.0969 7.50066L25.0969 13.5002" stroke="#333333" stroke-linecap="round"/>'
          + '<path d="M16.3394 14.9355L24.5962 7.00098" stroke="#333333" stroke-linecap="round"/>'
          + '<path d="M14 8H9C7.89543 8 7 8.89543 7 10V23C7 24.1046 7.89543 25 9 25H22C23.1046 25 24 24.1046 24 23V18" stroke="#333333" stroke-linecap="round"/>'
          + '</svg>'
            + '</span>');
            outlinkBtn.on('click', function(){
                var outlink = $(this).data('outlink');
                window.open(outlink, '_blank');
              });
          buttons.append(outlinkBtn);

        } else {
          var simpleBtn = $('<span class="send-message" data-message="'+ button.value +'">' + button.label + '</span>');
          simpleBtn.on('click', function() {
            var mText = $(this).data('message');
            chatui.sendMessage(mText);
          });
          buttons.append(simpleBtn);
        }
        }

        $('.quick-list').last().addClass('custom-quick-reply');
  
        $('.quick-list').last().html(buttons);
  
      }
  }

  $('.message-date').each(function() {
    var date = $(this).text();

    if(date.startsWith('am')) {
      date = date.replace('am', convert(eduLang.t_am));
    }

    if(date.startsWith('pm')) {
      date = date.replace('pm', convert(eduLang.t_pm));
    }

    $(this).text(date);
  });

  $('.request-li').each(function() {
    $(this).on('click', function(){
    var id = $(this).data(id);
    var selectedRequest = requestResultList[id.id];
    console.log(id, requestResultList, selectedRequest);

   
   
    $('.chat-message.left').last().find('custom-quick-reply').remove();
    appendQueryText(selectedRequest.question);

    var statusTextDesc = '';
    var statusText = '';
    if(selectedRequest.status == '0') {
      statusTextDesc = convert(eduLang.status_step0_text);
      statusText = convert(eduLang.status_step0);
    } else if(selectedRequest.status == '1') {
      statusTextDesc = convert(eduLang.status_step1_text);
      statusText = convert(eduLang.status_step1);
    } else if(selectedRequest.status == '2') {
      statusTextDesc = convert(eduLang.status_step2_text);
      statusText = convert(eduLang.status_step2);
    } else if(selectedRequest.status == '3') {
      statusTextDesc = convert(eduLang.status_step3_text);
      statusText = convert(eduLang.status_step3);
    } else {
      statusTextDesc = convert(eduLang.status_step0_text);
      statusText = convert(eduLang.status_step0);
    };

    // var statusFileNames = '';
    // for(let k=0; k<selectedRequest.files.length; k++) {
    //   statusFileNames += selectedRequest.files[k].name+'<br/>';
    // };

   
    
    var statusMessage = $('<div class="chat-message left"></div>');
    var profileCircle = $('<div class="profile"><img class="img-circle" src="'+imgUrl+'chem-profile.png"></div>');

    statusMessage.append(profileCircle);


    var statusDescBox = $('<div class="message">' + statusTextDesc + '</div>');
    statusMessage.append(statusDescBox);
      
    var statusMessageCheck = $('<div class="message request-check"></div>')
    var statusMessageTitle = $('<div class="check-title"><h5>'+convert(eduLang.request_title)+'</h5>'
    +'<span class="tag status-'+selectedRequest.status+'">' + statusText +'</span>'
    +'</div>');

    statusMessageCheck.append(statusMessageTitle);

    var statusMessageCheckList = $('<ul class="check-list">'
    +'<li><span class="check-label">'+convert(eduLang.request_date)+'</span>'
    +'<span class="check-text">' + moment(selectedRequest.registeredOn).format('YYYY.MM.DD') +'</span></li>'
    +'<li><span class="check-label">'+convert(eduLang.request_category)+'</span>'
    +'<span class="check-text">'+ selectedRequest.category +'</span></li>'
    +'<li><span class="check-label">'+convert(eduLang.request_ask)+'</span>'
    +'<span class="check-text hidden-text">'+ selectedRequest.question +'</span></li>'
    +'<li><span class="check-label">'+convert(eduLang.request_answer)+'</span>'
    +'<span class="check-text">'+ selectedRequest.answer +'</span></li>'
    +(selectedRequest.relatedUrl ? '<li><span class="check-label">'+convert(eduLang.ans_url)+'</span><span class="check-text">'+ selectedRequest.relatedUrl +'</span></li>' : '')
    +(selectedRequest.files ? '<li><span class="check-label">'+convert(eduLang.ans_file)+'</span><span class="check-text">'+ statusFileNames +'</span></li>' : '')
    + '<li><span class="check-label">'+convert(eduLang.request_yesorno)+'</span>'
    +'<span class="check-text">'+ (selectedRequest.assigneeYn == 1 ? 'YES' : 'NO')  +'</span></li>'
    +(selectedRequest.assigneeReason ? '<li><span class="check-label">신청 사유</span>'+'<span class="check-text">'+ selectedRequest.assigneeReason +'</span></li>' : '')
    +'</ul>'
    // +(selectedRequest.assigneeReason ? '<div class="auth-reason"> 등록 사유 : ' + selectedRequest.assigneeReason +'</div>' : '')
     +(selectedRequest.status == '2' ? '<div class="auth-reason"> <b>반려 사유</b></br>' + selectedRequest.comment +'</div>' : '')
    );
      

    statusMessageCheck.append(statusMessageCheckList);

    if(selectedRequest.status == '3') {
      var statusMessageCopy = $('<div class="copy-question"></div>');
      var messageCopyTooltip = $('<div class="f-tooltip">'+convert(eduLang.ask_copy_msg)+'</div>');
      statusMessageCopy.append(messageCopyTooltip);
      var copyButton = $('<button type="button" class="btn-text btn-emphasis">'
      +'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.83325 1C5.72868 1 4.83325 1.89543 4.83325 3C3.72868 3 2.83325 3.89543 2.83325 5V13C2.83325 14.1046 3.72868 15 4.83325 15H10.1666C11.2712 15 12.1666 14.1046 12.1666 13C13.2712 13 14.1666 12.1046 14.1666 11V3C14.1666 1.89543 13.2712 1 12.1666 1H6.83325ZM12.1666 12.2C12.8293 12.2 13.3666 11.6627 13.3666 11V3C13.3666 2.33726 12.8293 1.8 12.1666 1.8H6.83325C6.17051 1.8 5.63325 2.33726 5.63325 3H10.1666C11.2712 3 12.1666 3.89543 12.1666 5L12.1666 12.2ZM3.63325 5C3.63325 4.33726 4.17051 3.8 4.83325 3.8H10.1666C10.8293 3.8 11.3666 4.33726 11.3666 5V13C11.3666 13.6627 10.8293 14.2 10.1666 14.2H4.83325C4.17051 14.2 3.63325 13.6627 3.63325 13V5Z" fill="#E0205C"/>'
      +'</svg>'
      + convert(eduLang.ask_copy_btn)+'</button>');

      copyButton.on('click', function() {
        var temp = $('<input type="text" class="hidden-textbox" />');
        $("body").append(temp);
        temp.val($(this).parents('.request-check').find(".hidden-text").text()).select();
        console.log(temp.val());
        document.execCommand('copy');
        temp.remove();

        showConfirmDialog(convert(eduLang.ask_copy_finish));
      });
        
      statusMessageCopy.append(copyButton);
      statusMessageCheck.append(statusMessageCopy);
    } 
      statusMessage.append(statusMessageCheck);

      var quickReply = $('<div class="custom-quick-reply"></div>');
      var backBtn = $('<span class="btn-custom-reply">'+convert(eduLang.back_btn)+'</span>');
      backBtn.on('click', function() {
        chatui.sendEventMessage('check_status', {"languageCode": languageCode, "chatbotId": targetChatbotId}); 
      });
      quickReply.append(backBtn);
      statusMessage.append(quickReply);
      
      var messageDate = '<span class="message-date">' + timeFormat() +'</span>'
      statusMessage.append(messageDate);

      
      $('#divScroll').append(statusMessage);

      var objDiv = document.getElementById("divScroll");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  
  });
  

   
  }, 100);


  
}

var requestId = 0;

chatui.createCustomResponseMessage = function(resp, isHistory) {
  console.log("chatui.createCustomResponseMessage()", resp);
  loading = false;
  $('#btn-answer').removeClass('btn-disabled');
  if(resp.response) {
    var customPayload = JSON.parse(resp.response);
    var customMessage = $('<div class="custom-message"></div>');
    
    if(customPayload.type == 'requestEnd') {
      
      var requestCheck = $('<div class="message request-check"></div>');
      var checkTitle = $('<div class="check-title"><h5>'+convert(eduLang.request_title)+'</h5><span class="tag warning">'+convert(eduLang.status_step0)+'</span></div>');
      requestCheck.append(checkTitle);
      var checkContents = $('<ul class="check-list">'
      +'<li><span class="check-label">'+convert(eduLang.request_category)+'</span>'
      +'<span class="check-text">'+ customPayload.item["selectedCategory"] +'</span></li>'
      +'<li><span class="check-label">'+convert(eduLang.request_ask)+'</span>'
      +'<span class="check-text">'+ customPayload.item["questionText"] +'</span></li>'
      +'<li><span class="check-label">'+convert(eduLang.request_answer)+'</span>'
      +'<span class="check-text">'+ customPayload.item["answerText"] +'</span></li>'
      +(customPayload.item["answerUrl"] ? '<li><span class="check-label">'+convert(eduLang.ans_url)+'</span><span class="check-text">'+ customPayload.item["answerUrl"] +'</span></li>' : '')
      +(customPayload.item["addedFilesName"] ? '<li><span class="check-label">'+convert(eduLang.ans_file)+'</span><span class="check-text">'+ customPayload.item["addedFilesName"] +'</span></li>' : '')
      +'</ul>');

      requestCheck.append(checkContents);
      customMessage.append(requestCheck);

      //showCheckPersonCharge();
    }

    if(customPayload["template"] && customPayload.template.outputs[0].data.items) {
      console.log(customPayload.template.outputs[0]);
        console.log("out reflectionStatus");
      if(customPayload.template.outputs[0].type == "reflectionStatus") {

        console.log("in reflectionStatus");
        console.log(customPayload.template.outputs[0].data.items);
        console.log(customPayload.template.outputs[0].data.resultData);
        
        var items = customPayload.template.outputs[0].data.items;
        requestId += 1;
        var requestStatus = $('<div class="message request-status request-id-' + requestId +'"></div>');
        var requestStatusTitle = $('<div class="list-header-title"><svg class="list-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M2.00004 3.9974C2.36823 3.9974 2.66671 3.69892 2.66671 3.33073C2.66671 2.96254 2.36823 2.66406 2.00004 2.66406C1.63185 2.66406 1.33337 2.96254 1.33337 3.33073C1.33337 3.69892 1.63185 3.9974 2.00004 3.9974Z" fill="#2C2C2C"/>'
        +'<path d="M2.00004 8.66406C2.36823 8.66406 2.66671 8.36559 2.66671 7.9974C2.66671 7.62921 2.36823 7.33073 2.00004 7.33073C1.63185 7.33073 1.33337 7.62921 1.33337 7.9974C1.33337 8.36559 1.63185 8.66406 2.00004 8.66406Z" fill="#2C2C2C"/>'
        +'<path d="M2.66671 12.6641C2.66671 13.0323 2.36823 13.3307 2.00004 13.3307C1.63185 13.3307 1.33337 13.0323 1.33337 12.6641C1.33337 12.2959 1.63185 11.9974 2.00004 11.9974C2.36823 11.9974 2.66671 12.2959 2.66671 12.6641Z" fill="#2C2C2C"/>'
        +'<path d="M4.40004 7.59733C4.17913 7.59733 4.00004 7.77642 4.00004 7.99733C4.00004 8.21824 4.17913 8.39733 4.40004 8.39733H14.2667C14.4876 8.39733 14.6667 8.21824 14.6667 7.99733C14.6667 7.77642 14.4876 7.59733 14.2667 7.59733H4.40004Z" fill="#2C2C2C"/>'
        +'<path d="M4.00004 3.33066C4.00004 3.10975 4.17913 2.93066 4.40004 2.93066H14.2667C14.4876 2.93066 14.6667 3.10975 14.6667 3.33066C14.6667 3.55158 14.4876 3.73066 14.2667 3.73066H4.40004C4.17913 3.73066 4.00004 3.55158 4.00004 3.33066Z" fill="#2C2C2C"/>'
        +'<path d="M4.40004 12.264C4.17913 12.264 4.00004 12.4431 4.00004 12.664C4.00004 12.8849 4.17913 13.064 4.40004 13.064H14.2667C14.4876 13.064 14.6667 12.8849 14.6667 12.664C14.6667 12.4431 14.4876 12.264 14.2667 12.264H4.40004Z" fill="#2C2C2C"/>'
        +'</svg>'
        +'<h5>'+convert(eduLang.request_list_title)+'</h5>' 
        + '</div>');

        var selectStatus = $('<div class="select-status">'
        + '<span class="status-all">'+convert(eduLang.status_all)+' (' + items.length + convert(eduLang.list_count)+')' + '</span>'
        + '<svg class="arrow-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +   '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.7012 7.78633C5.8717 7.93789 6.12863 7.93789 6.29913 7.78633L10.3009 4.22924C10.4247 4.11917 10.6143 4.13032 10.7244 4.25416C10.8345 4.37799 10.8233 4.56761 10.6995 4.67769L6.69775 8.23478C6.29992 8.58841 5.70042 8.58841 5.30259 8.23478L1.30086 4.67769C1.17702 4.56761 1.16587 4.37799 1.27595 4.25416C1.38602 4.13032 1.57564 4.11917 1.69948 4.22924L5.7012 7.78633Z" fill="#6B6B6B"/>'
        + '</svg>'
        +'</div>');

        selectStatus.on('click', function() {
          var selectedRequestId = requestId;
          showSelectStatusPopup(selectedRequestId);
        });

        requestStatusTitle.append(selectStatus);

        requestStatus.append(requestStatusTitle);

        var requestList = $('<div class="text-list"></div>');

       requestResultList = items;
        for(var j = 0; j<items.length; j++) {
          var request = items[j];
          var statusText = '';
          //검토 대기중 0, 검토중 1, 반려 2, 반영완료 3
          if(request.status == '0') {
            statusText = convert(eduLang.status_step0);
          } else if(request.status == '1') {
            statusText = convert(eduLang.status_step1);
          } else if(request.status == '2') {
            statusText = convert(eduLang.status_step2);
          } else if(request.status == '3') {
            statusText = convert(eduLang.status_step3);
          } else {
            statusText = convert(eduLang.status_step0);
          }

          var requestLi = $((j < 4 ? '<div class="list-box request-li request-status-'+ request.status +'" data-id="' + j +'">' : '<div class="list-box request-li disp-none request-status-'+ request.status +'" data-id="' + j +'">')
          +'<h1>' + '<span class="tag status-' + request.status + '">' +statusText + '</span>' + request.question + '</h1>'
          +'<p class="desc">'+ request.answer +'</p>'
          + '<div class="arrow">'
              +'<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M12 6L20.3979 15.331C20.7402 15.7113 20.7402 16.2887 20.3979 16.669L12 26" stroke-width="1.2" stroke-linecap="round"/>'
              +'</svg>'
           +'</div>'
           +'</div>');

           
           requestList.append(requestLi);
      }

      if(items.length > 4) {
        var seeMore =  $('<div class="see-more">'
        + '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M7.09998 13.7666C7.09998 13.9875 7.27906 14.1666 7.49998 14.1666C7.72089 14.1666 7.89998 13.9875 7.89998 13.7666V7.89985H13.7667C13.9876 7.89985 14.1667 7.72077 14.1667 7.49985C14.1667 7.27894 13.9876 7.09985 13.7667 7.09985H7.89998V1.23325C7.89998 1.01234 7.72089 0.833252 7.49998 0.833252C7.27906 0.833252 7.09998 1.01234 7.09998 1.23325V7.09985H1.23337C1.01246 7.09985 0.833374 7.27894 0.833374 7.49985C0.833374 7.72077 1.01246 7.89985 1.23337 7.89985H7.09998V13.7666Z" fill="#2C2C2C"/>'
        + '</svg>'+convert(eduLang.add_btn)
        + '</div>');

        seeMore.on('click', function() {
          $(this).parents('.request-status').find('.list-box').removeClass('disp-none');
          $(this).remove();
        });

        requestList.append(seeMore);
      }

      requestStatus.append(requestList);
      customMessage.append(requestStatus);

    }

      

    }

    if(customPayload.data) {
      console.log(customPayload);
      if(customPayload.type == 'processList') {
        var processList = $('<div class="message process-list"></div>');
        
        var listUl = $('<ul></ul>');
        
  
        for(var i = 0; i<customPayload.data.list.length; i++) {
          var list = customPayload.data.list[i];
          var listLi = $('<li>'
          +'<div class="step">STEP ' + (i+1) + '</div>'
          +'<div class="text-box">'
          +(list.title ? '<h3>' + list.title + '</h3>' : '')
          +(list.contents ? '<p>' + list.contents + '</p>' : '')
          +'</div>'
          +'</li>');
          listUl.append(listLi);
        }
        

        processList.append(listUl);
  
        customMessage.append(processList);
      }

      

      if(customPayload.type == 'simpleText') {
        for(var i = 0; i<customPayload.data.list.length; i++) {
          var simpleText = $('<div class="message simple-text"></div>');
          var list = customPayload.data.list[i];
          if(list.title) {
            var title = $('<h2>' + list.title + '</h2>');
            simpleText.append(title);
          }
          if(list.contents) {
            var text = $('<p>' + list.contents + '</p>');
            simpleText.append(text);
          }
          if(list.buttons) {
            for(var k = 0; k<list.buttons.length; k++) {
              var simpleButton = $('<button type="button" class="btn-default" data-value="' + list.buttons[k].value + '">' + list.buttons[k].label + '</button>');
              if(list.buttons[k].type == "openPopup" && list.buttons[k].value == "open_add_answer_popup") {
                openAddNewAnswerPopup();
                simpleButton.on('click', function() {
                  openAddNewAnswerPopup();
                });
              }
              simpleText.append(simpleButton);
            }
          }
          customMessage.append(simpleText);
        }
      }

      if(customPayload.type == 'requestInput') {
        for(var i = 0; i<customPayload.data.list.length; i++) {
          var simpleText = $('<div class="message simple-text"></div>');
          var list = customPayload.data.list[i];
          if(list.title) {
            var title = $('<h2>' + list.title + '</h2>');
            simpleText.append(title);
          }
          if(list.contents) {
            var text = $('<p>' + list.contents + '</p>');
            simpleText.append(text);
          }
          if(list.buttons) {
            for(var k = 0; k<list.buttons.length; k++) {
              var simpleButton = $('<button type="button" class="btn-default" data-value="' + list.buttons[k].value + '">' + list.buttons[k].label + '</button>');
              if(list.buttons[k].type == "openPopup" && list.buttons[k].value == "open_check_charge_popup") {
                //openAddNewAnswerPopup();
                showCheckPersonCharge();
                simpleButton.on('click', function() {
                  //openAddNewAnswerPopup();
                  showCheckPersonCharge();
                });
              }
              simpleText.append(simpleButton);
            }
          }
          customMessage.append(simpleText);
        }
      }


      if(customPayload.type =="requestStatus") {
        requestId += 1;
        var requestStatus = $('<div class="message request-status request-id-' + requestId +'"></div>');
        var requestStatusTitle = $('<div class="list-header-title"><svg class="list-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M2.00004 3.9974C2.36823 3.9974 2.66671 3.69892 2.66671 3.33073C2.66671 2.96254 2.36823 2.66406 2.00004 2.66406C1.63185 2.66406 1.33337 2.96254 1.33337 3.33073C1.33337 3.69892 1.63185 3.9974 2.00004 3.9974Z" fill="#2C2C2C"/>'
        +'<path d="M2.00004 8.66406C2.36823 8.66406 2.66671 8.36559 2.66671 7.9974C2.66671 7.62921 2.36823 7.33073 2.00004 7.33073C1.63185 7.33073 1.33337 7.62921 1.33337 7.9974C1.33337 8.36559 1.63185 8.66406 2.00004 8.66406Z" fill="#2C2C2C"/>'
        +'<path d="M2.66671 12.6641C2.66671 13.0323 2.36823 13.3307 2.00004 13.3307C1.63185 13.3307 1.33337 13.0323 1.33337 12.6641C1.33337 12.2959 1.63185 11.9974 2.00004 11.9974C2.36823 11.9974 2.66671 12.2959 2.66671 12.6641Z" fill="#2C2C2C"/>'
        +'<path d="M4.40004 7.59733C4.17913 7.59733 4.00004 7.77642 4.00004 7.99733C4.00004 8.21824 4.17913 8.39733 4.40004 8.39733H14.2667C14.4876 8.39733 14.6667 8.21824 14.6667 7.99733C14.6667 7.77642 14.4876 7.59733 14.2667 7.59733H4.40004Z" fill="#2C2C2C"/>'
        +'<path d="M4.00004 3.33066C4.00004 3.10975 4.17913 2.93066 4.40004 2.93066H14.2667C14.4876 2.93066 14.6667 3.10975 14.6667 3.33066C14.6667 3.55158 14.4876 3.73066 14.2667 3.73066H4.40004C4.17913 3.73066 4.00004 3.55158 4.00004 3.33066Z" fill="#2C2C2C"/>'
        +'<path d="M4.40004 12.264C4.17913 12.264 4.00004 12.4431 4.00004 12.664C4.00004 12.8849 4.17913 13.064 4.40004 13.064H14.2667C14.4876 13.064 14.6667 12.8849 14.6667 12.664C14.6667 12.4431 14.4876 12.264 14.2667 12.264H4.40004Z" fill="#2C2C2C"/>'
        +'</svg>'
        +'<h5>'+convert(eduLang.request_list_title)+'</h5>' 
        + '</div>');

        var selectStatus = $('<div class="select-status">'
        + '<span class="status-all">'+convert(eduLang.status_all)+' (' + customPayload.data.list.length + convert(eduLang.list_count)+')' + '</span>'
        + '<svg class="arrow-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +   '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.7012 7.78633C5.8717 7.93789 6.12863 7.93789 6.29913 7.78633L10.3009 4.22924C10.4247 4.11917 10.6143 4.13032 10.7244 4.25416C10.8345 4.37799 10.8233 4.56761 10.6995 4.67769L6.69775 8.23478C6.29992 8.58841 5.70042 8.58841 5.30259 8.23478L1.30086 4.67769C1.17702 4.56761 1.16587 4.37799 1.27595 4.25416C1.38602 4.13032 1.57564 4.11917 1.69948 4.22924L5.7012 7.78633Z" fill="#6B6B6B"/>'
        + '</svg>'
        +'</div>');

        selectStatus.on('click', function() {
          var selectedRequestId = requestId;
          showSelectStatusPopup(selectedRequestId);
        });

        requestStatusTitle.append(selectStatus);

        requestStatus.append(requestStatusTitle);

        var requestList = $('<div class="text-list"></div>');

       requestResultList = customPayload.data.list;
        for(var j = 0; j<customPayload.data.list.length; j++) {
          var request = customPayload.data.list[j];
          var statusText = '';
          //검토 대기중 0, 검토중 1, 반려 2, 반영완료 3
          if(request.status == '0') {
            statusText = convert(eduLang.status_step0);
          } else if(request.status == '1') {
            statusText = convert(eduLang.status_step1);
          } else if(request.status == '2') {
            statusText = convert(eduLang.status_step2);
          } else if(request.status == '3') {
            statusText = convert(eduLang.status_step3);
          } else {
            statusText = convert(eduLang.status_step0);
          }

          var requestLi = $((j < 4 ? '<div class="list-box request-li request-status-'+ request.status +'" data-id="' + j +'">' : '<div class="list-box request-li disp-none request-status-'+ request.status +'" data-id="' + j +'">')
          +'<h1>' + '<span class="tag status-' + request.status + '">' +statusText + '</span>' + request.question + '</h1>'
          +'<p class="desc">'+ request.answer +'</p>'
          + '<div class="arrow">'
              +'<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
                + '<path d="M12 6L20.3979 15.331C20.7402 15.7113 20.7402 16.2887 20.3979 16.669L12 26" stroke-width="1.2" stroke-linecap="round"/>'
              +'</svg>'
           +'</div>'
           +'</div>');

           
           requestList.append(requestLi);
        }

        

        if(customPayload.data.list.length > 4) {
          var seeMore =  $('<div class="see-more">'
          + '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">'
          +'<path d="M7.09998 13.7666C7.09998 13.9875 7.27906 14.1666 7.49998 14.1666C7.72089 14.1666 7.89998 13.9875 7.89998 13.7666V7.89985H13.7667C13.9876 7.89985 14.1667 7.72077 14.1667 7.49985C14.1667 7.27894 13.9876 7.09985 13.7667 7.09985H7.89998V1.23325C7.89998 1.01234 7.72089 0.833252 7.49998 0.833252C7.27906 0.833252 7.09998 1.01234 7.09998 1.23325V7.09985H1.23337C1.01246 7.09985 0.833374 7.27894 0.833374 7.49985C0.833374 7.72077 1.01246 7.89985 1.23337 7.89985H7.09998V13.7666Z" fill="#2C2C2C"/>'
          + '</svg>'+convert(eduLang.add_btn)
          + '</div>');

          seeMore.on('click', function() {
            $(this).parents('.request-status').find('.list-box').removeClass('disp-none');
            $(this).remove();
          });

          requestList.append(seeMore);
        }

        requestStatus.append(requestList);
        customMessage.append(requestStatus);

      }
    }

    if(customPayload.quickReply) {
      var quickReply = $('<div class="custom-quick-reply"></div>');
      for(var j = 0; j<customPayload.quickReply.list.length; j++) {
        var quickBtn = customPayload.quickReply.list[j];
        if(quickBtn.type == "callIntent") {
          var callIntentBtn = $('<span class="btn-custom-reply call-intent" data-intent="' + quickBtn.value + '">' + quickBtn.label +'</span>');
          callIntentBtn.on('click', function() {
            var callEvent = $(this).data('intent');
            var callMessage = $(this).text();
            chatui.sendEventMessage(callEvent, {"languageCode": languageCode, "text": callMessage});
          });
          quickReply.append(callIntentBtn);
        } else if(quickBtn.type == "categroySelect") {
          var categorySelectBtn = $('<span class="btn-custom-reply category-select" data-category="' + quickBtn.value + '">' + quickBtn.label +'</span>');
          categorySelectBtn.on('click', function() {
            selectedCategory = $(this).data('category');
            chatui.sendEventMessage("add_new_message_step_2", {"languageCode": languageCode});
          });
          quickReply.append(categorySelectBtn);
        }else {
          var simpleBtn = $('<span class="send-message" data-message="'+ button.value +'">' + button.label + '</span>');
          simpleBtn.on('click', function() {
            var mText = $(this).data('message');
            chatui.sendMessage(mText);
          });
          quickReply.append(simpleBtn);
          
        }
      }
  
   
      customMessage.append(quickReply); 
    }

    return customMessage;
   
  }

}
const popup = function() {
  var $pop;
  var $btn;
  var popMode;
 
  function createPopup(popId) {
      var popWrap = '<div id="'+ popId +'" class="dialog-back" data-mode="create"><div class="dialog-overlay"></div></div>';
      $("body").append(popWrap);
  }
 
  var popupFn = {
      open: function(mode, btn, target, callback) {
          console.log(mode);
          console.log(btn);
          console.log(target);
          console.log(callback);
          
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
                    console.log(callback);
                      var html = eval(callback);
                      $pop.find(".dialog-overlay").append(html);
                      $pop.stop().fadeIn('fast', function(){
 
                      });
                  }
              }
 
          }
      },
      close: function(closeBtn, target, callback) {
 
          if (closeBtn) {
              $pop = $(closeBtn).closest(".dialog-back");
          } else if (target) {
              $pop = $(target);
 
          } else {
              $pop = $(".dialog-back:visible:last-child");
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
      var $closePop = $(this).closest(".dialog-back");
 
      popupFn.close(this, $closePop);
  });
 
  // Click Overlay
  $(document).on('click', '.dialog-back', function(e){
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

jQuery(document).ready(function(e){
    console.log('document.ready...');
    
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
var loadEl = {
  'edu_bot_close': function(popTitle, msg) {
      var html = '<div class="pop-wrapper dialog">' +
                    '<h2>' + popTitle + '</h2>' +
                    '<span class="dialog-close" onclick="pop.close(this);">' + 
                      iconPopupClose +
                    '</span>' +
                    '<p class="section-message">' +
                        msg +
                    '</p>' +
                    '<div class="dialog-btns">' +
                        '<button type="button" onclick="pop.close(this);" class="cancel">'+convert(eduLang.cancel_btn)+'</button>' +
                        '<button type="button" id="btnConfirm" class="confirm">종료</button>' 
                    '</div>' +
                  '</div>';
      return html;
  }
}

// 모바일 감지 이벤트
 function Mobile() {
     return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 }
 
/***************************************************************************************/  
var languageCode = null;
var eduLang = null;

var lang_ko = {
  t_am : "오전", 
  t_pm : "오후", 
  ans_cont : "내용",
  ans_url : "관련 URL",
  ans_file : "첨부파일",
  requester_input_msg : "요청인 정보 입력이 완료되었습니다.", 
  requester_end_msg : "반영 요청이 완료되었습니다.", 
  status_all : "전체", 
  status_step1 : "검토중", 
  status_step2 : "반려", 
  status_step3 : "반영완료", 
  status_step0 : "검토 대기중", 
  chatbot_title : "학습봇 모드",
  msg_input : "메시지를 입력해주세요", 
  answer_title : "답변작성", 
  answer_cont_msg : "답변 내용을 최대한 상세히 작성해 주세요!", 
  answer_ex : "예시", 
  answer_ex_1 : "PC 분실 대금 입금에 대해 안내해 드릴게요.", 
  answer_ex_2 : "1. 분실신고 및 분실신고 접수증 발급", 
  answer_ex_3 : "2. PC분실 사유서 작성 및 접수증 제출", 
  answer_ex_4 : "- 분실 사유서 작성(보안포탈 전자결재 양식)", 
  answer_ex_5 : "3. PC 분실 대금 입금 및 신규 PC 신청", 
  answer_url_msg : "관련 URL을 입력해 주세요.", 
  answer_send_btn : "발송",
  cancel_btn : "취소", 
  confirm_btn : "확인", 
  requester_title : "요청인 정보", 
  requester_ask_a : "등록해주신 업무의 담당자이신가요?", 
  requester_bogi_a1 : "네, 맞습니다.", 
  requester_bogi_a2 : "아니오, 담당자가 아닙니다.", 
  requester_ask_b : "신청 사유를 선택해 주세요.", 
  requester_bogi_b1 : "담당자가 없으나, 유용한 정보입니다.", 
  requester_bogi_b2 : "담당자를 알 수 없습니다.", 
  requester_bogi_b3 : "기타", 
  requester_reason_text : "신청 사유를 입력해 주세요. (선택사항)", 
  status_title : "검토 상태 선택", 
  status_select_text : "조회하시려는 검토 상태를 선택해 주세요", 
  status_step0_text : "요청해주신 답변은 아직 <b>검토 대기중</b>입니다.", 
  status_step1_text : "요청해주신 답변은 아직 담당자 <b>검토중</b>입니다. 조금만 더 기다려 주세요!", 
  status_step2_text : "요청해주신 답변이 <b>반려</b> 되었습니다. 재신청 시 하단의 반려 사유를 확인해 주세요.", 
  status_step3_text : "요청해주신 답변을 <b>반영 완료</b> 하였습니다. 도움을 주셔서 감사합니다.", 
  request_title : "요청 상세 정보",
  request_date : "요청일", 
  request_category : "카테고리", 
  request_ask : "질문", 
  request_answer : "답변", 
  request_yesorno : "담당여부",
  request_list_title : "요청 목록", 
  list_count : "건", 
  ask_copy_msg : "복사한 질문을 엘지니에 사용해 보세요!<br />새롭게 반영된 대화를 확인하실 수 있어요.",
  ask_copy_btn :  "질문 복사하기", 
  ask_copy_finish : "질문이 복사되었습니다.<br />학습봇 모드 종료 후 엘지니에 붙여넣기 해주세요.",
  back_btn : "뒤로가기",
  add_btn : "더보기"
}

var lang_en = {
  t_am : "am", 
  t_pm : "pm", 
  ans_cont : "contents",
  ans_url : "Related URL",
  ans_file : "attachment file",
  requester_input_msg : "Requester information has been entered.", 
  requester_end_msg : "Your reflection request has been completed.", 
  status_all : "entire", 
  status_step1 : "being reviewed", 
  status_step2 : "rejected", 
  status_step3 : "Reflection complete", 
  status_step0 : "Awaiting review", 
  chatbot_title : "Learning bot mode",
  msg_input : "Please enter your message", 
  answer_title : "Write a reply", 
  answer_cont_msg : "Please write your answer in as much detail as possible!", 
  answer_ex : "example", 
  answer_ex_1 : "We will guide you on how to deposit the money for your lost PC.", 
  answer_ex_2 : "1. Report loss and issue receipt of loss report", 
  answer_ex_3 : "2. Write a statement explaining the loss of your PC and submit a receipt.", 
  answer_ex_4 : "- Fill out a statement of reason for loss (secure portal electronic payment form)", 
  answer_ex_5 : "3. Deposit for lost PC and apply for new PC", 
  answer_url_msg : "Please enter the relevant URL.", 
  answer_send_btn : "send",
  cancel_btn : "cancellation", 
  confirm_btn : "confirmation", 
  requester_title : "Requester Information", 
  requester_ask_a : "Are you the person in charge of the job you registered?", 
  requester_bogi_a1 : "Yes, that's right.", 
  requester_bogi_a2 : "No, not the person in charge.", 
  requester_ask_b : "Please select your reason for applying.", 
  requester_bogi_b1 : "There is no contact person, but this is useful information.", 
  requester_bogi_b2 : "Contact person unknown.", 
  requester_bogi_b3 : "etc", 
  requester_reason_text : "Please enter the reason for application. (options)", 
  status_title : "Select review status", 
  status_select_text : "Please select the review status you would like to view", 
  status_step0_text : "The response you requested is still <b>awaiting review</b>.", 
  status_step1_text : "The response you requested is still <b>being reviewed</b> by the person in charge. Please wait a little longer!", 
  status_step2_text : "The response you requested has been <b>rejected</b>. When reapplying, please check the reason for rejection below.", 
  status_step3_text : "The response you requested has been <b>reflected</b>. Thanks for your help.", 
  request_title : "Request Details",
  request_date : "Request date", 
  request_category : "category", 
  request_ask : "question", 
  request_answer : "answer", 
  request_yesorno : "In charge or Not",
  request_list_title : "request list", 
  list_count : "case", 
  ask_copy_msg : "Try using the copied questions in LGenie!<br />You can check the newly reflected conversation.",
  ask_copy_btn :  "Copy question", 
  ask_copy_finish : "The question has been copied.<br />Please paste it into LGenie after exiting learning bot mode.",
  back_btn : "Go back",
  add_btn : "see more" 
}
 
 
function convert(conts, param) {
    var retText = conts;
    if(param != null) {
        for(var i=0; i<param.length; i++) {
            conts = conts.replaceAll('{'+i+'}', param[i]);
        }
        
        retText = conts;
    }
    
    //console.log('retText : '+retText);
    return retText;
}
 