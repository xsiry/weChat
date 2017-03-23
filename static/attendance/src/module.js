define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;

  module.exports = {
    init: function() {
      this._loadConfig();
      this._bindUI();
    },
    _loadConfig: function() {
      ajaxData();
      loadAttendance();
      loadAttendanceList();
    },
    _bindUI: function() {
    }
  };

  function loadAttendance() {
    $('.total_machine').text(mData.netbarTCount);
    $('.online_machine').text(88);
    $('.top_online').text('84%');
  }

  function loadAttendanceList() {
    mData = [["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%'],["2017/3/22 0:45:06", 66, '98%']]
    $.each(mData, function(index, obj) {
      var row = "<tr><td class='text-left'>" + obj[0];
      row += "</td><td class='text-center font_color'>" + obj[1];
      row += "</td><td class='text-right font_color'>" + obj[2];
      row += "</td></tr>";

      $('table:first tbody tr:last').after(row);
    })
  }

  function ajaxData() {
    mData = { "resultStatus": 1, "resultMsg": "sussce", "netbarName": "华艺网吧", "netbarTCount": 95, "ot1": { "tempDate": "2017/3/22 0:45:06", "OnlineT": 73 }, "ot2": { "tempDate": "2017/3/21 0:46:16", "OnlineT": 77 }, "ot3": { "tempDate": "2017/3/20 0:42:27", "OnlineT": 80 }, "ot4": { "tempDate": "2017/3/19 0:41:21", "OnlineT": 75 }, "ot5": { "tempDate": "2017/3/18 -0:39:43", "OnlineT": 69 }, "ot6": { "tempDate": "2017/3/17 0:38:37", "OnlineT": 64 }, "ot7": { "tempDate": "2017/3/16 0:39:45", "OnlineT": 66 } }
  }
})
