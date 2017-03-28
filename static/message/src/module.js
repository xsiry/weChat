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
      $.root_.on('click', '.del_msg_btn', function() {
        console.log('del')
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
	      url: 'getMsgs.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) {
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
      var unixTimestamp = new Date(obj.createTime) ;
      commonTime = toLocaleString(unixTimestamp);
      html += '<div class="content-block content-block-m">';
      html += '<h3 class="">'+ obj.machineNo +' 号机玩家留言</h3><p>' + obj.content + '</p>';
      html += obj.adminReply == null ? '' : '<div class="ad-Reply"><span>管理员回复：</span>' + obj.adminReply + '</div>';
      html += '<div class="content-bottom"><span>' + commonTime + '</span>';
      html += '<span class="pull-right"><a class="del_msg_btn" data-msgid='+ obj.msgid +' >删除</a></span><span class="pull-right"><a class="reply_btn" data-msgid='+ obj.msgid +' >回复</a></span></div></div>';
    })

    $('div.msg_content').append(html);
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
