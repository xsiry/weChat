define(function(require, exports, module) {
	$.root_ = $('body');
	var mData, search_load;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.on('click', '.search_btn', function() {
				if (search_load != null) search_load.resetload();
				load();
			})
			$.root_.on('click', '.download_game_btn', function(actionobj) {
				var rowobj = $(this);
				var gameid = rowobj.data("gameid");
				downloadGame(gameid);
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.on('click', '.top_detail_btn', function() {
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
		$('div.top_games').append('<div class="row row_col"><div class="col-xs-12 col-sm-12 col-md-12 text-center">热门网游排行榜</div></div>');
		$.each(mData, function(index, obj) {
			var row = '<div class="row row_col top_p_right">'
			+ '<div class="col-xs-3 col-sm-3 col-md-3 text-center">'+ ((index <= 2) ? '<i><svg class="svg_icon" viewBox="0 -140 1024 1100"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#top_hot_svg"></use></svg></i>' : (index+1)) +'</div>'
					+ '<div class="col-xs-9 col-sm-9 col-md-9 text-right">'+ obj.gamename +'</div>'
					+ '</div>';

			$('div.top_games').append(row);
		})
	}

	function load() {
		$('search_games').removeData().html('section class="search_games_panel" style="display:block"></section>');
		var name = $('.search_name').val();
		var tabLoadEnd = false;
		var tabLenght = 0;
		search_load = $('.search_games').dropload({
			// scrollArea: $('.search_games_content'),
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">已无数据，点此返回</div>'
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
									+ '<div class="row row_col search_p_left">'
									+ '<div class="col-xs-8 col-sm-8 col-md-8 text-left">'+ obj.gamename +'</div>'
									+ '<div class="col-xs-4 col-sm-4 col-md-4 text-center"><button class="btn btn-info btn-xs download_game_btn" data-gameid=' + obj.gameid + '>下载</button></div>'
									+ '</div>';
							}
							$('.search_games_panel').append(result);
							tabLenght ++;
							me.resetload();
						}, 300);
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
					$('button[data-gameid=' + gameid + ']').text('下载成功');
					$('button[data-gameid=' + gameid + ']').removeClass('btn-info');
					$('button[data-gameid=' + gameid + ']').addClass('btn-success');
					$('button[data-gameid=' + gameid + ']').prop('disabled', 'disabled');
				} else {
					$('button[data-gameid=' + gameid + ']').text("下载失败");
					$('button[data-gameid=' + gameid + ']').removeClass('btn-info');
					$('button[data-gameid=' + gameid + ']').addClass('btn-danger');
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}
})