define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;
  module.exports = {
    init: function() {
      this._bindUI();
      this._loadContent();
    },
    _bindUI: function() {
      $.root_.on('click', '.reply_btn', function() {

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
	        if (data.sucess) { 
	        	mData = data.list;
	        	$('div.name-title span').text(data.netbarName);
	        	loadMessages();
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
     }

  function loadMessages() {
    var html = '';
    $.each(mData, function(index, obj) {
      var unixTimestamp = new Date(obj.idfixedtime) ;
      commonTime = toLocaleString(unixTimestamp);
      html += '<div class="content-block content-block-m ' + (obj.wxread ? '':'c-b') + '">';
      html += '<h3 class="">'+ obj.idtitle +'</h3><p>' + obj.idcontent + '</p>';
      html += '<div class="content-bottom"><span>' + commonTime + '</span>';
      html += '<span class="pull-right"><a class="msg_details_btn ' + (obj.wxread ? '':'c-b') + ' data-infoid= '+ obj.infoid +' ">详细</a></span>';
      html += '</div></div>';
    })

    $('div.notice_content').append(html);
  }
  function toLocaleString(date) {
      return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日 " + date.getHours() + "点" + date.getMinutes() + "分" + date.getSeconds() + "秒";
  };
})
