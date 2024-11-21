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
var resizeObj = null;

 var iconPopupClose = '<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
 + '<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
 + '</svg>';

function dictDetailClose() {
  $('#dictDetail').removeClass('show');
  $('.plugin-dim').removeClass('show');
  setTimeout(function() {
    $('.plugin-dim').remove();
    $('#dictDetail').remove();
  }, 300);
} 

var loadingDict = false;

function resGptAllText(text) {

    var repanseMsg = text;
    var pulginDim = $('<div class="plugin-dim show"></div>');
    
    var dictDetail = $('<div class="plugins" id="dictDetail"></div>');
    var dictDetail1 = $('<div class="plugin-header">'
                        +'<h1>'+convert(gptLang.gpt_answer)+'</h1>'
                        +'<span class="close-plugin" onclick="dictDetailClose()">'
                        +'<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
                        +'<path d="M5.74478 4.75483C5.47141 4.48146 5.0282 4.48146 4.75483 4.75483C4.48146 5.0282 4.48146 5.47141 4.75483 5.74478L13.01 13.9999L4.75506 22.2548C4.48169 22.5282 4.48169 22.9714 4.75506 23.2448C5.02843 23.5181 5.47164 23.5181 5.74501 23.2448L13.9999 14.9899L22.2548 23.2448C22.5282 23.5181 22.9714 23.5181 23.2448 23.2448C23.5181 22.9714 23.5181 22.5282 23.2448 22.2548L14.9899 13.9999L23.245 5.74478C23.5184 5.47141 23.5184 5.0282 23.245 4.75483C22.9716 4.48146 22.5284 4.48146 22.2551 4.75483L13.9999 13.01L5.74478 4.75483Z" fill="#2C2C2C"/>'
                        +'</svg>'
                        +'</span>'
                        +'</div>');
    var dictDetail2 = $('<div class="plugin-contents"></div>');
    var dictDetail3 = $('<div class="gpt-all">'
                        +'<ul>'
                        +'<li><span class="hidden-text" id ="allText"><p>'+repanseMsg+'</p></span></li>'
                        +'</ul>'
                        +'</div>');
    var statusMessageCopy = $('<div class="copy-question"></div>');
    var messageCopyTooltip = $('<div class="f-tooltip">'+convert(gptLang.gpt_copyall)+'</div>');
    statusMessageCopy.append(messageCopyTooltip);
    var copyButton = $('<button type="button" class="btn btn-plugin btn-emphasis">'
                    +'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
                    +'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.83325 1C5.72868 1 4.83325 1.89543 4.83325 3C3.72868 3 2.83325 3.89543 2.83325 5V13C2.83325 14.1046 3.72868 15 4.83325 15H10.1666C11.2712 15 12.1666 14.1046 12.1666 13C13.2712 13 14.1666 12.1046 14.1666 11V3C14.1666 1.89543 13.2712 1 12.1666 1H6.83325ZM12.1666 12.2C12.8293 12.2 13.3666 11.6627 13.3666 11V3C13.3666 2.33726 12.8293 1.8 12.1666 1.8H6.83325C6.17051 1.8 5.63325 2.33726 5.63325 3H10.1666C11.2712 3 12.1666 3.89543 12.1666 5L12.1666 12.2ZM3.63325 5C3.63325 4.33726 4.17051 3.8 4.83325 3.8H10.1666C10.8293 3.8 11.3666 4.33726 11.3666 5V13C11.3666 13.6627 10.8293 14.2 10.1666 14.2H4.83325C4.17051 14.2 3.63325 13.6627 3.63325 13V5Z" fill="#E0205C"/>'
                    +'</svg>'
                    + convert(gptLang.gpt_copy)+'</button>');
    
    copyButton.on('click', function() {
        var temp = $('<textarea type="text" class="hidden-textbox" />');
        $("body").append(temp);
        temp.val($(this).parents('.plugin-contents').find(".hidden-text").text()).select();
        document.execCommand('copy');
        temp.remove();
        
        showConfirmDialog(convert(gptLang.copy_paste));
    });
    statusMessageCopy.append(copyButton);
    dictDetail2.append(dictDetail3);
    dictDetail2.append(statusMessageCopy);
    dictDetail2.append('<div class="confirm-dialog"></div>');
    dictDetail.append(dictDetail1);
    dictDetail.append(dictDetail2);

    /////////////////////////////////////// highlight 적용....
     highlightCodeBlock(dictDetail);
    ///////////////////////////////////////

    $('.test-panel').append(pulginDim);
    $('.test-panel').append(dictDetail);

    $('.plugin-dim').css('display', 'block');
    $('#dictDetail').css('display', 'block');

    setTimeout(function() {
      $('.plugin-dim').addClass('show');
      $('#dictDetail').addClass('show');
      loadingDict = false;
    }, 100);

}

function timeFormat(e) {
  let now = (e ? moment(e) : moment()).format("a h:mm");
  now = now.toString();
  if(now.startsWith('am')) {
    now = now.replace('am', convert(gptLang.t_am));
  }
  if(now.startsWith('pm')){
    now = now.replace('pm', convert(gptLang.t_pm));
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
    
  /* 사용자가 메시지를 줄바꿈한 형태대로 출력. 
   * by sunny 2023.10.25
   */       
  //console.log('message > '+message);
  message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');    
  //console.log('chgMsg > '+message);
    
  var chatMessage = '<div class="chat-message right">'
  +'<div class="message">' + message + '</div>'                  
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

// function sendCheckCharge() {
//   closePopup();
//   var chargeValueSet = $("input[name='charge-select']:checked").val();
//   var reason = $('input[name="charge-no"]:checked').val();
//   var assigneeYn = 'N';
//   if(chargeValueSet == 'yes') {
//     assigneeYn = 'Y';
//   };
//   var assigneeReason = reason;
//   if(reason == 'etc') {
//     assigneeReason = $('.etc-text').val();
//   }

//   var requestParam = {
//     query: {
//       "event": "save_answer_confirm"
//     },
//     payload :{
//       "assigneeYn": assigneeYn,
//       "category": selectedCategory,
//       "relatedUrl": answerUrl,
//       "answer": answerText,
//       "analogyIntent": '',
//       "assigneeReason": assigneeReason,
//       "file": '',
//       "userId": chatui.getSetting('userId'),
//       "question": questionText
//     }
//   }

//   var sessionId = chatui.getSessionId();

//   var reqHeader = {};
//   reqHeader["Content-Type"] = "application/json",
//   reqHeader.Authorization = "Bearer " + chatui.getSetting("apiToken"),
//   sessionId && (reqHeader["X-CHATBOT-SESSION"] = sessionId);

// 	$.ajax({
// 	    type: 'POST'
// 	  , url: chatui.getSetting("chatApiUrl") + "/gateway"
// 	  , headers: reqHeader
// 	  , dataType: 'json'
// 	  , contentType: "application/json"
// 	  , data: JSON.stringify(requestParam)
// 	  , success: function(payload, textStatus, jqXHR) {
//       console.log(payload);
//       answerReset();
//       showConfirmDialog('요청인 정보 입력이 완료되었습니다.');
//     }
// 	});


// }

// function closeCheckPersonPopup() {
//   closePopup();

//   var requestParam = {
//     query: {
//       "event": "save_answer_confirm"
//     },
//     payload :{
//       "assigneeYn": '',
//       "category": selectedCategory,
//       "relatedUrl": answerUrl,
//       "answer": answerText,
//       "analogyIntent": '',
//       "assigneeReason": '',
//       "file": '',
//       "userId": chatui.getSetting('userId'),
//       "question": questionText
//     }
//   }

//   var sessionId = chatui.getSessionId();

//   var reqHeader = {};
//   reqHeader["Content-Type"] = "application/json",
//   reqHeader.Authorization = "Bearer " + chatui.getSetting("apiToken"),
//   sessionId && (reqHeader["X-CHATBOT-SESSION"] = sessionId);

// 	$.ajax({
// 	    type: 'POST'
// 	  , url: chatui.getSetting("chatApiUrl") + "/gateway"
// 	  , headers: reqHeader
// 	  , dataType: 'json'
// 	  , contentType: "application/json"
// 	  , data: JSON.stringify(requestParam)
// 	  , success: function(payload, textStatus, jqXHR) {
//       console.log(payload);
//       answerReset();
//       showConfirmDialog('반영 요청이 완료되었습니다.');
//     }
// 	});
// }

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

function resizeTA(obj) {
    obj.style.height = '1px';
    obj.style.height = obj.scrollHeight + 'px';
}

/**
 * '사용자 메시지 입력 줄바꿈할 경우 스타일 변경' 함수
 */
function resizeFixedMenu(initTextH, orgPadding) {
    var inttFixedBottom = 2;
    var resizeHeight = inttFixedBottom + ($('.sendText').height() - initTextH);

    var lineCount = parseInt($('.sendText').height()/18);
    var newPadding = (lineCount > 1)? (orgPadding + (lineCount*15)):orgPadding;

    $(".menu.fixed").css("bottom", resizeHeight+"px");
    $(".chat-message:not(.fixed):last-child").css("padding-bottom",newPadding+"px");

    //console.log("padding-bottom > "+newPadding);
    console.log('resizeHeight > '+ resizeHeight+', sendTextheight > '+$('.sendText').height()+', lineCount > '+lineCount);

    //$("#divScroll").css("margin-bottom", marginBottom+"px");
    //$("#caas-chatbot .caas-chat-quicklink-back-color").css({ "position": "fixed", "bottom": resizeHeight+"px" });
    descendScroll();
}


/**
 * '화면 스크롤 최하단으로 내리기' 함수
 */
function descendScroll() {

    setTimeout(function() {
        var e = document.getElementById("divScroll");
        e.scrollTop = e.scrollHeight
    }, 50)
}

function checkByteSize(obj,limitSize) {
    let overYn = false;
    let stringSize = 0;
    let maxByte = limitSize;
    let stringVal = obj;
    let stringLen = obj.length;
    /*
        let byteString = "문자열 Byte 체크하기";
        let byteLength = 0;

        for(let i=0; i<byteString.length; i++){
            if(escape(byteString.charAt(i)).length >=4){
                byteLength += 3;
            }else if(escape(byteString.charAt(i)) === "%A7"){
                byteLength += 3;
              }else{
                if(escape(byteString.charAt(i)).length !=="%0D"){
                    byteLength++;
                }
            }
        }
        console.log(byteLength +" Bytes");

        //정규식으로 Byte계산
        byteLength = byteString.replace(/[\0-\x7f]:([0-\u07ff]:(.))/g,"$&$1$2").length;
        console.log(byteLength +" Bytes");

        //속도개선 문자열 Byte 계산
        byteLength = (function(s, b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b
        })(byteString);
        console.log(byteLength +" Bytes");

        stringSize = (function(s, b,i,c){
            for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
            return b
        })(obj);
        console.log("stringSize : "+stringSize +" Bytes");
    */
    // Byte 수 체크 제한
    var rbyte = 0;
    var rlen = 0;
    var one_char = "";
    var str2 = "";


    for(var i=0; i<stringLen; i++)
    {
        one_char = stringVal.charAt(i);
        if(escape(one_char).length > 4) {
            rbyte += 2;
        }else{
            rbyte++;
        }
        if(rbyte <= maxByte){
            rlen = i+1;
        }
    }
    console.log("rbyte : "+rbyte +" Bytes");
    if(rbyte > maxByte){
        //viewAlertPop("입력 사이즈는 "+maxByte+"byte를 초과할 수 없습니다.");
        viewAlertPop(convert(gptLang.input_size, [maxByte]));
        overYn = true;
        str2 = stringVal.substr(0,rlen);
        $('.sendText').val(str2);
    }
    console.log("overYn : "+overYn);
    return overYn;
}

function chkSecureText(reqText){
    var chkResult = "";
    var utterance = reqText;
    var limitSize = 250;
    var intersectSize = 70;
    var indexSize = limitSize-intersectSize;
    var cntSize = parseInt(utterance.length/indexSize)+1;
    var lastSize = utterance.length;

    var reqParam = {"query":{"text":"" , "languageCode":languageCode}};
    var sessionId = chatui.getSessionId();
    var reqHeader = {};

    reqHeader["Content-Type"] = "application/json",
        reqHeader.Authorization = "Bearer " + chatui.getSetting("apiToken"),
    sessionId && (reqHeader["X-CHATBOT-SESSION"] = sessionId);

    for(var i=0; i < cntSize; i++){
        var nameByPayLoad;
        var keywordJson;
        var keywordsList;
        var blockKeyword = [];
        var reqLimitText;
        if(i==0) reqLimitText = utterance.substr(0,limitSize);
        else if(i==cntSize-1) reqLimitText = utterance.substring(i*indexSize,lastSize);
        else reqLimitText = utterance.substr(i*indexSize,limitSize);
        reqParam.query.text = reqLimitText;
        console.log("block keyword check text : \n"+reqLimitText);
        $.ajax({
            type: 'POST'
            , url: chatui.getSetting("chatApiUrl") + "/gateway"
            , headers: reqHeader
            , dataType: 'json'
            , contentType: "application/json"
            , async: false
            // , async: true
            , data: JSON.stringify(reqParam)
            , success: function(payload, textStatus, jqXHR) {
                console.log("payload : ",payload);
                nameByPayLoad = payload.queryResult.intent.firstName;
                // blockKeyword = payload.queryResult.parameters.blockKeyword;
                if(nameByPayLoad == "발화 내용 보안 체크"){
                    keywordJson = JSON.parse(payload.queryResult.messages[0].response);
                    keywordsList = keywordJson.keywordsList;
                    console.log("parameters : ",payload.queryResult.parameters);
                    //console.log("wordsList : ",keywordJson.wordsList);
                    console.log("keywordsList : ",keywordsList);
                    console.log('keywordsList.length > '+keywordsList.length);
                    for(var k=0; k < keywordsList.length; k++) blockKeyword.push(keywordsList[k]);
                    console.log("blockKeyword : ",blockKeyword);
                }
            }
        });

        if(nameByPayLoad == "발화 내용 보안 체크"){
            //   if(blockKeyword !== undefined) blockKeyword = blockKeyword.replaceAll('"','').replaceAll('[','').replaceAll(']','');
            //   if(blockKeyword.length >0){
            //     blockKeyword = blockKeyword.split(',');
            for(j=0;j<blockKeyword.length;j++){
                if(chkResult.indexOf(blockKeyword[j]) < 0) chkResult += blockKeyword[j]+",";
            }
            //   }
        }
    }

    chkResult = chkResult.replace(/,$/, '');
    console.log("chkResult : "+chkResult);
    return chkResult;
}

function secBtnDisable(){
    $('.btn-default').last().prop('disabled',true);
    console.log("btn-default : ",$('.btn-default').last());
    // var lastElement = $('.message-content').last();
    // console.log("lastElement : ",lastElement);
    // if(lastElement [0].nextSibling !== null){
    //   if(lastElement[0].nextSibling.outerText === "사내 정보를 포함한 메시지가 아닙니다.") {
    //     $('.btn-wrap').last()[0].children[0].children[0].disabled = true;
    //   }
    // }
}

function viewAlertPop(msg){
    
    var temp = $('<input type="text" class="hidden-textbox" />');
    $("body").append(temp);
    temp.val($(this).parents('.request-check').find(".hidden-text").text()).select();
    document.execCommand('copy');
    temp.remove();

    showConfirmDialog(msg);
}

//Popup Module
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
 
chatui.onLoad = function(){
    console.log("lx gpt봇 onLoad");

    languageCode = chatui.getSetting("languageCode");
    gptLang = (languageCode == 'en')? lang_en:lang_ko;

    //console.log('languageCode : '+languageCode+', message : '+gptLang.copy_paste);
    //console.log('gpt targetParent : '+chatui.getParameter('targetParent'));
    
  $(".test-panel .panel-wrapper .chat-panel .info-area").html(
    '<div class="edu-header">'
    +'<h1>Chat GPT</h1>'
    +'<div class="dot-flashing">'
    +'</div>'
    +'</div>'
    //+'<span class="edu-close" id="eduClose">종료하기</span>'

    +'<div class="collapse" id="eduClose">'
//    +    '<img src="https://chatclient-stg.ai.lgcns.com/singlex-ai-chatbot-contents-stg/88a39d64-0e9a-4ea7-ac57-de5783a3e937/images/img_close.png" />'
    +'</div>'
  );
  
  $(".test-panel .panel-wrapper .chat-panel .form-group").empty();
//   $(".test-panel .panel-wrapper .chat-panel .form-group").append('<input type="text" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="질문을 입력해주세요" autocomplete="off">');
  $(".test-panel .panel-wrapper .chat-panel .form-group").append('<textarea type="text" style="resize:none" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="'+convert(gptLang.msg_input)+'"></textarea>');
  $(".test-panel .panel-wrapper .chat-panel .form-group").append('<button class="btn btn-trans btn-send caas-chat-send-icon-color"><svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.0676 4.79338C26.554 3.3341 25.1657 1.94578 23.7064 2.43221L4.10954 8.96451C2.53186 9.4904 2.37758 11.6613 3.86504 12.405L10.2305 15.5877C10.9042 15.9246 11.7179 15.7925 12.2505 15.2599L20.206 7.30442C20.4794 7.03106 20.9226 7.03106 21.1959 7.30442C21.4693 7.57779 21.4693 8.02101 21.1959 8.29437L13.2403 16.25C12.7077 16.7826 12.5756 17.5964 12.9125 18.2701L16.0948 24.6348C16.8386 26.1222 19.0094 25.968 19.5353 24.3903L26.0676 4.79338Z"></path></svg></button>');
  var beforeConv = '<div class="chat-message prev-msg"><a href="#"><i class="icon icon-lg-circle-arrow-down"></i><span data-lang-text-id="previous_chatting">이전 대화 조회</span></a></div>';
  $('#prev-msg').on('click', function(e){
     alert("이전 대화 보기 api 호출!!"); 
  });
//   $('#divScroll').append(beforeConv);

  // 발화영역 메시지 여러줄 입력시 챗봇 영역 화면 스크롤 계산.
  var initTextH = $('.sendText').height();          //  사용자 메시지 영역 높이
  var orgPadding = Number($(".chat-message:not(.fixed):last-child").css("padding-bottom").replace("px", ""));  // 사용자 발화영역 last padding bottom
  var orgLineCount = 0;


  $('.sendText').on('keyup', function(e) {
    var val = $(this).val();
    resizeObj = this;
    if(val.length > 0) {
      $('.btn-send').addClass('active');
    } else {
      $('.btn-send').removeClass('active');
    }

    if(checkByteSize(val,4096)){
            $('.sendText').focus();
            return;
    }
    
    if(val.length > 0 && (e.code == 'Enter' || e.keyCode == 13)) {
        if(!e.shiftKey){

          // ChatBot 소스코드 변환 응답값 수정 (24.11.13) Start
          var secVal = val.replace(/\n/g, "");
          $('.sendText').val('');
          $('.btn-send').removeClass('active');
          setTimeout(function() {
              var keyWord = chkSecureText(secVal);
              
              chgVal = replaceHtmlCodeForChar(val);
              chgVal = replaceSqlCodeForChar(chgVal);
              chgVal = replaceLinuxCodeForChar(chgVal);
              console.log('chgVal : '+chgVal);                  
              
              secBtnDisable();
              appendQueryText(chgVal);
              chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":chgVal,"keyWord":keyWord});
          }, 100);
         // ChatBot 소스코드 변환 응답값 수정 (24.11.13) End

////////////////////////////////////////////////////////////////////// 

        //   var chgVal = val.replace(/\n/g, "");
        //   $('.sendText').val('');
        //   $('.btn-send').removeClass('active');
        //   setTimeout(function() {
        //       var keyWord = chkSecureText(chgVal);
        //       secBtnDisable();
        //       appendQueryText(val);
        //       chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":val,"keyWord":keyWord});
        //   }, 100);

        }
    }
    resizeTA(this);
    
    // 발화영역 메시지 여러줄 입력시 챗봇 영역 화면 스크롤 계산.
    // 라인이 달라질때만 적용되게 함. 
    var lineCount = parseInt($('.sendText').height()/18);
    if(orgLineCount != lineCount) {
        resizeFixedMenu(initTextH, orgPadding);        
        orgLineCount = lineCount;
    }

  });

  $('.btn-send').on('click', function(e) {
    var val = $('.sendText').val();
    if(checkByteSize(val,4096)){
        $('.sendText').focus();
        return;
    } else {
        if(val.length > 0) {
            var sessionId = chatui.getSessionId();
            
            // ChatBot 소스코드 변환 응답값 수정 (24.11.13) Start
            var secVal = val.replace(/\n/g, "");
            $('.sendText').val('');
            $('.btn-send').removeClass('active');
            setTimeout(function() {
                var keyWord = chkSecureText(secVal);
                
                chgVal = replaceHtmlCodeForChar(val);
                chgVal = replaceSqlCodeForChar(chgVal);
                chgVal = replaceLinuxCodeForChar(chgVal);
                console.log('chgVal : '+chgVal);                  
                
                secBtnDisable();
                appendQueryText(chgVal);
                chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":chgVal,"keyWord":keyWord});
            }, 100);
            // ChatBot 소스코드 변환 응답값 수정 (24.11.13) End

////////////////////////////////////////////////////////////////////// 

        //   var chgVal = val.replace(/\n/g, "");
        //   $('.sendText').val('');
        //   $('.btn-send').removeClass('active');
        //   setTimeout(function() {
        //       var keyWord = chkSecureText(chgVal);
        //       secBtnDisable();
        //       appendQueryText(val);
        //       chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":val,"keyWord":keyWord});
        //   }, 100);
          
        }
    }
    $('.sendText').focus();
    resizeTA(resizeObj);
  })

    var confirmDialong = $('<div class="confirm-dialog"></div>');
    $('.test-panel').append(confirmDialong);

  var chatbotCollapse = document.getElementById("eduClose");
  chatbotCollapse.addEventListener('click', function(e) {
      
    if(!window.opener) {  
        pop.open('create', $(this), 'Gpt_Bot_Close', 'loadEl.gpt_bot_close("GPT 모드 종료", "모드 종료 시 대화 내용이 저장되지 않습니다.<br />종료할까요?")');
    
        $('#btnConfirm').on('click', function() {
    
          window.parent.postMessage('bot_close', '*');

        });
        // $('.list-menu').fadeOut();
    }
    else{
        window.close();
    }
  });

    var hlscriptSrc = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';

    loadScript(hlscriptSrc, function() {
        // 콜백 함수는 스크립트 로드가 끝나면 실행됩니다.
    });

};

function loadScript(src, callback) {
    let script = document.createElement('script');
    script.src = src;
    
    script.onload = () => callback(script);
    
    document.head.appendChild(script);
}

// ChatBot 소스코드 변환 응답값 수정 (24.11.13) Start

// 발화내용 중 sql 관련 단어 포함된 경우 html 코드로 치환.
function replaceSqlCodeForChar(val){
    let chgVal = val.replace(/select/gi, "&#115;&#101;&#108;&#101;&#99;&#116; ")
                .replace(/from/gi, "&#102;&#111;&#111;&#109; ")
                .replace(/where/gi, "&#119;&#104;&#101;&#114;&#101; ")
                .replace(/insert/gi, "&#105;&#110;&#115;&#101;&#114;&#116; ")
                .replace(/update/gi, "&#117;&#112;&#100;&#97;&#116;&#101; ")
                .replace(/delete/gi, "&#100;&#101;&#108;&#101;&#116;&#101; ")
                .replace(/create/gi, "&#99;&#114;&#101;&#112;&#101;&#116;&#101; ")
                .replace(/alter/gi, "&#97;&#108;&#116;&#101;&#114; ")
                .replace(/drop/gi, "&#100;&#114;&#111;&#112; ")
                .replace(/table/gi, "&#116;&#97;&#98;&#108;&#101; ")
                .replace(/database/gi, "&#100;&#97;&#116;&#97;&#98;&#101;&#115;&#101; ")
                .replace(/describe/gi, "&#100;&#101;&#115;&#99;&#114;&#105;&#112;&#101; ")
                .replace(/values/gi, "&#118;&#97;&#108;&#117;&#101;&#115; ")
                .replace(/exists/gi, "&#101;&#120;&#105;&#115;&#116;&#115; ")
                .replace(/primary/gi, "&#112;&#114;&#105;&#109;&#97;&#114;&#121; ")
                .replace(/foreign/gi, "&#102;&#111;&#114;&#101;&#105;&#103;&#110; ")
                .replace(/key/gi, "&#107;&#101;&#121;")
                ;
                
    return chgVal;
}

// 발화내용 중 linux 관련 단어 포함된 경우 html 코드로 치환.
function replaceLinuxCodeForChar(val){
    let chgVal = val.replace(/shutdown/gi, "&#115;&#104;&#117;&#116;&#100;&#111;&#119;&#110;")
                .replace(/reboot/gi, "&#114;&#101;&#98;&#111;&#111;&#116; ")
                .replace(/halt/gi, "&#104;&#97;&#108;&#116;")
                .replace(/useradd/gi, "&#117;&#115;&#101;&#114;&#97;&#100;&#100; ")
                .replace(/adduser/gi, "&#97;&#100;&#100;&#117;&#115;&#101;&#114; ")
                .replace(/userdel/gi, "&#117;&#115;&#101;&#114;&#100;&#101;&#108; ")
                .replace(/ifconfig/gi, "&#105;&#102;&#99;&#111;&#110;&#102;&#105;&#103; ")
                .replace(/ipconfig/gi, "&#105;&#112;&#99;&#111;&#110;&#102;&#105;&#103; ")
                .replace(/netstat/gi, "&#110;&#101;&#116;&#115;&#116;&#97;&#116; ")
                .replace(/fdisk/gi, "&#102;&#100;&#105;&#115;&#107;")
                .replace(/rm /gi, "&#114;&#109; ")
                .replace(/chmod/gi, "&#99;&#104;&#109;&#111;&#100;")
                .replace(/chown/gi, "&#99;&#104;&#111;&#119;&#110;")
                .replace(/route/gi, "&#114;&#111;&#117;&#116;&#101;")
                .replace(/on /gi, "&#79;&#110; ")
                .replace(/err/gi, "&#69;&#114;&#114;")
                .replace(/resume/gi, "&#82;&#101;&#115;&#117;&#109;&#101;")
                .replace(/next/gi, "&#78;&#101;&#120;&#116;")
                .replace(/import/gi, "&#105;&#109;&#112;&#111;&#114;&#116;")
                .replace(/os /gi, "&#111;&#115; ")
                .replace(/refer/gi, "&#82;&#101;&#102;&#101;&#114")
                ;
                 
    return chgVal;
}

// 발화내용 중 특수문자 포함된 경우 html 코드로 치환.
function replaceHtmlCodeForChar(val) {
    let chgVal = val.replace(/\&/g,"&amp;")              // &#38; 
                .replace(/\#/g,"&#35;")           // 치환한 html 문자에 포함되어 있어서 제일 먼저 치환함. 
                .replace(/\(/g,"&#40;")
                .replace(/\)/g,"&#41;")
                .replace(/\"/gi,"&quot;")               // 	&#34;
                .replace(/\'/gi,"&#39;")
                .replace(/\$/g,"&#36;")
                .replace(/\./g,"&#46;")
                .replace(/\%/g,"&#37;")
                .replace(/\</g,"&#60;")
                .replace(/\>/g,"&#62;")
                .replace(/\[/g,"&#91;")
                .replace(/\]/g,"&#93;")
                .replace(/\{/g,"&#123;")
                .replace(/\}/g,"&#125;")
                .replace(/\!/g,"&#33;")
                .replace(/\*/g,"&#42;")
                .replace(/\+/g,"&#43;")
                .replace(/\,/g,"&#44;")
                .replace(/\-/g,"&#45;")
                .replace(/\//g,"&#47;")
                .replace(/\:/g,"&#58;")
                //.replace(/\;/g,"&#59;")       // 처리시 모든 특수문자뒤에 세미콜론이 붙는다...
                .replace(/\=/g,"&#61;")
                .replace(/\?/g,"&#63;")
                .replace(/\@/g,"&#64;")
                .replace(/\\/g,"&#92;")
                .replace(/\^/g,"&#94;")
                .replace(/\`/g,"&#96;")
                .replace(/\~/g,"&#126;");
                
    return chgVal;
} 

// ChatBot 소스코드 변환 응답값 수정 (24.11.13) End

var saveQuestion = false;

chatui.onReceiveResponse = function(resp) {
  console.log('onReceiveResponse : ', resp);
  loading = false;
  $('#btn-answer').removeClass('btn-disabled');

  setTimeout(function() {

    if(resp.response.query.event == "Welcome") {
      if(chatui.getParameter("queryText")) {
          var sessionId = chatui.getSessionId();
          appendQueryText(chatui.getParameter("queryText"));
          chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":chatui.getParameter("queryText")});
        
      }
    } 

    
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
            //   var mText = button.value;
              console.log("버튼 텍스트 : "+mText);
            //   chatui.sendMessage(mText);
            appendQueryText(mText);
            chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":mText});
              
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
      date = date.replace('am', convert(gptLang.t_am));
    }

    if(date.startsWith('pm')) {
      date = date.replace('pm', convert(gptLang.t_pm));
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
    var profileCircle = $('<div class="profile"><img class="img-circle" src="https://chatclient-stg.ai.lgcns.com/singlex-ai-chatbot-contents-stg/e860eeaf-bdaf-4d42-9e85-2a3fe249722e/images/chem-profile.png"></div>');

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
        console.log("여기가 진짜");
        console.log(temp.val());
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
        chatui.sendEventMessage('check_status', {"languageCode": languageCode}); 
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
    console.log("resp : "+customPayload);
    var customMessage = $('<div class="custom-message"></div>');

    if(customPayload.type == 'gptPush') {
        // resizeTA(resizeObj);
        //var viewLimit = 200;
        var viewLimit = viewTextLimit(); 
        
        var checkContentsText = resp.text;
        var checkContents;
        var messages = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color">'+convert(gptLang.git_answer2)+'</div>');

        console.log('window.width : '+$(window).width());
        console.log('viewLimit : '+viewLimit);

        var isCopyBtn = false;
        var fullContents = $('<div class="full-message" style="display:none">'+checkContentsText+'</div>');
        if(checkContentsText.length<200) {
            console.log("1111");
            isCopyBtn = true;
            checkContents = $('<div id="answer-message" class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text">'
            +checkContentsText+'</span></div>');
        }
        else if(checkContentsText.length > viewLimit){
            console.log("2222");
            isCopyBtn = false;
            
            checkContents = $('<div id="answer-message" class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color">'
            //+'<div class="full-message" style="display:none">'+checkContentsText+'</div>'
            +'<span class="check-text hidden-text">'
            +checkContentsText+'</span></div>');
            
            //checkContents = $('<div class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text">'
            //    +checkContentsText.substr(0,viewLimit)+"..."+'</span></div>');
            
            // 코드 데이터가 있을 경우 태그가 잘리는 문제가 있어서 수정함. 
            var htmlContents = checkContents.find('.check-text').html();
            //console.log('htmlContents : '+htmlContents);
            var subContentsText = htmlContents.substr(0,viewLimit)+"...";
            //console.log('subContentsText > '+subContentsText);
        
            checkContents.find('.check-text').html(subContentsText);
            
        }else{
            console.log("3333");
            isCopyBtn = true;
            
            checkContents = $('<div id="answer-message" class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text" id="msg-result">'
                +checkContentsText+'</span></div>');
            
            //checkContents = $('<div class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text">'
            //    +checkContentsText+'</span></div>');
        }
        var statusMessageCopy = $('<div class="copy-question"></div>');
        var messageCopyTooltip = $('<div class="f-tooltip">'+convert(gptLang.gpt_copyall)+'</div>');
        statusMessageCopy.append(messageCopyTooltip);
        var copyButton = $('<button type="button" class="btn-text btn-emphasis">'
        +'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.83325 1C5.72868 1 4.83325 1.89543 4.83325 3C3.72868 3 2.83325 3.89543 2.83325 5V13C2.83325 14.1046 3.72868 15 4.83325 15H10.1666C11.2712 15 12.1666 14.1046 12.1666 13C13.2712 13 14.1666 12.1046 14.1666 11V3C14.1666 1.89543 13.2712 1 12.1666 1H6.83325ZM12.1666 12.2C12.8293 12.2 13.3666 11.6627 13.3666 11V3C13.3666 2.33726 12.8293 1.8 12.1666 1.8H6.83325C6.17051 1.8 5.63325 2.33726 5.63325 3H10.1666C11.2712 3 12.1666 3.89543 12.1666 5L12.1666 12.2ZM3.63325 5C3.63325 4.33726 4.17051 3.8 4.83325 3.8H10.1666C10.8293 3.8 11.3666 4.33726 11.3666 5V13C11.3666 13.6627 10.8293 14.2 10.1666 14.2H4.83325C4.17051 14.2 3.63325 13.6627 3.63325 13V5Z" fill="#E0205C"/>'
        +'</svg>'
        + convert(gptLang.gpt_copy)+'</button>'
        +'</div>');
        
        copyButton.on('click', function() {
            var temp = $('<textarea type="text" class="hidden-textbox" />');
            $("body").append(temp);
            temp.val($(this).parents('.answer-message').find(".hidden-text").text()).select();
            document.execCommand('copy');
            showConfirmDialog(temp);
            temp.remove();
    
            showConfirmDialog(convert(gptLang.copy_paste));
        });

        var seeMore =  $('<div class="see-more">'
        +convert(gptLang.view_all)+' <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<path fill-rule="evenodd" clip-rule="evenodd" d="M5.3817 6.60128C5.58377 6.82861 5.58377 7.17119 5.3817 7.39852L0.63891 12.7342C0.492143 12.8993 0.507015 13.1521 0.672128 13.2989C0.837241 13.4456 1.09007 13.4308 1.23684 13.2656L5.97963 7.93001C6.45113 7.39957 6.45113 6.60023 5.97962 6.06979L1.23684 0.734153C1.09007 0.56904 0.837241 0.554168 0.672128 0.700936C0.507015 0.847703 0.492143 1.10053 0.63891 1.26565L5.3817 6.60128Z" fill="#2C2C2C"/>'
        +'</svg>'
        +'</div>');

        seeMore.on('click', function() {
          $(this).parents('.request-status').find('.list-box').removeClass('disp-none');
          resGptAllText(checkContentsText);
        //   $(this).remove();
        });

        //checkContentsText.length>viewLimit?checkContents.append(seeMore):checkContents.append(statusMessageCopy.append(copyButton));

        checkContents.prepend(fullContents);            // 응답내용을 일부를 보여주든, 전체를 보여주든 full-message 포함(feat.창 사이즈 변경시 필요)
        !isCopyBtn? checkContents.append(seeMore):checkContents.append(statusMessageCopy.append(copyButton));

        // requestCheck.append(checkContents);
        // customMessage.append(requestCheck);
        
        customMessage.append(messages);
        customMessage.append(checkContents);

        /////////////////////////////////////// highlight 적용....
         highlightCodeBlock(customMessage);
        ///////////////////////////////////////

    }else if(customPayload.type == 'callGpt') {
            var reqMsg = customPayload.template.outputs[0].data.message;
            var keyword = customPayload.template.outputs[0].data.keyword;
            // var basicMsg = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color"><div class="basic"><div class="message-content" style="white-space: pre-line">'
            // +customPayload.template.outputs[0].data.items+'</div>'
            // +'<div class="btn-wrap"><div></div></div></div></div>');

            var basicMsg = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color"></div>');
            var basicSub1 = $('<div class="basic"></div>');
            var basciSub2 = $('<div class="message-content" style="white-space: pre-line">'+customPayload.template.outputs[0].data.items+'</div>');
            var basicSub3 = $('<div class="btn-wrap"></div>');
            var basicSub4 = $('<div></div>');
            var simpleButton = $('<button id="btn-callGpt" class="btn btn-default caas-chat-button-back-color caas-chat-button-font-color caas-chat-button-border-color" data-slot="N" style="font-size:12px;border-color:#FA9AA5;color:#E0205C;" title="'+customPayload.template.outputs[0].data.label+'">'
                +'<span></span>'+ customPayload.template.outputs[0].data.label + '</button>');

            simpleButton.on('click', function() {
                $(this).prop('disabled',true);
                appendQueryText(customPayload.template.outputs[0].data.label);
                //   chatui.sendEventMessage("btnCallGPT",{"reqText":reqMsg,"keyWord":keyword});
                chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "isProblem":"btn","reqText":reqMsg,"keyWord":keyword});
            });

            basicSub4.append(simpleButton);
            basicSub3.append(basicSub4);
            basicSub1.append(basciSub2);
            basicSub1.append(basicSub3);
            basicMsg.append(basicSub1);

            customMessage.append(basicMsg);

    }else if(customPayload.type == 'requestEnd') {
      
      var requestCheck = $('<div class="message request-check"></div>');
      var checkTitle = $('<div class="check-title"><h5>요청 상세 정보</h5><span class="tag warning">검토 대기중</span></div>');
      requestCheck.append(checkTitle);
      var checkContents = $('<ul class="check-list">'
      +'<li><span class="check-label">카테고리</span>'
      +'<span class="check-text">'+ "selectedCategory" +'</span></li>'
      +'<li><span class="check-label">질문</span>'
      +'<span class="check-text">'+ "questionText" +'</span></li>'
      +'<li><span class="check-label">답변</span>'
      +'<span class="check-text">'+ "answerText" +'</span></li>'
      +(answerUrl ? '<li><span class="check-label">관련URL</span><span class="check-text">'+ "answerUrl" +'</span></li>' : '')
      +(addedFilesName ? '<li><span class="check-label">첨부파일</span><span class="check-text">'+ "addedFilesName" +'</span></li>' : '')
      +'</ul>');

      requestCheck.append(checkContents);
      customMessage.append(requestCheck);

      showCheckPersonCharge();
    
    } else {

        var basicMsg = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color">'
        +customPayload.template.outputs[0].data.items
        +'</div>');
        
        customMessage.append(basicMsg);
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
        if(quickBtn.type == 'btn') {
            var sendMessageBtn = $('<span class="btn-custom-reply send-message" data-cmessage="'+ quickBtn.value +'">' + quickBtn.label + '</span>');
            sendMessageBtn.on('click', function() {
              var mText = $(this).data('cmessage');
            //   chatui.sendMessage(mText);
            appendQueryText(mText);
            chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":mText});
            });

            quickReply.append(sendMessageBtn);
        } else if(quickBtn.type == "callIntent") {
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

/*
 * 코드 블럭이 있는 경우 
 * 코드 블럭에 highlight 적용
 */
function highlightCodeBlock($customMessage) {
    
    //console.log('....'+$customMessage.find('pre > code').length);
    //var $answerText = $customMessage.find('#answer-message').find('.check-text');
    var $answerText = $customMessage.find('.hidden-text');

    $answerText.find('pre > code').each(function() {
        var codehtml = $(this).text();
        //console.log('codeHtml : '+codehtml);
        
        let codeLang = $(this).attr('class');
        //console.log('codeLang : '+codeLang);
        if(codeLang == "undefined" || codeLang == null) {
            codeLang = "language-xml";
            $(this).addClass(codeLang);
        }
        //console.log('codeLang : '+codeLang);
        
        let realLang = isIncludeLanguage(codeLang);
        //console.log('realLang : '+realLang);
        
        $(this).empty();
        $(this).attr('data-highlighted', 'yes').addClass('hljs');
            
        $(this).before('<div class="code-language" style="text-align: right; padding-right: 10px;"><small class="code-language-text" style="font-weight: bold;"><span class="sr-only">Language:</span>'+realLang+'</small></div>');
        
        if(realLang == '') {
            $(this).append(hljs.highlight(codehtml, { language: 'sh' }).value);         // 선언된 language 가 없으면 기본 : sh
        }
        else{
            $(this).append(hljs.highlight(codehtml, { language: realLang }).value);
        }
    });
}

const languageMap = new Map([
  ["python", "PYTHON"],
  ["파이썬", "PYTHON"],
  ["파이선", "PYTHON"],
  ["javascript", "JAVASCRIPT"], 
  ["자바스크립트", "JAVASCRIPT"], 
  ["JavaScript", "JAVASCRIPT"], 
  ["js", "JAVASCRIPT"], 
  ["java", "JAVA"], 
  ["자바", "JAVA"], 
  ["json", "JSON"], 
  ["css", "CSS"],  
  ["CSS", "CSS"],  
  ["html", "HTML"], 
  ["HTML", "HTML"],
  ["xml", "XML"], 
  ["SQL", "SQL"], 
  ["sql", "SQL"], 
  ["bash", "BASH"],  
  ["BASH", "BASH"],  
  ["-sh", "SH"],  
  ["-SH", "SH"],  
  ["C++", "C++"],  
  ["c++", "C++"],  
  ["C언어", "C"],  
  ["c언어", "C"]  
  //,["C", "c"],  
  //,["c", "c"] 
]);

function isIncludeLanguage(cont) {
  var retVal = "";
  
  //console.log('cont : '+cont);
  if(cont == "undefined" || cont == null) {
      return retVal;
  }
  
  for (let [key, value] of languageMap) {
    if(cont.lastIndexOf(key) > -1)  {
      return value;
    } 
  }
  
  return retVal;
}

// 2023.11.27 반응형 UI Start
let delay = 100;
let timer = null;
let textLimit = 100;

$(window).resize(function(){
  clearTimeout(timer);
  
  var fullText = null;
  var fullTextLength = 0;
  var viewTextLength = 0;
  var answerWidth = 0;
  var newContentText = null;
  timer = setTimeout(function(){
      console.log('window width : '+$(window).width());
      console.log('window height : '+$(window).height());
      
     customMessageResize();
     
  }, delay);
});    

/*
 * 커스텀 대화내용을 리사이징하는 함수. 2023.11.30
 */
function customMessageResize() {

      $('.answer-message').each(function() {
          console.log('full message length : '+$(this).find('.full-message').length);
          //if($(this).find('.full-message').length > 0) {
              
              fullText = ($(this).find('.full-message').length > 0)? $(this).find('.full-message').html():$(this).find('.hidden-text').html();
              fullTextLength = fullText.length;
              viewTextLength = fullTextLength - textLimit;
              console.log('fullText >>>> '+fullText);
              answerWidth = $(this).width();

              var viewLimit = viewTextLimit(answerWidth);
              
              console.log('answer-message width : '+$(this).width());
              console.log('viewLimit...'+viewLimit+', viewTextLength : '+viewTextLength);

              $(this).find('.full-message').remove();
              $(this).find('.copy-question').remove();
              $(this).find('.see-more').remove();
              
//              if($('.history-message').length > 0) {            // 세션이력 메시지의 경우는 일단. 전체보기/답변복사 버튼 없이. 
//                  console.log('history...');
//                  newContentText = fullText;
//                  $(this).find(".hidden-text").html(newContentText);
//              }
//              else{
                  console.log('not history...');
                  if(viewLimit < viewTextLength) {
                      newContentText = fullText.substr(0,viewLimit)+"...";
                      $(this).prepend('<div class="full-message" style="display:none">'+fullText+'</div>'); // 응답내용을 일부를 보여주든, 전체를 보여주든 full-message 포함(feat.창 사이즈 변경시 필요)
                      
                      $(this).append(appendAnswerButton('more', fullText));
                  }
                  else{
                      newContentText = fullText;
                      $(this).prepend('<div class="full-message" style="display:none">'+fullText+'</div>'); // 응답내용을 일부를 보여주든, 전체를 보여주든 full-message 포함(feat.창 사이즈 변경시 필요)
                      $(this).append(appendAnswerButton('copy'));
                  }
                  $(this).find(".hidden-text").html(newContentText);
                  highlightCodeBlock($(this));
//              }
              
          //}
      });
    
}

/*
* 커스텀메시지를 
* 브라우저 창 크기에 따라서 보여주는 함수. 2023.11.27
*/
function viewTextLimit(viewWidth) {
    //console.log('...'+$(leftChatSessionList).hasClass("left-menu"));
    //var menuVal = ($(leftChatSessionList).hasClass("left-menu"))? 220:0;            // 좌측 대화세션이 열려 있으면 그 부분만큼 제외함. 
    var menuVal = 0;
    objWidth = (viewWidth == null)? (($(window).width()-menuVal)*0.85)-36:viewWidth;
    
    console.log('objWith : '+objWidth);
    var viewLimit = (objWidth>400)? (parseInt(objWidth/10)-20)*10:200;
    return viewLimit;
}

/*
* 커스텀메시지에 따라오는 버튼을 
* 브라우저 창 클기에 따라서 보여주는 함수. 2023.11.27
*/
function appendAnswerButton(gubun, fullText) {
    var answerButton = null;  
        if(gubun == 'copy') {
            var statusMessageCopy = $('<div class="copy-question"></div>');
            var messageCopyTooltip = $('<div class="f-tooltip">GPT 답변 전체 복사하기.</div>');
            statusMessageCopy.append(messageCopyTooltip);
            var copyButton = $('<button type="button" class="btn-text btn-emphasis">'
            +'<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'<path fill-rule="evenodd" clip-rule="evenodd" d="M6.83325 1C5.72868 1 4.83325 1.89543 4.83325 3C3.72868 3 2.83325 3.89543 2.83325 5V13C2.83325 14.1046 3.72868 15 4.83325 15H10.1666C11.2712 15 12.1666 14.1046 12.1666 13C13.2712 13 14.1666 12.1046 14.1666 11V3C14.1666 1.89543 13.2712 1 12.1666 1H6.83325ZM12.1666 12.2C12.8293 12.2 13.3666 11.6627 13.3666 11V3C13.3666 2.33726 12.8293 1.8 12.1666 1.8H6.83325C6.17051 1.8 5.63325 2.33726 5.63325 3H10.1666C11.2712 3 12.1666 3.89543 12.1666 5L12.1666 12.2ZM3.63325 5C3.63325 4.33726 4.17051 3.8 4.83325 3.8H10.1666C10.8293 3.8 11.3666 4.33726 11.3666 5V13C11.3666 13.6627 10.8293 14.2 10.1666 14.2H4.83325C4.17051 14.2 3.63325 13.6627 3.63325 13V5Z" fill="#E0205C"/>'
            +'</svg>'
            + '답변 복사하기</button>'
            +'</div>');
            
            copyButton.on('click', function() {
                var temp = $('<textarea type="text" class="hidden-textbox" />');
                $("body").append(temp);
                temp.val($(this).parents('.answer-message').find(".hidden-text").text()).select();
                document.execCommand('copy');
                showConfirmDialog(temp);
                temp.remove();
        
                showConfirmDialog('GPT 답변을 복사했어요!<br />원하는 창에 붙여넣기 해주세요.');
            });
            
            answerButton = statusMessageCopy.append(copyButton);
        }
        else if(gubun == 'more') {
            var seeMore =  $('<div class="see-more">'
            +'전체보기 <svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'<path fill-rule="evenodd" clip-rule="evenodd" d="M5.3817 6.60128C5.58377 6.82861 5.58377 7.17119 5.3817 7.39852L0.63891 12.7342C0.492143 12.8993 0.507015 13.1521 0.672128 13.2989C0.837241 13.4456 1.09007 13.4308 1.23684 13.2656L5.97963 7.93001C6.45113 7.39957 6.45113 6.60023 5.97962 6.06979L1.23684 0.734153C1.09007 0.56904 0.837241 0.554168 0.672128 0.700936C0.507015 0.847703 0.492143 1.10053 0.63891 1.26565L5.3817 6.60128Z" fill="#2C2C2C"/>'
            +'</svg>'
            +'</div>');
    
            seeMore.on('click', function() {
              $(this).parents('.request-status').find('.list-box').removeClass('disp-none');
              resGptAllText(fullText);
            //   $(this).remove();
            });
            
            answerButton = seeMore;
            
        }

    return answerButton;
}
// 2023.11.27 반응형 UI End

/********************************************************** element *************************************************************************************/
var loadEl = {
  'gpt_bot_close': function(popTitle, msg) {
      var html = '<div class="pop-wrapper dialog">' +
                    '<h2>' + popTitle + '</h2>' +
                    '<span class="dialog-close" onclick="pop.close(this);">' + 
                      iconPopupClose +
                    '</span>' +
                    '<p class="section-message">' +
                        msg +
                    '</p>' +
                    '<div class="dialog-btns">' +
                        '<button type="button" onclick="pop.close(this);" class="cancel">취소</button>' +
                        '<button type="button" id="btnConfirm" class="confirm">종료</button>' 
                    '</div>' +
                  '</div>';
      return html;
  }
}

/***************************************************************************************/

var languageCode = null;
var gptLang = null;
var lang_ko = {
  gpt_answer : "GPT 답변",
  gpt_copyall : "GPT 답변 전체 복사하기.", 
  gpt_copy : "답변 복사하기", 
  copy_paste : "GPT 답변을 복사했어요!<br />원하는 창에 붙여넣기 해주세요.", 
  t_am : "오전", 
  t_pm : "오후", 
  input_size:  "입력 사이즈는 {0}byte를 초과할 수 없습니다.", 
  git_answer2 : "GPT의 답변입니다.", 
  view_all : "전체보기", 
  msg_input : "메시지를 입력해 주세요."
}

var lang_en = {
  gpt_answer : "GPT response",
  gpt_copyall : "Copy all GPT responses.", 
  gpt_copy : "Copy response", 
  copy_paste : "GPT response has been copied!<br />Please paste it into the desired window.", 
  t_am : "am", 
  t_pm : "pm", 
  input_size:  "The input size cannot exceed {0}byte.", 
  git_answer2 : "This is GPT's response.", 
  view_all : "View all", 
  msg_input : "Please enter your message."
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