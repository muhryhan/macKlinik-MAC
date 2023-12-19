document.getElementById("exit").addEventListener("click", function () {
  // Redirect ke halaman utama saat tombol ditekan
  window.location.href = "/";
});

function keluh_save() {
  var fullname = $("#fullname").val();
  var age = $("#age").val();
  var phone = $("#phone").val();
  var date = $("#date").val();

  var gender = $("input[name='radio_give']:checked").val();

  var address = $("#address").val();
  var keluhan = $("#keluhan").val();
  if (
    !fullname ||
    !age ||
    !phone ||
    !date ||
    !pria ||
    !wanita ||
    !address ||
    !keluhan
  ) {
    alert("Anda belum mengisi data keseluruhan");
    return;
  }
  $.ajax({
    type: "POST",
    url: "/keluhan/save",
    data: {
      fullname_give: fullname,
      age_give: age,
      phone_give: phone,
      date_give: date,
      radio_give: gender,
      address_give: address,
      keluhan_give: keluhan,
    },
    success: function (response) {
      if (response) {
        alert(msg);
        window.location.reload();
      } else {
        alert("Keluhan gagal dikirim");
      }
    },
  });
}
