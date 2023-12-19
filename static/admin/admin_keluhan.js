function show_keluhan() {
  $.ajax({
    type: "GET",
    url: '/adm_keluhan/get_show',
    data: {},
    success: function (response) {
      let keluhanList = response.keluhan_data;

      keluhanList.forEach(function (keluhan) {
        let img = "static/admin/profil.jpg";
        let fullname = keluhan.fullname;
        let time_post = new Date(keluhan.date);
        let formattedDate = time_post.toISOString().split('T')[0];
        

        let temp_html = `<tr>
          <td>
            <img src="${img}" />
            <p>${fullname}</p>
          </td>
          <td>${formattedDate}</td>
          <td>
          <span onclick="openlihatModal()" class="status update">Lihat</span>
          </td>
          <td>
            <span class="status update" onclick="openUpdateModal()">Update</span>
          </td>
          <td>
  <span class="status delete" onclick="delete_keluhan('${fullname}')">Delete</span>
</td>

        </tr>`;

        $("#show-keluhan").append(temp_html);
      });
    },
    error: function (error) {
      console.log("Error:", error);
    }
  });
}

function openlihatModal(id) {
  // Mengirim permintaan AJAX ke endpoint yang sesuai
  $.ajax({
    url: "/adm_keluhan/get_lihat?id=" + id,
    type: "GET",
    success: function (response) {
      let detail = response.detail;

      // Mengisi nilai dalam modal berdasarkan respons dari server
      $('#editModal .modal-content .tgl #fullname').text(detail.Fullname);
      $('#editModal .modal-content .tgl #age').text(detail.Age);
      $('#editModal .modal-content .tgl #phone').text(detail.Phone);
      $('#editModal .modal-content .tgl #date').text(detail.Date);
      $('#editModal .modal-content .tgl #address').text(detail.Address);
      $('#editModal .modal-content .tgl #keluhan').text(detail.Keluhan);

      // Menampilkan modal
      $('#editModal').modal('show');
    },
    error: function (xhr, status, error) {
      console.log('Request failed. Returned status of ' + xhr.status);
    }
  });
}

function update_keluhan() {
  // $("#editModal").empty();
  $.ajax({
    type: "POST",
    url: '/adm_keluhan/update_keluhan',
    data: {},
    success: function (response) {
      let keluhanList = response.keluhan_data;

      keluhanList.forEach(function (keluhan) {
        let fullname = keluhan.fullname;
        let age = keluhan.age;
        let phone = keluhan.phone;
        let gender = keluhan.gender;
        let address = keluhan.address;
        let keluhan_pasien = keluhan.keluhan;
        let time_post = new Date(keluhan.date);
        let formattedDate = time_post.toISOString().split('T')[0];

        let temp_html = ``;

        $("#editModal").append(temp_html);
      });
    },
    error: function (error) {
      console.log("Error:", error);
    }
  });
}

function delete_keluhan(fullname) {
  $.ajax({
      type: "POST",
      url: "/adm_keluhan/delete_keluhan",
      data: {'fullname_give': fullname},
      success: function (response) {
          alert(response["msg"]);
          window.location.reload();
      },
      error: function (error) {
          console.log("Error:", error);
      }
  });
}
