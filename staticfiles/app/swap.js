// Swap page — coin picker modal (custom open/close, no bootstrap.Modal
// dependency) plus wiring for the From/To coin selectors.

document.addEventListener("DOMContentLoaded", function () {
    let backdropEl = null;
    let activeTarget = null; // "from" or "to"

    function openModal(modalEl) {
        if (!modalEl) return;
        backdropEl = document.createElement("div");
        backdropEl.className = "fade";
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

    function closeModal(modalEl) {
        if (!modalEl) return;
        modalEl.classList.remove("show");
        modalEl.setAttribute("aria-hidden", "true");
        modalEl.removeAttribute("aria-modal");
        if (backdropEl) backdropEl.classList.remove("show");

        setTimeout(function () {
            modalEl.style.display = "none";
            if (backdropEl) { backdropEl.remove(); backdropEl = null; }
            document.body.classList.remove("modal-open");
        }, 150);
    }

    const coinPickerModal = document.getElementById("coinPickerModal");

    document.querySelectorAll(".swap-coin-select").forEach(function (btn) {
        btn.addEventListener("click", function () {
            activeTarget = btn.dataset.target; // "from" | "to"
            openModal(coinPickerModal);
        });
    });

    coinPickerModal.querySelectorAll("[data-modal-close]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            closeModal(coinPickerModal);
        });
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && coinPickerModal.classList.contains("show")) {
            closeModal(coinPickerModal);
        }
    });

    coinPickerModal.querySelectorAll(".swap-coin-option").forEach(function (option) {
        option.addEventListener("click", function () {
            const symbol = option.dataset.symbol;
            const balance = option.dataset.balance;
            const iconHTML = option.querySelector(".swap-coin-option-icon").innerHTML;
            const iconClass = Array.from(option.querySelector(".swap-coin-option-icon").classList)
                .find(function (c) { return c !== "swap-coin-option-icon"; });

            if (activeTarget === "from") {
                document.getElementById("fromCoinLabel").textContent = symbol;
                document.getElementById("fromCoinBalance").textContent = balance;
                document.getElementById("fromCoinInput").value = symbol;
                const iconEl = document.getElementById("fromCoinIcon");
                iconEl.innerHTML = iconHTML;
                iconEl.className = "swap-coin-icon-display " + (iconClass || "");
            } else if (activeTarget === "to") {
                document.getElementById("toCoinLabel").textContent = symbol;
                document.getElementById("toCoinBalance").textContent = balance;
                document.getElementById("toCoinInput").value = symbol;
                const iconEl = document.getElementById("toCoinIcon");
                iconEl.innerHTML = iconHTML;
                iconEl.className = "swap-coin-icon-display " + (iconClass || "");
            }

            closeModal(coinPickerModal);
        });
    });
});