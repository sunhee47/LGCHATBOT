$(document).ready(function() {
   // 페이지 로딩 표시
   var skeleton = '<div class="chatbot-skeleton"><div class="s-header"><div class="s-logo"></div></div>'
   +'<div class="s-body"><div class="s-left" id="left-01"><div class="profile"></div><div class="chat chat-01"></div><div class="chat" id="chat-02"></div></div>'
   + '<div class="s-right" id="right-01"><div class="chat chat-03"></div></div><div class="s-left" id="left-02"><div class="profile"></div><div class="chat chat-04"></div><div class="chat" id="chat-05"></div></div>'
   + '<div class="s-right" id="right-02"><div class="chat chat-06"></div></div></div>'
   + '<div class="s-footer"><div class="s-input"></div></div></div>';
 
   $('body').append(skeleton);
 
 
   var left01 = document.getElementById('left-01');
   var chat02 = document.getElementById('chat-02');
   var right01 = document.getElementById('right-01');
   var left02 = document.getElementById('left-02');
   var chat05 = document.getElementById('chat-05');
   var right02 = document.getElementById('right-02');
   
   function appearSkeleteon() {   
      left01.classList.add('appear');
      setTimeout(() => {
         chat02.classList.add('appear');
      }, 500);
      setTimeout(() => {
         right01.classList.add('appear');
      }, 1000);
      setTimeout(() => {
         left02.classList.add('appear');
      }, 1500);
      setTimeout(() => {
         chat05.classList.add('appear');
      }, 2000);
      setTimeout(() => {
         right02.classList.add('appear');
      }, 2500)
   }
 
   function disappearSkeleton() {
      left01.classList.add('disappear');
      chat02.classList.add('disappear');
      right01.classList.add('disappear');
      left02.classList.add('disappear');
      chat05.classList.add('disappear');
      right02.classList.add('disappear');
   }
 
   function removeClassSkeleton() {
      left01.classList.remove('appear', 'disappear');
      chat02.classList.remove('appear', 'disappear');
      right01.classList.remove('appear', 'disappear');
      left02.classList.remove('appear', 'disappear');
      chat05.classList.remove('appear', 'disappear');
      right02.classList.remove('appear', 'disappear');
   }
 
   function skeletonRepeat(){
      appearSkeleteon();
      setTimeout(() => {
         disappearSkeleton();
      }, 4000);
      setTimeout(() => {
         removeClassSkeleton();
      }, 4500)
 
      setTimeout(skeletonRepeat, 5000);
   }
 
   skeletonRepeat();
 });
 
 var bearer = null;
 var callFirst = true;
 
 $(document).ajaxComplete(function(event, xhr, settings) {
     if(callFirst) {
        bearer = settings.headers.Authorization;
        callFirst = false;
     }
 });
 
 function timeFormat(e) {
   let now = (e ? moment(e) : moment()).format("a h:mm");
   if(now === undefined) {
    now = moment().format("a h:mm");
   }
   
   now = now.toString();
   if(now.startsWith('am')) {
       now = now.replace('am', '오전');
   }
   if(now.startsWith('pm')){
       now = now.replace('pm', '오후');
   }
   return now;
 }
 
 // 주소 수정 필요 : 이미지 로드 에러시 임시 이미지
 var tempImage = 'https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/fc683bf7-fc01-4913-af76-eefcefc06c8d/image/assets/tmp.png';
 // 주소 수정 필요 : 유저 이미지 로드 에러시 임시 이미지
 var pAlternative = 'https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/fc683bf7-fc01-4913-af76-eefcefc06c8d/image/assets/profile-alternative.png';
 var makeButtons = function(data) {
  var buttons = '';
  if(data.buttons && data.buttons.length > 0) {
     buttons = '<div class="btns">';
     for(let i =0; i<data.buttons.length; i++) {
        var button = data.buttons[i];
        if(button.action == 'message') {
           buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="'+ button.message +'">' + button.label + '</button>'
        }
        else if(button.action == 'webLink') {
           buttons += '<button class="btn btn-text web-link" data-weblink="'+ button.webLink +'">' + button.label + '</button>'
        }
        else if(button.action == 'outLink') {
         buttons += '<button class="btn btn-icon-right out-link" data-outlink="'+ button.webLink +'">' 
         + button.label
         +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path d="M18.0964 6.50024L24.097 6.50066C24.6493 6.5007 25.0969 6.9484 25.0969 7.50066L25.0969 13.5002" stroke="#333333" stroke-linecap="round"/>'
         + '<path d="M16.3394 14.9355L24.5962 7.00098" stroke="#333333" stroke-linecap="round"/>'
         + '<path d="M14 8H9C7.89543 8 7 8.89543 7 10V23C7 24.1046 7.89543 25 9 25H22C23.1046 25 24 24.1046 24 23V18" stroke="#333333" stroke-linecap="round"/>'
         + '</svg>'
          + '</button>'
      }
        else if(button.action == 'copyData') {
           buttons += '<button type="button" class="btn btn-icon copy-message" data-copydata="'+ button.copyData +'">'
           +'<textarea class="dispnone" id="'+ button.copyData + '">' + button.copyData + '</textarea>'
           +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
           +'<path d="M9.12206 20.1932V20.1932C8.50237 20.1932 8 19.6908 8 19.0711V7.99951C8 6.89494 8.89543 5.99951 10 5.99951H18.5522C19.2568 5.99951 19.8281 6.57074 19.8281 7.27538V7.27538" stroke="#333333"/>'
           +'<rect x="11.9546" y="9.9541" width="11.9545" height="14.5455" rx="1.5" stroke="#333333"/>'
           +'</svg>'
           + button.label + '</button>'
        }
        else if(button.action == 'plugin') {
           buttons += '<button type="button" class="btn btn-emphasis active-plugin" data-plugin="' + button.plugin + '">' + button.label + '</button>'
        } else if(button.action == 'call_event') {
         //buttons += '<button type="button" class="btn btn-emphasis call-event" data-event="' + button.event + '">' + button.label + '</button>'
         buttons += '<button type="button" class="btn btn-emphasis call-event" data-event="' + button.event + '"data-message="' + button.parameter[0].message +'">' + button.label + '</button>'
       } 
        else {
           buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="'+ button.message +'">' + button.label + '</button>'
        }
     }
 
     buttons += '</div>'
    }
 
    return buttons;
 }
 
 var makeButtons2 = function(data) {
   var buttons = '';
   if(data.buttons && data.buttons.length > 0) {
      buttons = '<div class="btns">';
      for(let i =0; i<data.buttons.length; i++) {
         var button = data.buttons[i];
         if(button.type == 'btn') {
            buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="'+ button.value +'">' + button.label + '</button>'
         }
         else if(button.type == 'callIntent') {
            buttons += '<button type="button" class="btn btn-text intent" data-indent="'+ button.value + '">' + button.label + '</button>'
         }
         else if(button.type == 'link' || button.type == 'inApp') {
            buttons += '<button class="btn btn-text web-link" data-weblink="'+ button.value +'">' + button.label + '</button>'
         }
         else if(button.type == 'outApp') {
          buttons += '<button class="btn btn-icon-right out-link" data-outlink="'+ button.value +'">' 
          + button.label
          +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
          + '<path d="M18.0964 6.50024L24.097 6.50066C24.6493 6.5007 25.0969 6.9484 25.0969 7.50066L25.0969 13.5002" stroke="#333333" stroke-linecap="round"/>'
          + '<path d="M16.3394 14.9355L24.5962 7.00098" stroke="#333333" stroke-linecap="round"/>'
          + '<path d="M14 8H9C7.89543 8 7 8.89543 7 10V23C7 24.1046 7.89543 25 9 25H22C23.1046 25 24 24.1046 24 23V18" stroke="#333333" stroke-linecap="round"/>'
          + '</svg>'
           + '</button>'
       }
        else {
            buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="'+ button.message +'">' + button.label + '</button>'
         }
      }
  
      buttons += '</div>'
     }
  
     return buttons;
  }
 
 var makeProfileButtons = function(data) {
   var buttons = '';
   if(data.buttons && data.buttons.length > 0) {
      buttons = '<div class="p-btns-block"">';
      for(let i =0; i<data.buttons.length; i++) {
         var button = data.buttons[i];
         if(button.action == 'message') {
            buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="' + button.message + '">' + button.label + '</button>'
         }
         else if(button.action == 'webLink') {
            buttons += '<button class="btn btn-text web-link" data-weblink="'+ button.webLink +'">' + button.label + '</button>'
         }
         else if(button.action == 'outLink') {
            buttons += '<button class="btn btn-icon-right out-link" data-outlink="'+ button.webLink +'">' 
            + button.label
            +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<path d="M18.0964 6.50024L24.097 6.50066C24.6493 6.5007 25.0969 6.9484 25.0969 7.50066L25.0969 13.5002" stroke="#333333" stroke-linecap="round"/>'
            + '<path d="M16.3394 14.9355L24.5962 7.00098" stroke="#333333" stroke-linecap="round"/>'
            + '<path d="M14 8H9C7.89543 8 7 8.89543 7 10V23C7 24.1046 7.89543 25 9 25H22C23.1046 25 24 24.1046 24 23V18" stroke="#333333" stroke-linecap="round"/>'
            + '</svg>'
            + '</button>';
         }
         else if(button.action == 'copyData') {
            buttons += '<button type="button" class="btn btn-icon copy-message" data-copydata="'+ button.copyData +'">'
            +'<textarea class="dispnone" id="'+ button.copyData + '">' + button.copyData + '</textarea>'
            +'<svg width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'<path d="M9.12206 20.1932V20.1932C8.50237 20.1932 8 19.6908 8 19.0711V7.99951C8 6.89494 8.89543 5.99951 10 5.99951H18.5522C19.2568 5.99951 19.8281 6.57074 19.8281 7.27538V7.27538" stroke="#333333"/>'
            +'<rect x="11.9546" y="9.9541" width="11.9545" height="14.5455" rx="1.5" stroke="#333333"/>'
            +'</svg>'
            + button.label + '</button>'
         }
         else if(button.action == 'plugin') {
            buttons += '<button type="button" class="btn btn-emphasis active-plugin" data-plugin="' + button.plugin + '">' + button.label + '</button>'
         } else if(button.action == 'call_event') {
           buttons += '<button type="button" class="btn btn-emphasis call-event" data-event="' + button.event + '">' + button.label + '</button>'
        }   
         else {
            buttons += '<button type="button" class="btn send-message btn-emphasis" data-message="'+ button.message +'">' + button.label + '</button>'
         }
      }
 
      buttons += '</div>'
     }
 
     return buttons;
 }
 
 var iconSelect = function(iconName) {
   var selectedIcon = '';
   switch(iconName) {
      case 'notice':
         selectedIcon = '<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<g id="icon/notice">'
         + '<g id="Group 774">'
         + '<path id="Union (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M13.5244 42.0684H25.7403C26.0259 42.0684 26.2976 42.1283 26.5434 42.2361L47.4369 50.6722V13.5459L26.8508 21.8579C26.3749 22.0501 25.8664 22.1489 25.3532 22.1489H13.5244L13.5244 42.0684ZM25.7403 44.0684L25.7406 44.0687L25.7407 44.0689L46.6881 52.5268C48.0027 53.0576 49.4369 52.0899 49.4369 50.6722V13.5459C49.4369 12.1282 48.0027 11.1606 46.6881 11.6914L26.102 20.0034C25.864 20.0995 25.6098 20.1489 25.3532 20.1489H13.5244C12.4198 20.1489 11.5244 21.0443 11.5244 22.1489V42.0684C11.5244 43.1729 12.4198 44.0684 13.5244 44.0684H25.7403Z" fill="#333333"/>'
         + '<path id="Ellipse 103 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M52.9996 32.9844C52.9996 30.5161 50.7579 28.3506 47.7793 28.3506V26.3506C51.6715 26.3506 54.9996 29.2297 54.9996 32.9844C54.9996 36.739 51.6715 39.6181 47.7793 39.6181V37.6181C50.7579 37.6181 52.9996 35.4526 52.9996 32.9844Z" fill="#333333"/>'
         + '<path id="Line 36 (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M23.5205 42.2799L23.5205 21.7529L25.5205 21.7529L25.5205 42.2799L23.5205 42.2799Z" fill="#333333"/>'
         + '</g>'
         + '</g>'
         + '</svg>'
      return selectedIcon;
 
      case 'document':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path d="M22 24.5H11C10.1716 24.5 9.5 23.8284 9.5 23V9C9.5 8.17157 10.1716 7.5 11 7.5H19.0698C19.5248 7.5 19.9552 7.70651 20.2398 8.06143L23.1701 11.7145C23.3836 11.9807 23.5 12.3117 23.5 12.653V23C23.5 23.8284 22.8284 24.5 22 24.5Z" stroke="#333333"/>'
         + '<path d="M12 17H19" stroke="#333333" stroke-linecap="round"/>'
         + '<path d="M12 20H16" stroke="#333333" stroke-linecap="round"/>'
         + '<path d="M19 8V12C19 12.5523 19.4477 13 20 13H23" stroke="#333333"/>'
         +'</svg>'
      return selectedIcon;
 
      case 'schedule':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<rect x="10.5" y="6.5" width="2" height="5" rx="0.5" stroke="#333333"/>'
         + '<rect x="19.5" y="6.5" width="2" height="5" rx="0.5" stroke="#333333"/>'
         + '<path d="M10.6 8H9.7H9C7.89543 8 7 8.89543 7 10V22C7 23.1046 7.89543 24 9 24H23C24.1046 24 25 23.1046 25 22V10C25 8.89543 24.1046 8 23 8H22.3H21.4" stroke="#333333"/>'
         + '<line x1="7.5" y1="14.5" x2="24.5" y2="14.5" stroke="#333333" stroke-linecap="round"/>'
         + '<line x1="12.5" y1="8" x2="19.5" y2="8" stroke="#333333" stroke-linecap="round"/>'
         + '</svg>'
         
      return selectedIcon;
 
      case 'place':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path d="M10.0363 17.4746C6.97005 12.7458 10.3641 6.5 16 6.5C21.6359 6.5 25.0299 12.7458 21.9637 17.4747L17.1733 24.8624C16.9155 25.26 16.4739 25.5 16 25.5C15.5261 25.5 15.0845 25.26 14.8267 24.8624L10.0363 17.4746Z" stroke="#333333"/>'
         + '<circle cx="16" cy="14" r="2.5" stroke="#333333"/>'
         + '</svg>'
      return selectedIcon;
      
      case 'industry':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M28.5038 10.5072C27.5685 10.4462 26.7506 10.7827 26.0821 11.2757C25.6751 11.5758 25.2971 11.8952 24.9049 12.2265C24.6842 12.413 24.4591 12.6032 24.2218 12.7959C23.5832 13.3145 22.8912 13.8194 22.0932 14.1674L21.6935 13.2507C22.3661 12.9575 22.9745 12.5206 23.5914 12.0196C23.7961 11.8534 24.0065 11.6758 24.2211 11.4947C24.632 11.1479 25.0581 10.7883 25.4886 10.4709C26.294 9.87699 27.3398 9.42922 28.5688 9.50928C29.0763 9.54234 29.4427 9.85974 29.6022 10.2605C29.7569 10.6492 29.7199 11.1127 29.4782 11.4983L27.849 14.0969C27.1529 15.2072 26.2848 16.1999 25.2771 17.0377C23.0556 18.8849 20.2575 19.8962 17.3683 19.8962H13.4247C13.1517 19.8962 12.8824 19.9591 12.6376 20.08L12.1126 20.3392C11.865 20.4614 11.5651 20.3598 11.4429 20.1122C11.3206 19.8645 11.4223 19.5647 11.6699 19.4425L12.1949 19.1833C12.5774 18.9945 12.9982 18.8962 13.4247 18.8962H17.3683C20.0239 18.8962 22.5958 17.9667 24.6378 16.2688C25.564 15.4987 26.3619 14.5863 27.0017 13.5657L28.6309 10.9671C28.7062 10.847 28.7079 10.7177 28.6731 10.6303C28.6431 10.5549 28.5918 10.5129 28.5038 10.5072Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7726 10.6514C11.3813 10.6514 10.0641 11.2788 9.18738 12.3591L7.45808 14.49C7.28407 14.7044 6.96919 14.7372 6.75477 14.5632C6.54035 14.3892 6.50759 14.0743 6.6816 13.8599L8.4109 11.729C9.47753 10.4146 11.08 9.65137 12.7726 9.65137H14.0191C15.0036 9.65137 15.9724 9.89927 16.8359 10.3722L17.3083 10.6309C17.7147 10.8535 18.1705 10.9701 18.6338 10.9701H20.1555C21.3913 10.9701 22.3932 11.972 22.3932 13.2078C22.3932 14.4437 21.3913 15.4455 20.1555 15.4455H14.2536C13.9775 15.4455 13.7536 15.2217 13.7536 14.9455C13.7536 14.6694 13.9775 14.4455 14.2536 14.4455H20.1555C20.839 14.4455 21.3932 13.8914 21.3932 13.2078C21.3932 12.5243 20.839 11.9701 20.1555 11.9701H18.6338C18.0026 11.9701 17.3816 11.8112 16.8279 11.508L16.3556 11.2493C15.6393 10.857 14.8357 10.6514 14.0191 10.6514H12.7726Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M3.33431 18.5257C2.7805 17.9096 2.7805 16.9107 3.33431 16.2946L5.14066 14.2851C5.69447 13.669 6.59238 13.669 7.14619 14.2851L12.655 20.4134C13.2088 21.0295 13.2088 22.0284 12.655 22.6445L10.8486 24.6541C10.2948 25.2702 9.39688 25.2702 8.84307 24.6541L3.33431 18.5257ZM4.00282 17.0383C3.81822 17.2437 3.81822 17.5766 4.00282 17.782L9.51158 23.9104C9.69619 24.1157 9.99549 24.1157 10.1801 23.9104L11.9864 21.9008C12.171 21.6955 12.171 21.3625 11.9864 21.1571L6.47768 15.0288C6.29308 14.8234 5.99377 14.8234 5.80917 15.0288L4.00282 17.0383Z" fill="#333333"/>'
         + '</svg>'
      return selectedIcon;
      
      case 'service':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M26.3667 10.9094L20.0104 6.95022C19.6829 6.74622 19.2672 6.74885 18.9423 6.95698L5.87235 15.3295L12.2286 19.2886C12.5561 19.4927 12.9718 19.49 13.2967 19.2819L26.3667 10.9094ZM20.5391 6.10141C19.8841 5.6934 19.0527 5.69867 18.4029 6.11494L5.33294 14.4874C4.71419 14.8838 4.71993 15.7898 5.34364 16.1783L11.6999 20.1375C12.355 20.5455 13.1863 20.5402 13.8361 20.1239L26.9061 11.7514C27.5248 11.3551 27.5191 10.4491 26.8954 10.0606L20.5391 6.10141Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.8721 10.9094L12.2284 6.95022C12.5559 6.74622 12.9716 6.74885 13.2965 6.95698L26.3664 15.3295L20.0102 19.2886C19.6826 19.4927 19.267 19.49 18.942 19.2819L5.8721 10.9094ZM11.6997 6.10141C12.3547 5.6934 13.1861 5.69867 13.8359 6.11494L26.9058 14.4874C27.5246 14.8838 27.5188 15.7898 26.8951 16.1783L20.5389 20.1375C19.8838 20.5455 19.0525 20.5402 18.4026 20.1239L5.33269 11.7514C4.71394 11.3551 4.71968 10.4491 5.3434 10.0606L11.6997 6.10141Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M23.7863 17.7653L23.7863 21.0122C23.7863 21.8434 23.3731 22.6203 22.684 23.085L17.6444 26.4834C16.7856 27.0625 15.6586 27.0521 14.8107 26.457L10.0014 23.0823C9.33449 22.6143 8.93745 21.8506 8.93747 21.0358L8.93753 18.1694L9.93752 18.1694L9.93747 21.0358C9.93746 21.5247 10.1757 21.9829 10.5759 22.2637L15.3851 25.6385C15.8938 25.9955 16.57 26.0018 17.0853 25.6543L22.1249 22.2559C22.5384 21.977 22.7863 21.5109 22.7863 21.0122L22.7863 17.7653L23.7863 17.7653Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.6196 26.6375L15.6196 17.918L16.6196 17.918L16.6196 26.6375L15.6196 26.6375Z" fill="#333333"/>'
         + '</svg>'
      return selectedIcon;
      
      case 'platform':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M23.3768 10.1344L16.1474 6.69733C15.8171 6.54032 15.4133 6.54032 15.0831 6.69733L7.85366 10.1344C7.12054 10.483 7.12054 11.3718 7.85365 11.7203L15.0831 15.1574C15.4133 15.3144 15.8171 15.3144 16.1474 15.1574L23.3768 11.7203C24.1099 11.3718 24.1099 10.483 23.3768 10.1344ZM16.6795 5.9044C16.019 5.59039 15.2114 5.59039 14.551 5.9044L7.32152 9.34152C5.85529 10.0386 5.85529 11.8161 7.32152 12.5132L14.551 15.9504C15.2114 16.2644 16.019 16.2644 16.6795 15.9504L23.9089 12.5132C25.3752 11.8161 25.3752 10.0386 23.9089 9.34152L16.6795 5.9044Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M24.3695 15.3787C25.3215 15.9595 25.2467 17.173 24.2284 17.6677L16.9607 21.1987C16.1266 21.604 15.0994 21.6054 14.2637 21.2024L7.0134 17.7058C5.96153 17.1985 5.91773 15.935 6.93267 15.3769L8.7602 14.3721C9.01034 14.2346 9.34557 14.2938 9.50897 14.5043C9.67237 14.7148 9.60206 14.997 9.35192 15.1345L7.52439 16.1394C7.18608 16.3254 7.20068 16.7466 7.5513 16.9156L14.8016 20.4122C15.303 20.654 15.9194 20.6532 16.4198 20.41L23.6875 16.879C24.0269 16.7141 24.0519 16.3096 23.7345 16.116L22.1053 15.122C21.8634 14.9744 21.8095 14.6897 21.9848 14.4861C22.1602 14.2825 22.4984 14.2371 22.7403 14.3847L24.3695 15.3787Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M23.5353 20.2311C24.4915 20.8103 24.4189 22.0271 23.3986 22.5228L16.9578 25.6521C16.1237 26.0573 15.0964 26.0587 14.2608 25.6557L7.72356 22.5031C6.71467 22.0165 6.62314 20.8211 7.54948 20.2295L8.7292 19.4762C8.96723 19.3242 9.30658 19.3634 9.48716 19.5638C9.66775 19.7641 9.62118 20.0497 9.38315 20.2017L8.20343 20.9551C7.89465 21.1522 7.92516 21.5507 8.26145 21.7129L14.7987 24.8655C15.3001 25.1073 15.9164 25.1065 16.4169 24.8634L22.8577 21.7341C23.1978 21.5689 23.222 21.1633 22.9032 20.9702L21.646 20.2085C21.4035 20.0616 21.3484 19.7771 21.523 19.573C21.6975 19.3689 22.0356 19.3225 22.2781 19.4694L23.5353 20.2311Z" fill="#333333"/>'
         + '</svg>'
      return selectedIcon;
      
      case 'solution':
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M20.4156 21.5238L20.3574 19.3983C20.3563 19.3561 20.3689 19.3148 20.3935 19.2805L22.4074 16.4675C26.1409 11.2527 22.4136 4 16.0001 4C9.58658 4 5.85923 11.2527 9.59271 16.4675L11.6067 19.2805C11.6312 19.3148 11.6439 19.3561 11.6427 19.3983L11.5845 21.5238H20.4156ZM19.3879 20.5238L19.3578 19.4256C19.3507 19.1654 19.4288 18.91 19.5804 18.6984L21.5943 15.8854C24.854 11.3323 21.5997 5 16.0001 5C10.4005 5 7.14611 11.3323 10.4058 15.8854L12.4198 18.6984C12.5713 18.91 12.6494 19.1654 12.6423 19.4256L12.6123 20.5238H19.3879Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M12.2842 23.1667L11.6874 23.8336C11.585 23.948 11.5239 24.0966 11.5239 24.2619C11.5239 24.6169 11.8117 24.9048 12.1668 24.9048H19.8335C20.1885 24.9048 20.4763 24.6169 20.4763 24.2619C20.4763 24.0966 20.4153 23.948 20.3129 23.8336L19.7161 23.1667L20.313 22.4999C20.4154 22.3855 20.4764 22.2369 20.4764 22.0716C20.4764 21.7165 20.1886 21.4287 19.8336 21.4287H12.1669C11.8119 21.4287 11.524 21.7165 11.524 22.0716C11.524 22.2368 11.5851 22.3854 11.6875 22.4998L12.2842 23.1667ZM10.9422 23.1667C10.6821 23.4573 10.5239 23.8411 10.5239 24.2619C10.5239 25.1692 11.2595 25.9048 12.1668 25.9048H19.8335C20.7408 25.9048 21.4763 25.1692 21.4763 24.2619C21.4763 23.8412 21.3182 23.4574 21.0581 23.1668C21.3182 22.8761 21.4764 22.4923 21.4764 22.0716C21.4764 21.1642 20.7409 20.4287 19.8336 20.4287H12.1669C11.2596 20.4287 10.524 21.1642 10.524 22.0716C10.524 22.4923 10.6822 22.876 10.9422 23.1667Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M15.4048 25.9043C15.4048 26.233 15.6713 26.4995 16 26.4995C16.3288 26.4995 16.5953 26.233 16.5953 25.9043H17.5953C17.5953 26.7853 16.881 27.4995 16 27.4995C15.119 27.4995 14.4048 26.7853 14.4048 25.9043H15.4048Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 13C17.7761 13 18 13.2239 18 13.5L18 20.5C18 20.7761 17.7761 21 17.5 21C17.2239 21 17 20.7761 17 20.5L17 13.5C17 13.2239 17.2239 13 17.5 13Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M14.1973 13.1021C14.417 12.9349 14.7307 12.9775 14.8979 13.1973C15.106 13.4708 15.4628 13.7678 15.8421 13.8489C16.0201 13.887 16.2058 13.879 16.4018 13.7968C16.6017 13.7128 16.8422 13.5388 17.1021 13.1973C17.2693 12.9775 17.583 12.9349 17.8028 13.1021C18.0225 13.2693 18.0652 13.583 17.8979 13.8028C17.5578 14.2498 17.1858 14.5522 16.7889 14.7188C16.388 14.8871 15.9925 14.9037 15.6329 14.8268C14.9373 14.678 14.394 14.1864 14.1021 13.8028C13.9349 13.583 13.9775 13.2693 14.1973 13.1021Z" fill="#333333"/>'
         + '<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 13C14.7761 13 15 13.2239 15 13.5L15 20.5C15 20.7761 14.7761 21 14.5 21C14.2239 21 14 20.7761 14 20.5L14 13.5C14 13.2239 14.2239 13 14.5 13Z" fill="#333333"/>'
         + '</svg>'
      return selectedIcon;
 
      default:
         selectedIcon = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<circle cx="16" cy="16" r="9.5" stroke="#333333"/>'
         + '<path d="M15.3646 17.18C15.3588 17.4655 15.6064 17.6787 15.892 17.6787C16.2313 17.6787 16.4882 17.3797 16.5316 17.0431C16.7604 15.2683 18.8 14.4021 18.8 12.5265C18.8 10.9794 17.7624 10 16.178 10C15.2249 10 14.4396 10.3899 13.8305 10.9599C13.6351 11.1428 13.6542 11.4499 13.8497 11.6326C14.0568 11.8261 14.3804 11.8039 14.5987 11.6232C15.017 11.277 15.5029 11.0787 16.0378 11.0787C17.0333 11.0787 17.5521 11.76 17.5521 12.6116C17.5521 14.1819 15.4071 15.0774 15.3646 17.18ZM15.9958 21C16.5146 21 16.9352 20.6026 16.9352 20.0206C16.9352 19.4387 16.5146 19.0129 15.9958 19.0129C15.491 19.0129 15.0704 19.4387 15.0704 20.0206C15.0704 20.6026 15.491 21 15.9958 21Z" fill="#333333"/>'
         + '</svg>'
      return selectedIcon;
   }
 }
 
 var listHeaderTitle = function(data) {
   return ( data.cardTitle && '<div class="list-header-title">'
   +'<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
   +'<circle cx="8.25" cy="9.25" r="0.75" fill="#333333" stroke="#333333"/>'
   +  '<path d="M12 9.25H24" stroke="#333333" stroke-linecap="round"/>'
   +  '<circle cx="8.25" cy="16.25" r="0.75" fill="#333333" stroke="#333333"/>'
   +  '<path d="M12 16.25H24" stroke="#333333" stroke-linecap="round"/>'
   +  '<circle cx="8.25" cy="23.25" r="0.75" fill="#333333" stroke="#333333"/>'
   +  '<path d="M12 23.25H24" stroke="#333333" stroke-linecap="round"/>'
   +'</svg>'
   +'<span>' + data.cardTitle + '</span>'
 +'</div>')};
 
 // 주소 수정 필요 (챗봇 프로필 이미지)
 var profileBox = '<div class="profile"><img class="img-circle"src="https://storage.googleapis.com/singlex-ai-chatbot-contents-stg/fc683bf7-fc01-4913-af76-eefcefc06c8d/image/assets/chararcter.png"></div>'
 
 var makeStart = function(indexNum) {
   return profileBox + '<div class="re-box ' + 'index-' + indexNum + '">'; 
 };
 
 var makeCarouselStart = function(indexNum) {
   return profileBox + '<div class="re-box ' + 'index-' + indexNum + '">'; 
 };
 
 function appendQueryText(message) {
   var chatMessage = '<div class="chat-message right">'
   +'<div class="message">' + message + '</div>'
   // +'<span class="time-stamp">' + timeFormat() + '</span>';
   
   $('#divScroll').append(chatMessage);
 }
 
 var arrow ='<div class="arrow">'
      + '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path d="M12 6L20.3979 15.331C20.7402 15.7113 20.7402 16.2887 20.3979 16.669L12 26" stroke-width="1.2" stroke-linecap="round"/>'
      + '</svg>'
   + '</div>';   
 
 var iconCheck = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
   + '<path d="M7 13.9167L13.5254 21.2041C13.9112 21.6349 14.5808 21.6497 14.9852 21.2364L25 11" stroke="#333333" stroke-linecap="round"/>'
 +'</svg>';
 
 var iconCalendar = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<rect x="10.5" y="6.5" width="2" height="5" rx="0.5" stroke="#333333"/>'
 +'<rect x="19.5" y="6.5" width="2" height="5" rx="0.5" stroke="#333333"/>'
 +'<path d="M10.6 8H9.7H9C7.89543 8 7 8.89543 7 10V22C7 23.1046 7.89543 24 9 24H23C24.1046 24 25 23.1046 25 22V10C25 8.89543 24.1046 8 23 8H22.3H21.4" stroke="#333333"/>'
 +'<line x1="7.5" y1="14.5" x2="24.5" y2="14.5" stroke="#333333" stroke-linecap="round"/>'
 +'<line x1="12.5" y1="8" x2="19.5" y2="8" stroke="#333333" stroke-linecap="round"/>'
 +'</svg>';
 
 var iconTime = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<circle cx="16" cy="16" r="9.5" stroke="#333333"/>'
 +'<path d="M16 10.5V15.9854C16 16.3083 16.156 16.6114 16.4188 16.7991L19.5 19" stroke="#333333" stroke-linecap="round"/>'
 +'</svg>';
 
 var iconPlace = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 + '<path d="M10.0363 17.4746C6.97005 12.7458 10.3641 6.5 16 6.5C21.6359 6.5 25.0299 12.7458 21.9637 17.4747L17.1733 24.8624C16.9155 25.26 16.4739 25.5 16 25.5C15.5261 25.5 15.0845 25.26 14.8267 24.8624L10.0363 17.4746Z" stroke="#333333"/>'
 + '<circle cx="16" cy="14" r="2.5" stroke="#333333"/>'
 + '</svg>';
 
 var iconSearch = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="search">'
 + '<circle cx="6.5" cy="6.5" r="5.5" />'
 + '<path d="M11.2398 10.6464L10.8862 10.2929L10.1791 11L10.5327 11.3536L11.2398 10.6464ZM14.3963 15.2172C14.5915 15.4124 14.9081 15.4124 15.1034 15.2172C15.2986 15.0219 15.2986 14.7053 15.1034 14.5101L14.3963 15.2172ZM10.5327 11.3536L14.3963 15.2172L15.1034 14.5101L11.2398 10.6464L10.5327 11.3536Z" />'
 +'</svg>';
 
 var iconHome = '<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="blog">'
 + '<mask id="path-1-inside-1_3059:5785">'
   + '<path fill-rule="evenodd" clip-rule="evenodd" d="M8.6545 0.356376C8.27873 0.0309482 7.72097 0.0309472 7.34519 0.356375L0.85028 5.98114C0.150376 6.58727 0.579053 7.73707 1.50494 7.73707H2.39034V13.7497C2.39034 14.302 2.83805 14.7497 3.39034 14.7497H6.15892C6.7112 14.7497 7.15892 14.302 7.15892 13.7497V13.0615V11.3538C7.15892 11.0777 7.38278 10.8538 7.65892 10.8538H8.62245C8.89859 10.8538 9.12245 11.0777 9.12245 11.3538V13.7497C9.12245 14.302 9.57017 14.7497 10.1225 14.7497H12.6105C13.1628 14.7497 13.6105 14.302 13.6105 13.7497V7.73707H14.4948C15.4206 7.73707 15.8493 6.58727 15.1494 5.98114L8.6545 0.356376Z"/>'
 + '</mask>'
 + '<path d="M7.34519 0.356375L6.69054 -0.399554L7.34519 0.356375ZM8.6545 0.356376L9.30915 -0.399553L9.30915 -0.399553L8.6545 0.356376ZM0.85028 5.98114L0.195626 5.22521H0.195626L0.85028 5.98114ZM2.39034 7.73707H3.39034V6.73707H2.39034V7.73707ZM13.6105 7.73707V6.73707H12.6105V7.73707H13.6105ZM15.1494 5.98114L15.8041 5.22521L15.1494 5.98114ZM7.99985 1.1123L7.99985 1.11231L9.30915 -0.399553C8.55761 -1.05041 7.44209 -1.05041 6.69054 -0.399554L7.99985 1.1123ZM1.50493 6.73707L7.99985 1.1123L6.69054 -0.399554L0.195626 5.22521L1.50493 6.73707ZM1.50494 6.73707L1.50493 6.73706L0.195626 5.22521C-1.20419 6.43748 -0.346822 8.73707 1.50494 8.73707V6.73707ZM2.39034 6.73707H1.50494V8.73707H2.39034V6.73707ZM3.39034 13.7497V7.73707H1.39034V13.7497H3.39034ZM3.39034 13.7497H3.39034H1.39034C1.39034 14.8543 2.28577 15.7497 3.39034 15.7497V13.7497ZM6.15892 13.7497H3.39034V15.7497H6.15892V13.7497ZM6.15892 13.7497V13.7497V15.7497C7.26349 15.7497 8.15892 14.8543 8.15892 13.7497H6.15892ZM6.15892 13.0615V13.7497H8.15892V13.0615H6.15892ZM6.15892 11.3538V13.0615H8.15892V11.3538H6.15892ZM7.65892 9.85382C6.83049 9.85382 6.15892 10.5254 6.15892 11.3538H8.15892C8.15892 11.63 7.93506 11.8538 7.65892 11.8538V9.85382ZM8.62245 9.85382H7.65892V11.8538H8.62245V9.85382ZM10.1225 11.3538C10.1225 10.5254 9.45088 9.85382 8.62245 9.85382V11.8538C8.34631 11.8538 8.12245 11.63 8.12245 11.3538H10.1225ZM10.1225 13.7497V11.3538H8.12245V13.7497H10.1225ZM10.1225 13.7497H10.1225H8.12245C8.12245 14.8543 9.01788 15.7497 10.1225 15.7497V13.7497ZM12.6105 13.7497H10.1225V15.7497H12.6105V13.7497ZM12.6105 13.7497V15.7497C13.7151 15.7497 14.6105 14.8543 14.6105 13.7497H12.6105ZM12.6105 7.73707V13.7497H14.6105V7.73707H12.6105ZM14.4948 6.73707H13.6105V8.73707H14.4948V6.73707ZM14.4948 6.73707L14.4948 6.73707V8.73707C16.3465 8.73707 17.2039 6.43748 15.8041 5.22521L14.4948 6.73707ZM7.99985 1.11231L14.4948 6.73707L15.8041 5.22521L9.30915 -0.399553L7.99985 1.11231Z" mask="url(#path-1-inside-1_3059:5785)" class="blog" />'
 + '</svg>';
 
 var iconWarning = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
 + '<path fill-rule="evenodd" clip-rule="evenodd" d="M12 18.75C15.7279 18.75 18.75 15.7279 18.75 12C18.75 8.27208 15.7279 5.25 12 5.25C8.27208 5.25 5.25 8.27208 5.25 12C5.25 15.7279 8.27208 18.75 12 18.75ZM12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" fill="#706B6B"/>'
 + '<path d="M11.6175 13.044H12.279L12.405 8.592L12.4365 7.5H11.46L11.4915 8.592L11.6175 13.044ZM11.943 15.501C12.3315 15.501 12.636 15.207 12.636 14.7765C12.636 14.346 12.3315 14.031 11.943 14.031C11.565 14.031 11.25 14.346 11.25 14.7765C11.25 15.207 11.565 15.501 11.943 15.501Z" fill="#706B6B"/>'
 + '</svg>';
 
 var wSunny = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path d="M22 16C22 19.3137 19.3137 22 16 22C12.6863 22 10 19.3137 10 16C10 12.6863 12.6863 10 16 10C19.3137 10 22 12.6863 22 16Z" fill="#F3A73F"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 22C19.3137 22 22 19.3137 22 16C22 12.6863 19.3137 10 16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M23.5 16C23.5 15.7239 23.7239 15.5 24 15.5H27C27.2761 15.5 27.5 15.7239 27.5 16C27.5 16.2761 27.2761 16.5 27 16.5H24C23.7239 16.5 23.5 16.2761 23.5 16Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 16C4.5 15.7239 4.72386 15.5 5 15.5H8C8.27614 15.5 8.5 15.7239 8.5 16C8.5 16.2761 8.27614 16.5 8 16.5H5C4.72386 16.5 4.5 16.2761 4.5 16Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16 23.5C16.2761 23.5 16.5 23.7239 16.5 24L16.5 27C16.5 27.2761 16.2761 27.5 16 27.5C15.7239 27.5 15.5 27.2761 15.5 27L15.5 24C15.5 23.7239 15.7239 23.5 16 23.5Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16 4.5C16.2761 4.5 16.5 4.72386 16.5 5L16.5 8C16.5 8.27614 16.2761 8.5 16 8.5C15.7239 8.5 15.5 8.27614 15.5 8L15.5 5C15.5 4.72386 15.7239 4.5 16 4.5Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M21.6464 21.6465C21.8417 21.4513 22.1583 21.4513 22.3536 21.6465L24.4749 23.7678C24.6701 23.9631 24.6701 24.2797 24.4749 24.4749C24.2796 24.6702 23.963 24.6702 23.7678 24.4749L21.6464 22.3536C21.4512 22.1584 21.4512 21.8418 21.6464 21.6465Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M7.64645 7.64652C7.84171 7.45126 8.15829 7.45126 8.35355 7.64652L10.4749 9.76784C10.6701 9.9631 10.6701 10.2797 10.4749 10.4749C10.2796 10.6702 9.96303 10.6702 9.76777 10.4749L7.64645 8.35363C7.45118 8.15837 7.45118 7.84178 7.64645 7.64652Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M21.6465 10.3536C21.4513 10.1583 21.4513 9.84171 21.6465 9.64645L23.7678 7.52513C23.9631 7.32986 24.2797 7.32986 24.4749 7.52513C24.6702 7.72039 24.6702 8.03697 24.4749 8.23223L22.3536 10.3536C22.1584 10.5488 21.8418 10.5488 21.6465 10.3536Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M7.64652 24.3536C7.45126 24.1583 7.45126 23.8417 7.64652 23.6464L9.76784 21.5251C9.9631 21.3299 10.2797 21.3299 10.4749 21.5251C10.6702 21.7204 10.6702 22.037 10.4749 22.2322L8.35363 24.3536C8.15837 24.5488 7.84178 24.5488 7.64652 24.3536Z" fill="#D69133"/>'
 +'</svg>';
 
 var wPartlyCloudy = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4998 19C21.9851 19 23.9999 16.7614 23.9999 14C23.9999 11.2386 21.9851 9 19.4998 9C17.3219 9 15.5053 10.7192 15.0894 13.0028C15.1426 13.0009 15.1961 13 15.2498 13C17.5971 13 19.4998 14.7909 19.4998 17C19.4998 17.7136 19.3013 18.3835 18.9534 18.9635C19.1325 18.9876 19.3149 19 19.4998 19Z" fill="#F3A73F"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M19.3076 9.5C17.6034 9.5 16.1163 10.5963 15.4633 12.2016C15.3592 12.4574 15.0675 12.5803 14.8117 12.4763C14.5559 12.3722 14.4329 12.0805 14.537 11.8247C15.3265 9.88411 17.1537 8.5 19.3076 8.5C22.2048 8.5 24.5001 10.9928 24.5001 14C24.5001 17.0072 22.2048 19.5 19.3076 19.5C19.0314 19.5 18.8076 19.2761 18.8076 19C18.8076 18.7239 19.0314 18.5 19.3076 18.5C21.5936 18.5 23.5001 16.5156 23.5001 14C23.5001 11.4844 21.5936 9.5 19.3076 9.5Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M25.8887 14.5752C25.8887 14.2991 26.1125 14.0752 26.3887 14.0752H28.3887C28.6648 14.0752 28.8887 14.2991 28.8887 14.5752C28.8887 14.8513 28.6648 15.0752 28.3887 15.0752H26.3887C26.1125 15.0752 25.8887 14.8513 25.8887 14.5752Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M19.4248 4.5C19.7009 4.5 19.9248 4.72386 19.9248 5L19.9248 7C19.9248 7.27614 19.7009 7.5 19.4248 7.5C19.1487 7.5 18.9248 7.27614 18.9248 7L18.9248 5C18.9248 4.72386 19.1487 4.5 19.4248 4.5Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M24.2939 19.4449C24.4892 19.2496 24.8058 19.2496 25.001 19.4449L26.4152 20.8591C26.6105 21.0543 26.6105 21.3709 26.4152 21.5662C26.22 21.7614 25.9034 21.7614 25.7081 21.5662L24.2939 20.152C24.0986 19.9567 24.0986 19.6401 24.2939 19.4449Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M12.1074 7.25785C12.3026 7.06259 12.6192 7.06259 12.8145 7.25785L14.2287 8.67206C14.424 8.86733 14.424 9.18391 14.2287 9.37917C14.0334 9.57443 13.7169 9.57443 13.5216 9.37917L12.1074 7.96496C11.9121 7.76969 11.9121 7.45311 12.1074 7.25785Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M24.2945 9.70609C24.0992 9.51083 24.0992 9.19425 24.2945 8.99899L25.7087 7.58477C25.9039 7.38951 26.2205 7.38951 26.4158 7.58477C26.6111 7.78003 26.6111 8.09662 26.4158 8.29188L25.0016 9.70609C24.8063 9.90135 24.4897 9.90135 24.2945 9.70609Z" fill="#D69133"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M9.02242 17C9.27504 14.1967 11.631 12 14.5 12C17.5376 12 20 14.4624 20 17.5C20 18.1009 19.9036 18.6793 19.7255 19.2206C21.0541 19.7173 22 20.9982 22 22.5C22 24.433 20.433 26 18.5 26C18.3899 26 18.2811 25.9949 18.1736 25.985C18.1172 25.9949 18.0592 26 18 26H9C8.94566 26 8.89233 25.9957 8.84034 25.9873C8.72799 25.9957 8.61449 26 8.5 26C6.01472 26 4 23.9853 4 21.5C4 19.0147 6.01472 17 8.5 17C8.61449 17 8.72799 17.0043 8.84034 17.0127C8.89233 17.0043 8.94566 17 9 17H9.02242Z" fill="#CBE9F0"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M9.93636 18H9C8.99926 18 8.99886 18 8.99875 18.0001L8.88285 18.0186L8.76577 18.0099C8.67821 18.0033 8.58959 18 8.5 18C6.567 18 5 19.567 5 21.5C5 23.433 6.567 25 8.5 25C8.58959 25 8.67821 24.9967 8.76577 24.9901L8.88285 24.9814L8.99875 24.9999C8.99885 25 8.99925 25 9 25H18C18.0007 25 18.0011 25 18.0012 25L18.1327 24.9769L18.2657 24.9892C18.3426 24.9963 18.4207 25 18.5 25C19.8807 25 21 23.8807 21 22.5C21 21.4288 20.3259 20.5126 19.3753 20.1572L18.4753 19.8207L18.7756 18.908C18.921 18.4663 19 17.9934 19 17.5C19 15.0147 16.9853 13 14.5 13C12.1532 13 10.225 14.7972 10.0184 17.0898L9.93636 18ZM19.7255 19.2206C19.9036 18.6793 20 18.1009 20 17.5C20 14.4624 17.5376 12 14.5 12C11.631 12 9.27504 14.1967 9.02242 17H9C8.94566 17 8.89233 17.0043 8.84034 17.0127C8.72799 17.0043 8.61449 17 8.5 17C6.01472 17 4 19.0147 4 21.5C4 23.9853 6.01472 26 8.5 26C8.61449 26 8.72799 25.9957 8.84034 25.9873C8.89233 25.9957 8.94566 26 9 26H18C18.0592 26 18.1172 25.9949 18.1736 25.985C18.2811 25.9949 18.3899 26 18.5 26C20.433 26 22 24.433 22 22.5C22 20.9982 21.0541 19.7173 19.7255 19.2206Z" fill="#66C4DA"/>'
 +'</svg>';
 
 var wCloudy = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4574 13.4286C10.7822 9.82439 13.8113 7 17.5 7C21.4054 7 24.5714 10.166 24.5714 14.0714C24.5714 14.844 24.4475 15.5877 24.2185 16.2836C25.9267 16.9222 27.1429 18.5691 27.1429 20.5C27.1429 22.9853 25.1281 25 22.6429 25C22.5613 25 22.4803 24.9978 22.3999 24.9936C22.3624 24.9978 22.3243 25 22.2857 25H10.1429C10.1075 25 10.0726 24.9982 10.0382 24.9946C9.95449 24.9982 9.87031 25 9.78571 25C6.59035 25 4 22.4096 4 19.2143C4 16.0189 6.59035 13.4286 9.78571 13.4286C9.87031 13.4286 9.95449 13.4304 10.0382 13.434C10.0726 13.4304 10.1075 13.4286 10.1429 13.4286H10.4574Z" fill="#EFEFF0"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M11.3713 14.4286H10.1429L10.1416 14.4286L10.0686 14.4362L9.9953 14.4331C9.92587 14.4301 9.856 14.4286 9.78571 14.4286C7.14264 14.4286 5 16.5712 5 19.2143C5 21.8574 7.14264 24 9.78571 24C9.856 24 9.92587 23.9985 9.9953 23.9955L10.0686 23.9924L10.1416 24L10.1429 24H22.2857L22.287 24L22.3698 23.9905L22.453 23.995C22.5158 23.9983 22.5791 24 22.6429 24C24.5759 24 26.1429 22.433 26.1429 20.5C26.1429 18.9997 25.1985 17.7175 23.8683 17.2203L22.9683 16.8838L23.2686 15.971C23.4649 15.3747 23.5714 14.7365 23.5714 14.0714C23.5714 10.7183 20.8532 8 17.5 8C14.3334 8 11.7321 10.4249 11.4534 13.5183L11.3713 14.4286ZM24.2185 16.2836C24.4475 15.5877 24.5714 14.844 24.5714 14.0714C24.5714 10.166 21.4054 7 17.5 7C13.8113 7 10.7822 9.82439 10.4574 13.4286H10.1429C10.1075 13.4286 10.0726 13.4304 10.0382 13.434C9.95449 13.4304 9.87031 13.4286 9.78571 13.4286C6.59035 13.4286 4 16.0189 4 19.2143C4 22.4096 6.59035 25 9.78571 25C9.87031 25 9.95449 24.9982 10.0382 24.9946C10.0726 24.9982 10.1075 25 10.1429 25H22.2857C22.3243 25 22.3624 24.9978 22.3999 24.9936C22.4803 24.9978 22.5613 25 22.6429 25C25.1281 25 27.1429 22.9853 27.1429 20.5C27.1429 18.5691 25.9267 16.9222 24.2185 16.2836Z" fill="#8E8A8A"/>'
 +'</svg>';
 
 var wRainy = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4574 10.4286C10.7822 6.82439 13.8113 4 17.5 4C21.4054 4 24.5714 7.16599 24.5714 11.0714C24.5714 11.844 24.4475 12.5877 24.2185 13.2836C25.9267 13.9222 27.1429 15.5691 27.1429 17.5C27.1429 19.9853 25.1281 22 22.6429 22C22.5613 22 22.4803 21.9978 22.3999 21.9936C22.3624 21.9978 22.3243 22 22.2857 22H10.1429C10.1075 22 10.0726 21.9982 10.0382 21.9946C9.95449 21.9982 9.87031 22 9.78571 22C6.59035 22 4 19.4096 4 16.2143C4 13.0189 6.59035 10.4286 9.78571 10.4286C9.87031 10.4286 9.95449 10.4304 10.0382 10.434C10.0726 10.4304 10.1075 10.4286 10.1429 10.4286H10.4574Z" fill="#EFEFF0"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M9.19276 23.7649C8.98922 23.679 8.91376 23.4543 9.02422 23.263L11.8193 18.4217C11.9298 18.2304 12.1843 18.1449 12.3878 18.2308C12.5914 18.3167 12.6668 18.5414 12.5564 18.7327L9.7613 23.5739C9.65085 23.7653 9.3963 23.8507 9.19276 23.7649Z" fill="#333333"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0505 25.6766C15.8592 25.5661 15.7936 25.3215 15.9041 25.1302L18.4041 20.8C18.5146 20.6087 18.7592 20.5432 18.9505 20.6536C19.1418 20.7641 19.2074 21.0087 19.0969 21.2L16.5969 25.5302C16.4865 25.7215 16.2418 25.787 16.0505 25.6766Z" fill="#333333"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4716 22.6487C13.268 22.5628 13.1926 22.3381 13.303 22.1468L16.803 16.0846C16.9135 15.8933 17.168 15.8078 17.3716 15.8937C17.5751 15.9795 17.6506 16.2042 17.5401 16.3956L14.0401 22.4577C13.9297 22.649 13.6751 22.7345 13.4716 22.6487Z" fill="#333333"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1429 11.4286H11.3713L11.4534 10.5183C11.7321 7.42488 14.3334 5 17.5 5C20.8532 5 23.5714 7.71827 23.5714 11.0714C23.5714 11.7365 23.4649 12.3747 23.2686 12.971L22.9683 13.8838L23.8683 14.2203C25.1985 14.7175 26.1429 15.9997 26.1429 17.5C26.1429 19.433 24.5759 21 22.6429 21C22.5791 21 22.5158 20.9983 22.453 20.995L22.3698 20.9905L22.287 21L22.2857 21H21V22H22.2857C22.3243 22 22.3624 21.9978 22.3999 21.9936C22.4803 21.9978 22.5613 22 22.6429 22C25.1281 22 27.1429 19.9853 27.1429 17.5C27.1429 15.5691 25.9267 13.9222 24.2185 13.2836C24.4475 12.5877 24.5714 11.844 24.5714 11.0714C24.5714 7.16599 21.4054 4 17.5 4C13.8113 4 10.7822 6.82439 10.4574 10.4286H10.1429C10.1075 10.4286 10.0726 10.4304 10.0382 10.434C9.95449 10.4304 9.87031 10.4286 9.78571 10.4286C6.59035 10.4286 4 13.0189 4 16.2143C4 18.7865 5.67853 20.9667 8 21.7192V20.6557C6.24141 19.948 5 18.2261 5 16.2143C5 13.5712 7.14264 11.4286 9.78571 11.4286C9.856 11.4286 9.92587 11.4301 9.9953 11.4331L10.0686 11.4362L10.1416 11.4286L10.1429 11.4286Z" fill="#333333"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M9.19276 23.7649C8.98922 23.679 8.91376 23.4543 9.02422 23.263L11.8193 18.4217C11.9298 18.2304 12.1843 18.1449 12.3878 18.2308C12.5914 18.3167 12.6668 18.5414 12.5564 18.7327L9.7613 23.5739C9.65085 23.7653 9.3963 23.8507 9.19276 23.7649Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0505 25.6766C15.8592 25.5661 15.7936 25.3215 15.9041 25.1302L18.4041 20.8C18.5146 20.6087 18.7592 20.5432 18.9505 20.6536C19.1418 20.7641 19.2074 21.0087 19.0969 21.2L16.5969 25.5302C16.4865 25.7215 16.2418 25.787 16.0505 25.6766Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4716 22.6487C13.268 22.5628 13.1926 22.3381 13.303 22.1468L16.803 16.0846C16.9135 15.8933 17.168 15.8078 17.3716 15.8937C17.5751 15.9795 17.6506 16.2042 17.5401 16.3956L14.0401 22.4577C13.9297 22.649 13.6751 22.7345 13.4716 22.6487Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1429 11.4286H11.3713L11.4534 10.5183C11.7321 7.42488 14.3334 5 17.5 5C20.8532 5 23.5714 7.71827 23.5714 11.0714C23.5714 11.7365 23.4649 12.3747 23.2686 12.971L22.9683 13.8838L23.8683 14.2203C25.1985 14.7175 26.1429 15.9997 26.1429 17.5C26.1429 19.433 24.5759 21 22.6429 21C22.5791 21 22.5158 20.9983 22.453 20.995L22.3698 20.9905L22.287 21L22.2857 21H21V22H22.2857C22.3243 22 22.3624 21.9978 22.3999 21.9936C22.4803 21.9978 22.5613 22 22.6429 22C25.1281 22 27.1429 19.9853 27.1429 17.5C27.1429 15.5691 25.9267 13.9222 24.2185 13.2836C24.4475 12.5877 24.5714 11.844 24.5714 11.0714C24.5714 7.16599 21.4054 4 17.5 4C13.8113 4 10.7822 6.82439 10.4574 10.4286H10.1429C10.1075 10.4286 10.0726 10.4304 10.0382 10.434C9.95449 10.4304 9.87031 10.4286 9.78571 10.4286C6.59035 10.4286 4 13.0189 4 16.2143C4 18.7865 5.67853 20.9667 8 21.7192V20.6557C6.24141 19.948 5 18.2261 5 16.2143C5 13.5712 7.14264 11.4286 9.78571 11.4286C9.856 11.4286 9.92587 11.4301 9.9953 11.4331L10.0686 11.4362L10.1416 11.4286L10.1429 11.4286Z" fill="#8E8A8A"/>'
 +'</svg>';
 
 var wSnowy = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4574 10.4286C10.7822 6.82439 13.8113 4 17.5 4C21.4054 4 24.5714 7.16599 24.5714 11.0714C24.5714 11.844 24.4475 12.5877 24.2185 13.2836C25.9267 13.9222 27.1429 15.5691 27.1429 17.5C27.1429 19.9853 25.1281 22 22.6429 22C22.5613 22 22.4803 21.9978 22.3999 21.9936C22.3624 21.9978 22.3243 22 22.2857 22H10.1429C10.1075 22 10.0726 21.9982 10.0382 21.9946C9.95449 21.9982 9.87031 22 9.78571 22C6.59035 22 4 19.4096 4 16.2143C4 13.0189 6.59035 10.4286 9.78571 10.4286C9.87031 10.4286 9.95449 10.4304 10.0382 10.434C10.0726 10.4304 10.1075 10.4286 10.1429 10.4286H10.4574Z" fill="#EFEFF0"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M7.57393 15.7136C7.68438 15.5223 7.92902 15.4567 8.12034 15.5672L12.2691 17.9625C12.4605 18.073 12.526 18.3176 12.4156 18.5089C12.3051 18.7002 12.0605 18.7658 11.8691 18.6553L7.72034 16.26C7.52902 16.1496 7.46347 15.9049 7.57393 15.7136Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M9.99453 14.3164C10.2154 14.3164 10.3945 14.4955 10.3945 14.7164L10.3945 19.507C10.3945 19.7279 10.2154 19.907 9.99453 19.907C9.77362 19.907 9.59453 19.7279 9.59453 19.507L9.59453 14.7164C9.59453 14.4955 9.77362 14.3164 9.99453 14.3164Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M7.57354 18.509C7.46308 18.3177 7.52863 18.0731 7.71995 17.9626L11.8688 15.5673C12.0601 15.4568 12.3047 15.5224 12.4152 15.7137C12.5256 15.905 12.4601 16.1496 12.2688 16.2601L8.11995 18.6554C7.92863 18.7659 7.68399 18.7003 7.57354 18.509Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5739 18.7136C14.6844 18.5223 14.929 18.4567 15.1203 18.5672L19.2691 20.9625C19.4605 21.073 19.526 21.3176 19.4156 21.5089C19.3051 21.7002 19.0605 21.7658 18.8691 21.6553L14.7203 19.26C14.529 19.1496 14.4635 18.9049 14.5739 18.7136Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16.9945 17.3164C17.2154 17.3164 17.3945 17.4955 17.3945 17.7164L17.3945 22.507C17.3945 22.7279 17.2154 22.907 16.9945 22.907C16.7736 22.907 16.5945 22.7279 16.5945 22.507L16.5945 17.7164C16.5945 17.4955 16.7736 17.3164 16.9945 17.3164Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5735 21.509C14.4631 21.3177 14.5286 21.0731 14.7199 20.9626L18.8688 18.5673C19.0601 18.4568 19.3047 18.5224 19.4152 18.7137C19.5256 18.905 19.4601 19.1496 19.2688 19.2601L15.1199 21.6554C14.9286 21.7659 14.684 21.7003 14.5735 21.509Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M8.61055 22.7912C8.721 22.5999 8.96564 22.5344 9.15696 22.6448L13.4748 25.1377C13.6661 25.2482 13.7316 25.4928 13.6212 25.6841C13.5107 25.8754 13.2661 25.941 13.0748 25.8305L8.75696 23.3376C8.56564 23.2272 8.50009 22.9826 8.61055 22.7912Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M11.1156 21.3452C11.3365 21.3452 11.5156 21.5243 11.5156 21.7452L11.5156 26.731C11.5156 26.9519 11.3365 27.131 11.1156 27.131C10.8947 27.131 10.7156 26.9519 10.7156 26.731L10.7156 21.7452C10.7156 21.5243 10.8947 21.3452 11.1156 21.3452Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M8.61064 25.6843C8.50019 25.493 8.56574 25.2483 8.75705 25.1379L13.0749 22.645C13.2662 22.5346 13.5108 22.6001 13.6213 22.7914C13.7317 22.9827 13.6662 23.2274 13.4749 23.3378L9.15705 25.8307C8.96574 25.9412 8.7211 25.8756 8.61064 25.6843Z" fill="#4EAFC5"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1429 11.4286H11.3713L11.4534 10.5183C11.7321 7.42488 14.3334 5 17.5 5C20.8532 5 23.5714 7.71827 23.5714 11.0714C23.5714 11.7365 23.4649 12.3747 23.2686 12.971L22.9683 13.8838L23.8683 14.2203C25.1985 14.7175 26.1429 15.9997 26.1429 17.5C26.1429 19.433 24.5759 21 22.6429 21C22.5791 21 22.5158 20.9983 22.453 20.995L22.3698 20.9905L22.287 21L22.2857 21H21V22H22.2857C22.3243 22 22.3624 21.9978 22.3999 21.9936C22.4803 21.9978 22.5613 22 22.6429 22C25.1281 22 27.1429 19.9853 27.1429 17.5C27.1429 15.5691 25.9267 13.9222 24.2185 13.2836C24.4475 12.5877 24.5714 11.844 24.5714 11.0714C24.5714 7.16599 21.4054 4 17.5 4C13.8113 4 10.7822 6.82439 10.4574 10.4286H10.1429C10.1075 10.4286 10.0726 10.4304 10.0382 10.434C9.95449 10.4304 9.87031 10.4286 9.78571 10.4286C6.59035 10.4286 4 13.0189 4 16.2143C4 18.7865 5.67853 20.9667 8 21.7192V20.6557C6.24141 19.948 5 18.2261 5 16.2143C5 13.5712 7.14264 11.4286 9.78571 11.4286C9.856 11.4286 9.92587 11.4301 9.9953 11.4331L10.0686 11.4362L10.1416 11.4286L10.1429 11.4286Z" fill="#8E8A8A"/>'
 +'</svg>';
 
 var wThunder = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.4574 10.4286C10.7822 6.82439 13.8113 4 17.5 4C21.4054 4 24.5714 7.16599 24.5714 11.0714C24.5714 11.844 24.4475 12.5877 24.2185 13.2836C25.9267 13.9222 27.1429 15.5691 27.1429 17.5C27.1429 19.9853 25.1281 22 22.6429 22C22.5613 22 22.4803 21.9978 22.3999 21.9936C22.3624 21.9978 22.3243 22 22.2857 22H10.1429C10.1075 22 10.0726 21.9982 10.0382 21.9946C9.95449 21.9982 9.87031 22 9.78571 22C6.59035 22 4 19.4096 4 16.2143C4 13.0189 6.59035 10.4286 9.78571 10.4286C9.87031 10.4286 9.95449 10.4304 10.0382 10.434C10.0726 10.4304 10.1075 10.4286 10.1429 10.4286H10.4574Z" fill="#EFEFF0"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M10.1429 11.4286H11.3713L11.4534 10.5183C11.7321 7.42488 14.3334 5 17.5 5C20.8532 5 23.5714 7.71827 23.5714 11.0714C23.5714 11.7365 23.4649 12.3747 23.2686 12.971L22.9683 13.8838L23.8683 14.2203C25.1985 14.7175 26.1429 15.9997 26.1429 17.5C26.1429 19.433 24.5759 21 22.6429 21C22.5791 21 22.5158 20.9983 22.453 20.995L22.3698 20.9905L22.287 21L22.2857 21H21V22H22.2857C22.3243 22 22.3624 21.9978 22.3999 21.9936C22.4803 21.9978 22.5613 22 22.6429 22C25.1281 22 27.1429 19.9853 27.1429 17.5C27.1429 15.5691 25.9267 13.9222 24.2185 13.2836C24.4475 12.5877 24.5714 11.844 24.5714 11.0714C24.5714 7.16599 21.4054 4 17.5 4C13.8113 4 10.7822 6.82439 10.4574 10.4286H10.1429C10.1075 10.4286 10.0726 10.4304 10.0382 10.434C9.95449 10.4304 9.87031 10.4286 9.78571 10.4286C6.59035 10.4286 4 13.0189 4 16.2143C4 18.7865 5.67853 20.9667 8 21.7192V20.6557C6.24141 19.948 5 18.2261 5 16.2143C5 13.5712 7.14264 11.4286 9.78571 11.4286C9.856 11.4286 9.92587 11.4301 9.9953 11.4331L10.0686 11.4362L10.1416 11.4286L10.1429 11.4286Z" fill="#8E8A8A"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16.7804 14.2068C16.7866 14.0115 16.5378 13.9241 16.4205 14.0804L10.9206 21.4137C10.8711 21.4796 10.9182 21.5737 11.0006 21.5737H12.9915L12.8207 26.9406C12.8145 27.136 13.0633 27.2234 13.1806 27.067L18.6806 19.7337C18.73 19.6678 18.683 19.5737 18.6006 19.5737H16.6097L16.7804 14.2068Z" fill="#F3A73F"/>'
 +'<path fill-rule="evenodd" clip-rule="evenodd" d="M14.0238 20.5737L13.9008 24.4401L16.8006 20.5737H15.5773L15.7004 16.7073L12.8006 20.5737H14.0238ZM11.0006 21.5737C10.9182 21.5737 10.8711 21.4796 10.9206 21.4137L16.4205 14.0804C16.5378 13.9241 16.7866 14.0115 16.7804 14.2068L16.6097 19.5737H18.6006C18.683 19.5737 18.73 19.6678 18.6806 19.7337L13.1806 27.067C13.0633 27.2234 12.8145 27.136 12.8207 26.9406L12.9915 21.5737H11.0006Z" fill="#D69133"/>'
 +'</svg>';
 
 
 function selectWeatherIcon(symbolText) {
   switch(symbolText) {
      case 'sunny':
      return wSunny;
 
      case 'partlycloudy':
      return wPartlyCloudy;
 
      case 'cloudy':
      return wCloudy;
 
      case 'rainy':
      return wRainy;
 
      case 'snowy':
      return wSnowy;
 
      case 'thunder':
      return wThunder;
 
      default:
      return wSunny;
   }
 }
 
 function selectWeatherIcon2(sky, pty) { //sky : 하늘상태 pty: 강수형태 //하늘상태(SKY) 코드 : 맑음(1), 구름많음(3), 흐림(4) - 강수형태(PTY) 코드 : (단기) 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4) 
   if(pty != 0 && pty != null) {
      switch (pty) {
         case '1':
            return wRainy;
         case '2' :
            return wRainy;
         case '3' :
            return wSnowy;
         case '4':
            return wRainy;
 
         default:
            return wRainy;
      }
   } else {
      switch(sky) {
         case '1':
         return wSunny;
   
         case '3':
         return wPartlyCloudy;
   
         case '4':
         return wCloudy;
   
         // case 'thunder':?
         // return wThunder;
   
         default:
         return wSunny;
      }
   }
   
 }
 
 function pm10Select(data) {
   var pm10G = data.pm10Grade;
   var pm10V = data.pm10Value;
 
   switch(pm10G) {
      case '1' :
         return '<span class="status-green">좋음 ' + pm10V + '</span>';
      case '2' :
         return '<span class="status-green">보통 ' + pm10V + '</span>';
 
      case '3' :
         return '<span class="status-red">나쁨 ' + pm10V + '</span>';
      
      case '4' :
         return '<span class="status-red">매우나쁨 ' + pm10V + '</span>';
 
      default :
         return '<span>-</span>';
   }
 
 }
 
 function pm25Select(data) {
   var pm25G = data.pm25Grade;
   var pm25V = data.pm25Value;
 
   switch(pm25G) {
      case '1' :
         return '<span class="status-green">좋음 ' + pm25V + '</span>';
      case '2' :
         return '<span class="status-green">보통 ' + pm25V + '</span>';
 
      case '3' :
         return '<span class="status-red">나쁨 ' + pm25V + '</span>';
      
      case '4' :
         return '<span class="status-red">매우나쁨 ' + pm25V + '</span>';
 
      default :
         return '<span>-</span>';
   }
 
 }
 
 
 function auto_grow(element) {
  element.style.height = "5px";
  element.style.height = (element.scrollHeight)+"px";
 }
 
 var makeResponse = function(data, eventType, resultText)  {
 
   var eventTypeLower = eventType ? eventType.toLowerCase() : '';
   var lastMessage = ''      
   
   switch(eventTypeLower){
      case 'simpletext':
            
      var bulletText = data["bullet"] ? data["bullet"] : null;
      var bulletHtml = '';
      if(bulletText) {
         bulletHtml = '<ul>';
         for(var i=0; i<bulletText.length; i++) {
            bulletHtml += '<li>' + bulletText[i].text + '</li>';
         }
         bulletHtml += '</ul>';
      }
 
      var simpleTexBtns = ''
      if(data.buttons) simpleTexBtns = makeButtons(data);
 
      lastMessage = (bulletText ? '<div class="simple-text bullet-text">' : '<div class="simple-text">')
         + '<p>' + resultText + '</p>'
         + ( bulletHtml ? bulletHtml : '' )
         + (simpleTexBtns ? simpleTexBtns : '')
      +'</div>';
      
      return lastMessage;
      
 
      case 'image':
         lastMessage = `<div class="media-box">` +`<img src="` + data.imageUrl + `" onerror="this.src='` + tempImage + `';" />`+`</div>`;
      return lastMessage;
      
         
      case 'video':
         lastMessage = '<div class="media-box">'
            //videoLink
         + '<div class="play-btn">'
               + '<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">'
                  +'<rect opacity="0.6" width="60" height="60" fill="white"/>'
                  +'<path opacity="0.6" d="M44 30L23 42.1244L23 17.8756L44 30Z" fill="#333333"/>'
               +'</svg>'
            +'</div>'
         +'</div>';
 
      return lastMessage;      
 
      case 'basiccard':
         const cardButtons = makeButtons(data);
         var thumbnail ='';
         if(data.thumbnail) {
            if(data.thumbnail.webLink) {
               thumbnail = '<div class="img-box web-link" data-weblink="'+ data.thumbnail.webLink +'">' + `<img src="` + data.thumbnail.imageUrl + `" onerror="this.src='` + tempImage + `';" />` + '</div>'
            } else if(data.thumbnail.outLink) {
               thumbnail = '<div class="img-box out-link" data-outlink="'+ data.thumbnail.webLink +'">' + `<img src="` + data.thumbnail.imageUrl + `" onerror="this.src='` + tempImage + `';" />` + '</div>'
            } else {
               thumbnail = '<div class="img-box">' + `<img src="` + data.thumbnail.imageUrl + `" onerror="this.src='` + tempImage + `';" />`  +'</div>'
            }
         }
 
         lastMessage = '<div class="basic-card">'
               + (thumbnail ? thumbnail : '')
               + ( data.title ? '<h1>' + data.title + '</h1>' : '')
               + ( data.description ? '<p class="desc">' + data.description + '</p>' : '')
               + (cardButtons ? cardButtons : '')
            +'</div>';
 
      return lastMessage;
      
 
      case 'textlist':
         var textList = '';
         if(data.list && data.list.length > 0) {
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  textList += (list.webLink ? '<div class="list-box action web-link" data-weblink="'+ list.webLink +'">' : '<div class="list-box">')
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else if(list["action"] && list["action"]=='outLink') {
                  textList += (list.webLink ? '<div class="list-box action out-link" data-outlink="'+ list.webLink +'">' : '<div class="list-box">')
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else if(list["action"] && list["action"]=='message') {
                  textList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box">')
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + ( list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else {
                  textList += '<div class="list-box">'
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
            }
         }
         
         var textListBtns = makeButtons(data);
 
         lastMessage = '<div class="text-list">'
         + ( data.cardTitle ? listHeaderTitle(data) : '')
         + ( textList ? textList : '')
         + ( textListBtns ? textListBtns : '')
         +'</div>'
         
         
      return lastMessage;
         
      
 
      case 'iconlist':
         var iconList = '';
         if(data.list && data.list.length > 0) {
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  iconList += (list.webLink ? '<div class="list-box action web-link" data-weblink="' + list.webLink + '">' : '<div class="list-box">')
                  + (list.icon ? '<div class="icon">'+ iconSelect(list["icon"]) + '</div>' : '')
                  + '<div class="text-box">'
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description  ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  + '</div>'
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"] == 'outLink') {
                  iconList += (list.webLink ? '<div class="list-box action out-link" data-outlink="' + list.webLink + '">' : '<div class="list-box">')
                  + (list.icon ? '<div class="icon">'+ iconSelect(list["icon"]) + '</div>' : '')
                  + '<div class="text-box">'
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description  ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  + '</div>'
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"]=='message') {
                  iconList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box">')
                  + (list.icon ? '<div class="icon">' + iconSelect(list["icon"]) +'</div>' : '')
                  + '<div class="text-box">'
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + arrow
                  +'</div>'
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else if(!list["description"]){
                  iconList += '<div class="list-box">'
                  + (list.icon ? '<div class="icon">' + iconSelect(list["icon"]) +'</div>' : '')
                  + '<div class="text-box">'
                  + '<h1>'+ list.title +'</h1>'
                  +'</div>'
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else {
                  iconList += '<div class="list-box">'
                  + (list.icon ? '<div class="icon">' + iconSelect(list["icon"]) +'</div>' : '')
                  + '<div class="text-box">'
                  + (list.title ?'<h1>'+ list.title +'</h1>' : '')
                  + (list.description  ? '<p class="desc">' + list.description + '</p>' : '')
                  +'</div>'
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
            }
         }
 
         var iconListBtns = makeButtons(data);
 
         var lastMessage = '<div class="icon-list">'
         + ( data.cardTitle ? listHeaderTitle(data) : '')
         + ( iconList ? iconList : '')
         + (iconListBtns ? iconListBtns : '')
         +'</div>';
 
      return lastMessage;
            
         
 
 
      case 'imagelist':
         var imageList = '';
 
         if(data.list && data.list.length > 0) {
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  imageList += (list.webLink ? '<div class="list-box action web-link" data-weblink="' + list.webLink + '">' : '<div class="list-box">')
                     + (list.imageUrl ? '<div class="image">' + `<img src="` + list.imageUrl + `" onerror="this.src='` + tempImage + `';" />` +'</div>' : '')
                     +(list.title || list.description ? '<div class="text-box">' : '')
                        + ( list.title ? '<h1>'+ list.title +'</h1>' : '')
                        + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                     +(list.title || list.description ? '</div>' : '')
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"] == 'outLink') {
                  imageList += (list.webLink ? '<div class="list-box action out-link" data-outlink="' + list.webLink + '">' : '<div class="list-box">')
                     + (list.imageUrl ? '<div class="image">' + `<img src="` + list.imageUrl + `" onerror="this.src='` + tempImage + `';" />` +'</div>' : '')
                     +(list.title || list.description ? '<div class="text-box">' : '')
                        + ( list.title ? '<h1>'+ list.title +'</h1>' : '')
                        + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                     +(list.title || list.description ? '</div>' : '')
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"]=='message') {
                  imageList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box"')
                  + (list.imageUrl ? '<div class="image">' +`<img src="` + list.imageUrl + `" onerror="this.src='` + tempImage + `';" />` +'</div>' : '')
                  +(list.title || list.description ? '<div class="text-box">' : '')
                     + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                     + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                     +(list.title || list.description ? '</div>' : '')
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else {
                  imageList += '<div class="list-box">'
                  + (list.imageUrl ? '<div class="image">' + `<img src="` + list.imageUrl + `" onerror="this.src='` + tempImage + `';" />`+'</div>' : '')
                  + (list.title || list.description ? '<div class="text-box">' : '')
                  + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                  + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + (list.title || list.description ? '</div>' : '')
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
            }
         }
 
 
         var imagenListBtns = makeButtons(data);
         lastMessage = '<div class="image-list">'
            + ( data.cardTitle ? listHeaderTitle(data) : '')
            + (imageList ? imageList :'')
            + (imagenListBtns ? imagenListBtns : '')
            +'</div>';
         
      return lastMessage;
            
         
      
 
      case 'processlist':
 
         var processList = '';
 
         if(data.list && data.list.length > 0) {
            processList = '<div class="p-box">'
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  processList += (list.webLink ? '<div class="list-box action web-link" data-weblink="' + list.webLink + '">' : '<div class="list-box">')
                     +'<div class="step">'
                     + 'STEP ' + (i + 1)
                     +'</div>'
                     +(list.title || list.description ? '<div class="text-box">' : '')
                        + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                        + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                     + (list.title || list.description ? '</div>' : '')
                  +'</div>'
               } 
               else if(list["action"] && list["action"] == 'outLink') {
                  processList += (list.webLink ? '<div class="list-box action out-link" data-outlink="' + list.webLink + '">' : '<div class="list-box">')
                     +'<div class="step">'
                     + 'STEP ' + (i + 1)
                     +'</div>'
                     +(list.title || list.description ? '<div class="text-box">' : '')
                        + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                        + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                     + (list.title || list.description ? '</div>' : '')
                  +'</div>'
               }
               else if(list["action"] && list["action"]=='message') {
                  processList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box">')
                  +'<div class="step">'
                     + 'STEP ' + (i + 1)
                     +'</div>'
                     +(list.title || list.description ? '<div class="text-box">' : '')
                     + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                     + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + (list.title || list.description ? '</div>' : '')
                  +'</div>'
               } else {
                  processList += '<div class="list-box">'
                  +'<div class="step">'
                     + 'STEP ' + (i + 1)
                     +'</div>'
                     +(list.title || list.description ? '<div class="text-box">' : '')
                     + (list.title ? '<h1>'+ list.title +'</h1>' : '')
                     + (list.description ? '<p class="desc">' + list.description + '</p>' : '')
                  + (list.title || list.description ? '</div>' : '')
                  +'</div>'
               }
            }
 
            processList += '</div>'
         }
 
 
         var processListBtns = makeButtons(data);
         lastMessage = '<div class="process-list">'
         + ( data.cardTitle ? listHeaderTitle(data) : '')
         + (processList ? processList : '')
         + (processListBtns ? processListBtns : '')
         +'</div>';
      return lastMessage;
            
 
      case 'profilelist':
 
         var profileList = '';
 
         if(data.list && data.list.length > 0) {
            profileList = '<div class="p-box">'
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  profileList += (list.webLink ? '<div class="list-box action web-link" data-weblink="' + list.webLink + '">' : '<div class="list-box">')
                     +(list.imageUrl ? '<div class="profile-img">' +`<img src="` + list.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` +'</div>' : '')
                     +'<div class="text-box">'
                        +(list.title ||  list.tag ? '<div class="name">' : '')
                           + (list.title ? '<h1>' + list.title +'</h1>' : '')
                           + (list.tag ? '<span class="position">' + list.tag +'</span>' : '')
                        +(list.title ||  list.tag ? '</div">' : '')
                        +( list.part || list.mobile ? '<p class="desc">' : '')
                           + (list.part ? '<span>' + list.part+ '</span>' : '')
                           + (list.mobile ? '<span>' + list.mobile + '</span>' : '')
                        +( list.part || list.mobile ? '</p>' : '')
                        +'</div>'
                     +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"] == 'outLink') {
                  profileList += (list.webLink ? '<div class="list-box action out-link" data-outlink="' + list.webLink + '">' : '<div class="list-box">')
                     +(list.imageUrl ? '<div class="profile-img">' +`<img src="` + list.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` +'</div>' : '')
                     +'<div class="text-box">'
                        +(list.title ||  list.tag ? '<div class="name">' : '')
                           + (list.title ? '<h1>' + list.title +'</h1>' : '')
                           + (list.tag ? '<span class="position">' + list.tag +'</span>' : '')
                        +(list.title ||  list.tag ? '</div">' : '')
                        +( list.part || list.mobile ? '<p class="desc">' : '')
                           + (list.part ? '<span>' + list.part+ '</span>' : '')
                           + (list.mobile ? '<span>' + list.mobile + '</span>' : '')
                        +( list.part || list.mobile ? '</p>' : '')
                        +'</div>'
                     +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"]=='message') {
                  profileList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box">')
                  +(list.imageUrl ? '<div class="profile-img">' +`<img src="` + list.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` +'</div>' : '')
                  +'<div class="text-box">'
                     +(list.title ||  list.tag ? '<div class="name">' : '')
                        + (list.title ? '<h1>' + list.title +'</h1>' : '')
                        + (list.tag ? '<span class="position">' + list.tag +'</span>' : '')
                     +(list.title ||  list.tag ? '</div">' : '')
                     +( list.part || list.mobile ? '<p class="desc">' : '')
                        + (list.part ? '<span>' + list.part+ '</span>' : '')
                        + (list.mobile ? '<span>' + list.mobile + '</span>' : '')
                     +( list.part || list.mobile ? '</p>' : '')
                     +'</div>'
                  +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else {
                  profileList += '<div class="list-box">'
                  +(list.imageUrl ? '<div class="profile-img">' +`<img src="` + list.imageUrl + `" onerror="this.src='` + pAlternative + `';" />`+'</div>' : '')
                  +'<div class="text-box">'
                     +(list.title ||  list.tag ? '<div class="name">' : '')
                        + (list.title ? '<h1>' + list.title +'</h1>' : '')
                        + (list.tag ? '<span class="position">' + list.tag +'</span>' : '')
                     +(list.title ||  list.tag ? '</div">' : '')
                     +( list.part || list.mobile ? '<p class="desc">' : '')
                        + (list.part ? '<span>' + list.part+ '</span>' : '')
                        + (list.mobile ? '<span>' + list.mobile + '</span>' : '')
                     +( list.part || list.mobile ? '</p>' : '')
                     +'</div>'
                  +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
            }
 
            profileList += '</div>'
         }
         var profileListBtns = makeButtons(data);
         lastMessage = '<div class="profile-list">'
         + ( data.cardTitle ? listHeaderTitle(data) : '')
         + (profileList ? profileList : '')
         + (profileListBtns ? profileListBtns : '')
         +'</div>';
      return lastMessage;


      case 'profile':
         var profiletBtns = makeProfileButtons(data);
         lastMessage = '<div class="profile-one">'
            + '<div class="list-box">';
            if(data.hasOwnProperty("ceo")) lastMessage += (data.imageUrl ? '<div class="profile-img"><div class="ceo">' + `<img src="` + data.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` + '</div></div>' : '');
            else lastMessage += (data.imageUrl ? '<div class="profile-img">' + `<img src="` + data.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` + '</div>' : '');
            // + (data.imageUrl ? '<div class="profile-img">' + `<img src="` + data.imageUrl + `" onerror="this.src='` + pAlternative + `';" />` + '</div>' : '')
            lastMessage += (data.title || data.part ? '<div class="text-box">' : '')
               +(data.title ? '<h1>'+ data.title + '</h1>' : '')
               +(data.part ? '<p class="desc">' +'<span>'+ data.part + '</span>' +'</p>' : '')
            +(data.title || data.part ? '</div>' : '')
         +'</div>'
         + '<div class="more-infos">'
            +(data.mail || data.mobile || data.office || data.description ? '<ul class="p-info">' : '')
               +( data.mail ? '<li><span class="info-label">E-mail</span><span class="info">'+ data.mail + '</span></li>' : '')
               +( data.mobile ? '<li><span class="info-label">Mobile</span><span class="info">'+ data.mobile + '</span></li>' : '')
               +( data.office ? '<li><span class="info-label">Office</span><span class="info">'+ data.office + '</span></li>' : '')
               +( data.description ? '<li><p class="desc">' + data.description + '</p></li>' : '')
            +( data.mail || data.mobile || data.office ? '</ul>' : '' )
            +( profiletBtns ? '<div class="p-btns-block">'+ profiletBtns + '</div>' : '' )
         +'</div></div>';
      return lastMessage;;
 
      
      case 'schedule':
         var scheduleList = '';
         if(data.list && data.list.length > 0) {
            for(let i=0; i<data.list.length; i++) {
               var list = data.list[i];
               if(list["action"] && list["action"] == 'webLink') {
                  scheduleList += (list.webLink ? '<div class="list-box action web-link" data-weblink="' + list.webLink + '">' : '<div class="list-box">')
                     +'<div class="icon">' +  iconCalendar + '</div>'
                     +'<div class="text-box">'
                     + (list.title ? '<h1>' + list.title + '</h1>' : '')
                     + (list.date ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconCalendar + '</span>'
                        + '<span class="s-text">' + list.date + '</span>'
                     + '</p>' : '')
                     + (list.time ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconTime + '</span>'
                        + '<span class="s-text">' + list.time + '</span>'
                     + '</p>' : '')
                     + (list.place ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconPlace + '</span>'
                        + '<span class="s-text">' + list.place + '</span>'
                     + '</p>' : '')
                     +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"] == 'outLink') {
                  scheduleList += (list.webLink ? '<div class="list-box action out-link" data-outlink="' + list.webLink + '">' : '<div class="list-box">')
                     +'<div class="icon">' +  iconCalendar + '</div>'
                     +'<div class="text-box">'
                     + (list.title ? '<h1>' + list.title + '</h1>' : '')
                     + (list.date ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconCalendar + '</span>'
                        + '<span class="s-text">' + list.date + '</span>'
                     + '</p>' : '')
                     + (list.time ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconTime + '</span>'
                        + '<span class="s-text">' + list.time + '</span>'
                     + '</p>' : '')
                     + (list.place ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconPlace + '</span>'
                        + '<span class="s-text">' + list.place + '</span>'
                     + '</p>' : '')
                     +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               }
               else if(list["action"] && list["action"]=='message') {
                  scheduleList += (list.message ? '<div class="list-box action send-message" data-message="' + list.message +'">' : '<div class="list-box">')
                  +'<div class="icon">' +  iconCalendar + '</div>'
                     +'<div class="text-box">'
                     + (list.title ? '<h1>' + list.title + '</h1>' : '')
                     + (list.date ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconCalendar + '</span>'
                        + '<span class="s-text">' + list.date + '</span>'
                     + '</p>' : '')
                     + (list.time ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconTime + '</span>'
                        + '<span class="s-text">' + list.time + '</span>'
                     + '</p>' : '')
                     + (list.place ? '<p class="s-label">'
                        + '<span class="s-icon">' + iconPlace + '</span>'
                        + '<span class="s-text">' + list.place + '</span>'
                     + '</p>' : '')
                     +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />')
               } else {
                  scheduleList += '<div class="list-box">'
                  +'<div class="icon">' +  iconCalendar + '</div>'
                  +'<div class="text-box">'
                  + (list.title ? '<h1>' + list.title + '</h1>' : '')
                  + (list.date ? '<p class="s-label">'
                     + '<span class="s-icon">' + iconCalendar + '</span>'
                     + '<span class="s-text">' + list.date + '</span>'
                  + '</p>' : '')
                  + (list.time ? '<p class="s-label">'
                     + '<span class="s-icon">' + iconTime + '</span>'
                     + '<span class="s-text">' + list.time + '</span>'
                  + '</p>' : '')
                  + (list.place ? '<p class="s-label">'
                     + '<span class="s-icon">' + iconPlace + '</span>'
                     + '<span class="s-text">' + list.place + '</span>'
                  + '</p>' : '')
                  +'</div>'
                     + arrow
                  +'</div>'
                  + (i == data.list.length - 1 ? '' : '<hr />');
               }
            }
         }
 
         var scheduleListBtns = makeButtons(data);
 
         lastMessage = '<div class="schedule">'
            +'<div class="s-header">'
               +'<span class="icon">'
                  + iconCheck
               +'</span>'
               + (data.cardTitle ?  '<h1>'+ data.cardTitle + '</h1>' : '')
            +'</div>'
            + (scheduleList ? scheduleList : '')
            + (scheduleListBtns ? scheduleListBtns : '');
            + '</div>'
 
         return lastMessage;
 
 
 
         case 'item':
 
         var itemList = '';
         if(data.itemList && data.itemList.length > 0) {
            for(let i=0; i<data.itemList.length; i++) {
               var list = data.itemList[i];
               itemList += '<li>'
               + (list.title ? '<span class="label">'+ list.title + '</span>' : '')
               + (data["itemListAlignment"] && data["itemListAlignment"] == "right" ? (list.description ? '<span class="data text-right">' + list.description + '</span>' : '') : (list.description  ? '<span class="data text-right">' + list.description + '</span>' : ''))
               + '</li>'
            }
         }
 
         var itemBtns = makeButtons(data);
 
         lastMessage = '<div class="item">'
            + (data.thumbnail ? ( data.thumbnail.webLink ? '<div class="img-box web-link" data-weblink="' + data.thumbnail.webLink +'">' : (data.thumbnail.outLink ? '<div class="img-box out-link" data-outlink="' + data.thumbnail.webLink +'">' : '<div class="img-box">'))
                     + `<img src="` + data.thumbnail.imageUrl + `" onerror="this.src='` + tempImage + `';" />`
                  + '</div>' : '')
            +(data.title ? '<h1>' + data.title +'</h1><hr />' : '')
            +(data.cardTitle ? '<h1 class="mid-title">' + data.cardTitle +'</h1>' : '')
            +(data.cardTitle ? '<div class="item-box mid-title"><ul>': '<div class="item-box"><ul>')
            + (itemList ? itemList : '')
            +'</ul>'
            +'</div>'
            +(data.description ? '<hr class="bottom" /><p class="desc">' + data.description +'</p>' : '')
            + itemBtns
         +'</div>';
         
      return lastMessage;
 
      case "quickreply":
         var quickReplyBtn = '';
 
         for(var i=0; i<data.length; i++) {
            quickReplyBtn += (data[i].action == 'call_event' ? '<button type="button" class="btn-s btn-text call-event quick" data-event="' + data[i].event + '"data-message="' + data[i].parameter[0].message +'">' : '<button type="button" class="btn-s btn-text send-message quick" data-message="' + data[i].message + '">')
            +(data[i].icon && data[i].icon == 'search' ? iconSearch : '')
            +(data[i].icon && data[i].icon == 'home' ? iconHome : '')
            + (data[i].label ? data[i].label : '')
            +'</button>';
         }
 
      return lastMessage = '<div class="btns">'
         + (quickReplyBtn ? quickReplyBtn : '')
      +'</div>';
 
      case "carousel":
 
         lastMessage = '<div class="carousel-box"><div class="variable-width">';
         for(var i=0; i<data.list.length; i++) {
            var carouselNum = data.list[i];
            console.log("data : ",carouselNum.data);
            if(carouselNum.data) lastMessage += '<div class="re-content">' + makeResponse(carouselNum.data, carouselNum.type, null) + '</div>';
            // lastMessage += '<div class="re-content">' + makeResponse(carouselNum.data, carouselNum.type, null) + '</div>';
         }
         lastMessage += '</div></div>';
 
      return lastMessage;
 
 
      case "carouselheader":
         lastMessage = '<div class="carousel-header">'
         +'<div class="img-box">'
            +(data.thumbnail.imageUrl ? `<img src="` + data.thumbnail.imageUrl +`" onerror="this.src='` + tempImage + `';"/>` : `<img src="` + tempImage + `"/>`)
         +'</div>'
         +'<div class="carousel-header-title">'
            +(data.title ? '<h1>'+ data.title +'</h1>' : '')
            +(data.description ? '<p>' + data.description + '</p>' : '')
         +'</div>'
         +'</div>';
 
      return lastMessage;
 
 
      case "weather":
 
 
 
         if(data["listByTime"]) {
            var weatherToday = '';
            for(var i=0; i<data.listByTime.length; i++) {
               var todayTime = data.listByTime[i];
               weatherToday += '<li>'
                  +'<span class="time">' + todayTime.time + '</span>'
                  + '<div class="icon">'+ selectWeatherIcon(todayTime.symabol)+'</div>'
                  +'<span class="tem">' + todayTime.temp +'°</span>'
               +'</li>';
            };
 
            lastMessage = '<div class="weather">'
            +'<div class="weather-header">'
               +'<div class="location">'
                  +'<span class="icon">' + iconPlace + '</span>'
                  +'<span class="address">'+ data.location + '</span>'
               +'</div>'
               +'<div class="source">'
                  +'<span class="icon">'+ iconWarning +'</span>'
                  +'<span class="address">출처</span>'
               +'</div>'
            +'</div>'
 
            +'<div class="weather-now">'
               +'<div class="icon">'
                  + selectWeatherIcon(data.total.symbol)
                  +'</div>'
                  +'<h1 class="w-h1">' + data.total.temp_now + '<span class="sup">°C</span></h1>'
               + '<div class="high-low-rain">'
                  + '<span class="hign-low">' + data.total.temp_min +'° / ' + data.total.temp_max +'°</span>'
                  + '<span class="rain">강수확률 : ' + data.total.rain+'%</span>'
               +'</div>'
            +'</div>'
 
            +'<div class="weather-future">'
               +'<ul>'
                  + weatherToday      
               +'</ul>'
            +'</div>'
            + '<div class="dust">'
               +'<div><span class="fine">미세먼지</span><span class="status-red">나쁨 49</span></div>'
               +'<div><span class="ultra">초미세먼지</span><span class="status-green">보통 20</span></div>'
            +'</div>'
         +'</div>';
         }
 
         else if(data["weatherList"]) {
            var weatherToday2 = '';
            for(var i=0; i<data.weatherList.length; i++) {
               var todayTime2 = data.weatherList[i];
               weatherToday2 += '<li>'
                  +'<span class="time">' + todayTime2.fcstTime + '시</span>'
                  + '<div class="icon">'+ selectWeatherIcon2(todayTime2.sky, todayTime2.pty)+'</div>'
                  +'<span class="tem">' + todayTime2.t1h +'°</span>'
               +'</li>';
            };
 
 
            lastMessage = '<div class="weather">'
            +'<div class="weather-header">'
               +'<div class="location">'
                  +'<span class="icon">' + iconPlace + '</span>'
                  +'<span class="address">'+ data.local1 + data.local2 + '</span>'
               +'</div>'
               +'<a class="source" href="'+ data.url +'" target="_blank">'
                  +'<span class="icon">'+ iconWarning +'</span>'
                  +'<span class="address">출처</span>'
               +'</a>'
            +'</div>'
 
            +'<div class="weather-now">'
               +'<div class="icon">'
                  + selectWeatherIcon2(data.todaySky, null)
                  +'</div>'
                  +'<h1 class="w-h1">' + data.t1h + '<span class="sup">°C</span></h1>'
               + '<div class="high-low-rain">'
                  + '<span class="hign-low">' + data.tmn +'° / ' + data.tmx +'°</span>'
                  + '<span class="rain">강수확률 : ' + data.todayPop +'%</span>'
               +'</div>'
            +'</div>'
 
            +'<div class="weather-future">'
               +'<ul>'
                  + weatherToday2      
               +'</ul>'
            +'</div>'
            + '<div class="dust">'
               +'<div><span class="fine">미세먼지</span>'+pm10Select(data)+'</div>'
               +'<div><span class="ultra">초미세먼지</span>'+pm25Select(data)+'</div>'
            +'</div>'
         +'</div>';
         }
         
 
         
      return lastMessage;
            
 
      default:
         lastMessage = '<div class="simple-text"><p>' + resultText + '</p></div>';
      return lastMessage;
   }
 }
 
 var makeResponse2 = function(data, eventType, resultText)  {
 
   var eventTypeLower = eventType ? eventType.toLowerCase() : '';
   var lastMessage = ''      
   
   switch(eventTypeLower){
      case 'basic':
            
      var bulletText = data["bullet"] ? data["bullet"] : null;
      var bulletHtml = '';
      if(bulletText) {
         bulletHtml = '<ul>';
         for(var i=0; i<bulletText.length; i++) {
            bulletHtml += '<li>' + bulletText[i].text + '</li>';
         }
         bulletHtml += '</ul>';
      }
 
      var simpleTexBtns = ''
      if(data.buttons) simpleTexBtns = makeButtons2(data);
 
      lastMessage = (bulletText ? '<div class="simple-text bullet-text">' : '<div class="simple-text">')
         + '<p>' + resultText + '</p>'
         + ( bulletHtml ? bulletHtml : '' )
         + (simpleTexBtns ? simpleTexBtns : '')
      +'</div>';
      
      return lastMessage;
      
   case 'basiccard':
         const cardButtons = makeButtons2(data);
         var thumbnail ='';
         if(data.imageUrl) {
           thumbnail = '<div class="img-box">' + `<img src="` + data.imageUrl + `" onerror="this.src='` + tempImage + `';" />`  +'</div>'
         }
 
       var subTitleText = '';
         if(data.subTitle && data.subTitle.includes('<ul>')) {
           subTitleText = '<div class="basic-card-list">' + data.subTitle + '</div>';
         } else if(!data.subTitle) {
           subTitleText = '';
         } else {
           subTitleText = '<p class="sub-title">' + data.subTitle + '</p>';
         }
 
 
         lastMessage = '<div class="basic-card">'
               + (thumbnail ? thumbnail : '')
               + ( data.title ? '<h1>' + data.title + '</h1>' : '')
               + ( subTitleText ? subTitleText : '')
               + (cardButtons ? cardButtons : '')
            +'</div>';
 
      return lastMessage;
 
 
      case "quickreply":
         var quickReplyBtn = '';
 
         for(var i=0; i<data.length; i++) {
           var btn = '';
             if(data[i].type == 'btn') {
                btn = '<button type="button" class="btn-s btn-text send-message quick" data-message="' + data[i].value + '">';
             } else if(data[i].type =='callIntent') {
                btn = '<button type="button" class="btn-s btn-text call-event quick" data-event="' + data[i].value + '"data-message="' + data[i].label +'">';
             } else if(data[i].action && data.action =='call_event') {
                btn = '<button type="button" class="btn-s btn-text call-event quick" data-event="' + data[i].event + '"data-message="' + data[i].parameter[0].message +'">';
             } else {
                btn = '<button type="button" class="btn-s btn-text send-message quick" data-message="' + data[i].message + '">';
             }
             
             quickReplyBtn += btn
            +(data[i].icon && data[i].icon == 'search' ? iconSearch : '')
            +(data[i].icon && data[i].icon == 'home' ? iconHome : '')
            + (data[i].label ? data[i].label : '')
            +'</button>';
         }
 
      return lastMessage = '<div class="btns">'
         + (quickReplyBtn ? quickReplyBtn : '')
      +'</div>';
 
      case "carousel":
 
         lastMessage = '<div class="carousel-box"><div class="variable-width">';
         for(var i=0; i<data.card.length; i++) {
            var carouselNum = data.card[i];
            lastMessage += '<div class="re-content">' + makeResponse2(carouselNum, 'basicCard', null) + '</div>';
         }
         lastMessage += '</div></div>';
 
      return lastMessage;
 
 
      case "carouselheader":
         lastMessage = '<div class="carousel-header">'
         +'<div class="img-box">'
            +(data.thumbnail.imageUrl ? `<img src="` + data.thumbnail.imageUrl +`" onerror="this.src='` + tempImage + `';"/>` : `<img src="` + tempImage + `"/>`)
         +'</div>'
         +'<div class="carousel-header-title">'
            +(data.title ? '<h1>'+ data.title +'</h1>' : '')
            +(data.description ? '<p>' + data.description + '</p>' : '')
         +'</div>'
         +'</div>';
 
      return lastMessage;
 
      default:
         lastMessage = '<div class="simple-text"><p>' + resultText + '</p></div>';
      return lastMessage;
   }
 }

 var indexNum = 0;
 function receiveMessages(chatEvent, received) {   
   setTimeout(function() {
     indexNum += 1;
    if(chatEvent.response.queryResult.messages && chatEvent.response.queryResult.messages.length > 0) {
      var end = (received ? '</div><span class="time-stamp">' + timeFormat() + '</span>' : '</div><span class="time-stamp">' + timeFormat(chatEvent.chatDate) + '</span>');
      var chatE = chatEvent.response.queryResult.messages;
      var customResponse = null;
      var rTypeJson = false;
      
      var chatContent = '';
      var lastMessageFind = $(".chat-message.left").last();
      
      for(var i=0; i<chatE.length;i++) {

        //23.02.06 no comment fallback 호출 시 응답 메시지 삭제 처리
        if(chatE[0].response !== null){
            if(JSON.parse(chatE[0].response).type == "no_comment"){
                lastMessageFind.empty().append('');
                break;
            }
        }
              
        rTypeJson = chatE[i].response ? true : false;
        
        if(rTypeJson) {
            customResponse = JSON.parse(chatE[i].response);
        
            var eventType = customResponse ? customResponse.type : chatEvent.response.queryResult.intent.name;
            var resultText = customResponse && customResponse.data && customResponse.data.text ? customResponse.data.text : '';
            var data = customResponse ? customResponse.data : null;   
            if(i == 0) {
               if(eventType == 'carousel') {
                  chatContent = makeCarouselStart(indexNum);
               }else {
                  chatContent = makeStart(indexNum);
               }
            }
            
            if(eventType === 'quickReply') {
               data = customResponse.buttons;
               chatContent += '<div class="re-content reply-btns">' + makeResponse(data, eventType, resultText) + '</div>';
            } else if(eventType =='carousel') {
               chatContent +=  makeResponse(customResponse, eventType, null);
            }else if(eventType == 'hashtag') {
               chatContent +=  '<div class="re-content">' + makeResponse(data, eventType, resultText) + '</div>' + '<p class="hashtag">' + data.text + '</p>'
            } else {
               chatContent +=  '<div class="re-content">' + makeResponse(data, eventType, resultText) + '</div>'
            }

            
        } else {
            customResponse = chatE[i];
        
            var eventType = customResponse ? customResponse.panelType : '';
            var quickReplyCheck = customResponse && customResponse.quickReply ? true : false;
            var resultText = customResponse && customResponse.message ? customResponse.message : '';
            var data = customResponse ? customResponse : null;   
            if(i == 0) {
               if(eventType == 'carousel') {
                  chatContent = makeCarouselStart(indexNum);
               }else {
                  chatContent = makeStart(indexNum);
               }
            }
            
            if(eventType =='carousel') {
               chatContent +=  makeResponse2(customResponse, eventType, null);
            } else {
               chatContent +=  '<div class="re-content">' + makeResponse2(data, eventType, resultText) + '</div>'
            }

            if(quickReplyCheck) {
              data = customResponse.quickReply;
              chatContent += '<div class="re-content reply-btns">' + makeResponse2(data, 'quickReply', resultText) + '</div>';
           } 
        }
       
        if(i == chatE.length-1) {
            chatContent += end;
        }
      }

     if(received) {
         lastMessageFind.html(chatContent);
     } else {
         var newMessage = (chatEvent.response.query.text  ? '<div class="chat-message right"><div class="message">' + chatEvent.response.query.text + '</div><span class="time-stamp">' + timeFormat(chatEvent.chatDate) +'</span></div>' : '')
         + '<div class="chat-message left">' + chatContent + '</div>';
         $('.chat-discussion').append(newMessage);
     }

   } else {
        var end = '</div><span class="time-stamp">' + timeFormat() + '</span>';

      var lastMessageFind = $(".chat-message.left").last();
      var chatContent = makeStart(indexNum);
      var resultText = chatEvent.response.queryResult.text ? chatEvent.response.queryResult.text : '';
      chatContent += '<div class="re-content">' + makeResponse(null, null, resultText) + '</div>';
      chatContent += end;
      
      if(received) {
         lastMessageFind.html(chatContent);
     } else {
         var newMessage = '<div class="chat-message left">' + chatContent + '</div>';
         $('.chat-discussion').append(newMessage);
     }
   }


   $(".index-"+indexNum+" .send-message").each(function() {
      $(this).on('click', function(){
         var mText = $(this).data('message');
         chatui.sendMessage(mText);


         if($(this).hasClass('quick')) {
            $('.reply-btns').remove();
         }
         if($('.f-tooltip').hasClass('active')) {
          $('.f-tooltip').removeClass('active');
         }
         if($('.menu').hasClass('show')) {
          $('.menu').removeClass('show');
          $('.more-back').removeClass('active');
      }
         
      });
   });

   $(".index-"+indexNum+" .call-event").each(function() {
    $(this).on('click', function(){
       var callEvent = $(this).data('event');
       var callMessage = $(this).data('message');
       chatui.sendEventMessage(callEvent, {"message": callMessage});


       appendQueryText(callMessage);
    });
 });

   $(".index-"+indexNum+" .web-link").each(function() {
      $(this).on('click', function(){
         var weblink = $(this).data('weblink');
         window.parent.location.href = weblink;
      });
   });

   $(".index-"+indexNum+" .out-link").each(function() {
      $(this).on('click', function(){
         var outlink = $(this).data('outlink');
         window.open(outlink, '_blank');
      });
   });

   $(".index-"+indexNum+" .copy-message").each(function() {
      $(this).on('click', function(){
         var copydata = $(this).data('copydata');
         navigator.clipboard.writeText(copydata);

         $('.copied').addClass('show');
         
         setTimeout(()=> {
             $('.copied').removeClass('show');
         }, 3000)
      });
   });



   $(".index-"+indexNum+" .variable-width").each(function() {

      var cWidth = $('.chat-panel').width();
      var contents = $(this).find('.re-content');

      var biggestHeight = 0;

      contents.each(function (index, element) {
         var currentBoxHeight = $(this).outerHeight();
         biggestHeight = currentBoxHeight >= biggestHeight ? currentBoxHeight : biggestHeight;
      });

      var carouselWidth = (contents.length * 265) + 36;
     
      if(carouselWidth < cWidth) {
         $(this).width(carouselWidth);
         $(this).addClass('not-carousel');
         $(this).parent().height(biggestHeight + 6);
         
      } else {
         $(this).width(cWidth - 56);
         $(this).removeClass('not-carousel');
         $(this).slick({
            dots: false,
            infinite: false,
            speed: 300,
            slidesToShow: 1,
            variableWidth: true
         });  


         $(this).find('.slick-prev').html('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
         + '<path d="M20 6L11.6021 15.331C11.2598 15.7113 11.2598 16.2887 11.6021 16.669L20 26" stroke-width="1.2" stroke-linecap="round"/>'
         +'</svg>'); 
         
         $(this).find('.slick-next').html('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
            +'<path d="M12 6L20.3979 15.331C20.7402 15.7113 20.7402 16.2887 20.3979 16.669L12 26" stroke-width="1.2" stroke-linecap="round"/>'
         +'</svg>');

         $(this).parent().height(biggestHeight + 6);
      }
      
      contents.each(function (index, element) {
         $(this).height(biggestHeight);
     });
      
   });


   $('#divScroll').scrollTop($("#divScroll")[0].scrollHeight);



});
}

 chatui.onLoad = function(){

   console.log("chatui.onLoad()");


    // Event ID 파라미터

    var eventId = chatui.getParameter("eventId");
    var eventText = chatui.getParameter("eventText");
    var userId=chatui.getSetting("plainUserId");
    var langCode = chatui.getParameter("languageCode");
    
    // console.log('eventId =', eventId, '/ eventText =', eventText, '/ userId =', userId);

    if (eventId && eventText) {
      var params = {
         eventId: eventId,
         eventText: eventText
     };

     //chatui.sendEventMessage(eventId, params);
     chatui.sendEventMessage("Welcome", {"message": "Welcome"});

   } else if(eventId && eventId !== 'false' && !eventText) {

      chatui.sendEventMessage(eventId, null);
   
    } else {

      if(userId == null) userId = chatui.getSetting("userId");
        
      if(userId && bearer) {
         var a = {
            "userId": userId,
            "languageCode": "ko",
            "requestId": ""
         };
         var t = { "Content-Type": "application/json"};
            t.Authorization = bearer;
            var r = $.ajax({
               url: "https://eapi.singlex.com/stg-chatbot/" + chatId + "/history",
               headers: t,
               type: "POST",
               data: JSON.stringify(a),
               dataType: "json",
               contentType: "application/json"
            }).done(function(response) {
               if(!response || response.length === 0) {
                     chatui.sendEventMessage("Welcome", {"message": "Welcome", "userId" : userId});
               } else {
                     for(let i=response.length-1; i>=0; i--) {
                        receiveMessages(response[i], false);
                     }

                     $('.f-tooltip').removeClass('active');
               }
            }).fail(function() {
               console.error("error ajaxApiCall()", "[" + r.status + "] " + r.statusText),
               toastr.info("에러가 발생했습니다.");
            });   
      } else {
         chatui.sendEventMessage("Welcome", {"message": "Welcome"});
      };   
  }
   
    
   
   $(".test-panel .panel-wrapper .chat-panel .info-area").html('<div class="header-back"></div>'
       + '<div class="collapse" id="chatbot-collapse">'
        + '<svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M21 1L11.6247 8.50024C11.2595 8.79242 10.7405 8.79242 10.3753 8.50024L1 1" stroke-width="1.5" stroke-linecap="round"/>'
        + '</svg>'
        +'</div>'
        +'<div class="center">'
        +'</div>'
        +'<div class="home" id="home">'
        +'<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
        +'<mask id="path-1-inside-1" fill="white">'
        +'<path fill-rule="evenodd" clip-rule="evenodd" d="M16.6539 3.56634C16.2781 3.24091 15.7204 3.24091 15.3446 3.56634L3.30438 13.9935C2.60448 14.5996 3.03315 15.7494 3.95904 15.7494H6.99963V24.9992C6.99963 26.1038 7.89506 26.9992 8.99963 26.9992H13.6496C14.2019 26.9992 14.6496 26.5515 14.6496 25.9992V24.2909V21.2492C14.6496 20.9731 14.8735 20.7492 15.1496 20.7492H17.2996C17.5758 20.7492 17.7996 20.9731 17.7996 21.2492V25.9992C17.7996 26.5515 18.2473 26.9992 18.7996 26.9992H22.9996C24.1042 26.9992 24.9996 26.1038 24.9996 24.9992V15.7494H28.0394C28.9653 15.7494 29.394 14.5996 28.6941 13.9935L16.6539 3.56634Z"/>'
        +'</mask>'
        +'<path d="M15.3446 3.56634L14.3626 2.43244L14.3626 2.43244L15.3446 3.56634ZM16.6539 3.56634L15.6719 4.70023L15.6719 4.70023L16.6539 3.56634ZM3.30438 13.9935L2.3224 12.8596H2.3224L3.30438 13.9935ZM6.99963 15.7494H8.49963V14.2494H6.99963V15.7494ZM24.9996 15.7494V14.2494H23.4996V15.7494H24.9996ZM28.6941 13.9935L29.6761 12.8596L28.6941 13.9935ZM16.3266 4.70023C16.1387 4.86294 15.8598 4.86295 15.6719 4.70023L17.6359 2.43244C16.6964 1.61887 15.302 1.61887 14.3626 2.43244L16.3266 4.70023ZM4.28636 15.1274L16.3266 4.70023L14.3626 2.43244L2.3224 12.8596L4.28636 15.1274ZM3.95904 14.2494C4.42198 14.2494 4.63631 14.8243 4.28636 15.1274L2.3224 12.8596C0.572647 14.3749 1.64432 17.2494 3.95904 17.2494V14.2494ZM6.99963 14.2494H3.95904V17.2494H6.99963V14.2494ZM8.49963 24.9992V15.7494H5.49963V24.9992H8.49963ZM8.99963 25.4992C8.72348 25.4992 8.49963 25.2754 8.49963 24.9992H5.49963C5.49963 26.9322 7.06663 28.4992 8.99963 28.4992V25.4992ZM13.6496 25.4992H8.99963V28.4992H13.6496V25.4992ZM13.1496 25.9992C13.1496 25.7231 13.3735 25.4992 13.6496 25.4992V28.4992C15.0303 28.4992 16.1496 27.3799 16.1496 25.9992H13.1496ZM13.1496 24.2909V25.9992H16.1496V24.2909H13.1496ZM13.1496 21.2492V24.2909H16.1496V21.2492H13.1496ZM15.1496 19.2492C14.0451 19.2492 13.1496 20.1447 13.1496 21.2492H16.1496C16.1496 21.8015 15.7019 22.2492 15.1496 22.2492V19.2492ZM17.2996 19.2492H15.1496V22.2492H17.2996V19.2492ZM19.2996 21.2492C19.2996 20.1446 18.4042 19.2492 17.2996 19.2492V22.2492C16.7473 22.2492 16.2996 21.8015 16.2996 21.2492H19.2996ZM19.2996 25.9992V21.2492H16.2996V25.9992H19.2996ZM18.7996 25.4992C19.0758 25.4992 19.2996 25.7231 19.2996 25.9992H16.2996C16.2996 27.3799 17.4189 28.4992 18.7996 28.4992V25.4992ZM22.9996 25.4992H18.7996V28.4992H22.9996V25.4992ZM23.4996 24.9992C23.4996 25.2754 23.2758 25.4992 22.9996 25.4992V28.4992C24.9326 28.4992 26.4996 26.9322 26.4996 24.9992H23.4996ZM23.4996 15.7494V24.9992H26.4996V15.7494H23.4996ZM28.0394 14.2494H24.9996V17.2494H28.0394V14.2494ZM27.7121 15.1274C27.3622 14.8243 27.5765 14.2494 28.0394 14.2494V17.2494C30.3542 17.2494 31.4258 14.3749 29.6761 12.8596L27.7121 15.1274ZM15.6719 4.70023L27.7121 15.1274L29.6761 12.8596L17.6359 2.43244L15.6719 4.70023Z" mask="url(#path-1-inside-1)" class="home-path"/>'
        +'</svg>'
        +'</div>'
   );
 
   $("#home").on('click', function(){
      if($('.f-tooltip').hasClass('active')) {
         $('.f-tooltip').removeClass('active');
      }
      if($('.menu').hasClass('show')) {
        $('.menu').removeClass('show');
        $('.more-back').removeClass('active');
      }
      chatui.sendMessage("처음으로");
   });
 
   $(".test-panel .panel-wrapper .chat-panel .form-group").prepend('<div class="copied">데이터가 복사되었습니다</div>'
      +'<div class="f-tooltip">자주 묻는 질문들을 확인해 보세요</div>'
      +'<div class="send-more" id="send-more">'
         +'<span class="more-back">'
            +'<div class="plus">'
               +'<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">'
                 +' <rect x="7.2002" width="1.6" height="16" />'
                  +'<rect y="8.7998" width="1.6" height="16" transform="rotate(-90 0 8.7998)" />'
               +'</svg>'
            +'</div>'
         +'</span>'
      +'</div>'
      + '<textarea class="input-message" id="input-message" placeholder="메세지를 입력해주세요." autocomplete="off" style="overflow:hidden"></textarea>'
   );
 
 
   $('.input-message').on('keydown', function(e) {
      let val = $('.input-message').val();
      if(val.length > 1) {
         $('.btn-send').addClass('active');
      } else {
         $('.btn-send').removeClass('active');
      }
      
      var scroll_height = $(".input-message").get(0).scrollHeight;
      if(e.keyCode==8 || e.keyCode==46) {
         if(val.length > 0 && scroll_height > 66) {
            $(".input-message").css('height', scroll_height + 'px');
         } else {
            $('.input-message').css('height', '40px');
         }
      } else if(e.keyCode==13) {
         if($('.f-tooltip').hasClass('active')) {
            $('.f-tooltip').removeClass('active');
         }
         if($('.menu').hasClass('show')) {
            $('.menu').removeClass('show');
            $('.more-back').removeClass('active');
         }
 
         e.preventDefault();
         chatui.sendMessage(val);
 
         $('.input-message').val('');
         $('.btn-send').removeClass('active');
         $('.input-message').css('height', '40px');
      } else {
         $(".input-message").css('height', scroll_height + 'px');
      };
   });
 
 
   $('.btn-send').on('click', function() {
       
        if($('.f-tooltip').hasClass('active')) {
         $('.f-tooltip').removeClass('active');
        }
        if($('.menu').hasClass('show')) {
            $('.menu').removeClass('show');
            $('.more-back').removeClass('active');
        }
      
      let val = $('.input-message').val();
      if(val.length > 1) {
         chatui.sendMessage(val);
         $('.input-message').val('');
         $('.btn-send').removeClass('active');
         $('.input-message').css('height', '40px');
         $('.input-message').css('overflow', 'hidden');
      }
   });
      
 
   $(".test-panel .panel-wrapper .chat-panel .form-group .btn-send").html('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
      +'<path fill-rule="evenodd" clip-rule="evenodd" d="M13.4965 23.8502C13.5823 24.0503 13.8663 24.0494 13.9509 23.8488L23.9983 0L10.3043 14.9302C10.0418 15.2164 9.97147 15.6298 10.1245 15.9867L13.4965 23.8502ZM0.1462 10.6509C-0.0500838 10.5638 -0.0491728 10.2849 0.147675 10.1991L23.5316 0.00111718L8.91602 13.8779C8.62665 14.1526 8.20033 14.2262 7.83562 14.0643L0.1462 10.6509Z" />'
   +'</svg>'
   );
 
   $(".menu").html('<div class="faq-list">'
     +'<div class="faq-header">'
     +'<h1>자주 묻는 질문을 모아봤어요.</h1>'
     +'<div class="input-collapse">'
     +'    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" xmlns="http://www.w3.org/2000/svg">'
     +'       <path d="M21 1L11.6247 8.50024C11.2595 8.79242 10.7405 8.79242 10.3753 8.50024L1 1" stroke="#333333" stroke-width="1.5" stroke-linecap="round"/>'
     +'    </svg>            '
     +' </div>'
     +'</div>'
     +'<div class="faq-body">'
     +' <h2>LG CNS의 비즈니스가 궁금하신가요?</h2>'
     +' <div class="btns">'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="비즈니스 소개">비즈니스 소개</button>'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="담당자 정보">담당자 정보</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="DX 체험하기">DX 체험하기</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="고객사례">고객사례</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="장애신고 및 문의">장애신고 및 문의</button>'
     +' </div>'
     +' <h2>채용 및 일하는 문화에 대해 조회해보세요!</h2>'
     +' <div class="btns">'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="채용공고">'
     + iconSearch
     + '채용공고</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="채용 프로세스">채용 프로세스</button>'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="사내복지">사내복지</button>'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="일하는 방식">일하는 방식</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="직무 인터뷰">직무 인터뷰</button>'
     +'    <button type="button" class="btn-s btn-highlight send-faq" data-message="채용FAQ">채용FAQ</button>'
     +' </div>'
     +' <h2>협력사 임직원이신가요?</h2>'
     +' <div class="btns">'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="제휴제안">제휴제안</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="협력사 포탈">협력사 포탈</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="정보보안교육">정보보안교육</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="구매담당자">구매담당자</button>'
     +' </div>'
     +' <h2>LG CNS의 전/현 임직원이신가요?</h2>'
     +' <div class="btns">'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="제증명서 발급 신청">제증명서 발급 신청</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="복지몰">복지몰</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="사업자 번호/주소">사업자 번호/주소</button>'
     +' </div>'
     +' <h2>이런 질문도 환영이에요!</h2>'
     +' <div class="btns">'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="오늘 날씨">오늘 날씨</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="코로나 확진자수">코로나 확진자수</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="블로그 검색">블로그 검색</button>'
     +'    <button type="button" class="btn-s btn-text send-faq" data-message="뉴스 검색">뉴스 검색</button>'
     +' </div>'
     +'</div>'
     +'</div>');
     
      $('.menu').removeClass('fixed');
      $('.menu').removeClass('hide');
 
      $("#send-more").on('click', function(){
         if($('.menu').hasClass('show')) {
            $('.menu').removeClass('show');
            $(this).find('.more-back').removeClass('active');
         } else {
            $('.menu').addClass('show');
            $(this).find('.more-back').addClass('active')    
         }
 
         if($('.f-tooltip').hasClass('active')) {
            $('.f-tooltip').removeClass('active');
         }
      });
 
      $(".input-collapse").on('click', function(){
         if($('.menu').hasClass('show')) {
            $('.menu').removeClass('show');
            $('.more-back').removeClass('active');
         };
      });
 
      $(".send-faq").each(function() {
         $(this).on('click', function(){
            var mText = $(this).data('message');
            chatui.sendMessage(mText);
 
            if($('.menu').hasClass('show')) {
               $('.menu').removeClass('show');
            }
 
            if($('.more-back').hasClass('active')) {
               $('.more-back').removeClass('active')
            }
         });
      });
 
      $('.f-tooltip').addClass('active');
   
   /* 팝업 외부 터치시 팝업 닫기 */
   $("#divScroll").on('click', function(){
       if($('.menu').hasClass('show')) {
         $('.menu').removeClass('show');
         $('.more-back').removeClass('active');
       }
   });
   $("#divHeader").on('click', function(){
       if($('.menu').hasClass('show')) {
         $('.menu').removeClass('show');
         $('.more-back').removeClass('active');
       }
   });
   
   $("#input-message").focus();
   
   var chatbotCollapse = document.getElementById("chatbot-collapse");
   
   chatbotCollapse.addEventListener('click', function(e) {
       //주소 수정 필요 : 챗봇이 iframe으로 들어가는 홈페이지 도메인 입력
      window.parent.postMessage({ childData : 'bot_close' }, 'https://wwwdev.lgcns.com/*');
   });
     
   
   chatui.onReceiveResponse = function(chatEvent) {
    receiveMessages(chatEvent, true)
   }  


 
   chatui.onSendMessage = function(chatEvent) {
 
      $('.quick').each(function() {
         $(this).parents('.reply-btns').remove();
      });
      
      setTimeout(() => {
         var lastQ = $(".chat-message.right").last().find('.message');    
         lastQ.after('<span class="time-stamp">' + timeFormat() + '</span>');
      })
   }
 
   
 
   $(window).resize(function() {
      var cWidth = $('.chat-panel').width();
      
      $('.plugins').each(function() {
         var pHeight = $(this).height();
         $(this).css('margin-bottom', '-' + pHeight + 'px');
      });
      
      
      $(".variable-width").each(function() {
         var contents = $(this).find('.re-content');
         var carouselWidth = (contents.length * 265) + 36;
         if(carouselWidth < cWidth) {
            $(this).filter('.slick-initialized').slick('unslick');
            $(this).width(carouselWidth);
            $(this).addClass('not-carousel');
         } else {
            if($(this).hasClass('not-carousel')) {
               $(this).removeClass('not-carousel');
               $(this).slick({
                  dots: false,
                  infinite: false,
                  speed: 300,
                  slidesToShow: 1,
                  variableWidth: true
               });  
   
   
               $(this).find('.slick-prev').html('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
               + '<path d="M20 6L11.6021 15.331C11.2598 15.7113 11.2598 16.2887 11.6021 16.669L20 26" stroke-width="1.2" stroke-linecap="round"/>'
               +'</svg>'); 
               
               $(this).find('.slick-next').html('<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">'
                  +'<path d="M12 6L20.3979 15.331C20.7402 15.7113 20.7402 16.2887 20.3979 16.669L12 26" stroke-width="1.2" stroke-linecap="round"/>'
               +'</svg>');
 
               $(this).parent().height(biggestHeight + 6);
            } else {
               $(this).width(cWidth - 56);
            }
 
            
         } 
 
         var biggestHeight = 0;
 
         contents.each(function (index, element) {
            var currentBoxHeight = $(this).outerHeight();
            biggestHeight = currentBoxHeight >= biggestHeight ? currentBoxHeight : biggestHeight;
         });
 
         contents.each(function (index, element) {
            $(this).height(biggestHeight);
        });
         
      });
   });
 
   // 페이지 로딩 숨김, 챗봇 화면 표시
   setTimeout(function() {
      $("#caas-chatbot").css("opacity", "1");
     $(".chatbot-skeleton").fadeOut(500);
  }, 500);
 }

// == 자사홈페이지 챗봇_GA코드 삽입 == //

$(document).ready(function() {

    window.dataLayer = window.dataLayer || [];

    if (chatui.getParameter("ga")) {
        window.dataLayer.push({
            "cid" : chatui.getParameter("ga")
        });
    }

  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5TQ6TN2');

});