"use strict";

// cursor
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", changeCursor);

function changeCursor(e) {
  const x = e.clientX + window.scrollX; // Menghitung posisi X dengan offset scroll
  const y = e.clientY + window.scrollY; // Menghitung posisi Y dengan offset scroll

  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;
}
