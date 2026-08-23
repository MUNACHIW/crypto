document.addEventListener("DOMContentLoaded", function () {
    const amountInput = document.getElementById("rechargeAmount");
    const clearBtn = document.getElementById("rechargeClearBtn");
    const quickButtons = document.querySelectorAll(".recharge-quick-btn");

    function setActiveQuickButton(amount) {
        quickButtons.forEach(function (btn) {
            btn.classList.toggle("active", btn.dataset.amount === String(amount));
        });
    }

    quickButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            amountInput.value = btn.dataset.amount;
            setActiveQuickButton(btn.dataset.amount);
            amountInput.focus();
        });
    });

    amountInput.addEventListener("input", function () {
        setActiveQuickButton(amountInput.value);
    });

    clearBtn.addEventListener("click", function () {
        amountInput.value = "";
        setActiveQuickButton(null);
        amountInput.focus();
    });
});