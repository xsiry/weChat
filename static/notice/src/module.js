define(function(require, exports, module) {
	$.root_ = $('body');
	var list,
		loading;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.on('click', '.msg_details_btn', function(actionobj) {
				var rowobj = $(this);
				var infoid = rowobj.data("infoid");
				notice_detail(infoid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.on('click', '.go_back_btn', function(actionobj) {
				var rowobj = $(this);
				var infoid = rowobj.data("infoid");
				$('.notice_detail').hide();
				$('.content-block_' + infoid).addClass('c-b');
				$('.msg_details_btn_' + infoid).addClass('c-b');
				$('.idcontent_' + infoid).addClass('c-b');
				$('.notice_content').show();
				actionobj.preventDefault();
				rowobj = null;
			})
		},
		_loadContent : function() {
			zeptoInitBind();
			query(true);
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
			url : 'infoDelivery.json',
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
				loadNotice(type);
			},
			error : function() {
				loading = true;
				$(".page_no").val(parseInt($(".page_no").val()) - 1);
				console.log("查询数据出错啦，请刷新再试");
			}
		});
	}

	/* 对ajax的数据进行处理，并显示到对应标签中 */
	function loadNotice(type) {
		loading = true;

		if (list == null) {
			$(".page_no").val(parseInt($(".page_no").val()) - 1);
		} else {
			var content = "";
			for (var i = 0; i < list.length; i++) {
				var obj = list[i];
				content = content
					+ '<div class="content-block content-block-m content-block_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">'
					+ '<h3 class="notice_title' + obj.infoid + '">' + obj.idtitle + '</h3><p class="idcontent_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">' + obj.idcontent.substring(0, 2220) + ((obj.idcontent.length >= 20) ? '……' : '') + '</p><div class="notice_content' + obj.infoid + '" style="display:none;">' + obj.idcontent + '</div>'
					+ '<div class="content-bottom"><span class="notice_time' + obj.infoid + '">' + toLocaleString(obj.idfixedtime) + '</span>'
					+ '<span class="pull-right"><a class="btn btn-info btn-xs msg_details_btn msg_details_btn_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '" data-infoid= ' + obj.infoid + ' >详细</a></span>'
					+ '</div></div>';
			}
			if (type) {
				$("div.notice_content").html(content);
			} else {
				if (list.length == 0) {
					$(".page_no").val(parseInt($(".page_no").val()) - 1);
					return "";
				}
				$("div.notice_content").append(content);
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

	function notice_detail(infoid) {
		$('.notice_detail').removeData();
		var title = $('.notice_title' + infoid).text();
		var content = $('.notice_content' + infoid).text();
		var time = $('.notice_time' + infoid).text();
		$('.notice_content').hide();
		var div_text = '<div class="content-block content-block-m"><h3>' + title + '</h3><p>' + content;
		div_text += '</p><div class="content-bottom"><span>' + time;
		div_text += '</span><span class="pull-right"><a class="btn btn-info btn-xs go_back_btn" ';
		div_text += 'data-infoid= ' + infoid + ' >返回</a></span></div></div>'
		$('.notice_detail').html(div_text);
		$('.notice_detail').show();

		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : 'infoDeliveryRead.json',
			dataType : 'json',
			data : {
				infoid : infoid
			},
			success : function(data) {},
			error : function(e) {
				console.log(e);
			}
		});
	}
})