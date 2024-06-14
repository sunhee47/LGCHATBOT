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

var imgBaseUrl = "https://chatclient.ai.lgcns.com/singlex-ai-chatbot-contents/af477af3-5903-492a-9e3a-ade8660ace6c";

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

function resGptAllText(text, gubun) {

    var answerMsg = (gubun!=null)? gubun:"ChatGPT";
    var repanseMsg = text;
    var pulginDim = $('<div class="plugin-dim show"></div>');

    var dictDetail = $('<div class="plugins" id="dictDetail"></div>');
    var dictDetail1 = $('<div class="plugin-header">'
        +'<h1>'+answerMsg+' '+convert(gptLang.gpt_answer)+'</h1>'
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
    var messageCopyTooltip = $('<div class="f-tooltip">'+answerMsg+' '+convert(gptLang.gpt_copyall)+'</div>');
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

        showConfirmDialog(answerMsg+' '+convert(gptLang.copy_paste));
    });
    statusMessageCopy.append(copyButton);
    dictDetail2.append(dictDetail3);
    dictDetail2.append(statusMessageCopy);
    dictDetail2.append('<div class="confirm-dialog"></div>');
    dictDetail.append(dictDetail1);
    dictDetail.append(dictDetail2);

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
//   if(now.startsWith('am')) {
//     now = now.replace('am', '오전');
//   }
//   if(now.startsWith('pm')){
//     now = now.replace('pm', '오후');
//   }
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

function appendQueryText(message) {
    // by sunny 2023.10.30
    //console.log('message > '+message);
    message = message.replace(/(?:\r\n|\r|\n)/g, '<br>');
    //console.log('chgMsg > '+message);
    // by sunny 2023.10.30

    var chatMessage = '<div class="chat-message right">'
        +'<div class="message">' + message + '</div>'
        +'<span class="message-date">' + timeFormat() +'</span>'
        +'</div>';

    $('#divScroll').append(chatMessage);
}

function appendQueryText2(message) {
    var chatMessage = '<div class="chat-message left">'
        +'<div class="message">' + message + '</div>'
        +'<span class="message-date">' + timeFormat() +'</span>'
        +'</div>';

    $('#divScroll').append(chatMessage);
}

var loading = false;

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


function showSelectStatusPopup(selectedRequestId) {
    $('.plugin-dim').css('display', 'block');
    $('#status-select').css('display', 'block');

    setTimeout(function() {
        $('.plugin-dim').addClass('show');
        $('#status-select').addClass('show');
    }, 100)


    statusSelectTarget = selectedRequestId;
}


function resizeTA(obj) {
    obj.style.height = '1px';
    obj.style.height = obj.scrollHeight+4 + 'px';
}

/**
 * '사용자 메시지 입력 줄바꿈할 경우 스타일 변경' 함수
 *  by sunny 2023.10.17      // 2023.10.26 수정.
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
        //viewAlertPop("메시지는 한 번에 "+maxByte+"byte까지 입력할 수 있어요.");
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
        console.log('reqLimitText : '+chatui.getSetting("chatApiUrl")+' : '+chatui.getSetting("apiToken"));
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


var initQuickDisplay = 'none';       // by sunny 2023.10.26
var initRecResp = 0;            // by sunny 2023.10.26

chatui.onLoad = function(){
    console.log("LG전자 gpt봇 onLoad");
    //console.log("param : "+window.location.search);
    languageCode = chatui.getSetting("languageCode");
    gptLang = (languageCode == 'en')? lang_en:lang_ko;
    
    console.log('languageCode : '+languageCode);
    
    $(".test-panel .panel-wrapper .chat-panel .info-area").html(
        '<div class="edu-header">'
        +'<h1>'+convert(gptLang.gpt_title)+'</h1>'
        +'<div class="dot-flashing">'
        +'</div>'
        +'</div>'
        +'<span class="edu-close" id="eduClose">'+convert(gptLang.gpt_close)+'</span>'
    );

    $(".test-panel .panel-wrapper .chat-panel .form-group").empty();
//   $(".test-panel .panel-wrapper .chat-panel .form-group").append('<input type="text" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="질문을 입력해주세요" autocomplete="off">');
    $(".test-panel .panel-wrapper .chat-panel .form-group").append('<textarea type="text" style="resize:none" class="sendText form-control test-sentence-input caas-chat-input-back-color caas-chat-input-font-color ui-autocomplete-input" placeholder="'+convert(gptLang.msg_input)+'"></textarea>');
    $(".test-panel .panel-wrapper .chat-panel .form-group").append('<button class="btn btn-trans btn-send caas-chat-send-icon-color"><svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.0676 4.79338C26.554 3.3341 25.1657 1.94578 23.7064 2.43221L4.10954 8.96451C2.53186 9.4904 2.37758 11.6613 3.86504 12.405L10.2305 15.5877C10.9042 15.9246 11.7179 15.7925 12.2505 15.2599L20.206 7.30442C20.4794 7.03106 20.9226 7.03106 21.1959 7.30442C21.4693 7.57779 21.4693 8.02101 21.1959 8.29437L13.2403 16.25C12.7077 16.7826 12.5756 17.5964 12.9125 18.2701L16.0948 24.6348C16.8386 26.1222 19.0094 25.968 19.5353 24.3903L26.0676 4.79338Z"></path></svg></button>');
    var beforeConv = '<div class="chat-message prev-msg"><a href="#"><i class="icon icon-lg-circle-arrow-down"></i><span data-lang-text-id="previous_chatting">이전 대화 조회</span></a>';
    $('#prev-msg').on('click', function(e){
        alert("이전 대화 보기 api 호출!!");
    });
//   $('#divScroll').append(beforeConv);


    // by suuny 2023.10.17    // 2023.10.26
    var initTextH = $('.sendText').height();          //  사용자 메시지 영역 높이
    var orgPadding = Number($(".chat-message:not(.fixed):last-child").css("padding-bottom").replace("px", ""));  // 사용자 발화영역 last padding bottom
    var orgLineCount = 0;
    initQuickDisplay = $(".menu.fixed").css('display');

    $("#divScroll").css("margin-bottom", "0");

    if(initQuickDisplay == 'block') {
        $(".menu.fixed").css('display', 'none');
    }
    // console.log('dispaly : '+$(".menu.fixed").css('display'));
    // by suuny 2023.10.17    // 2023.10.26

    var searchType = null;
    function checkMessageContents(val, keyWord) {
        var blexArr = ['/B-LEX', '/b-lex', '/BLEX', '/blex'];
        var isBlex = false;
        $.each(blexArr, function(index, element){
            console.log(index + " :: " + element);

            if(val.indexOf(element) != -1) {
                isBlex = true;
            }
        });

        if(isBlex) {
            var findMessage = val;
            var payload = {
                "languageCode": languageCode, 
                reqText: findMessage
                //,userId : chatui.getSetting('userId')
            }
            chatui.sendEventMessage("callBlex", payload);
            $('.search-close').trigger('click');

        }
        else{
            chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":val,"keyWord":keyWord});
        }
    }

    // textarea Enter키 입력시 입력창에 줄바꿈 되는 현상 방지.
    $('.sendText').on('keydown', function(e) {
        var val = $(this).val();
        if(val.length > 0 && (e.code == 'Enter' || e.keyCode == 13)) {
            if(!e.shiftKey){
                console.log('....... keydown Enter');
                return false;
            }
        }
    });

    $('.sendText').on('keyup', function(e) {
        var val = $(this).val();

        if(val.length > 0) {
            $('.btn-send').addClass('active');
        } else {
            $('.btn-send').removeClass('active');
        }

        resizeTA(this);
        if(checkByteSize(val,8000)){
            $('.sendText').focus();
            return;
        }

        if(val.length > 0 && (e.code == 'Enter' || e.keyCode == 13)) {

          if(!e.shiftKey){
              orgVal = val;
              val = val.replace(/\n/g, "");
              $('.sendText').val(val);
              $('.sendText').val('');
              $('.btn-send').removeClass('active');
              setTimeout(function() {
                  var keyWord = '';  // chkSecureText(val);       // 보안키워드 체크 제외.

                  org_chgVal = replaceHtmlCodeForChar(orgVal);
                  chgVal = replaceHtmlCodeForChar(val);
                  console.log('chgVal : '+chgVal);
                  secBtnDisable();
                  appendQueryText(org_chgVal);
                  chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":chgVal,"keyWord":keyWord});
                  
              }, 100);
          }
      }
      resizeTA(this);

        // 라인이 달라질때만 적용되게 함. by sunny   2023.10.26
        var lineCount = parseInt($('.sendText').height()/18);
        if(orgLineCount != lineCount) {
            resizeFixedMenu(initTextH, orgPadding);        // by sunny 2023.10.17  // 2023.10.26
            orgLineCount = lineCount;
        }
        // by sunny   2023.10.26

    });

    $('.btn-send').on('click', function(e) {
      var val = $('.sendText').val();
      if(checkByteSize(val,8000)){
          $('.sendText').focus();
          return;
      } else {
          if(val.length > 0) {
              $('.sendText').val('');
              $('.btn-send').removeClass('active');
              setTimeout(function() {
                  var keyWord = '';  //chkSecureText(val);       // 보안키워드 체크 제외.
                  
                  chgVal = replaceHtmlCodeForChar(val);
                  console.log('chgVal : '+chgVal);                  
                  secBtnDisable();
                  appendQueryText(chgVal);
                  chatui.sendEventMessage("callGPT",{"languageCode": languageCode, "reqText":chgVal,"keyWord":keyWord});
                  
              }, 100);
          }
          
          resizeTA($('.sendText')[0]);
      }
    });


    var confirmDialong = $('<div class="confirm-dialog"></div>');
    $('.test-panel').append(confirmDialong);


    var chatbotCollapse = document.getElementById("eduClose");
    chatbotCollapse.addEventListener('click', function(e) {
        pop.open('create', $(this), 'Gpt_Bot_Close', 'loadEl.gpt_bot_close("'+convert(gptLang.gpt_close_title)+'","'+convert(gptLang.gpt_close_msg)+'")');

        $('#btnConfirm').on('click', function() {

            //   clearAllConversation();
            //   pop.close($("#btnConfirm"));
            window.parent.postMessage('bot_close', '*');
            //   setTimeout(function() {
            // showSmallDialog('대화 내역이 삭제되었습니다.');
            //   }, 500);

        });
        // $('.list-menu').fadeOut();

    });


};

// 발화내용 중 특수문자 포함된 경우 html 코드로 치환.
function replaceHtmlCodeForChar(val) {
    let chgVal = val.replace(/\(/g,"&#40;")
                .replace(/\)/g,"&#41;")
                .replace(/\"/gi,"&quot;")
                .replace(/\'/gi,"&#39;")
//                .replace(/\#/g,"&#35;")           // 치환한 html 문자에 포함되어 있어서 일단 제외함. 
                .replace(/\$/g,"&#36;")
                .replace(/\./g,"&#46;")
                .replace(/\%/g,"&#37;")
                .replace(/\</g,"&#60;")
                .replace(/\>/g,"&#62;")
                .replace(/\[/g,"&#91;")
                .replace(/\]/g,"&#93;")
                .replace(/\{/g,"&#123;")
                .replace(/\}/g,"&#125;");
                
    return chgVal;
} 

var saveQuestion = false;

chatui.onReceiveResponse = function(resp) {
    console.log("chatui.onReceiveResponse", resp);
    loading = false;
    $('#btn-answer').removeClass('btn-disabled');
    $(".sendText").attr("readonly", false);

    // chatbot message, quick link 영역 스타일 변경. // by sunny 2023.10.26
    initRecResp = initRecResp + 1;
    //console.log("initRecResp > "+initRecResp);

    if(initQuickDisplay == 'block') {
        $(".menu.fixed").css('display', initQuickDisplay);
        if(initRecResp == 1) {
            $(".menu.fixed").css({ "position": "relative", "bottom": "2px" });
        }
        else{
            var menuBottom = $(".menu.fixed").css('bottom').replace("px","");
            $(".menu.fixed").css("bottom", menuBottom+"px");
        }
        $("ul.menu-list").css('text-align', 'right');
        //console.log('.menu.fixed : '+$(".menu.fixed").css('bottom'));
    }
    // by sunny 2023.10.26

    setTimeout(function() {

        // if(resp.response.query.event == "") {
        //   resp.response.queryResult.messages[0].panelType = "custom";
        //   var mText = resp.response.query.text;
        //   appendQueryText(mText);
        //   chatui.sendEventMessage("requestChatGPT",{"reqText":mText});
        // //   return;
        // }

        if(resp.response.query.event == "WELCOME") {
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
                //console.log(message.quickReply);
                var buttons = $('<div class="btn-list"></div>');

                for(var k=0; k<message.quickReply.length; k++) {
                    var button = message.quickReply[k];
                    if(button.type == 'btn') {
                        var sendMessageBtn = $('<span class="btn-custom-reply send-message" data-message="'+ button.value +'">' + button.label + '</span>');
                        sendMessageBtn.on('click', function() {
                            var mText = $(this).data('message');
                            //   var mText = button.value;
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

//   $('.message-date').each(function() {
//     var date = $(this).text();

//     if(date.startsWith('am')) {
//       date = date.replace('am', '오전');
//     }

//     if(date.startsWith('pm')) {
//       date = date.replace('pm', '오후');
//     }

//     $(this).text(date);
//   });

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
                var profileCircle = $('<div class="profile"><img class="img-circle" src="'+imgBaseUrl+'/images/chem-profile.png"></div>');

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
    console.log("createCustomResponseMessage : ",resp);
    loading = false;

    $('#btn-answer').removeClass('btn-disabled');
    $(".sendText").attr("readonly", false);

    if(resp.response) {
        var customPayload = JSON.parse(resp.response);

        var customMessage = $('<div class="custom-message"></div>');

        if(customPayload.type == 'gptPush') {
            var viewLimit = 200;
            var checkContentsText = resp.text;
            var checkContents;
            var messages = $('<div class="message caas-chat-response-message-back-color caas-chat-response-message-font-color">'+convert(gptLang.git_answer2)+'</div>');

            //if(checkContentsText.length>viewLimit){
            //    checkContents = $('<div class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text">'
            //        +checkContentsText.substr(0,viewLimit)+"..."+'</span></div>');
            //}else{
                checkContents = $('<div class="answer-message caas-chat-response-message-back-color caas-chat-response-message-font-color"><span class="check-text hidden-text">'
                    +checkContentsText+'</span></div>');
            //}
            var statusMessageCopy = $('<div class="copy-question"></div>');
            var messageCopyTooltip = $('<div class="f-tooltip">ChatGPT '+convert(gptLang.gpt_copyall)+'</div>');
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

                showConfirmDialog('ChatGPT '+convert(gptLang.copy_paste));
            });

            var seeMore =  $('<div class="see-more">'
                +convert(gptLang.view_all)+'<svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">'
                +'<path fill-rule="evenodd" clip-rule="evenodd" d="M5.3817 6.60128C5.58377 6.82861 5.58377 7.17119 5.3817 7.39852L0.63891 12.7342C0.492143 12.8993 0.507015 13.1521 0.672128 13.2989C0.837241 13.4456 1.09007 13.4308 1.23684 13.2656L5.97963 7.93001C6.45113 7.39957 6.45113 6.60023 5.97962 6.06979L1.23684 0.734153C1.09007 0.56904 0.837241 0.554168 0.672128 0.700936C0.507015 0.847703 0.492143 1.10053 0.63891 1.26565L5.3817 6.60128Z" fill="#2C2C2C"/>'
                +'</svg>'
                +'</div>');

            seeMore.on('click', function() {
                $(this).parents('.request-status').find('.list-box').removeClass('disp-none');
                resGptAllText(checkContentsText);
                //   $(this).remove();
            });

            //checkContentsText.length>viewLimit?checkContents.append(seeMore):checkContents.append(statusMessageCopy.append(copyButton));
            checkContents.append(statusMessageCopy.append(copyButton));
            
            // requestCheck.append(checkContents);
            // customMessage.append(requestCheck);

            customMessage.append(messages);
            customMessage.append(checkContents);

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
            var simpleButton = $('<button id="btn-callGpt" class="btn btn-default caas-chat-button-back-color caas-chat-button-font-color caas-chat-button-border-color" data-slot="N" style="font-size:12px">'
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

/*
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



        } */

        /*
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
        }   */

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
            '<button type="button" onclick="pop.close(this);" class="cancel">'+convert(gptLang.gpt_cancel)+'</button>' +
            '<button type="button" id="btnConfirm" class="confirm">'+convert(gptLang.gpt_quit)+'</button>'
        '</div>' +
        '</div>';
        return html;
    },
    'security_check': function(popTitle, msg) {
        var html = '<div class="pop-wrapper dialog-warning">' +
            // '<h2>' + popTitle + '</h2>' +
            '<svg width="83" height="24" viewBox="0 0 83 24" fill="none" xmlns="http://www.w3.org/2000/svg">'+
            '<path fill-rule="evenodd" clip-rule="evenodd" d="M22.6667 12C22.6667 15.6819 19.6819 18.6666 16 18.6666C12.3181 18.6666 9.33334 15.6819 9.33334 12C9.33334 8.31808 12.3181 5.33331 16 5.33331C19.6819 5.33331 22.6667 8.31808 22.6667 12ZM16 8.66665C15.7239 8.66665 15.5 8.8905 15.5 9.16665V12.1666C15.5 12.4428 15.7239 12.6666 16 12.6666C16.2762 12.6666 16.5 12.4428 16.5 12.1666V9.16665C16.5 8.8905 16.2762 8.66665 16 8.66665ZM16.6667 14.3333C16.6667 14.7015 16.3682 15 16 15C15.6318 15 15.3333 14.7015 15.3333 14.3333C15.3333 13.9651 15.6318 13.6666 16 13.6666C16.3682 13.6666 16.6667 13.9651 16.6667 14.3333Z" fill="#F94B50"/>'+
            '<path d="M30.4279 17H31.7479L33.0559 11.696C33.1999 11 33.3559 10.364 33.4999 9.692H33.5479C33.6919 10.364 33.8239 11 33.9799 11.696L35.3119 17H36.6439L38.4679 8.204H37.3999L36.4759 12.992C36.3079 13.928 36.1399 14.876 35.9719 15.836H35.9119C35.7079 14.876 35.5039 13.928 35.2879 12.992L34.0519 8.204H33.0439L31.8319 12.992C31.6159 13.94 31.3999 14.888 31.1959 15.836H31.1479C30.9799 14.888 30.7999 13.94 30.6319 12.992L29.7079 8.204H28.5559L30.4279 17ZM41.1841 17.156C41.9881 17.156 42.7201 16.736 43.3441 16.22H43.3801L43.4761 17H44.3761V12.992C44.3761 11.384 43.7041 10.316 42.1201 10.316C41.0761 10.316 40.1521 10.784 39.5521 11.168L39.9841 11.924C40.5001 11.576 41.1841 11.228 41.9401 11.228C43.0081 11.228 43.2841 12.032 43.2841 12.872C40.5121 13.184 39.2761 13.892 39.2761 15.308C39.2761 16.484 40.0921 17.156 41.1841 17.156ZM41.4961 16.28C40.8481 16.28 40.3441 15.98 40.3441 15.236C40.3441 14.396 41.0881 13.856 43.2841 13.592V15.416C42.6481 15.98 42.1321 16.28 41.4961 16.28ZM46.4575 17H47.5495V12.812C47.9815 11.696 48.6535 11.312 49.1935 11.312C49.4575 11.312 49.6135 11.336 49.8295 11.42L50.0335 10.46C49.8295 10.352 49.6255 10.316 49.3375 10.316C48.6055 10.316 47.9455 10.844 47.4895 11.672H47.4535L47.3575 10.484H46.4575V17ZM51.1099 17H52.2019V12.272C52.8619 11.612 53.3179 11.276 53.9899 11.276C54.8539 11.276 55.2259 11.792 55.2259 13.016V17H56.3179V12.872C56.3179 11.204 55.6939 10.316 54.3259 10.316C53.4379 10.316 52.7659 10.808 52.1419 11.42H52.1059L52.0099 10.484H51.1099V17ZM58.4458 17H59.5378V10.484H58.4458V17ZM58.9978 9.14C59.4298 9.14 59.7538 8.84 59.7538 8.432C59.7538 7.988 59.4298 7.724 58.9978 7.724C58.5658 7.724 58.2418 7.988 58.2418 8.432C58.2418 8.84 58.5658 9.14 58.9978 9.14ZM61.7505 17H62.8425V12.272C63.5025 11.612 63.9585 11.276 64.6305 11.276C65.4945 11.276 65.8665 11.792 65.8665 13.016V17H66.9585V12.872C66.9585 11.204 66.3345 10.316 64.9665 10.316C64.0785 10.316 63.4065 10.808 62.7825 11.42H62.7465L62.6505 10.484H61.7505V17ZM71.2824 20C73.2984 20 74.5704 18.956 74.5704 17.744C74.5704 16.676 73.8144 16.196 72.3024 16.196H71.0304C70.1544 16.196 69.8904 15.908 69.8904 15.488C69.8904 15.128 70.0704 14.912 70.3104 14.708C70.5984 14.852 70.9584 14.936 71.2824 14.936C72.6024 14.936 73.6584 14.06 73.6584 12.668C73.6584 12.104 73.4424 11.624 73.1304 11.324H74.4624V10.484H72.1944C71.9664 10.4 71.6424 10.316 71.2824 10.316C69.9624 10.316 68.8344 11.216 68.8344 12.644C68.8344 13.424 69.2544 14.048 69.6864 14.396V14.444C69.3504 14.684 68.9544 15.116 68.9544 15.656C68.9544 16.172 69.2064 16.52 69.5544 16.724V16.772C68.9424 17.168 68.5824 17.696 68.5824 18.248C68.5824 19.376 69.6864 20 71.2824 20ZM71.2824 14.192C70.5264 14.192 69.8904 13.592 69.8904 12.644C69.8904 11.684 70.5144 11.12 71.2824 11.12C72.0504 11.12 72.6624 11.696 72.6624 12.644C72.6624 13.592 72.0264 14.192 71.2824 14.192ZM71.4384 19.256C70.2504 19.256 69.5424 18.8 69.5424 18.104C69.5424 17.72 69.7464 17.336 70.2144 17C70.5024 17.072 70.8144 17.108 71.0544 17.108H72.1824C73.0464 17.108 73.5144 17.312 73.5144 17.912C73.5144 18.596 72.6864 19.256 71.4384 19.256Z" fill="#F94B50"/>'+
            '<rect x="0.375" y="0.375" width="82.25" height="23.25" rx="11.625" stroke="#F94B50" stroke-width="0.75"/>'+
            '</svg>'+
            '<span class="dialog-close" onclick="pop.close(this);">' +
            iconPopupClose +
            '</span>' +
            '<p class="section-message">' +
            msg +
            '</p>' +
            '<div class="dialog-btns">' +
            '<button type="button" id="ConfirmGPT" class="confirm">계속</button>'+
            '<button type="button" onclick="pop.close(this);" class="cancel" id="cancel">입력취소</button>'
        '</div>' +
        '</div>';
        return html;
    }
}

/***************************************************************************************/

var languageCode = null;
var gptLang = null;
var lang_ko = {
  gpt_title : "GPT 모드", 
  gpt_close : "종료하기", 
  gpt_answer : "답변",
  gpt_copyall : "답변 전체 복사하기.", 
  gpt_copy : "답변 복사하기", 
  copy_paste : "답변을 복사했어요!<br />원하는 창에 붙여넣기 해주세요.", 			
  t_am : "오전", 
  t_pm : "오후", 
  input_size:  "메시지는 한 번에 {0}byte까지 입력할 수 있어요.", 
  git_answer2 : "ChatGPT의 답변입니다.", 
  view_all : "전체보기", 
  msg_input : "메시지를 입력해주세요 (줄바꿈은 Shift + Enter)", 
  gpt_close_title : "ChatGPT Mode 종료", 
  gpt_close_msg : "종료 시 대화 내용이 저장되지 않고<br />업무 챗봇으로 돌아갑니다.<br />종료할까요?", 
  gpt_quit : "종료", 
  gpt_cancel : "취소"
}

var lang_en = {
  gpt_title : "GPT Mode", 
  gpt_close : "Exit", 
  gpt_answer : "response",
  gpt_copyall : "Copy all responses.", 
  gpt_copy : "Copy response", 
  copy_paste : "I copied the answer!<br />Please paste it into the desired window.", 			
  t_am : "am", 
  t_pm : "pm", 
  input_size:  "Messages can be entered up to {0} bytes at a time.", 
  git_answer2 : "This is ChatGPT's answer.", 
  view_all : "View all", 
  msg_input : "Please enter your message. (The new line is 'Shift + Enter')", 
  gpt_close_title : "Exit ChatGPT Mode", 
  gpt_close_msg : "When you quit, your conversation will not be saved<br />and you will return to the work chatbot.<br />Do you want to quit?", 
  gpt_quit : "Quit", 
  gpt_cancel : "Cancel"
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