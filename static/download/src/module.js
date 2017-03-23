define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;
  module.exports = {
    init: function() {
      this._loadConfig();
      this._bindUI();
      this._loadContent();
    },
    _loadConfig: function() {
      $('div.name-title span').text('龙腾网吧');
    },
    _bindUI: function() {
      $.root_.on('click', '.search_btn', function() {
        searchGames();
      })
    },
    _loadContent: function() {
      ajaxData();
      loadTopGames();
    }
  }

  function ajaxData() {
    mData = ['英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟','英雄联盟']
  }

  function loadTopGames() {
    $.each(mData, function(index, obj) {
      var row = "<tr><td class='text-center'>" + (index+1);
      row += "</td><td class='text-center'>" + obj;
      row += "</td></tr>";

      $('div.top_games table:first tbody tr:last').after(row);
    })
  }

  function searchGames() {
    $('div.search_games').show();
    $('div.search_games table:first tbody').removeData().html("<tr style='display:none;'></tr>")
    var games = ['英雄联盟百宝箱','英雄联盟百宝箱','英雄联盟百宝箱','英雄联盟百宝箱','英雄联盟百宝箱']
    $.each(games, function(index, obj) {
      var row = "<tr><td class='text-center'>" + obj;
      row += "</td><td class='text-center'><a>下载</a>";
      row += "</td></tr>";

      $('div.search_games table:first tbody tr:last').after(row);
    })
  }
})
