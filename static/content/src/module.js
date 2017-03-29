define(function(require, exports, module) {
	$.root_ = $('body');
	var _interval;
	module.exports = {
		init : function() {
			this._bindUI();
			this._buildMenu();
			this._main();
		},
		_main : function() {
			relogin();
			var r = window.location.href;
			r = r.substring(r.indexOf("#") + 1, r.length);
			if (r == "index") {
				loadURL('../apps/index.html');
				$('div.menus').hide();
			} else {
				$('.' + r + '_bbtn').click();
			}
		},
		_bindUI : function() {
			$.root_.on('click', '.attendance_bbtn', function(e) {
				loadURL('../apps/attendance.html');
				$('div.menus').show();
				$('div a.bbtn').addClass('grayscale');
				$('div a.attendance_bbtn').removeClass('grayscale');

				$('div p').css('color', '#82858B');
				$('div a.attendance_bbtn p').css('color', '#4E90FF')
			})
			$.root_.on("click", '.message_bbtn', function(e) {
				loadURL('../apps/message.html');
				$('div.menus').show();
				$('div a.bbtn').addClass('grayscale');
				$('div a.message_bbtn').removeClass('grayscale');

				$('div p').css('color', '#82858B');
				$('div a.message_bbtn p').css('color', '#4E90FF')
			})
			$.root_.on("click", '.download_bbtn', function(e) {
				loadURL('../apps/download.html');
				$('div.menus').show();
				$('div a.bbtn').addClass('grayscale');
				$('div a.download_bbtn').removeClass('grayscale');

				$('div p').css('color', '#82858B');
				$('div a.download_bbtn p').css('color', '#4E90FF')
			})
			$.root_.on("click", '.notice_bbtn', function(e) {
				loadURL('../apps/notice.html');
				$('div.menus').show();
				$('div a.bbtn').addClass('grayscale');
				$('div a.notice_bbtn').removeClass('grayscale');

				$('div p').css('color', '#82858B');
				$('div a.notice_bbtn p').css('color', '#4E90FF')
			})
			$.root_.on("click", '.msg_setting', function(e) {
				loadURL('../apps/message-switch.html');
				$('div.menus').show();
			})
			$.root_.on("click", '.afresh_login', function(e) {
				loginOut();
			})
			$.root_.on("click", '.loginout', function(e) {
				loginOut();
			})
			$.root_.on("click", '.close_ping_msg', function(e) {
				$('.noping_msg').hide();
			})
		},
		_buildMenu : function() {
			buildMenu();
		}
	};

	function buildMenu() {
		var menus = [ {
			classT : 'bbtn attendance_bbtn grayscale',
			img_src : '../static/images/u2414.png',
			text : '上座率'
		},
			{
				classT : 'bbtn message_bbtn grayscale',
				img_src : '../static/images/u2464.png',
				text : '留言板'
			},
			{
				classT : 'bbtn download_bbtn grayscale',
				img_src : '../static/images/u2524.png',
				text : '下游戏'
			},
			{
				classT : 'bbtn notice_bbtn grayscale',
				img_src : '../static/images/u2591.png',
				text : '看通知'
			}
		]

		var html = '';
		for (var i in menus) {
			var m = menus[i];
			html += '<div><a href="javascript:void(0);" class="' + m.classT + '" >';
			html += '<img src="' + m.img_src + '" /><p>' + m.text + '</p></a></div>';
		}

		$('div.menus').append(html);
	}

	function loadURL(a) {
		var b = $('div.content');
		$.ajax({
			"type" : "GET",
			"url" : a,
			"dataType" : "html",
			"cache" : !0,
			"beforeSend" : function() {
				b.removeData().html(""),
				b.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> 加载中...</h1>'),
				b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
				drawBreadCrumb(),
				$("html").animate({
					"scrollTop" : 0
				}, "fast"))
			},
			"success" : function(a) {
				b.css({
					"opacity" : "0.0"
				}).html(a).delay(50).animate({
					"opacity" : "1.0"
				}, 300),
				a = null,
				b = null
			},
			"error" : function(c, d, e) {
				b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
			},
			"async" : !0
		})
	}

	function loginOut() {
		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : '/weChat/loginOut.do',
			dataType : 'json',
			success : function(data) {
				if (data) {
					location.href = "/weChat/login.html";
				}
			},
			error : function(e) {}
		});
	}

	function relogin() {
		$(document).ajaxComplete(function(event, xhr, settings) {
			if (xhr.getResponseHeader("sessionstatus") == 'timeout') {
				$('.noping_msg').show();
			}
		})
	}
})