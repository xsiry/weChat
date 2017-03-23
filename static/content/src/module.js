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
        $('div a.bbtn').addClass('grayscale');
        $('div a.attendance_bbtn').removeClass('grayscale');
      })
      $.root_.on("click", '.message_bbtn', function(e) {
        loadURL('../apps/message.html');
        $('div a.bbtn').addClass('grayscale');
        $('div a.message_bbtn').removeClass('grayscale');
      })
      $.root_.on("click", '.download_bbtn', function(e) {
        loadURL('../apps/download.html');
        $('div a.bbtn').addClass('grayscale');
        $('div a.download_bbtn').removeClass('grayscale');
      })
      $.root_.on("click", '.notice_bbtn', function(e) {
        loadURL('../apps/notice.html');
        $('div a.bbtn').addClass('grayscale');
        $('div a.notice_bbtn').removeClass('grayscale');
      })
    },
    _buildMenu: function() {
      buildMenu();
    }
  };

  function buildMenu() {
    var menus = [{ class: 'bbtn attendance_bbtn grayscale', img_src: '../static/images/u2414.png', text: '上座率' },
      { class: 'bbtn message_bbtn grayscale', img_src: '../static/images/u2464.png', text: '留言板' },
      { class: 'bbtn download_bbtn grayscale', img_src: '../static/images/u2524.png', text: '下游戏' },
      { class: 'bbtn notice_bbtn grayscale', img_src: '../static/images/u2591.png', text: '看通知' }
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
