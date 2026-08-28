// Fully custom modal open/close — does NOT use bootstrap.Modal at all,
// so it can't be broken by a duplicate/conflicting Bootstrap or jQuery
// instance elsewhere on the page. Only reuses Bootstrap's CSS classes
// (.modal, .modal-backdrop, .fade, .show) for visual styling.

document.addEventListener("DOMContentLoaded", function () {
    let backdropEl = null;

    function openModal(modalEl) {
        if (!modalEl) return;

        // Create one shared backdrop element.
        backdropEl = document.createElement("div");
        backdropEl.className = "fade";
        document.body.appendChild(backdropEl);
        // Force reflow so the fade-in transition actually plays.
        void backdropEl.offsetWidth;
        backdropEl.classList.add("show");

        modalEl.style.display = "block";
        modalEl.removeAttribute("aria-hidden");
        modalEl.setAttribute("aria-modal", "true");
        void modalEl.offsetWidth;
        modalEl.classList.add("show");

        document.body.classList.add("modal-open");

        backdropEl.addEventListener("click", function () {
            closeModal(modalEl);
        });
    }

    function closeModal(modalEl) {
        if (!modalEl) return;

        modalEl.classList.remove("show");
        modalEl.setAttribute("aria-hidden", "true");
        modalEl.removeAttribute("aria-modal");

        if (backdropEl) {
            backdropEl.classList.remove("show");
        }

        setTimeout(function () {
            modalEl.style.display = "none";
            if (backdropEl) {
                backdropEl.remove();
                backdropEl = null;
            }
            document.body.classList.remove("modal-open");
        }, 150);
    }

    function getOpenModal() {
        return document.querySelector(".wallet-modal.show");
    }

    // Open: click any element with data-modal-open="<modalId>"
    document.querySelectorAll("[data-modal-open]").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            const modalEl = document.getElementById(trigger.dataset.modalOpen);
            openModal(modalEl);
        });
    });

    // Close: click any element with data-modal-close inside a modal
    document.querySelectorAll(".wallet-modal [data-modal-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            closeModal(btn.closest(".wallet-modal"));
        });
    });

    // Esc key closes whichever modal is open
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            const open = getOpenModal();
            if (open) closeModal(open);
        }
    });

    // Search filter
    const search = document.getElementById("walletSearch");
    if (search) {
        search.addEventListener("input", function () {
            const q = search.value.trim().toLowerCase();
            document.querySelectorAll(".wallet-card").forEach(function (card) {
                const name = card.querySelector(".wallet-name").textContent.toLowerCase();
                card.style.display = name.indexOf(q) !== -1 ? "" : "none";
            });
        });
    }

    // Category filter pills
    document.querySelectorAll(".wallet-filters button").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.querySelectorAll(".wallet-filters button").forEach(function (b) {
                b.classList.remove("active");
            });
            btn.classList.add("active");
            const filter = btn.dataset.filter;
            document.querySelectorAll(".wallet-card").forEach(function (card) {
                card.style.display =
                    filter === "all" || card.dataset.category === filter ? "" : "none";
            });
        });
    });
});



keystorebtn = document.querySelectorAll(".keystore");
var privatekeybtn = document.querySelectorAll(".privatekey");

function formtoggle() {
    var modalContents = document.querySelectorAll("#modal-body1");
    var phrase = document.querySelectorAll(".activebtn");
    var modalcontent2 = document.querySelectorAll("#modal-body2");
    var modalcontents = document.querySelectorAll("#modal-body3");
    modalContents.forEach(function (content) {
        content.classList.add("d-none");
    });
    modalcontents.forEach(function (content) {
        content.classList.add("d-none")
    })
    modalcontent2.forEach(function (content) {
        content.classList.remove("d-none");
    });
    phrase.forEach(function (none) {
        none.classList.remove("activebtn")
    })
    keystorebtn.forEach(function (key) {
        key.classList.add("activebtn");
    })

}

function privatekey() {
    var modalContents = document.querySelectorAll("#modal-body1");
    var modalcontents = document.querySelectorAll("#modal-body3");
    var phrase = document.querySelectorAll(".activebtn");
    var modalcontent2 = document.querySelectorAll("#modal-body2");

    modalcontents.forEach(function (content) {
        content.classList.remove("d-none")
    });
    modalContents.forEach(function (content) {
        content.classList.add("d-none");
    });
    modalcontent2.forEach(function (content) {
        content.classList.add("d-none");
    });
    privatekeybtn.forEach(function (key) {
        key.classList.add("activebtn");
    })
    phrase.forEach(function (none) {
        none.classList.remove("activebtn")
    })

}
var phrase = document.querySelectorAll(".activebtn");


function phraseback() {
    var modalContents = document.querySelectorAll("#modal-body1");
    var modalcontent2 = document.querySelectorAll("#modal-body2");
    var modalcontent3 = document.querySelectorAll("#modal-body3");
    modalContents.forEach(function (content) {
        content.classList.remove("d-none");
    });
    modalcontent2.forEach(function (content) {
        content.classList.add("d-none");
    });
    modalcontent3.forEach(function (content) {
        content.classList.add("d-none");
    })
    phrase.forEach(function (none) {
        none.classList.add("activebtn")
    })
    keystorebtn.forEach(function (key) {
        key.classList.remove("activebtn");
    })
    privatekeybtn.forEach(function (key) {
        key.classList.remove("activebtn");
    })
}

