define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {

    init: function() {
      this._loadConfig();
      this._bindUI();
    },
    _loadConfig: function() {
      loadNetBarConfig();
      messageCount();
      noticeCount();
    },
    _bindUI: function() {
      $.root_.on("click", '.attendance_btn', function(e) {
        $('.attendance_bbtn').click();
      })
      $.root_.on("click", '.message_btn', function(e) {
        $('.message_bbtn').click();
      })
      $.root_.on("click", '.download_btn', function(e) {
        $('.download_bbtn').click();
      })
      $.root_.on("click", '.notice_btn', function(e) {
        $('.notice_bbtn').click();
      })
    }
  };

  // Helpers
  function loadNetBarConfig() {
    $.ajax({
      type: 'GET',
      contentType: 'application/json',
      url: 'loadIndexData.json',
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          var result = JSON.parse(data.result);
          $('.netbar_icon').prop('src', '../static/images/u2646.png');
          $('.you-name').text(data.netbarinfo.netbarname);
          $('.authorized_num').text(result.netbarTCount);
          $('.due_time').text('2018-02-15');
        }
      },
      error: function(e) {
        $('.login_msg').text(e);
      }
    });

  }

  function messageCount() {
    var count = 0;
    $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'getMsgs.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) {
	        	count = data.list.length;
	        }
	        if (count > 0) {
	            $('.message_count').addClass('bg-0');
	            $('.message_count').text(count);
	          }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }

  function noticeCount() {
    var count = 0;
    $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'infoDelivery.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) { 
	        	count = data.list.length;
	        }
	        if (count > 0) {
	            $('.notice_count').addClass('bg-f');
	            $('.notice_count').text(count);
	          }
	      },
	      error: function(e) {
	        console.log(e);
	      }
	    });
  }
})
