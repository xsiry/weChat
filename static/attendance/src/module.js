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
    $('div.recent_div').append('<div class="row row_col"><div class="col-xs-12 col-sm-12 col-md-12 text-center">最近七天网吧上机情况</div></div>');
    $.each(mData.otlist, function(index, obj) {
      var row = ''
      + '<div class="row row_col text-center">'
      + '<div class="col-xs-6 col-sm-6 col-md-6">' + dateFactory(obj.tempDate) + '</div>'
      + '<div class="col-xs-3 col-sm-3 col-md-3 c-4">' + obj.OnlineT + '</div>'
      + '<div class="col-xs-3 col-sm-3 col-md-3 c-4">' + (obj.OnlineT / mData.netbarTCount * 100).toFixed(0) + '%' + '</div>'
      + '</div>';
      console.log(row)
        // != "") ? obj.tempDate.split(' ')[0].replace('/','-').replace('/','-') : ""
      $('div.recent_div').append(row);
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
          mData = { "netbarName": data.netbarinfo.netbarname, "netbarTCount": result.netbarTCount };
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

  function dateFactory (str) {
    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var d = string2date(str);
    //获取当前年
    var year = d.getFullYear();
    //获取当前月
    var month = d.getMonth() + 1;
    //获取当前日
    var date = d.getDate();

    var h = d.getHours(); //获取当前小时数(0-23)
    var m = d.getMinutes(); //获取当前分钟数(0-59)
    var s = d.getSeconds();

    var now = [p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':')
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
})
