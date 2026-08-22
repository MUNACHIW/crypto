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
        backdropEl.className = "modal-backdrop fade";
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