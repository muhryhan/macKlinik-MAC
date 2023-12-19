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
// JavaScript modal
const editModal = document.getElementById("editModal");
const closeModalBtn = document.querySelector(".close-btn");
const newUserName = document.getElementById("newUserName");
const newUserEmail = document.getElementById("newUserEmail");
const newUserImg = document.getElementById("newUserImg");
const newUserDescription = document.getElementById("newUserDescription");
const userImg = document.getElementById("userImg");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userDescription = document.getElementById("userDescription");

function editProfile() {
  editModal.style.display = "block";
}

function closeModal() {
  editModal.style.display = "none";
}

function saveChanges() {
  if (newUserName.value !== "") {
    userName.textContent = newUserName.value;
  }
  if (newUserEmail.value !== "") {
    userEmail.textContent = newUserEmail.value;
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
  // Implement logout functionality here
  console.log("Logout");
}
