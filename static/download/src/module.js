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
	        if (data.sucess) { 
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
		$('div.search_games').show();
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
		        if (data.sucess) { 
		        	var games = data.list
		            $.each(games, function(index, obj) {
		              if (index <6) {
		              var row = "<tr><td class='text-left'>" + obj.gamename;
		              row += "</td><td class='text-center' data-gameid="+ obj.gameid +"><a>下载</a>";
		              row += "</td></tr>";

		              $('div.search_games table:first tbody tr:last').after(row);
		              }
		            })
		        }
		      },
		      error: function(e) {
		        console.log(e);
		      }
		    });
	}else{
		$('div.search_games').hide();
	    $('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>")
	}
  }
})
