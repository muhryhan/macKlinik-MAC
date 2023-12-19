"use strict";

const productDetail = document.querySelector(".product-detail");

function loadJson() {
  fetch("static/user/products.json")
    .then((responce) => responce.json())
    .then((data) => {
      const id = new URLSearchParams(window.location.search).get("id");
      for (const filter of data) {
        for (const product of filter.products) {
          if (product.id == id) {
            productDetail.innerHTML += `
            <div class="row product-detail-item" data="${product.id}">
            <div class="col-6 product-detail-img-box">
              <img
                src="${product.imgSrc}"
                alt="product image"
                class="product-detail-img"
              />
            </div>
            <div class="col-6 product-detail-desc-box">
              <p class="name">${product.name}</p>
              <p class="price">${product.price}</p>
              <p class="desc">${product.detail}</p>
              <p class="desc">${product.anjuran}</p>
    
              <hr />
            </div>
          </div>`;
          }
        }
      }
    })
    .catch((error) => {
      alert(error);
    });
}
loadJson();