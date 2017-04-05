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
    $('.netbar_title').text(mData.netbarName);
    $('.total_machine').text(mData.netbarTCount);
    $('.online_machine').text(88);
    $('.due_time').text('2018-02-15');
  }

  function loadAttendanceList() {
    $('div.recent_div').append('<div class="row row_col"><div class="col-xs-12 col-sm-12 col-md-12 text-center row_col_t">最近七天网吧上机情况</div></div>');
    $.each(mData.otlist, function(index, obj) {
      var date = '';
      if (obj.tempDate == null) return;
      if (index == 0) {
        date = '<svg class="svg_icon" viewBox="0 0 1500 1024" style="width: 50px;height: 28px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#yesterday_svg"></use></svg>';
      }else if (index == 1) {
        date = '<svg class="svg_icon" viewBox="0 0 1500 1024" style="width: 50px;height: 28px;"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#before_yesterday_svg"></use></svg>';
      }else {
        date = dateFactory(obj.tempDate);
      }

      var row = ''
      + '<div class="row row_col text-center">'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + date + '</div>'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + obj.OnlineT + '</div>'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + (obj.OnlineT / mData.netbarTCount * 100).toFixed(0) + '%' + '</div>'
      + '</div>';
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

    var now = [p(month), p(date)].join('-');
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
})
