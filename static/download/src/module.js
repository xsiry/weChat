define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;
  module.exports = {
    init: function() {
      this._bindUI();
      this._loadContent();
    },
    _bindUI: function() {
      $.root_.on('click', '.search_btn', function() {
        searchGames();
      })
      $.root_.on('click', '.download_game_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var gameid = rowobj.data("gameid");
    	  downloadGame(gameid);
          actionobj.preventDefault();
          rowobj = null;
      })
    },
    _loadContent: function() {
      ajaxData();
    }
  }

  function ajaxData() {
	  $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'topGamesList.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) { 
	        	mData = data.list;
	        	$('div.name-title span').text(data.netbarName);
	        	loadTopGames();
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }

  function loadTopGames() {
    $.each(mData, function(index, obj) {
      var row = "<tr><td class='text-center'>" + (index+1);
      row += "</td><td class='text-right'>" + obj.gamename;
      row += "</td></tr>";

      $('div.top_games table:first tbody tr:last').after(row);
    })
  }

  function searchGames() {
	var name = $('.search_name').val();
	if (name != '') {
		$('div.search_games_content').show();
	    $('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>")
	    $.ajax({
		      type: 'GET',
		      contentType: 'application/json',
		      url: 'searchGames.json',
		      dataType: 'json',
		      data: {
		    	  name: name
		      },
		      success: function(data) {
		        if (data.success) { 
		        	var games = data.list
		        	var row = '';
		            $.each(games, function(index, obj) {
		              row += "<tr><td class='text-left'>" + obj.gamename;
		              row += "</td><td class='text-center'><a class='download_game_btn' data-gameid="+ obj.gameid +">下载</a>";
		              row += "</td></tr>";
		            })
		            $('table caption span').text(games.length);
		            $('div.search_games table:first tbody tr:last').after(row);
		        }
		      },
		      error: function(e) {
		        console.log(e);
		      }
		    });
	}else{
		$('div.search_games_content').hide();
	    $('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>")
	}
  }
  
  function downloadGame(gameid) {
	  $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'downloadGame.json',
	      data: {
	    	gameid: gameid
	      },
	      dataType: 'json',
	      success: function(data) {
	        if (data) { 
	        	$('a[data-gameid='+ gameid +']').text('下载成功');
	        	$('a[data-gameid='+ gameid +']').css('color', '#66e46b');
	        }else {
	        	$('a[data-gameid='+ gameid +']').text("下载失败");
	        	$('a[data-gameid='+ gameid +']').css('color', '#e85a4f');
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }
})
