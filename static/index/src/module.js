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
        window.location.href = './login.html';
      })
      $.root_.on("click", '.attendance_btn', function(e) {
        window.location.href = 'apps/attendance.html';
      })
      $.root_.on("click", '.message_btn', function(e) {
        window.location.href = 'apps/message.html';
      })
      $.root_.on("click", '.download_btn', function(e) {
        window.location.href = 'apps/download.html';
      })
      $.root_.on("click", '.notice_btn', function(e) {
        window.location.href = 'apps/notice.html';
      })
    }
  };

  // Helpers
  function loadNetBarConfig() {
    $('.netbar_icon').prop('src', 'static/images/u2646.png');
    $('.you-name').text('龙腾网吧');
    $('.authorized_num').text(198);
    $('.due_time').text('2018-02-15');
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
})
