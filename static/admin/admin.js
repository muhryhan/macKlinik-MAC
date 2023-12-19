const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

allSideMenu.forEach((item) => {
  const li = item.parentElement;

  item.addEventListener("click", function () {
    allSideMenu.forEach((i) => {
      i.parentElement.classList.remove("active");
    });
    li.classList.add("active");
  });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector("#content nav .bx.bx-menu");
const sidebar = document.getElementById("sidebar");

menuBar.addEventListener("click", function () {
  sidebar.classList.toggle("hide");
});

const searchButton = document.querySelector(
  "#content nav form .form-input button"
);
const searchButtonIcon = document.querySelector(
  "#content nav form .form-input button .bx"
);
const searchForm = document.querySelector("#content nav form");

searchButton.addEventListener("click", function (e) {
  if (window.innerWidth < 576) {
    e.preventDefault();
    searchForm.classList.toggle("show");
    if (searchForm.classList.contains("show")) {
      searchButtonIcon.classList.replace("bx-search", "bx-x");
    } else {
      searchButtonIcon.classList.replace("bx-x", "bx-search");
    }
  }
});

if (window.innerWidth < 768) {
  sidebar.classList.add("hide");
} else if (window.innerWidth > 576) {
  searchButtonIcon.classList.replace("bx-x", "bx-search");
  searchForm.classList.remove("show");
}

window.addEventListener("resize", function () {
  if (this.innerWidth > 576) {
    searchButtonIcon.classList.replace("bx-x", "bx-search");
    searchForm.classList.remove("show");
  }
});

const switchMode = document.getElementById("switch-mode");

switchMode.addEventListener("change", function () {
  if (this.checked) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
});

// modal

const lihatButton = document.querySelector("button[data-action='lihat']");
const closeModalBtn = document.querySelector(".close-btn");
const newUserName = document.getElementById("newUserName");
const newUserEmail = document.getElementById("newUserEmail");
const newUserImg = document.getElementById("newUserImg");
const newUserDescription = document.getElementById("newUserDescription");
const userImg = document.getElementById("userImg");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userDescription = document.getElementById("userDescription");

// update modal
const updateModal = document.querySelector(".updateModal");
function openUpdateModal() {
  updateModal.style.display = "flex";
}
document
  .querySelector("#editKeluhan .close-btn")
  .addEventListener("click", function () {
    updateModal.style.display = "none";
  });

// Lihat modal
let editModal = document.querySelector("#editModal");

function openlihatModal() {
  editModal.style.display = "block";
}

function closeModal() {
  editModal.style.display = "none";
}

function saveChanges() {
  if (newUserName.value !== "") {
    userName.textContent = newUserName.value;
  }

  if (newUserDescription.value !== "") {
    userDescription.textContent = newUserDescription.value;
  }
  if (newUserImg.files.length > 0) {
    const file = newUserImg.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
      userImg.src = event.target.result;
    };

    reader.readAsDataURL(file);
  }
  closeModal();
}

function logoutProfile() {
  
  console.log("Logout");
}

function show_list_regis() {
  $.ajax({
    type: "GET",
    url: '/adm_hist_regis/list_regis',
    data: {},
    success: function (response) {
      let usernames = response.usernames;  // Sesuaikan dengan kembalian dari server
      let listRegis = $("#list-regis");

      usernames.forEach(function (user) {
        let img = "static/admin/profil.jpg";
        let username = user.username;

        let temp_html = `<tr>
          <td>
            <img src="${img}" />
            <p>${username}</p>
          </td>
          <td>${getCurrentDate()}</td>
          <td><span class="status delete" onclick="delete_list_regis('${username}')")>Delete</span></td>
        </tr>`;

        listRegis.append(temp_html);
      });
    },
    error: function (error) {
      console.log("Error:", error);
    }
  });
}

function getCurrentDate() {
  let currentDate = new Date();
  let formattedDate = currentDate.toISOString().split('T')[0];
  return formattedDate;
}

function delete_list_regis(username) {
  $.ajax({
      type: "POST",
      url: "/adm_hist_regis/delete_list_regis",
      data: {'username_give': username}, 
      success: function (response) {
          alert(response["msg"]);
          window.location.reload();
      },
      error: function (error) {
          console.log("Error:", error);
      }
  });
}

