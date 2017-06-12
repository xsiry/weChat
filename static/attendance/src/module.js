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
    $('.online_machine').text('未知 ');
    $('.due_time').text(dateFactory(mData.netbarAuthorTime, true));
  }

  function loadAttendanceList() {
    var attendanceAve = 0;
    $('div.recent_div').append('<div class="row row_col"><div class="col-xs-12 col-sm-12 col-md-12 text-left row_col_t t_padding">最近七天网吧上机情况</div></div>');
    $('div.recent_div').append('<div class="row row_col text-center"><div class="col-xs-4 col-sm-4 col-md-4">日期</div><div class="col-xs-4 col-sm-4 col-md-4">台数</div><div class="col-xs-4 col-sm-4 col-md-4">上座率</div></div>');
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

      var attendance = mData.netbarTCount == 0 ? 0 : (obj.OnlineT / mData.netbarTCount * 100).toFixed(0);
      attendanceAve += parseFloat(attendance);
      var row = ''
      + '<div class="row row_col text-center">'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + date + '</div>'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + obj.OnlineT + '</div>'
      + '<div class="col-xs-4 col-sm-4 col-md-4">' + attendance + '%' + '</div>'
      + '</div>';
      $('div.recent_div').append(row);
    })

    attendanceAve = attendanceAve / mData.otlist.length;
    attendanceTop(attendanceAve.toFixed(0));
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
          mData = { "netbarName": data.netbarinfo.netbarname, "netbarTCount": result.netbarTCount, "netbarAuthorTime": result.netbarAuthorTime };
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

  function dateFactory (str, yearBool) {
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
    var mydatetime = yearBool ? [year, p(month), p(date)] : [p(month), p(date)];
    var now = mydatetime.join('-');
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
  
  function attendanceTop(ave) {
    var text = '';
    if (ave > 97) {
      text = '打败了全国 <span class="c-4">96.53%</span> 的同行！';
    }else if (ave > 94 && ave < 98) {
      text = '打败了全国 <span class="c-4">92.16%</span> 的同行！';
    }else if (ave > 89 && ave < 95) {
      text = '打败了全国 <span class="c-4">83.25%</span> 的同行！';
    }else if (ave > 84 && ave < 90) {
        text = '打败了全国 <span class="c-4">74.76%</span> 的同行！';
    }else if (ave > 79 && ave < 85) {
        text = '打败了全国 <span class="c-4">66.67%</span> 的同行！';
    }else if (ave > 74 && ave < 80) {
        text = '打败了全国 <span class="c-4">59.1%</span> 的同行！';
    }else if (ave > 69 && ave < 75) {
        text = '打败了全国 <span class="c-4">51.71%</span> 的同行！';
    }else if (ave > 64 && ave < 70) {
        text = '打败了全国 <span class="c-4">44.51%</span> 的同行！';
    }else if (ave > 59 && ave < 65) {
        text = '打败了全国 <span class="c-4">38.42%</span> 的同行！';
    }else if (ave > 54 && ave < 60) {
        text = '打败了全国 <span class="c-4">32.16%</span> 的同行！';
    }else if (ave > 49 && ave < 55) {
        text = '打败了全国 <span class="c-4">26.32%</span> 的同行！';
    }else if (ave > 29 && ave < 50) {
        text = '创业难，守业更难，同志仍需努力！';
    }else if (ave > 0 && ave < 30) {
        text = '市场竞争激励，君须砥砺前行！';
    }

      $('.attendance_ave').html('近7天的平均上座率为 <span class="c-4">' + ave + '%</span> 喔~');
    $('.attendance_top').html(text);
  }
})
