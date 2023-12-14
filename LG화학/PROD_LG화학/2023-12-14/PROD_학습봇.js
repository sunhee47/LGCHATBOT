var selectedCategory = '';
var answerFiles = new DataTransfer();
var fileNames = [];
var answerText = '';
var answerUrl = '';
var questionText = '';
var addedFilesName = '';

var chargeValue = "yes";
var noChargeValue = "useful";
var etcText = '';
var statusSelectTarget = 0;
var selectdStatusValue = "all";

var requesetResultList = [];

function timeFormat(e) {
  let now = (e ? moment(e) : moment()).format("a h:mm");
  now = now.toString();
  if(now.startsWith('am')) {
    now = now.replace('am', '오전');
  }
  if(now.startsWith('pm')){
    now = now.replace('pm', '오후');
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
  var answer = '[내용]<br />'
  + answerText + '<br /><br />'
  + (answerUrl ? '[관련 URL]<br />' + answerUrl + '<br /><br />' : '')
  +( addedFilesName ? '[첨부파일]<br />' + addedFilesName : '');

  
  appendQueryText(answer); 
  closePopup();
  chatui.sendEventMessage('new_answer_request', {"text": ""});
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
  var chargeValueSet = $("input[name='charge-select']:checked").val();
  var reason = $('input[name="charge-no"]:checked').val();
  var assigneeYn = 'N';
  if(chargeValueSet == 'yes') {
    assigneeYn = 'Y';
  };
  var assigneeReason = reason;
  if(reason == 'etc') {
    assigneeReason = $('.etc-text').val();
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
      "file": '',
      "userId": chatui.getSetting('userId'),
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
      showConfirmDialog('요청인 정보 입력이 완료되었습니다.');
    }
	});

  
}

function closeCheckPersonPopup() {
  closePopup();
  
  var requestParam = {
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
      showConfirmDialog('반영 요청이 완료되었습니다.');
    }
	});
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
    selectStatusBtn.text("전체 (" + statusListBoxes.length + ')');
  } else {
   if(selectdStatusValue == 'status-1') {
      var status1 = $('.request-id-'+statusSelectTarget).find('.request-status-1');
      selectStatusBtn.text("검토중 (" + status1.length + ')');
    } else if(selectdStatusValue == 'status-2') {
      var status2 = $('.request-id-'+statusSelectTarget).find('.request-status-2');
      selectStatusBtn.text("반려 (" + status2.length + ')');
    } else if(selectdStatusValue == 'status-3') {
      var status3 = $('.request-id-'+statusSelectTarget).find('.request-status-3');
      selectStatusBtn.text("반영완료 (" + status3.length + ')');
    } else {
      var status0 = $('.request-id-'+statusSelectTarget).find('.request-status-0');
      selectStatusBtn.text("검토 대기중 (" + status0.length + ')');
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
  $(".test-panel .panel-wrapper .chat-panel .info-area").html(
    '<div class="edu-header">'
    +'<h1>학습봇 모드</h1>'
    +'<div class="dot-flashing">'
    +'</div>'
    +'</div>'
    +'<span class="edu-close" id="eduClose">종료하기</span>'
  );

  $(".test-panel .panel-wrapper .chat-panel .form-group").empty();

  $(".test-panel .panel-wrapper .chat-panel .form-group").append('<input type="text" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="메시지를 입력해주세요" autocomplete="off">');
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
        chatui.sendEventMessage("createChatbotMessage", {"chatMsg": val});
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
        chatui.sendEventMessage("createChatbotMessage", {"chatMsg": val});
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
      +'<h1>답변작성</h1>'
      +'<span class="close-plugin" onclick="closePopup()">'
        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
          +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
        + '</svg>          '
      +'</span>'
    +'</div>'
    +'<div class="plugin-contents">'
    +'<form class="add-new-answer-form">'
     + '<div class="input-box">'
        +'<label>내용<b>*</b></label>'
       +'<textarea id="answer-contents" placeholder="답변 내용을 최대한 상세히 작성해 주세요!&#13;&#10;&#13;&#10;'

       +'예시)&#13;&#10;'
       +'PC 분실 대금 입금에 대해 안내해 드릴게요.&#13;&#10;&#13;&#10;'
       
       +'1. 분실신고 및 분실신고 접수증 발급&#13;&#10;'
       +'2. PC분실 사유서 작성 및 접수증 제출&#13;&#10;'
       +'- 분실 사유서 작성(보안포탈 전자결재 양식)&#13;&#10;'
       +'3. PC 분실 대금 입금 및 신규 PC 신청'
       +'"></textarea>'
      +'</div>'
      +'<div class="input-box">'
        +'<label>관련 URL</label>'
        +'<input type="text" placeholder="관련 URL을 입력해 주세요." id="answer-url" />'  
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
      +'<button type="button" class="btn btn-plugin btn-apply btn-disabled" id="btn-answer" onclick="sendAnswer();">발송</button>'
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
          + '<span class="cancel">취소</span>'
          + '<span class="confirm">확인</span>'
          + '</div>'
    +'</div>');

    $('.test-panel').append(dialog);


    var checkPersonPopup = $('<div class="plugins" id="checkPerson">'
     +'<div class="plugin-header">'
      +'<h1>요청인 정보</h1>'
      +'<span class="close-plugin" onclick="closeCheckPersonPopup()">'
        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
          +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
        + '</svg>          '
      +'</span>'
    +'</div>'
    +'<div class="plugin-contents">'
    +'<div class="select-contents">'
    +'<form name="charge-select-form">'
    +'<p>등록해주신 업무의 담당자이신가요?<b>*</b></p>'
    +  '<ul class="select-list">'
    +     '<li>'
    +        '<label class="input-radio">'
    +           '네, 맞습니다.'
    +           '<input type="radio" name="charge-select" id="yes" value="yes" checked="checked" />'
    +           '<span class="radiomark"></span>'
    +        '</label>'
    +     '</li>'
    +     '<li>'
    +        '<label class="input-radio">'
    +            '아니오, 담당자가 아닙니다.'
    +           '<input type="radio" name="charge-select" id="no" value="no" />'
    +           '<span class="radiomark"></span>'
    +        '</label>'
    +     '</li>'
      +'</ul>'
    +'<div class="not-charge">'
      +'<p>신청 사유를 선택해 주세요.<b>*</b></p>'
      +  '<ul class="select-list">'
      +     '<li>'
      +        '<label class="input-radio">'
      +           '담당자가 없으나, 유용한 정보입니다.'
      +           '<input type="radio" name="charge-no" id="useful" value="userful" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '담당자를 알 수 없습니다.'
      +           '<input type="radio" name="charge-no" id="unknown" value="unknown" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '기타'
      +           '<input type="radio" name="charge-no" id="etc" value="etc" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
        +'</ul>'
        +'<div class="input-box">'
        +'<input type="text" id="etc-text" class="etc-text" placeholder="신청 사유를 입력해 주세요. (선택사항)" />'
        +'</div>'
      +'</div>'
      +'<button type="button" class="btn btn-plugin btn-apply" id="btn-charge" onclick="sendCheckCharge();">확인</button>'
      +'</div>'
      +'</form>'
    +'</div>'
    +'</div>');

    $('.test-panel').append(checkPersonPopup);

    var confirmDialong = $('<div class="confirm-dialog"></div>');
    $('.test-panel').append(confirmDialong);

    var statusSelectPopup = $('<div class="plugins" id="status-select">'
    +'<div class="plugin-header">'
    +'<h1>검토 상태 선택</h1>'
    +'<span class="close-plugin" onclick="closePopup()">'
      +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
      + '</svg>          '
    +'</span>'
  +'</div>'
  +'<div class="plugin-contents">'
  +'<div class="select-contents">'
 
      +'<p>조회하시려는 검토 상태를 선택해 주세요<b>*</b></p>'
      +  '<ul class="select-list">'
      +     '<li>'
      +        '<label class="input-radio">'
      +           '전체'
      +           '<input type="radio" name="status-select" id="all" value="all" checked="checked" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '검토 대기중'
      +           '<input type="radio" name="status-select" id="status-0" value="status-0" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '검토중'
      +           '<input type="radio" name="status-select" id="status-1" value="status-1" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '반영 완료'
      +           '<input type="radio" name="status-select" id="status-3" value="status-3" />'
      +           '<span class="radiomark"></span>'
      +        '</label>'
      +     '</li>'
      +     '<li>'
      +        '<label class="input-radio">'
      +            '반려'
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

   

    // var firstSlide = $('<div class="ex-slide-box">'
    //   + '<div class="first-slide">'
    //     + '<div class="slide slide-01"><div class="image-box"><img src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/slide01.png" /></div><h1>켐봇이 필요한 질문에<br />응답하지 못하고 있나요?</h1><p>학습봇 모드에서 켐봇에게<br />새로운 대화를 직접 가르쳐 보세요!</p></div>'
    //     + '<div class="slide slide-02"><div class="image-box"><img src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/slide02.png" /></div><h1>간단한 정보 입력으로<br />새로운 대화를 만들 수 있어요!</h1><p>4단계의 정보를 순서대로 가르쳐 주시면<br />새로운 대화를 배울 수 있습니다!</p></div>'
    //     + '<div class="slide slide-03"><div class="image-box"><img src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/slide03.png" /></div><h1>새롭게 만든 대화가<br />켐봇에 반영되었는지 확인해 보세요.</h1><p>켐봇에 반영 요청한 내역이 잘 검토 되고 있는지<br />실시간으로 확인할 수 있어요.</p></div>'
    //     + '<div class="slide slide-04"><div class="image-box"><img src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/slide03.png" /></div><h1>도움을 주셔서 감사합니다.<br />최선을 다해 배워볼게요!</h1><p>‘학습봇 모드 시작’ 버튼을 클릭하여<br />지금 바로 학습봇 모드로 접속해 보세요!</p></div>'
    // + '</div>'
    // +'<ul class="dots">'
    // +  '<li></li>'
    // +  '<li></li>'
    // +  '<li></li>'
    // +  '<li></li>'
    // +'</ul>'
    // +'<div class="first-slide-btns">'
    // +'<button class="start-bot">학습봇 모드 시작</button>'
    // + '<button class="no-more">다시 보지 않기</button>'
    // + '</div>'
    // +'</div>');

    // $('#caas-chatbot').append(firstSlide);




  var chatbotCollapse = document.getElementById("eduClose");

  chatbotCollapse.addEventListener('click', function(e) {
    window.parent.postMessage('bot_close', '*');
  });   

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
              chatui.sendEventMessage(callEvent, {"text": callMessage});
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
      date = date.replace('am', '오전');
    }

    if(date.startsWith('pm')) {
      date = date.replace('pm', '오후');
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
      statusTextDesc = '요청해주신 답변은 아직 <b>검토 대기중</b>입니다.';
      statusText = '검토 대기중';
    } else if(selectedRequest.status == '1') {
      statusTextDesc = '요청해주신 답변은 아직 담당자 <b>검토중</b>입니다. 조금만 더 기다려 주세요!';
      statusText = '검토중';
    } else if(selectedRequest.status == '2') {
      statusTextDesc = '요청해주신 답변이 <b>반려</b> 되었습니다. 재신청 시 하단의 반려 사유를 확인해 주세요.';
      statusText = '반려';
    } else if(selectedRequest.status == '3') {
      statusTextDesc = '요청해주신 답변을 <b>반영 완료</b> 하였습니다. 도움을 주셔서 감사합니다.';
      statusText = '반영 완료';
    } else {
      statusTextDesc = '요청해주신 답변은 아직 <b>검토 대기중</b>입니다.';
      statusText = '검토 대기중';
    };

    // var statusFileNames = '';
    // for(let k=0; k<selectedRequest.files.length; k++) {
    //   statusFileNames += selectedRequest.files[k].name+'<br/>';
    // };

   
    
    var statusMessage = $('<div class="chat-message left"></div>');
    var profileCircle = $('<div class="profile"><img class="img-circle" src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/chem-profile.png"></div>');

    statusMessage.append(profileCircle);


    var statusDescBox = $('<div class="message">' + statusTextDesc + '</div>');
    statusMessage.append(statusDescBox);
      
    var statusMessageCheck = $('<div class="message request-check"></div>')
    var statusMessageTitle = $('<div class="check-title"><h5>요청 상세 정보</h5>'
    +'<span class="tag status-'+selectedRequest.status+'">' + statusText +'</span>'
    +'</div>');

    statusMessageCheck.append(statusMessageTitle);

    var statusMessageCheckList = $('<ul class="check-list">'
    +'<li><span class="check-label">요청일</span>'
    +'<span class="check-text">' + moment(selectedRequest.registeredOn).format('YYYY.MM.DD') +'</span></li>'
    +'<li><span class="check-label">카테고리</span>'
    +'<span class="check-text">'+ selectedRequest.category +'</span></li>'
    +'<li><span class="check-label">질문</span>'
    +'<span class="check-text hidden-text">'+ selectedRequest.question +'</span></li>'
    +'<li><span class="check-label">답변</span>'
    +'<span class="check-text">'+ selectedRequest.answer +'</span></li>'
    +(selectedRequest.relatedUrl ? '<li><span class="check-label">관련URL</span><span class="check-text">'+ selectedRequest.relatedUrl +'</span></li>' : '')
    +(selectedRequest.files ? '<li><span class="check-label">첨부파일</span><span class="check-text">'+ statusFileNames +'</span></li>' : '')
    + '<li><span class="check-label">담당여부</span>'
    +'<span class="check-text">'+ (selectedRequest.assigneeYn == 1 ? 'YES' : 'NO')  +'</span></li>'
    +'</ul>'
    +(selectedRequest.assigneeReason ? '<div class="auth-reason">' + selectedRequest.assigneeReason +'</div>' : '')
    );
      

    statusMessageCheck.append(statusMessageCheckList);

    if(selectedRequest.status == '3') {
      var statusMessageCopy = $('<div class="copy-question"></div>');
      var messageCopyTooltip = $('<div class="f-tooltip">복사한 질문을 켐봇에 사용해 보세요!<br />새롭게 반영된 대화를 확인하실 수 있어요.</div>');
      statusMessageCopy.append(messageCopyTooltip);
      var copyButton = $('<button type="button" class="btn-text btn-emphasis">'
      +'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.83325 1C5.72868 1 4.83325 1.89543 4.83325 3C3.72868 3 2.83325 3.89543 2.83325 5V13C2.83325 14.1046 3.72868 15 4.83325 15H10.1666C11.2712 15 12.1666 14.1046 12.1666 13C13.2712 13 14.1666 12.1046 14.1666 11V3C14.1666 1.89543 13.2712 1 12.1666 1H6.83325ZM12.1666 12.2C12.8293 12.2 13.3666 11.6627 13.3666 11V3C13.3666 2.33726 12.8293 1.8 12.1666 1.8H6.83325C6.17051 1.8 5.63325 2.33726 5.63325 3H10.1666C11.2712 3 12.1666 3.89543 12.1666 5L12.1666 12.2ZM3.63325 5C3.63325 4.33726 4.17051 3.8 4.83325 3.8H10.1666C10.8293 3.8 11.3666 4.33726 11.3666 5V13C11.3666 13.6627 10.8293 14.2 10.1666 14.2H4.83325C4.17051 14.2 3.63325 13.6627 3.63325 13V5Z" fill="#E0205C"/>'
      +'</svg>'
      + '질문 복사하기</button>');

      copyButton.on('click', function() {
        var temp = $('<input type="text" class="hidden-textbox" />');
        $("body").append(temp);
        temp.val($(this).parents('.request-check').find(".hidden-text").text()).select();
        document.execCommand('copy');
        temp.remove();

        showConfirmDialog('질문이 복사되었습니다.<br />학습봇 모드 종료 후 켐봇에 붙여넣기 해주세요.');
      });
        
      statusMessageCopy.append(copyButton);
      statusMessageCheck.append(statusMessageCopy);
    } 
      statusMessage.append(statusMessageCheck);

      var quickReply = $('<div class="custom-quick-reply"></div>');
      var backBtn = $('<span class="btn-custom-reply">뒤로가기</span>');
      backBtn.on('click', function() {
        chatui.sendEventMessage('check_status'); 
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
  console.log(resp);
  loading = false;
  $('#btn-answer').removeClass('btn-disabled');
  if(resp.response) {
    var customPayload = JSON.parse(resp.response);
    var customMessage = $('<div class="custom-message"></div>');
    
    if(customPayload.type == 'requestEnd') {
      
      var requestCheck = $('<div class="message request-check"></div>');
      var checkTitle = $('<div class="check-title"><h5>요청 상세 정보</h5><span class="tag warning">검토 대기중</span></div>');
      requestCheck.append(checkTitle);
      var checkContents = $('<ul class="check-list">'
      +'<li><span class="check-label">카테고리</span>'
      +'<span class="check-text">'+ selectedCategory +'</span></li>'
      +'<li><span class="check-label">질문</span>'
      +'<span class="check-text">'+ questionText +'</span></li>'
      +'<li><span class="check-label">답변</span>'
      +'<span class="check-text">'+ answerText +'</span></li>'
      +(answerUrl ? '<li><span class="check-label">관련URL</span><span class="check-text">'+ answerUrl +'</span></li>' : '')
      +(addedFilesName ? '<li><span class="check-label">첨부파일</span><span class="check-text">'+ addedFilesName +'</span></li>' : '')
      +'</ul>');

      requestCheck.append(checkContents);
      customMessage.append(requestCheck);

      showCheckPersonCharge();
    }

    if(customPayload["template"] && customPayload.template.outputs[0].data.items) {
      console.log(customPayload.template.outputs[0]);
      if(customPayload.template.outputs[0].type == "reflectionStatus") {

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
        +'<h5>요청 목록</h5>' 
        + '</div>');

        var selectStatus = $('<div class="select-status">'
        + '<span class="status-all">전체 (' + items.length + '건)' + '</span>'
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
            statusText = '검토 대기중';
          } else if(request.status == '1') {
            statusText = '검토중';
          } else if(request.status == '2') {
            statusText = '반려';
          } else if(request.status == '3') {
            statusText = '반영완료';
          } else {
            statusText = '검토 대기중';
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
        + '</svg>더보기'
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
        +'<h5>요청 목록</h5>' 
        + '</div>');

        var selectStatus = $('<div class="select-status">'
        + '<span class="status-all">전체 (' + customPayload.data.list.length + '건)' + '</span>'
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
            statusText = '검토 대기중';
          } else if(request.status == '1') {
            statusText = '검토중';
          } else if(request.status == '2') {
            statusText = '반려';
          } else if(request.status == '3') {
            statusText = '반영완료';
          } else {
            statusText = '검토 대기중';
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
          + '</svg>더보기'
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
            chatui.sendEventMessage(callEvent, {"text": callMessage});
          });
          quickReply.append(callIntentBtn);
        } else if(quickBtn.type == "categroySelect") {
          var categorySelectBtn = $('<span class="btn-custom-reply category-select" data-category="' + quickBtn.value + '">' + quickBtn.label +'</span>');
          categorySelectBtn.on('click', function() {
            selectedCategory = $(this).data('category');
            chatui.sendEventMessage("add_new_message_step_2");
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