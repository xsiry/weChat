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
      $.root_.on('click', '.del_msg_btn', function() {
        console.log('del')
      })
    },
    _loadContent: function() {
      ajaxData();
      loadMessages();
    }
  }

  function ajaxData() {
    mData = [['辖区网吧下周安装净网先锋', '网吧英雄网吧英雄联盟加载报错的，请退出营销大师后重新登录就好了网吧英雄网吧英雄联盟加载报错的请退出营销大师后重新登录就好了网吧英雄网吧英雄联盟加载报错的，请退出营销大师后重新登录就好了','分手的距离看风景独守空房惊世毒妃第十六届','2016-12-09 16:32'],
    ['辖区网吧下周安装净网先锋', '网吧英雄网吧英雄联盟加载报错的，请退出营销大师后重新登录就好了网吧英雄网吧英雄联盟加载报错的请退出营销大师后重新登录就好了网吧英雄网吧英雄联盟加载报错的，请退出营销大师后重新登录就好了','','2016-12-09 16:32']];
  }

  function loadMessages() {
    var html = '';
    for (var i in mData) {
      var m = mData[i];
      html += '<div class="content-block content-block-m">';
      html += '<h3 class="">'+ m[0] +'</h3><p>' + m[1] + '</p>';
      html += m[2] == '' ? '' : '<div class="ad-Reply"><span>管理员回复：</span>' + m[2] + '</div>';
      html += '<div class="content-bottom"><span>' + m[3] + '</span>';
      html += '<span class="pull-right"><a class="del_msg_btn">删除</a></span><span class="pull-right"><a class="reply_btn">回复</a></span></div></div>';
    }

    $('div.msg_content').append(html);
  }
})
