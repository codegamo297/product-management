// Validate
const formNeedValidation = document.querySelector(".needs-validation");

if (formNeedValidation) {
    formNeedValidation.addEventListener("submit", (e) => {
        if (!formNeedValidation.checkValidity()) {
            e.preventDefault();
            e.stopPropagation();
        }

        formNeedValidation.classList.add("was-validated");
    });
}
// End Validate

// Countdown
const countdown = document.querySelector("#countdown");

if (countdown) {
    let countdownMinutes = 3;
    let countdownSeconds = 0;
    let isResend = false;

    const resendOTPBtn = document.getElementById("resendOTPBtn");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {
        if (countdownSeconds === 0 && countdownMinutes === 0) {
            clearInterval(timerInterval);
            resendOTPBtn.classList.remove("d-none");

            return;
        }

        if (countdownSeconds === 0) {
            countdownMinutes--;
            countdownSeconds = 59;
        } else {
            countdownSeconds--;
        }

        minutesElement.textContent = String(countdownMinutes).padStart(2, "0");
        secondsElement.textContent = String(countdownSeconds).padStart(2, "0");
    }

    resendOTPBtn.addEventListener("click", async () => {
        const email = document.getElementById("email").value;

        try {
            const formData = new URLSearchParams();
            formData.append("email", email);

            if (!isResend) {
                const response = await fetch(`/user/password/forgot`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData.toString(),
                });

                if (response.ok) isResend = true;
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    const timerInterval = setInterval(updateCountdown, 1000);
}

// End Countdown
