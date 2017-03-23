define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
    },
    _bindUI: function() {
      $.root_.on("click", '.msg_setting', function(e) {
        window.location.href = '../apps/message-switch.html';
      })
    }
  }
})
