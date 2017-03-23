define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
      this._buildMenu();
    },
    _bindUI: function() {
      $.root_.on('click', '.attendance_bbtn', function(e) {
        loadURL('../apps/attendance.html');
      })
      $.root_.on("click", '.message_bbtn', function(e) {
        loadURL('../apps/message.html');
      })
      $.root_.on("click", '.download_bbtn', function(e) {
        loadURL('../apps/download.html');
      })
      $.root_.on("click", '.notice_bbtn', function(e) {
        loadURL('../apps/notice.html');
      })
    },
    _buildMenu: function() {
      buildMenu();
    }
  };

  function buildMenu() {
    var menus = [{ class: 'attendance_bbtn', img_src: '../static/images/u2466.png', text: '上座率' },
      { class: 'message_bbtn', img_src: '../static/images/u2412.png', text: '留言板' },
      { class: 'download_bbtn', img_src: '../static/images/u2416.png', text: '下游戏' },
      { class: 'notice_bbtn', img_src: '../static/images/u2410.png', text: '看通知' }
    ]

    var html = '';
    for (var i in menus) {
      var m = menus[i];
      html += '<div><a href="javascript:void(0);" class="' + m.class + '" >';
      html += '<img src="' + m.img_src + '" /><p>' + m.text + '</p></a></div>';
    }

    $('div.menus').append(html);
  }

  function loadURL(a) {
    var b = $('div.content');
    $.ajax({
      "type": "GET",
      "url": a,
      "dataType": "html",
      "cache": !0,
      "beforeSend": function() {
        b.removeData().html(""),
          b.html('<h1 class="ajax-loading-animation"><i class="fa fa-cog fa-spin"></i> 页面加载中...</h1>'),
          b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
            drawBreadCrumb(),
            $("html").animate({
              "scrollTop": 0
            }, "fast"))
      },
      "success": function(a) {
        b.css({
            "opacity": "0.0"
          }).html(a).delay(50).animate({
            "opacity": "1.0"
          }, 300),
          a = null,
          b = null
      },
      "error": function(c, d, e) {
        b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
      },
      "async": !0
    })
  }
})
