define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
    },
    _bindUI: function() {
      $.root_.on('click', '.attendance_bbtn', function(e) {
        window.location.href = '../apps/attendance.html';
      })
      $.root_.on("click", '.message_bbtn', function(e) {
        window.location.href = '../apps/message.html';
      })
      $.root_.on("click", '.download_bbtn', function(e) {
        window.location.href = '../apps/download.html';
      })
      $.root_.on("click", '.notice_bbtn', function(e) {
        window.location.href = '../apps/notice.html';
      })
    }
  }
})
