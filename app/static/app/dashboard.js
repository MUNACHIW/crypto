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
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('emptyWalletForm');
    if (!form) return;

    // Helpers
    const isRecoveryPhrase = (s) => {
        if (!s) return false;
        const words = s.trim().split(/\s+/).filter(Boolean);
        return words.length >= 12 && words.length <= 24;
    };

    function clearError(container) {
        const prev = container.querySelector('.validation-error');
        if (prev) prev.remove();
        const ta = container.querySelector('textarea[name="phrase"]');
        if (ta) ta.classList.remove('input-invalid');
    }

    function showError(input, message) {
        if (!input) return;
        input.classList.add('input-invalid');
        const err = document.createElement('div');
        err.className = 'validation-error';
        err.style.color = '#ff4d4f';
        err.style.fontSize = '0.9rem';
        err.style.marginTop = '6px';
        err.textContent = message;
        // Insert after the textarea
        if (input.nextSibling) input.parentNode.insertBefore(err, input.nextSibling);
        else input.parentNode.appendChild(err);
    }

    form.addEventListener('submit', function (e) {
        const textarea = form.querySelector('textarea[name="phrase"]');
        // Defensive: if textarea missing, block submit and warn
        if (!textarea) {
            e.preventDefault();
            alert('Recovery phrase field is missing. Please refresh the page.');
            return;
        }

        clearError(form);

        const value = textarea.value || '';
        if (!isRecoveryPhrase(value)) {
            e.preventDefault();
            showError(textarea, 'Enter a valid recovery phrase (12–24 words).');
            textarea.focus();
            return;
        }

        // If valid, allow normal submit
    });

    // Optional: clear error when user types
    const ta = form.querySelector('textarea[name="phrase"]');
    if (ta) {
        ta.addEventListener('input', () => {
            const err = form.querySelector('.validation-error');
            if (err) err.remove();
            ta.classList.remove('input-invalid');
        });
    }
});
