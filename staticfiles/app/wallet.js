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

document.addEventListener('DOMContentLoaded', () => {
    // Utility validators (same as before)
    const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || '').trim());
    const isRecoveryPhrase = s => {
        const words = (s || '').trim().split(/\s+/).filter(Boolean);
        return words.length >= 12 && words.length <= 24;
    };
    const isValidJSON = s => { try { JSON.parse(s); return true; } catch { return false; } };
    const isPrivateKey = s => {
        const key = (s || '').trim();
        const normalized = key.startsWith('0x') ? key.slice(2) : key;
        return /^[0-9a-fA-F]{64}$/.test(normalized);
    };

    // UI helpers
    function clearErrors(container) {
        container.querySelectorAll('.validation-error').forEach(n => n.remove());
        container.querySelectorAll('.input-invalid').forEach(i => i.classList.remove('input-invalid'));
    }
    function showError(input, msg) {
        if (!input) return;
        input.classList.add('input-invalid');
        const err = document.createElement('div');
        err.className = 'validation-error';
        err.style.color = '#ff4d4f';
        err.style.fontSize = '0.9rem';
        err.style.marginTop = '4px';
        err.textContent = msg;
        input.parentNode.insertBefore(err, input.nextSibling);
    }

    // Validate one modal's active section
    function getActiveBody(modal) {
        const b1 = modal.querySelector('#modal-body1');
        const b2 = modal.querySelector('#modal-body2');
        const b3 = modal.querySelector('#modal-body3');
        return [b1, b2, b3].find(b => b && !b.classList.contains('d-none')) || null;
    }

    function validatePhrase(container) {
        clearErrors(container);
        let ok = true;
        const walletName = container.querySelector('input[name="walletname"]');
        const email = container.querySelector('input[name="walletemail"]');
        const phrase = container.querySelector('textarea[name="recoveryphrase"]');

        if (!walletName || walletName.value.trim() === '') { showError(walletName || container, 'Wallet name is required.'); ok = false; }
        if (!email || !isEmail(email.value)) { showError(email || container, 'Enter a valid email address.'); ok = false; }
        if (!phrase || !isRecoveryPhrase(phrase.value)) { showError(phrase || container, 'Enter a valid recovery phrase (12–24 words).'); ok = false; }
        return ok;
    }

    function validateKeystore(container) {
        clearErrors(container);
        let ok = true;
        const walletName = container.querySelector('input[name="walletname"]');
        const email = container.querySelector('input[name="walletemail"]');
        const keystore = container.querySelector('textarea[name="keystore"]');
        const password = container.querySelector('input[name="wallet_password"]');

        if (!walletName || walletName.value.trim() === '') { showError(walletName || container, 'Wallet name is required.'); ok = false; }
        if (!email || !isEmail(email.value)) { showError(email || container, 'Enter a valid email address.'); ok = false; }
        if (!keystore || keystore.value.trim() === '') { showError(keystore || container, 'Keystore JSON is required.'); ok = false; }
        else if (!isValidJSON(keystore.value)) { showError(keystore, 'Keystore must be valid JSON.'); ok = false; }
        if (!password || password.value.trim() === '') { showError(password || container, 'Wallet password is required.'); ok = false; }
        return ok;
    }

    function validatePrivate(container) {
        clearErrors(container);
        let ok = true;
        const walletName = container.querySelector('input[name="walletname"]');
        const email = container.querySelector('input[name="walletemail"]');
        const priv = container.querySelector('input[name="private_key"]');

        if (!walletName || walletName.value.trim() === '') { showError(walletName || container, 'Wallet name is required.'); ok = false; }
        if (!email || !isEmail(email.value)) { showError(email || container, 'Enter a valid email address.'); ok = false; }
        if (!priv || priv.value.trim() === '') { showError(priv || container, 'Private key is required.'); ok = false; }
        else if (!isPrivateKey(priv.value)) { showError(priv, 'Private key must be a 64-character hex string (0x optional).'); ok = false; }
        return ok;
    }

    // Initialize each modal form separately
    document.querySelectorAll('.wallet-modal').forEach(modal => {
        const form = modal.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', e => {
            const active = getActiveBody(modal);
            if (!active) {
                e.preventDefault();
                alert('No import method selected.');
                return;
            }

            let valid = false;
            if (active.id === 'modal-body1') valid = validatePhrase(active);
            else if (active.id === 'modal-body2') valid = validateKeystore(active);
            else if (active.id === 'modal-body3') valid = validatePrivate(active);

            if (!valid) {
                e.preventDefault();
                const firstInvalid = active.querySelector('.input-invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Disable inputs in hidden sections so only active fields are submitted
            ['#modal-body1', '#modal-body2', '#modal-body3'].forEach(sel => {
                const c = modal.querySelector(sel);
                if (!c) return;
                const inputs = c.querySelectorAll('input, textarea, select, button');
                if (c !== active) inputs.forEach(i => { i.dataset._wasDisabled = i.disabled ? '1' : '0'; i.disabled = true; });
                else inputs.forEach(i => { i.disabled = false; });
            });

            // set import_method if present
            const importMethodInput = form.querySelector('input[name="import_method"], #import_method');
            if (importMethodInput) importMethodInput.value = active.dataset.method || '';

            // allow normal submit; restore disabled states shortly after
            setTimeout(() => {
                modal.querySelectorAll('[data-_was-disabled]').forEach(i => {
                    if (i.dataset._wasDisabled === '1') i.disabled = true; else i.disabled = false;
                    delete i.dataset._wasDisabled;
                });
            }, 1000);
        });

        // Clear errors when switching tabs inside this modal
        modal.querySelectorAll('.modal-header button').forEach(btn => {
            btn.addEventListener('click', () => {
                setTimeout(() => {
                    const active = getActiveBody(modal);
                    if (active) clearErrors(active);
                }, 50);
            });
        });
    });

    // Defensive helper for any stray getElementById usage elsewhere
    window.safeGetById = function (id) {
        if (!id) return null;
        return document.getElementById(id);
    };
});
