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
