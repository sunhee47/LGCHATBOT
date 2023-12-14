/*
* STG 챗봇 정보  
*/
const Chatbot = {
   Server_Domain: "https://chatclient-stg.ai.lgstation.com"          // 서버 도메인
   , Chembot_ChatbotID: "d88153ab-4e9a-4849-b56c-2b2521ea5057"       // 화학 케미 챗봇ID 
   , Gptbot_ChatbotID: "88a39d64-0e9a-4ea7-ac57-de5783a3e937"        // 화학 GPT 챗봇ID 
   , Edubot_ChatbotID: "e860eeaf-bdaf-4d42-9e85-2a3fe249722e"        // 화학 학습봇 챗봇ID 
}

/*
* 운영 챗봇 정보  
*/
/*
const Chatbot = {
   Server_Domain: "https://chatclient.ai.lgstation.com"          // 서버 도메인
   , Chembot_ChatbotID: "0966ba56-6466-4d02-9eb8-953930614a90"       // 화학 케미 챗봇ID 
   , Gptbot_ChatbotID: "1bfbf1e1-b595-42a8-8ed8-256bcedd562e"        // 화학 GPT 챗봇ID 
   , Edubot_ChatbotID: "3c7111d1-051a-4148-b70d-d0989241bbfe"        // 화학 학습봇 챗봇ID 
}
*/

window.onload = function(){
   var chatbotFloating = document.getElementById('chatbot-floating');
   var textWidth = document.getElementById('text-width').offsetWidth;
   var pMessage = document.getElementById('text');
   var chatbotIcon = document.getElementById('chatbot-icon');
   pMessage.style.width = textWidth + 'px';
   

   var notiCloser = document.getElementsByClassName('closer');

   for(var i=0; i<notiCloser.length; i++) {
      notiCloser[i].addEventListener('click', function() {
        this.parentNode.style.display = "none";
      })
   };

   setTimeout(() => {
      pMessage.classList.add('show');

      setTimeout(() => {
         pMessage.classList.remove('show');
      }, 5000);
   }, 700);


   setTimeout(() => {
      chatbotFloating.classList.add('full-width');
      chatbotIcon.style.width = textWidth + 110 + 'px';      

      setTimeout(() => {
         chatbotFloating.classList.remove('full-width');
         chatbotIcon.style.width = '80px';
      }, 5500);
   }, 300);
};

var gWindowHeight = 0;
var gWindowWidth = 0;

let delay = 300;
let timer = null;
// 챗봇창 resize 해도 실행이 된다. 그래서 float 아이콘이 원래 자리로 온다. 
$(window).resize(function(){
   clearTimeout(timer);
   timer = setTimeout(function(){

      // floating 버튼도 원래 자리로 오는 문제 해결 : window 크기의 변화가 없으면 실행하지 않기....
      gWindowHeight = $(window).height();
      gWindowWidth = $(window).width();
   
      //console.log('gWindowHeight > '+gWindowHeight + ', gWindowWidth > ' +gWindowWidth);
   
      $("#popBox").css('left', '');
      $("#popBox").css('top', '');
      $("#chatbot-floating").css('left', '');
      $("#chatbot-floating").css('top', '');
      $("#notification").css('right','');
      $("#notification").css('bottom','');
   
      $("#popBox").css('right', '40');
      $("#popBox").css('bottom', '40');
      $("#chatbot-floating").css('right','36');
      $("#chatbot-floating").css('bottom','40');
      $("#notification").css('right','36');
      $("#notification").css('bottom','140');
   }, delay);
});

$('document').ready(function() {
      
   var chatPannel = document.getElementById("popBox"),
   chatPannelBack = document.getElementById("popBoxBack"),
   launcher = document.getElementById("chatbot-floating"),
   notifications = document.getElementById("notification");
   
   /* 챗봇 floating 버튼 드래그 이벤트 start */
   
   //var windowHeight = $(window).height();
   //var windowWidth = $(window).width();
   gWindowHeight = $(window).height();
   gWindowWidth = $(window).width();

   //console.log('windowH > '+windowHeight + ', window > ' +windowWidth);

   $("#chatbot-floating").draggable({
      containment: 'window'
       , snap: 'window'
       //, cursor: 'crosshair'
       , drag: function( event, ui ) {                           

          // 챗봇 floating 버튼 드래그 -> 공지창이 있으면 공지창도 같이 드래그되게 한다. 
         if($("#notification").css("display") != "none") {

            setTimeout(function(){
               var bottomPoint = gWindowHeight - ui.position.top + 20;
               var rightPoint = gWindowWidth - ui.position.left - 80;
               //console.log('bottom > '+bottomPoint + ', right > ' +rightPoint);
      
               $("#notification").animate({bottom:bottomPoint, right:rightPoint}, 1);
            }, 100);
         }

       }       
    });
   /* 챗봇 floating 버튼 드래그 이벤트 end */

   /**
    * 플로팅 버튼 클릭 이벤트.
   */
   launcher.addEventListener("click", function(e){
      e.preventDefault();
   
      if (chatPannel.classList.contains("show")) {
         launcher.classList.remove("hide");
         chatPannel.classList.remove("show");
         notifications.classList.remove('hide');
      } else {
         launcher.classList.add("hide");
         chatPannel.classList.add("show");
         notifications.classList.add("hide");

         /* 
         * 챗봇 창이 재 오픈시에만, 챗봇 창 오픈할 때 챗봇창 너비, 높이를 재조정한다.
         */
         if(chatPannelWidth != 0) {
            $("#popBox").css("width", chatPannelWidth);
            $("#popBox").css("height", chatPannelHeight);
         }

         if (!document.getElementById("float-chatbot-chat-iframe").isLoaded) {
            document.getElementById("float-chatbot-chat-iframe").isLoaded = true;

            var params = {
               languageCode: "ko",                             // Front UI Default 파라미터
               token: "test",                            // Front UI Default 파라미터
               userId: "kkkkkkkkang"                          // Front UI Default 파라미터
            };
      
            var url = Chatbot.Server_Domain+"/"+Chatbot.Chembot_ChatbotID+"/chat";

            openChatFrame(url, "float-chatbot-chat-iframe", params);

            
         }
      
      }
   }, false);

   /**
    * iframe 으로 케미 챗봇창을 오픈한다. 
   */
   function openChatFrame(url, target, params) {
   
      var form = document.createElement("form");
      form.setAttribute("action", url);
      form.setAttribute("method", "POST");
      form.setAttribute("target", target);
   
     if (params) {
         for (param in params) {
             var obj = document.createElement("input");
             obj.setAttribute("type", "hidden");
             obj.setAttribute("name", param);
             obj.setAttribute("value", params[param]);
             form.appendChild(obj);
         }
     }
   
     document.body.appendChild(form);
   
     form.submit();
    
     setTimeout(function() { form.parentNode.removeChild(form); }, 1000);
   
      /*
         // 레이어 팝업 마우스로 사이즈 조절을 위해서 추가함. 
         // 최소,최대 크기지정 해야 함. 
      */
      var windowHeight = $(window).height()-45;          // 최대 높이 사이즈 = window 높이 - 챗봇창의 bottom
      var windowWidth = $(window).width()-45;            // window 너비 - 챗봇창의 right
      //console.log('windowHeight : '+windowHeight+', windowWidth : '+windowWidth);
   
      var min_With = 355;                            // 최소 너비 사이즈 = 355X710 
   
      // 챗봇 레이어 마우스로 사이즈 resizable.
      $("#popBox").resizable({
         //함께 커질영역 
         //alsoResize:".chatbot-pop-box1.show",    /* 함께 커지는 영역에 대한 사이즈를 구하지 못해서 에러나서 주석처리함. */
         //커질때 애니메이션 발생 
         animate :  true,
         animateDuration: 100,
         animateEasing:"swing",
         //비율유지
         aspectRatio: false,
         //마우스 hover 아닐때 핸들러 숨기기
         //autoHide: true,                      /* 사이즈 조절 커서가 잘 보이지 않는 현상이 있어서 막음. */
         handles: "w, n, nw",                  /* 위, 왼쪽 사이즈를 늘리면 창이 안 보이는 현상이 있음. */
         //handles: "nw",                         // nw, n, w
         maxHeight: windowHeight, 
         //minHeight:700,
         //maxWidth:  windowWidth, 
         minWidth:min_With                           /* 최소,최대 크기지정 */ 
         , start: function( event, ui ) {
            chatPannelBack.classList.add("show");
            $('.ui-resizable-nw').css('z-index', '19000');
            $('.ui-resizable-helper').css('z-index', '19100');
         }
         , stop: function( event, ui ) {
            chatPannelBack.classList.remove("show");
         }
      });


   }
   
});         // $('document').ready 종료

var chatPannelWidth = 0;
var chatPannelHeight = 0;
 /**
  * LG화학 케미, GPT모드, 학습봇 에서 전달하는 키 이벤트 처리.  
  */
window.addEventListener("message",function (e) { 

   // 케미 창을 close 할 때 
   if(e.data === 'bot_close') {

      /* 챗봇 창 닫을때 리사이징한 너비와 높이 보관. */
      resizeChatbotAfter();

      console.log('chatPannelWidth : '+chatPannelWidth+', chatPannelHeight : '+chatPannelHeight);
      console.log('close..');
   };

   // 케미 업무봇,  GPT모드, 학습봇 에서 '기본사이즈 복귀' 버튼 클릭시. 
   if(e.data === 'bot_Recover' || e.data === 'gpt_Recover' || e.data === 'edu_Recover') {
      console.log('recover..'+e.data);

      $("#popBox").css("width", "400");
      $("#popBox").css("height", "800");
      $("#popBox").css("top", "");
      $("#popBox").css("left", "");
   }

   // 케미 업무봇 '팝업창 전환' 버튼 클릭시. 
   if(e.data === 'bot_Winopen') {
      console.log('window open..');

      var params = {
         languageCode: "ko",                             // Front UI Default 파라미터
         token: "test",                            // Front UI Default 파라미터
         userId: "kkkkkkkkang"                          // Front UI Default 파라미터
      };

      var url = Chatbot.Server_Domain+"/"+Chatbot.Chembot_ChatbotID+"/chat";
      var target = "chatFloating";

      openChatWindow(url, target, params);
      //openChatFrame("chatFloating", params);

      /* 챗봇 창 닫을때 리사이징한 너비와 높이 보관. */
      resizeChatbotAfter();

   }

   // GPT모드 '팝업창 전환' 버튼 클릭시. 
   if(e.data === 'gpt_Winopen') {
      console.log('gpt open..');

      var params = {
         languageCode: "ko",                       // Front UI Default 파라미터
         token: "test",                            // Front UI Default 파라미터
         userId: "kkkkkkkkang",                     // Front UI Default 파라미터
         initMode: "GPT"                           // GPT 팝업일 경우 케미 팝업에 프레임으로 GPT 호출
      };

      //var url = Chatbot.Server_Domain+"/"+Chatbot.Gptbot_ChatbotID+"/chat";
      var url = Chatbot.Server_Domain+"/"+Chatbot.Chembot_ChatbotID+"/chat";
      var target = "chatGptBot";

      openChatWindow(url, target, params);

      /* 챗봇 창 닫을때 리사이징한 너비와 높이 보관. */
      resizeChatbotAfter();

   }

   // 학습봇 '팝업창 전환' 버튼 클릭시. 
   if(e.data === 'edu_Winopen') {
      console.log('edu open..');

      var params = {
         languageCode: "ko",                       // Front UI Default 파라미터
         token: "test",                            // Front UI Default 파라미터
         userId: "kkkkkkkkang",                     // Front UI Default 파라미터
         initMode: "EDU"                           // 학습봇 팝업일 경우 케미 팝업에 프레임으로 학습봇 호출
      };

      //var url = Chatbot.Server_Domain+"/"+Chatbot.Edubot_ChatbotID+"/chat";
      var url = Chatbot.Server_Domain+"/"+Chatbot.Chembot_ChatbotID+"/chat";
      var target = "chatEduBot";

      openChatWindow(url, target, params);

      /* 챗봇 창 닫을때 리사이징한 너비와 높이 보관. */
      resizeChatbotAfter();

   }

},false);

 /**
   * 팝업창 으로 챗봇창을 오픈한다. 
   */
function openChatWindow(url, target, params) {
   var paramForm = document.createElement("form");

   var openWindow = window.open("", target, "width=500, height=700, toolbar=1, scrollbars=1, resizable=1");

   $(paramForm).attr('action', url);
   $(paramForm).attr('target', target);
   $(paramForm).attr('method', 'post');

   if (params) {
      for (param in params) {
          var obj = document.createElement("input");
          obj.setAttribute("type", "hidden");
          obj.setAttribute("name", param);
          obj.setAttribute("value", params[param]);
          paramForm.appendChild(obj);
      }
  }   
   document.body.appendChild(paramForm);
   paramForm.submit();

   setTimeout(function() { paramForm.parentNode.removeChild(paramForm); }, 1000);
}

 /**
   * 챗봇 창 닫을때 리사이징한 너비와 높이 보관하는 함수. 
   */
function resizeChatbotAfter() {
   var chatPannel = document.getElementById("popBox"),
   launcher = document.getElementById("chatbot-floating"),
   notifications = document.getElementById("notification");

   chatPannelWidth = $("#popBox").width();
   chatPannelHeight = $("#popBox").height();

   launcher.classList.remove('hide');
   chatPannel.classList.remove('show');
   chatPannel.removeAttribute("style");            // 사이즈 조절 후 close 하는 경우 style 값 초기화.
   notifications.classList.remove('hide');

}
