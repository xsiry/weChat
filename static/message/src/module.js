define(function(require, exports, module) {
	$.root_ = $('body');
	var list, loading,
		auditMessage;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.on('click', '.reply_btn', function(actionobj) {
				var rowobj = $(this);
				var msgid = rowobj.data("msgid");
				$('.reply_content').show();
				var title = $('.number_msg_' + msgid).text();
				var admin_msg = $('.admin_msg_' + msgid).text();
				$('.reply_number_msg').text(title);
				$('span.msgid_msg').text(msgid);
				$('pre.flex').text(admin_msg);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.on('click', '.del_msg_btn', function(actionobj) {
				var rowobj = $(this);
				var msgid = rowobj.data("msgid");
				delMsg(msgid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.on('click', '.reply_commit_btn', function() {
				commitMsg();
			})
			$.root_.on("click", '.msg_setting_btn', function(e) {
				console.log("safasfasfsafsa");
			})
			$.root_.on('click', '.reply_cancel_btn', function() {
				$('.reply_content').hide();
			})
			$.root_.on('click', '.status_btn', function(actionobj) {
				var rowobj = $(this);
				var msgid = rowobj.data("msgid");
				statusMsg(msgid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.on('click', '.right_btn', function() {
				$('div.tools_div').css('transform','translate(159px,0px)');
				$('div.arrow-right').hide();
				$('div.arrow-left').show();
			})
			$.root_.on('click', '.left_btn', function() {
				$('div.tools_div').css('transform','translate(0px,0px)');
				$('div.arrow-left').hide();
				$('div.arrow-right').show();
			})
			$.root_.on('click', '#switchP', function() {
				if ($('#switchP').prop("checked")) {
					setStatus('POST');
				} else {
					setStatus('DELETE');
				}
				query(true);
			})
		},
		_loadContent : function() {
			zeptoInitBind();
			query(true);
			setStatus('GET');
		}
	}
	
	/* 初始化zepoto插件，监听滚动事件 */
	function zeptoInitBind() {
		loading = false;
		Zepto(function($) {
			$(window).scroll(function() {
				if (($(window).scrollTop() + $(window).height() > $(document).height() - 10) && loading) {
					loading = false;
					$(".page_no").val(parseInt($(".page_no").val()) + 1);
					query(false);
				}
			});
		})
	}

	/* 滚动满足条件，通过ajax 分页查询请求数据 */ 
	function query(type) {
		$.ajax({
			url : 'getMsgs.json',
			dataType : 'json',
			contentType : 'application/json',
			data : {
				pageNo : $(".page_no").val()
			},
			dataType : 'json',
			cache : false,
			success : function(data) {
				list = data.list;
				$('div.name-title span').text(data.netbarName);
				loadProcessing(type);
			},
			error : function() {
				loading = true;
				$(".page_no").val(parseInt($(".page_no").val()) - 1);
				console.log("查询数据出错啦，请刷新再试");
			}
		});
	}

	/* 对ajax的数据进行处理，并显示到对应标签中 */
	function loadProcessing(type) {
		loading = true;
		if (list == null) {
			$(".page_no").val(parseInt($(".page_no").val()) - 1);
		} else {
			var content = "";
			for (var i = 0; i < list.length; i++) {
				var obj = list[i];
				content = content
					+ '<div class="content-block content-block-m content_block_msg_' + obj.msgid + '">'
					+ '<h3><span class="number_msg_' + obj.msgid + '">' + obj.machineNo + '</span> 号机玩家留言</h3><p>' + obj.content + '</p>'
					+ '<div class="ad-Reply ad_reply_' + obj.msgid + '" style="' + ((obj.adminReply == null || obj.adminReply == '') ? 'display:none;' : '') + '"><span class="ad_name">管理员回复：</span><span class="admin_msg_' + obj.msgid + '">' + obj.adminReply + '</span></div>'
					+ '<div class="content-bottom"><span>' + toLocaleString(obj.createTime) + '</span>'
					+ '<span class="pull-right"><button class="btn btn-danger btn-xs del_msg_btn" data-msgid=' + obj.msgid + ' >删除</button></span>'
					+ '<span class="pull-right"><button class="btn btn-info btn-xs reply_btn" data-msgid=' + obj.msgid + ' >回复</button></span>'
					+ ((auditMessage == false) ? '' : '<span class="pull-right"><button class="btn btn-info btn-xs status_btn status_btn_' + obj.msgid + '" data-msgid=' + obj.msgid + ' ' + ((obj.isShow == 0) ? '' : 'disabled') + '>' + ((obj.isShow == 0) ? '审核' : '已审核') + '</button></span>')
					+ '</div></div>';
			}
			if (type) {
				$("div.msg_content").html(content);
			} else {
				if (list.length == 0) {
					$(".page_no").val(parseInt($(".page_no").val()) - 1);
					return "";
				}
				$("div.msg_content").append(content);
			}
		}
	}

	/* 时间处理函数 参数 毫秒 */
	function toLocaleString(ms) {
		var dateTime = new Date(ms)
		function p(s) {
			return s < 10 ? '0' + s : s;
		}
		//获取当前年
		var year = dateTime.getFullYear();
		//获取当前月
		var month = dateTime.getMonth() + 1;
		//获取当前日
		var date = dateTime.getDate();

		var h = dateTime.getHours(); //获取当前小时数(0-23)
		var m = dateTime.getMinutes(); //获取当前分钟数(0-59)
		var s = dateTime.getSeconds();

		var now = [ year, p(month), p(date) ].join('-') + " " + [ p(h), p(m), p(s) ].join(':');
		return now;
	}

	function delMsg(msgid) {
		$.ajax({
			type : 'DELETE',
			contentType : 'application/json',
			url : 'delMsg/' + msgid + '.do',
			dataType : 'json',
			success : function(data) {
				if (data) {
					$('.content_block_msg_' + msgid).remove()
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	function commitMsg() {
		var msgid = $('span.msgid_msg').text();
		var adminReply = $('pre.flex').text();
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'adminReply.json',
			dataType : 'json',
			data : JSON.stringify({
				msgid : msgid,
				adminReply : adminReply
			}),
			success : function(data) {
				if (data) {
					$('.admin_msg_' + msgid).text(adminReply);
					if (adminReply == '' ) {
						$('.ad_reply_' + msgid).hide();
					} else {
						$('.ad_reply_' + msgid).show();
					}
					$('.reply_content').hide();
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	function statusMsg(msgid) {
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'showStatus/' + msgid + '.do',
			dataType : 'json',
			success : function(data) {
				if (data) {
					$('.status_btn_' + msgid).text('已审核');
					$('.status_btn_' + msgid).prop('disabled', 'disabled')
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}
	
	function setStatus(type) {
		$.ajax({
			type : type,
			contentType : 'application/json',
			url : 'syssetMsg.do',
			dataType : 'json',
			success : function(data) {
				if (data && type == "GET") {
					$('.msg_checkout').prop("checked", "checked");
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}
})