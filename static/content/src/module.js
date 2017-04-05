define(function(require, exports, module) {
	$.root_ = $('body');
	var _activate;
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
			$.root_.off('click', '.attendance_bbtn').on('click', '.attendance_bbtn', function(e) {
				var name = 'attendance';
				initBtn(name);
				$('.icon_' + name + '_svg').empty().append('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '_svg"></use></svg></i>');
			})
			$.root_.off('click', '.message_bbtn').on("click", '.message_bbtn', function(e) {
				var name = 'message';
				initBtn(name);
				$('.icon_' + name + '_svg').empty().append('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '_svg"></use></svg></i>');
			})
			$.root_.off('click', '.download_bbtn').on("click", '.download_bbtn', function(e) {
				var name = 'download';
				initBtn(name);
				$('.icon_' + name + '_svg').empty().append('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '_svg"></use></svg></i>');
			})
			$.root_.off('click', '.notice_bbtn').on("click", '.notice_bbtn', function(e) {
				var name = 'notice';
				initBtn(name);
				$('.icon_' + name + '_svg').empty().append('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#' + name + '_svg"></use></svg></i>');
			})
			$.root_.off('click', '.afresh_login').on("click", '.afresh_login', function(e) {
				loginOut();
			})
			$.root_.off('click', '.loginout').on("click", '.loginout', function(e) {
				loginOut();
			})
			$.root_.off('click', '.close_ping_msg').on("click", '.close_ping_msg', function(e) {
				$('.noping_msg').hide();
			})
		},
		_buildMenu : function() {
			buildMenu();
		}
	};

	function buildMenu() {
		var menus = [ {
				classT : 'bbtn attendance_bbtn',
				svg_src : '_attendance_svg',
				text : '上座率',
				iconCount: ''
			},
			{
				classT : 'bbtn message_bbtn',
				svg_src : '_message_svg',
				text : '留言板',
				iconCount: '<div class="message_count clue"></div>'
			},
			{
				classT : 'bbtn download_bbtn',
				svg_src : '_download_svg',
				text : '下游戏',
				iconCount: ''
			},
			{
				classT : 'bbtn notice_bbtn',
				svg_src : '_notice_svg',
				text : '看通知',
				iconCount: '<div class="notice_count clue"></div>'
			}
		]

		var html = '';
		for (var i in menus) {
			var m = menus[i];
			html += '<div><a href="javascript:void(0);" class="' + m.classT + '" ><div class=" icon'+ m.svg_src +'">';
			html += '<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'+ m.svg_src +'"></use></svg></i>';
			html += '</div><p>' + m.text + '</p></a>' + m.iconCount + '</div>';


		}

		$('div.menus').append(html);
		messageCount();
		noticeCount();
	}

	function initBtn(name) {
		$('.icon_'+ _activate +'_svg').empty().append('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#_' + _activate + '_svg"></use></svg></i>');
		loadURL('../apps/'+ name +'.html');
		$('div.menus').show();
		$('div p').css('color', '#82858B');
		$('div a.' + name + '_bbtn p').css('color', '#3eca00');
		_activate = name;
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
				b.html('<div class="dropload-load"><span class="loading"></span>加载中...</div>'),
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

	function messageCount() {
		var count = 0;
		$.ajax({
				type: 'GET',
				contentType: 'application/json',
				url: 'showStatusTotal.json',
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						count = data.total;
					}
					if (count > 0) {
						$('.message_count').show();
						$('.message_count').addClass('bg-0');
						$('.message_count').text(count);
					}else{
						$('.message_count').hide();
					}
				},
				error: function(e) {
					console.log(e);
				}
			});
	}

	function noticeCount() {
		var count = 0;
		$.ajax({
				type: 'GET',
				contentType: 'application/json',
				url: 'getNoReadTotal.json',
				dataType: 'json',
				success: function(data) {
					if (data.success) {
						count = data.total;
					}
					if (count > 0) {
						$('.notice_count').show();
						$('.notice_count').addClass('bg-f');
						$('.notice_count').text(count);
					}else {
						$('.notice_count').hide();
					}
				},
				error: function(e) {
					console.log(e);
				}
			});
	}
})