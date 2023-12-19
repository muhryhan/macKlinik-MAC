function regis_admin(event) {
  event.preventDefault();
  var un = $("#username").val();
  var pw = $("#password").val();
  var confirm_pw = $("#confirm_password").val();
  if (!un) {
    alert("Mohon masukkan username anda");
    return;
  } else if (!pw) {
    alert("Mohon masukkan password anda");
    return;
  } else if (!confirm_pw) {
    alert("Mohon masukkan konfirmasi sandi anda");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/api/regis_admin",
    data: {
      un_give: un,
      pw_give: pw,
      confirm_pw_give: confirm_pw,
    },
    success: function (response) {
      if (response["result"] === "success") {
        alert(response.msg);
        window.location.replace("/login_admin");
      } else if (response["result"] === "fail") {
        alert(response('msg'));
        window.location.reload;
      }
      else if (response["result"] === "sament") {
        alert("Password dan konfirmasi password tidak sama");
        window.location.reload;
      } else {
        alert("Registrasi gagal");
      }
    },
  });
}
