define(function(require, exports, module) {
	$.root_ = $('body');
	module.exports = {
		init: function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI: function() {
			$.root_.off('click', '.msg_details_btn').on('click', '.msg_details_btn', function(actionobj) {
				var rowobj = $(this);
				var infoid = rowobj.data("infoid");
				notice_detail(infoid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.off('click', '.go_back_btn').on('click', '.go_back_btn', function(actionobj) {
				var rowobj = $(this);
				var infoid = rowobj.data("infoid");
				$('.detail_panel').hide();
				$('.content-block_' + infoid).addClass('c-b');
				$('.msg_details_btn_' + infoid).addClass('c-b');
				$('.idcontent_' + infoid).addClass('c-b');
				$('body,html').animate({ scrollTop: 0 }, 0);
				$('.notice_content').show();
				actionobj.preventDefault();
				rowobj = null;
			})
            $.root_.off('click', '.right_btn').on('click', '.right_btn', function() {
                $('div.tools_div').css('transform','translate(115px,0px)');
                $('div.arrow-right').hide();
                $('div.arrow-left').show();
            })
            $.root_.off('click', '.left_btn').on('click', '.left_btn', function() {
                $('div.tools_div').css('transform','translate(0px,0px)');
                $('div.arrow-left').hide();
                $('div.arrow-right').show();
            })
            $.root_.off('click', '.read_all').on('click', '.read_all', function() {
                readAllNotices();
            })
		},
		_loadContent: function() {
			load();
		}
	}

	function load() {
		var tabLoadEnd = false;
		var tabLenght = 0;
		$('.notice_content').dropload({
			scrollArea: window,
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">已无数据</div>'
			},
			loadDownFn: function(me) {
				$.ajax({
					url: 'infoDelivery.json',
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
									+ '<div class="x_act content-block content-block-m content-block_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">'
									+ '<h3 class="notice_title' + obj.infoid + '">' + obj.idtitle + '</h3>'
									+ '<p class="idcontent_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">' + obj.idcontent.replace(/<[^>]+>/g,"").substring(0, 50) + ((obj.idcontent.replace(/<[^>]+>/g,"").length >= 50) ? '……' : '') + '</p>'
									+ '<div class="notice_content' + obj.infoid + '" style="display:none;">' + obj.idcontent + '</div>'
									+ '<div class="content-bottom"><span class="notice_time' + obj.infoid + '">' + toLocaleString(obj.createtime) + '</span>'
									+ '<span class="pull-right"><a herf="javascript(0);" class="msg_details_btn msg_details_btn_' + obj.infoid + '" data-infoid= ' + obj.infoid + ' ><i class="icon_lg">' + (obj.wxread == 0 ? '<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detail_svg"></use></svg>' : '<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detailed_svg"></use></svg>') + '</i></a></span>'
									+ '</div></div>';
							}
							$('.notice_content_panel').append(result);
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
		var utc = 8*60*60*1000;
		var dateTime = new Date(ms-utc);

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

		var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
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
		div_text += '</span><span class="pull-right"><a href="javascript:void(0);" class="go_back_btn" ';
		div_text += 'data-infoid= ' + infoid + ' ><i class="icon_lg"><svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#go_back_svg"></use></svg><span class="svg_icon_text">返回</span></i></a></span></div></div>'
		$('.notice_detail').html(div_text);
		$('body,html').animate({ scrollTop: 0 }, 0);
		$('.detail_panel').show();

		$.ajax({
			type: 'GET',
			contentType: 'application/json',
			url: 'infoDeliveryRead.json',
			dataType: 'json',
			data: {
				infoid: infoid
			},
			success: function(data) {
				$('.msg_details_btn_'+ infoid).html('<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detailed_svg"></use></svg>');
				noticeCount();
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

	function readAllNotices() {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: 'readAllNotices.json',
            dataType: 'json',
            success: function(data) {
                if (data) {
                    $('.notice_bbtn').click();
                    noticeCount();
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }
})
