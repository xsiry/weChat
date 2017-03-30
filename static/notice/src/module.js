define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;
  module.exports = {
    init: function() {
      this._bindUI();
      this._loadContent();
    },
    _bindUI: function() {
      $.root_.on('click', '.msg_details_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var infoid = rowobj.data("infoid");
    	  notice_detail(infoid);
          actionobj.preventDefault();
          rowobj = null;
      })
      $.root_.on('click', '.go_back_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var infoid = rowobj.data("infoid");
    	  $('.notice_detail').hide();
    	  $('.content-block_'+ infoid).addClass('c-b');
    	  $('.msg_details_btn_'+ infoid).addClass('c-b');
    	  $('.idcontent_'+ infoid).addClass('c-b');
    	  $('.notice_content').show();
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
	      url: 'infoDelivery.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) { 
	        	mData = data.list;
	        	$('div.name-title span').text(data.netbarName);
	        	loadNotice();
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
     }

  function loadNotice() {
    var html = '';
    $.each(mData, function(index, obj) {
      var unixTimestamp = new Date(obj.idfixedtime) ;
      commonTime = toLocaleString(unixTimestamp);
      html += '<div class="content-block content-block-m content-block_'+ obj.infoid +' ' + (obj.wxread==0 ? '':'c-b') + '">';
      html += '<h3 class="notice_title'+ obj.infoid +'">'+ obj.idtitle +'</h3><p class="idcontent_'+ obj.infoid +' ' + (obj.wxread==0 ? '':'c-b') + '">' + obj.idcontent.substring(0,20) + ((obj.idcontent.length >= 20) ? '……' : '')  + '</p><div class="notice_content'+ obj.infoid +'" style="display:none;">' + obj.idcontent + '</div>';
      html += '<div class="content-bottom"><span class="notice_time'+ obj.infoid +'">' + commonTime + '</span>';
      html += '<span class="pull-right"><a class="btn btn-info btn-xs msg_details_btn msg_details_btn_'+ obj.infoid + ' ' + (obj.wxread==0 ? '':'c-b') + '" data-infoid= '+ obj.infoid +' >详细</a></span>';
      html += '</div></div>';
    })

    $('div.notice_content').append(html);
  }
  
  function notice_detail(infoid) {
	  $('.notice_detail').removeData();
	  var title = $('.notice_title'+ infoid).text();
	  var content = $('.notice_content'+ infoid).text();
	  var time = $('.notice_time'+ infoid).text();
	  $('.notice_content').hide();
	  var div_text = '<div class="content-block content-block-m"><h3>'+ title +'</h3><p>' + content;
	  div_text += '</p><div class="content-bottom"><span>' + time;
	  div_text += '</span><span class="pull-right"><a class="btn btn-info btn-xs go_back_btn" ';
	  div_text += 'data-infoid= '+ infoid +' >返回</a></span></div></div>'
	  $('.notice_detail').html(div_text);
	  $('.notice_detail').show();
	  
	  $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'infoDeliveryRead.json',
	      dataType: 'json',
	      data:{
	    	  infoid: infoid
	      },
	      success: function(data) {},
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }
  
  function toLocaleString(myDate) {
		function p(s) {
	      return s < 10 ? '0' + s : s;
	    }
	    //获取当前年
	    var year = myDate.getFullYear();
	    //获取当前月
	    var month = myDate.getMonth() + 1;
	    //获取当前日
	    var date = myDate.getDate();

	    var h = myDate.getHours(); //获取当前小时数(0-23)
	    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
	    var s = myDate.getSeconds();

	    var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
	    return now;
	  };
})
