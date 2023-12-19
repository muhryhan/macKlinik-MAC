// nav background
let header = document.querySelector("header");

window.addEventListener("scroll", () => {
  header.classList.toggle("shadow", window.scrollY > 0);
});

//Filter
$(document).ready(function () {
  $(".filter-item").click(function () {
    const value = $(this).attr("data-filter");
    if (value == "all") {
      $(".post-box").show("1000");
    } else {
      $(".post-box")
        .not("." + value)
        .hide(1000);
      $(".post-box")
        .filter("." + value)
        .show("1000");
    }
  });
  $(".filter-item").click(function () {
    $(this).addClass("active-filter").siblings().removeClass("active-filter");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Fetch daftar artikel
  fetch("static/user/data_artikel.json")
    .then((response) => response.json())
    .then((data) => {
      const articleList = document.getElementById("articleList");

      // Iterasi melalui setiap artikel
      data.articles.forEach((article) => {
        const articleElement = createArticleElement(article);
        articleList.appendChild(articleElement);
      });

      // Tangani klik pada link artikel
      $(".post-box a").click(function (e) {
        e.preventDefault();
        const id = $(this).attr("href").split("?id=")[1];

        // Sembunyikan semua artikel kecuali yang sesuai dengan ID
        $(".post-box").not(`[data-id="${id}"]`).hide(1000);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function createArticleElement(article) {
  const articleBox = document.createElement("div");
  articleBox.classList.add("post-box");
  articleBox.setAttribute("data-id", article.id); // Tambahkan atribut data-id

  const imageElement = document.createElement("img");
  imageElement.src = article.image;
  imageElement.alt = "";
  imageElement.classList.add("post-img");

  const titleLink = document.createElement("a");
  titleLink.href = article.link + "?id=" + article.id;
  titleLink.classList.add("post-title");
  titleLink.textContent = article.title;

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("post-description");
  descriptionElement.textContent = article.description;

  articleBox.appendChild(imageElement);
  articleBox.appendChild(titleLink);
  articleBox.appendChild(descriptionElement);

  return articleBox;
}
