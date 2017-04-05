define(function(require, exports, module) {
  $.root_ = $('#loginFrom');
  module.exports = {

    init: function() {
      this._bindUI();
      inputValidator();
    },
    _bindUI: function() {
      $.root_.on('click', '.subimt_btn', function() {
        loginSubmit();
      })
    },
  };

  // Helpers
  /*
   * 登陆验证
   */
  function inputValidator() {
    $('#loginFrom').bootstrapValidator({
      message: '该项不能为空',
      fields: {
        username: {
          message: '账号不能为空',
          validators: {
            notEmpty: {
              message: '账号不能为空'
            },
            regexp: {
              regexp: /^[a-zA-Z0-9_]+$/,
              message: '账号只能由字母、数字和下划线组成'
            }
          }
        },
        password: {
          validators: {
            notEmpty: {
              message: '密码不能为空'
            }
          }
        }
      }
    });

    // 记住密码选中时，记住账号则自动选中 反之
    $('#rmbPassWord').click(function() {
      $("#rmbPassWord").is(':checked') == true ? $("#rmbUser").prop("checked", 'true') : $("#rmbUser").prop("checked", false);
    });

    //初始化页面时验证是否记住了帐号
    if ($.cookie("rmbUser") == "true") {
      $("#rmbUser").prop("checked", true);
      $("#inputUsername").val($.cookie("userName"));
    };

    //初始化页面时验证是否记住了密码
    if ($.cookie("rmbPassWord") == "true") {
      $("#rmbPassWord").prop("checked", true);
      $("#inputPassword").val($.cookie("passWord"));
    };
  };

  function loginSubmit() {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      url: 'login.json',
      data: JSON.stringify({
        username: $('#inputUsername').val(),
        password: $('#inputPassword').val()
      }),
      dataType: 'json',
      beforeSend: function() {
    	  $('.subimt_btn').prop("disabled","disabled");
    	  $('.login_msg').text("正在登陆，请稍等...");
      },
      success: function(data) {
        if (data) {
          $('.login_msg').text("登陆成功！");
          saveUserInfo();
          location.href = "apps/content.html#index";
        } else {
          $('.login_msg').text("登陆失败！用户名或密码错误！");
        }
        $('.subimt_btn').removeAttr("disabled");
      },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          $('.subimt_btn').removeAttr("disabled");
          $('.login_msg').html("请求对象XMLHttpRequest: " + XMLHttpRequest.responseText.substring(0, 50) + " ,错误类型textStatus: " + textStatus + ",异常对象errorThrown: " + errorThrown.substring(0, 50));
        }
    });
  }

  //保存用户信息，存储一个带7天期限的 cookie 或者 清除 cookie
  function saveUserInfo() {

    // 保存帐号和密码
    if ($("#rmbUser").is(':checked') == true && $("#rmbPassWord").is(':checked') == true) {
      var userName = $("#inputUsername").val();
      var passWord = $("#inputPassword").val();

      $.cookie("rmbUser", "true", {
        expires: 7
      });
      $.cookie("rmbPassWord", "true", {
        expires: 7
      });
      $.cookie("userName", userName, {
        expires: 7
      });
      $.cookie("passWord", passWord, {
        expires: 7
      });

      // 只保存帐号
    } else if ($("#rmbUser").is(':checked') == true) {
      var userName = $("#inputUsername").val();

      $.cookie("rmbUser", "true", {
        expires: 7
      });
      $.cookie("userName", userName, {
        expires: 7
      });

      // 清除用户信息的 cookie
    } else {
      $.cookie("rmbUser", "false", {
        expires: -1
      });
      $.cookie("rmbPassWord", "false", {
        expires: -1
      });
      $.cookie("userName", '', {
        expires: -1
      });
      $.cookie("passWord", '', {
        expires: -1
      });
    }
  }
})
