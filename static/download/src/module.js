define(function(require, exports, module) {
	$.root_ = $('body');
	var mData, list, loading, endLoad, list_count;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.on('click', '.search_btn', function() {
				endLoad = true;
				list_count = 0;
				query(true);
			})
			$.root_.on('click', '.download_game_btn', function(actionobj) {
				var rowobj = $(this);
				var gameid = rowobj.data("gameid");
				downloadGame(gameid);
				actionobj.preventDefault();
				rowobj = null;
			})
		},
		_loadContent : function() {
			zeptoInitBind();
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
		$.each(mData, function(index, obj) {
			var row = "<tr><td class='text-center'>" + (index + 1);
			row += "</td><td class='text-right'>" + obj.gamename;
			row += "</td></tr>";

			$('div.top_games table:first tbody tr:last').after(row);
		})
	}

	/* 初始化zepoto插件，监听滚动事件 */
	function zeptoInitBind() {
		loading = false;
		Zepto(function($) {
			$('.search_games_content').scroll(function() {
				if (($('.search_games_content').scrollTop() + $('.search_games_content').height() > $('.search_games').height() - 10) && loading) {
					loading = false;
					$(".page_no").val(parseInt($(".page_no").val()) + 1);
					query(false);
				}
			});
		})
	}

	/* 滚动满足条件，通过ajax 分页查询请求数据 */
	function query(type) {
		var name = $('.search_name').val();
		if (name == '') {
			$('div.search_games_content').hide();
			$('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>");
			return false;
		}
		$.ajax({
			url : 'searchGames.json',
			dataType : 'json',
			contentType : 'application/json',
			data : {
				pageNo : $(".page_no").val(),
				name : name
			},
			dataType : 'json',
			cache : false,
			success : function(data) {
				list = data.list;
				$('table caption span').text(0);
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
			list_count += list.length;
			for (var i = 0; i < list.length; i++) {
				var obj = list[i];
				content = content
					+ "<tr><td class='text-left'>" + obj.gamename
					+ "</td><td class='text-center'><button class='btn btn-info btn-xs download_game_btn' data-gameid=" + obj.gameid + ">下载</button>"
					+ "</td></tr>";
			}
			if (type) {
				$('div.search_games_content').show();
				$('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>")
				$('div.search_games table:first tbody tr:last').after(content);
			} else {
				if (list.length == 0) {
					if  (endLoad == true) {
						var endText = "<tr><td class='text-center' colspan='2'> 已到末尾，共"+ list_count +"个游戏 </td></tr>";
						$('div.search_games table:first tbody tr:last').after(endText);
						endLoad = false;
					}
					$(".page_no").val(parseInt($(".page_no").val()) - 1);
					return "";
				}
				$('div.search_games table:first tbody tr:last').after(content);
			}
		}
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