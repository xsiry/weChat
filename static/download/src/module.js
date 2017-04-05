define(function(require, exports, module) {
	$.root_ = $('body');
	var mData, name, search_load, tabLoadEnd;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.off('click', '.search_btn').on('click', '.search_btn', function() {
				name = $('.search_name').val();
				if (name == '' || $('.search_btn').attr('disabled') == 'disabled') return;
				tabLoadEnd = false;
				$('.search_btn').attr('disabled', 'disabled');
				if (search_load != null) {
					$(".page_no").val(1);
					$('.search_games section').empty();
					search_load.unlock();
					search_load.noData(false);
					search_load.resetload();
					return;
				};
				load();
			})
			$.root_.off('click', '.download_game_btn').on('click', '.download_game_btn', function(actionobj) {
				var rowobj = $(this);
				var gameid = rowobj.data("gameid");
				if ($('a[data-gameid=' + gameid + ']').prop('disabled') == 'disabled') return;
				downloadGame(gameid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.off('click', '.top_detail_btn').on('click', '.top_detail_btn', function() {
				if ($('.top_detail_btn').text() == '<<展开列表>>') {
					$('.top_games').removeClass('top_detail_close');
					$('.top_games').addClass('top_detail_open');
					$('.top_detail_btn').text('<<收起列表>>');
				}else {
					$('.top_games').removeClass('top_detail_open');
					$('.top_games').addClass('top_detail_close');
					$('.top_detail_btn').text('<<展开列表>>');
				}

			})
		},
		_loadContent : function() {
			ajaxData();
		}
	}

	function ajaxData() {
		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : 'topGamesList.json',
			dataType : 'json',
			success : function(data) {
				if (data.success) {
					mData = data.list;
					$('div.name-title span').text(data.netbarName);
					loadTopGames();
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	function loadTopGames() {
		$('div.top_games').append('<div class="row row_col"><div class="col-xs-12 col-sm-12 col-md-12 text-center row_col_t">热门网游排行榜</div></div>');
		$.each(mData, function(index, obj) {
			var row = '<div class="row row_col top_p_right">'
					+ '<div class="col-xs-3 col-sm-3 col-md-3 text-center">'+ ((index <= 2) ? '<i><svg class="svg_icon" viewBox="0 -140 1024 1100"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#top_hot_svg"></use></svg></i>' : (index+1)) +'</div>'
					+ '<div class="col-xs-9 col-sm-9 col-md-9 text-right">'+ obj.gamename +'</div>'
					+ '</div>';

			$('div.top_games').append(row);
		})
	}

	function load() {
		search_load = $('.search_games').dropload({
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">已无数据</div>'
			},
			loadDownFn: function(me) {
				$.ajax({
					url: 'searchGames.json',
					dataType: 'json',
					contentType: 'application/json',
					data: {
						pageNo : $(".page_no").val(),
						name : name
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
						$('.search_games').show();
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
									+ '<div class="row row_col search_p_left x_act">'
									+ '<div class="col-xs-8 col-sm-8 col-md-8 text-left">'+ obj.gamename +'</div>'
									+ '<div class="col-xs-4 col-sm-4 col-md-4 text-center"><a class="download_game_btn" data-gameid=' + obj.gameid + '>'
									+ '<svg class="svg_icon" viewBox="0 0 1024 1024" style="margin-top:2px;width:25px;height:25px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download_game_svg"></use></svg></a></div>'
									+ '</div>';
							}
							$('.search_games_panel').append(result);
							$('.search_btn').removeAttr('disabled');
							me.resetload();
						}, 300);
						$(".page_no").val(parseInt($(".page_no").val()) + 1);

					},
					error: function() {
						loading = true;
						$(".page_no").val(parseInt($(".page_no").val()) - 1);
						$('.search_btn').removeAttr('disabled');
						console.log("查询数据出错啦，请刷新再试");
					}
				});
			}
		});
	}

	function downloadGame(gameid) {
		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : 'downloadGame.json',
			data : {
				gameid : gameid
			},
			dataType : 'json',
			success : function(data) {
				if (data) {
					$('a[data-gameid=' + gameid + ']').empty;
					$('a[data-gameid=' + gameid + ']').html('<svg class="svg_icon" viewBox="0 0 1024 1024" style="width:30px;height:30px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download_game_success_svg"></use></svg>');
					$('a[data-gameid=' + gameid + ']').prop('disabled', 'disabled');
				} else {
					$('a[data-gameid=' + gameid + ']').empty;
					$('a[data-gameid=' + gameid + ']').html('<svg class="svg_icon" viewBox="0 0 1024 1024" style="width:30px;height:30px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download_game_failure_svg"></use></svg>');
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}
})