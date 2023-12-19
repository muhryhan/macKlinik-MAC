function login_admin() {
  let un = $("#username").val();
  let pw = $("#password").val();

  if (un === "") {
    alert("Masukkan username");
    return;
  }

  if (pw === "") {
    alert("Masukkan passord");
    return;
  }

  $.ajax({
    type: "POST",
    url: "/api/login_admin",
    data: { 
      un_give: un, 
      pw_give: pw, 
    },
    success: function (response) {
      if (response) {
        $.cookie('mytoken', response['token']);
        alert("Login Berasil"); 
        window.location.replace("/admin");
      } else {
        alert(response["msg"]);
      }
  },  
  });
}
