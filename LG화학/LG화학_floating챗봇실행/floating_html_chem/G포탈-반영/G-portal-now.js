
function showChat(){

	var chatbotFloating = $jq('#chatbot-floating');
	var popBox = $jq('#popBox');
	var chatPannelBack  = $jq('#popBoxBack');
	var textWidth = $jq('#text-width').outerWidth();
	var pMessage = $jq('#chatbot-text');
	var chatbotIcon = $jq('#chatbot-icon');
	var notifications = $jq('#notification');
	pMessage.css('width', textWidth + 'px');
	var chatPannelWidth,chatPannelHeight;
	var isLoad = false;
	var isNoti = false

	chatbotFloating.add("#chatMsg").click(function(e){
		
		if(!isClick) return;
		e.preventDefault();
		
		 if (popBox.hasClass("show")) {
			 chatbotFloating.removeClass('hide');
			 popBox.removeClass('show');
			 
	      } else {
			chatbotFloating.addClass('hide');
			notifications.hide();
			popBox.addClass('show');
			popBox.removeClass('hide');
			
			if(chatPannelWidth != 0) {
				popBox.css("width", chatPannelWidth);
				popBox.css("height", chatPannelHeight);
	        }
			
			$jq("#popBox").css("height", $jq(window).height() - 90);
			
			if(!isLoad){
				$jq('#float-chatbot-chat-iframe').attr('src', "< c:url value='/portal/main/chatbotPopup.do' />?isNew=1");
				
				isLoad = true;
				
				
				/*
				 var windowHeight = $jq(window).height()-90;          // 최대 높이 사이즈 = window 높이 - 챗봇창의 bottom
			     var windowWidth = $jq(window).width()-45;            // window 너비 - 챗봇창의 right
			  
			     var min_With = 355;                            // 최소 너비 사이즈 = 355X710 
			     popBox.resizable({
			        //함께 커질영역 
			        //alsoResize:".chatbot-pop-box.show",    // 함께 커지는 영역에 대한 사이즈를 구하지 못해서 에러나서 주석처리함. 
			        //커질때 애니메이션 발생 
			        animate :  true,
			        animateDuration: 300,
			        animateEasing:"swing",
			        //비율유지
			        aspectRatio: true,
			        //마우스 hover 아닐때 핸들러 숨기기
			        //autoHide: true,                      // 사이즈 조절 커서가 잘 보이지 않는 현상이 있어서 막음. 
			        handles: "w, n, nw",                  // 위, 왼쪽 사이즈를 늘리면 창이 안 보이는 현상이 있음. 
			        //handles: "nw",                         // nw, n, w
			        maxHeight: windowHeight, 
			        //minHeight:700,
			        //maxWidth:  windowWidth, 
			        minWidth:min_With                          // 최소,최대 크기지정
			        , start: function( event, ui ) {
			            chatPannelBack.addClass('show');
			            chatPannelBack.removeClass('hide');
			            $jq('.ui-resizable-nw').css('z-index', '19000');
			            $jq('.ui-resizable-helper').css('z-index', '19100');
			         }
			         , stop: function( event, ui ) {
			            chatPannelBack.removeClass('show');
			            chatPannelBack.addClass('hide');
			         }
			     });
			     
			     */
			     
			}
	      }
		
	});

	$jq('#chatMsgCloser').click(function(){
		$jq(this).parent().hide();
	});

	/**
     * 챗봇 창 닫을때 리사이징한 너비와 높이 보관하는 함수. 
    */
	hideChat = function(){
		iKEP.overViewIFrameRemove();
		popBox.removeClass('show');
		popBox.addClass('hide');

		chatbotFloating.removeClass('hide');
		chatPannelWidth = popBox.width();
		chatPannelHeight = popBox.height();

		getCntChat();
		   
	}

	getCntChat = function(){
		if(!chatbotFloating.is(".hide")){
			$jq.ajax({
				url : '< c:url value="/portal/admin/app/app/getCntChat.do" />',
				type : "get",
				success : function(result) {
					if(result > 0){
						$jq("#notification").show();
						$jq("#chatMsg").show().text(iKEPLang.mainPortlet.chatMsgCnt.replace('%w',result));
						$jq("#badgeTxt").show().text(result);
					} else {
						$jq("#notification").hide();
						$jq("#badgeTxt").hide();
					}
				}
			});
		}
	}

	getCntChat();
	setInterval(function(){ getCntChat(); },60*10*1000);	//10분마다

	setTimeout(function(){
		pMessage.addClass('show');

		setTimeout(function(){
			pMessage.removeClass('show');
		}, 5000);
	}, 700);

	setTimeout(function(){
		chatbotFloating.addClass('full-width');
		chatbotIcon.css('width',textWidth + 110 + 'px');

		setTimeout(function(){
			chatbotFloating.removeClass('full-width');
			chatbotIcon.css('width','80px');
		}, 5500);
	}, 2000);

	window.addEventListener("message", function(e) {
		if(e.data === 'bot_close') {
			hideChat();
		}

		if(e.data.event_id === 'messengser_open') {
			var userId = e.data.id.userId;
			var targetId = e.data.id.targetId;
			var uCapUri = 'LGUCAPL://' + 'GUC005;CHAT;' + userId + ';' + targetId + '@GUC005';
			window.protocolCheck(uCapUri, function() {
				//window.open("http://www.lgucap.com", "width=1100,height=800, resizable=1,scrollbars=1");
			});
		}
		
		// 케미 업무봇 '팝업창 전환' 버튼 클릭시. 
	   if(e.data === 'bot_Winopen') {

	      openChatWindow();
	      hideChat();

	   }
		
	   // 케미 업무봇,  GPT모드, 학습봇 에서 '기본사이즈 복귀' 버튼 클릭시. 
	   if(e.data === 'bot_Recover' || e.data === 'gpt_Recover' || e.data === 'edu_Recover') {

		  /*
	      $jq("#popBox").css("width", "400");
	      $jq("#popBox").css("height", "810");
	      $jq("#popBox").css("top", "");
	      $jq("#popBox").css("left", "");
	      */
	   }
	   
	   
	   // GPT모드 '팝업창 전환' 버튼 클릭시. 
	   if(e.data === 'gpt_Winopen') {

	      openChatWindow('GPT');

	      hideChat();

	   }

	   // 학습봇 '팝업창 전환' 버튼 클릭시. 
	   if(e.data === 'edu_Winopen') {

	      openChatWindow('EDU');

	      hideChat();

	   }
		
	},false);
	
}