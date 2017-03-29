define(function(require, exports, module) {
  $.root_ = $('body');
  var mData, auditMessage;
  module.exports = {
    init: function() {
      this._bindUI();
      this._loadContent();
    },
    _bindUI: function() {
      $.root_.on('click', '.reply_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var msgid = rowobj.data("msgid");
    	  $('.reply_content').show();
    	  var title = $('.number_msg_'+ msgid).text();
    	  var admin_msg = $('.admin_msg_'+ msgid).text();
    	  $('.reply_number_msg').text(title);
    	  $('span.msgid_msg').text(msgid);
    	  $('pre.flex').text(admin_msg);
          actionobj.preventDefault();
          rowobj = null;
      })
      $.root_.on('click', '.del_msg_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var msgid = rowobj.data("msgid");
    	  delMsg(msgid);
    	  actionobj.preventDefault();
          rowobj = null;
      })
      $.root_.on('click', '.reply_commit_btn', function() {
    	  commitMsg();
      })
      $.root_.on('click', '.reply_cancel_btn', function() {
    	  $('.reply_content').hide();
      })
      $.root_.on('click', '.status_btn', function(actionobj) {
    	  var rowobj = $(this);
    	  var msgid = rowobj.data("msgid");
    	  statusMsg(msgid);
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
	      url: 'getMsgs.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) {
	        	mData = data.list;
	        	auditMessage = data.auditMessage;
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
      html += '<div class="content-block content-block-m content_block_msg_'+ obj.msgid +'">';
      html += '<h3><span class="number_msg_'+ obj.msgid +'">'+ obj.machineNo +'</span> 号机玩家留言</h3><p>' + obj.content + '</p>';
      html += (obj.adminReply == null || obj.adminReply == '') ? '' : '<div class="ad-Reply ad_reply_'+ obj.msgid +'"><span>管理员回复：</span><span class="admin_msg_'+ obj.msgid +'">' + obj.adminReply + '</span></div>';
      html += '<div class="content-bottom"><span>' + commonTime + '</span>';
      html += '<span class="pull-right"><button class="btn btn-danger btn-xs del_msg_btn" data-msgid='+ obj.msgid +' >删除</button></span>';
      html += '<span class="pull-right"><button class="btn btn-info btn-xs reply_btn" data-msgid='+ obj.msgid +' >回复</button></span>';
      html += (auditMessage == false) ? '' : '<span class="pull-right"><button class="btn btn-info btn-xs status_btn status_btn_'+ obj.msgid +'" data-msgid='+ obj.msgid +' ' + ((obj.isShow == 0) ? '' : 'disabled')+ '>' + ((obj.isShow == 0) ? '审核' : '已审核') + '</button></span>';
      html += '</div></div>';
    })

    $('div.msg_content').append(html);
  }
  
  function delMsg(msgid) {
	  $.ajax({
	      type: 'DELETE',
	      contentType: 'application/json',
	      url: 'delMsg/'+ msgid + '.do',
	      dataType: 'json',
	      success: function(data) {
	        if (data) {
	        	$('.content_block_msg_'+ msgid).remove()
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }
  
  function commitMsg() {
	  var msgid = $('span.msgid_msg').text();
	  var adminReply = $('pre.flex').text();
	  $.ajax({
	      type: 'POST',
	      contentType: 'application/json',
	      url: 'adminReply.json',
	      dataType: 'json',
	      data: JSON.stringify({
	    	  msgid: msgid,
	    	  adminReply: adminReply
	      }),
	      success: function(data) {
	        if (data) {
	        	$('.admin_msg_'+ msgid).text(adminReply);
	        	if (adminReply == '') {
	        		$('.ad_reply_'+ msgid).hide();
	        	}else{
	        		$('.ad_reply_'+ msgid).show();
	        	}
	      	  	$('.reply_content').hide();
	        }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }
  
  function statusMsg(msgid)  {
	  $.ajax({
	      type: 'POST',
	      contentType: 'application/json',
	      url: 'showStatus/'+ msgid +'.do',
	      dataType: 'json',
	      success: function(data) {
	        if (data) {
	        	$('.status_btn_' + msgid).text('已审核');
	        	$('.status_btn_' + msgid).prop('disabled', 'disabled')
	        }
	      },
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
