define(function(require, exports, module) {
	$.root_ = $('body');
	var auditMessage = false, dropLoad;
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
				console.log(admin_msg);
				$('pre.flex').text((admin_msg == "null" ? '': admin_msg));
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

			})
		},
		_loadContent : function() {
			setStatus("GET");
			load();
		}
	}

	function load() {
		var tabLoadEnd = false;
		var tabLenght = 0;
		dropLoad = $('.msg_content').dropload({
			scrollArea: window,
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">已无数据，点此返回</div>'
			},
			loadDownFn: function(me) {
				$.ajax({
					url: 'getMsgs.json',
					dataType: 'json',
					contentType: 'application/json',
					data: {
						pageNo: $(".page_no").val()
					},
					dataType: 'json',
					cache: false,
					success: function(data) {
						var list = data.list;
						if (list == null) {
							$(".page_no").val(parseInt($(".page_no").val()) - 1);
						};
						if (list.length == 0) {
							tabLoadEnd = true;
						}
						setTimeout(function() {
							if (tabLoadEnd) {
								me.resetload();
								me.lock();
								me.noData();
								me.resetload();
								return;
							}
							var result = '';
							for (var i = 0; i < list.length; i++) {
								var obj = list[i];
								result
									+= ''
									+ '<div class="x_act content-block content-block-m content_block_msg_' + obj.msgid + '">'
									+ '<h3><span class="number_msg_' + obj.msgid + '">' + obj.machineNo + '</span> 号机玩家留言</h3><p>' + obj.content + '</p>'
									+ '<div class="ad-Reply ad_reply_' + obj.msgid + '" style="' + ((obj.adminReply == null || obj.adminReply == '') ? 'display:none;' : '') + '"><span class="ad_name">管理员回复：</span><span class="admin_msg_' + obj.msgid + '">' + obj.adminReply + '</span></div>'
									+ '<div class="content-bottom"><span>' + toLocaleString(obj.createTime) + '</span>'
									+ '<span class="pull-right" style="margin-left: 10px;"><a href="javascript:void(0);" class="del_msg_btn" data-msgid=' + obj.msgid + ' ><i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#del_svg"></use></svg></i></a></span>'
									+ '<span class="pull-right" style="margin-left: 10px;"><a href="javascript:void(0);" class="reply_btn" data-msgid=' + obj.msgid + ' ><i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#reply_svg"></use></svg></i></a></span>'
									+ '<span class="pull-right audit_btn" style="' + ((auditMessage == false) ? 'display: none;' : '') + '"><a href="javascript:void(0);" class="status_btn status_btn_' + obj.msgid + '" data-msgid=' + obj.msgid + ' ' + ((obj.isShow == 0) ? '' : 'disabled="disabled"') + '>' + ((obj.isShow == 0) ? '<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#audit_svg"></use></svg></i>' : '<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#approved_svg"></use></svg></i>') + '</a></span>'
									+ '</div></div>';
							}
							$('.msg_content_panel').append(result);
							tabLenght ++;
							me.resetload();
						}, 200);
						$(".page_no").val(parseInt($(".page_no").val()) + 1);
					},
					error: function() {
						loading = true;
						$(".page_no").val(parseInt($(".page_no").val()) - 1);
						console.log("查询数据出错啦，请刷新再试");
					}
				});
			}
		});
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
		adminReply = adminReply == '' ? null : adminReply;

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
					if (adminReply == '' || adminReply == null ) {
						$('.ad_reply_' + msgid).hide();
					} else {
						$('.ad_reply_' + msgid).show();
					}
					messageCount();
					$('.reply_content').hide();
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	function statusMsg(msgid) {
		if ($('.status_btn_' + msgid).attr('disabled') == "disabled") return;
		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : 'showStatus/' + msgid + '.do',
			dataType : 'json',
			success : function(data) {
				if (data) {
					$('.status_btn_' + msgid).html('<i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#approved_svg"></use></svg></i>');
					$('.status_btn_' + msgid).attr('disabled', 'disabled')
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
					auditMessage = true;
					$('.msg_checkout').prop("checked", "checked");
				}else if (data && type == "POST") {
					$('.audit_btn').show();
				}else if (data && type == "DELETE") {
					$('.audit_btn').hide();
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
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
})