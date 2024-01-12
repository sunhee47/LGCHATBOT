
var isChk = false;
function showChat(){

	var chatbotFloating = $jq('#chatbot-floating');
	var popBox = $jq('#popBox');
	var textWidth = $jq('#text-width').outerWidth();
	var pMessage = $jq('#chatbot-text');
	var chatbotIcon = $jq('#chatbot-icon');
	var notifications = $jq('.notification');
	pMessage.css('width', textWidth + 'px');

	chatbotFloating.add("#chatMsg").click(function(){
		chatbotFloating.addClass('hide');
		notifications.hide();

		popBox.addClass('show');
		$jq('#chatbotFrame1').attr('src', "< c:url value='/portal/main/chatbotPopup.do' />?isNew=1");
	});

	var notiCloser = $jq('#chatMsgCloser').click(function(){
		$jq(this).parent().hide();
	});

	hideChat = function(){
		iKEP.overViewIFrameRemove();
		popBox.removeClass('show');

		chatbotFloating.removeClass('hide');
		getCntChat();
	}

	getCntChat = function(){
		if(!chatbotFloating.is(".hide")){
			$jq.ajax({
				url : '< c:url value="/portal/admin/app/app/getCntChat.do" />',
				type : "get",
				success : function(result) {
					if(result > 0){
						$jq(".notification").show();
						$jq("#chatMsg").show().text(iKEPLang.mainPortlet.chatMsgCnt.replace('%w',result));
						$jq("#badgeTxt").show().text(result);
					} else {
						$jq(".notification").hide();
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
	},false);

}