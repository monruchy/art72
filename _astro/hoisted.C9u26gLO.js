document.addEventListener("click", function(e) {
    e.target.closest(".nav-toggle") && document.querySelector("#head").classList.toggle("active")
}, !1);