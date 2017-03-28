define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;

  module.exports = {
    init: function() {
      this._loadData();
    },
    _loadData: function() {
      ajaxData();
    }
  };

  function loadAttendance() {
	$('.name-title span').text(mData.netbarName);
    $('.total_machine').text(mData.netbarTCount);
    $('.online_machine').text(88);
    $('.top_online').text('84%');
  }

  function loadAttendanceList() {
    $.each(mData.otlist, function(index, obj) {
      var row = "<tr><td class='text-left'>" + obj.tempDate;
      row += "</td><td class='text-center font_color'>" + obj.OnlineT;
      row += "</td><td class='text-right font_color'>" + (obj.OnlineT/mData.netbarTCount*100).toFixed(0) + '%';
      row += "</td></tr>";

      $('table:first tbody tr:last').after(row);
    })
  }

  function ajaxData() {
	$.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: 'loadIndexData.json',
      dataType: 'json',
      success: function(data) {
        if (data.success) {
        	var result = JSON.parse(data.result);
            mData = {"netbarName": result.netbarName, "netbarTCount": result.netbarTCount};
			mData.otlist = [result.ot1, result.ot2, result.ot3, result.ot4, result.ot5, result.ot6, result.ot7]
			loadAttendance();
			loadAttendanceList();
        }
      },
      error: function(e) {
        console.log(e);
      }
    });
  }
})
