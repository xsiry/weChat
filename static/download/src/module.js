define(function(require, exports, module) {
  $.root_ = $('body');
  var mData;
  module.exports = {
    init: function() {
      this._loadConfig();
      this._bindUI();
      this._loadContent();
    },
    _loadConfig: function() {
      $('div.name-title span').text('龙腾网吧');
    },
    _bindUI: function() {
      $.root_.on('click', '.reply_btn', function() {

      })
    },
    _loadContent: function() {
      ajaxData();
      loadMessages();
    }
  }

  function ajaxData() {
    mData = []
  }

  function loadMessages() {
    var html = '';
    for (var i in mData) {
      var m = mData[i];
      html += '<div class="content-block content-block-m ' + (m[2] ? '':'c-b') + '">';
      html += '<h3 class="">'+ m[0] +'</h3><p>' + m[1] + '</p>';
      html += '<div class="content-bottom"><span>' + m[3] + '</span>';
      html += '<span class="pull-right"><a class="del_msg_btn ' + (m[2] ? '':'c-b') + '">' + (m[2] ? '已读' : '未读') + '</a></span>';
      html += '</div></div>';
    }

    $('div.notice_content').append(html);
  }
})
