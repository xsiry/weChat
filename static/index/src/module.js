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
      // bind .name_search_btn
      $.root_.on("click", '.loginout', function(e) {
    	loginOut();
      })
      $.root_.on("click", '.attendance_btn', function(e) {
        window.location.href = 'apps/content.html#attendance';
      })
      $.root_.on("click", '.message_btn', function(e) {
        window.location.href = 'apps/content.html#message';
      })
      $.root_.on("click", '.download_btn', function(e) {
        window.location.href = 'apps/content.html#download';
      })
      $.root_.on("click", '.notice_btn', function(e) {
        window.location.href = 'apps/content.html#notice';
      })
    }
  };

  // Helpers
  function loadNetBarConfig() {
	  $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: '/weChat/apps/loadIndexData.json',
	      dataType: 'json',
	      success: function(data) {
	        if (data.success) {
	        	var result = JSON.parse(data.result);
	        	$('.netbar_icon').prop('src', 'static/images/u2646.png');
	            $('.you-name').text(result.netbarName);
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
    var count = 12;
    if (count > 0) {
      $('.message_count').addClass('bg-0');
      $('.message_count').text(count);
    }

  }

  function noticeCount() {
    var count = 12;
    if (count > 0) {
      $('.notice_count').addClass('bg-f');
      $('.notice_count').text(count);
    }
  }
  
  function loginOut() {
	    $.ajax({
	      type: 'GET',
	      contentType: 'application/json',
	      url: 'loginOut.json',
	      dataType: 'json',
	      success: function(data) {
	    	  if (data) {
	    		  window.location.href = 'login.html';
	    	  }
	      },
	      error: function(e) {}
	    });
	  }
})
