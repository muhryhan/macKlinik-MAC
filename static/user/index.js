// Toggle class active
const navbarNav = document.querySelector(".navbar-nav");
// Ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

// Klik di luar sidebar untuk menghilangkan nav
const hamburger = document.querySelector("#hamburger-menu");
const dropMenu = document.querySelector(".dropdown span");
const dropItem = document.querySelector(".dropdown");

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (!dropMenu.contains(e.target)) {
    dropItem.classList.remove("active");
  }
});

dropMenu.addEventListener("click", function () {
  dropItem.classList.toggle("active");
});

// Misalkan ini adalah kondisi login (gantilah dengan kondisi login sesuai aplikasi Anda)
var tamuNavbar = document.getElementById("navbar-before-login");
var userNavbar = document.getElementById("navbar-after-login");

// Fungsi untuk mendapatkan status login dari server
async function getLoginStatus() {
  try {
    const response = await fetch('http://localhost:8000/checkLoginStatus');
    const data = await response.json();
    return data.isLoggedIn;
  } catch (error) {
    console.error('Gagal memeriksa status login:', error);
    return false;
  }
}

// Tampilkan atau sembunyikan navbar sesuai dengan kondisi login
getLoginStatus().then((isLoggedIn) => {
  if (isLoggedIn) {
    tamuNavbar.style.display = "none";
    userNavbar.style.display = "flex";
  } else {
    tamuNavbar.style.display = "flex";
    userNavbar.style.display = "none";
  }

  // Inisialisasi Feather Icons
  feather.replace();
});

function cardArtikel() {
  $.ajax({
    type: "GET",
    url: '/get_artikel',
    data: {},
    success: function (response) {
      let artikelList = response.artikel_data;

      artikelList.forEach(function (artikel) {
        let img = artikel.image;  
        let title = artikel.title; 
        let description = artikel.description; 
        let link = artikel.link; 

        let temp_html = `<div class="card">
          <div class="image">
            <img
              src="${img}"
              alt=""
            />
          </div>
          <h2 class="title"><a href="${link}">${title}</a></h2>
          <p class="description">
            ${description}
          </p>
        </div>`;

        $("#card-artikel").append(temp_html);
      });
    },
    error: function (error) {
      console.log("Error:", error);
    }
  });
}