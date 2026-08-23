// Modal open/close — fully custom (no bootstrap.Modal dependency).
// "Connect A Wallet" closes the first modal and opens a second, empty one.

document.addEventListener("DOMContentLoaded", function () {
    let backdropEl = null;

    function openModal(modalEl) {
        if (!modalEl) return;
        backdropEl = document.createElement("div");
        backdropEl.className = " fade";
        document.body.appendChild(backdropEl);
        void backdropEl.offsetWidth;
        backdropEl.classList.add("show");

        modalEl.style.display = "block";
        modalEl.removeAttribute("aria-hidden");
        modalEl.setAttribute("aria-modal", "true");
        void modalEl.offsetWidth;
        modalEl.classList.add("show");

        document.body.classList.add("modal-open");
        backdropEl.addEventListener("click", function () { closeModal(modalEl); });
    }

    function closeModal(modalEl, onDone) {
        if (!modalEl) { if (onDone) onDone(); return; }
        modalEl.classList.remove("show");
        modalEl.setAttribute("aria-hidden", "true");
        modalEl.removeAttribute("aria-modal");
        if (backdropEl) backdropEl.classList.remove("show");

        setTimeout(function () {
            modalEl.style.display = "none";
            if (backdropEl) { backdropEl.remove(); backdropEl = null; }
            document.body.classList.remove("modal-open");
            if (onDone) onDone();
        }, 150);
    }

    function getOpenModal() {
        return document.querySelector(".wallet-modal.show");
    }

    document.querySelectorAll("[data-modal-open]").forEach(function (trigger) {
        trigger.addEventListener("click", function () {
            openModal(document.getElementById(trigger.dataset.modalOpen));
        });
    });

    document.querySelectorAll(".wallet-modal [data-modal-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            closeModal(btn.closest(".wallet-modal"));
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            const open = getOpenModal();
            if (open) closeModal(open);
        }
    });

    // "Connect A Wallet" — close the first modal, then open the second
    // (currently empty) modal once the close transition finishes.
    const connectBtn = document.getElementById("connectAWalletBtn");
    if (connectBtn) {
        connectBtn.addEventListener("click", function () {
            const first = document.getElementById("connectWalletModal");
            const second = document.getElementById("emptyWalletModal");
            closeModal(first, function () {
                openModal(second);
            });
        });
    }

    // --- Category filters (wallet chooser grid, if present) ---
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