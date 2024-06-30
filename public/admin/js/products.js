// Change status
const btnChangeStatuses = document.querySelectorAll("[button-change-status]");
if (btnChangeStatuses.length > 0) {
    const formChangeStatus = document.getElementById("form-change-status");
    const path = formChangeStatus.getAttribute("data-path");

    btnChangeStatuses.forEach((btn) => {
        btn.addEventListener("click", () => {
            const statusCurrent = btn.getAttribute("data-status");
            const id = btn.getAttribute("data-id");

            let statusChange =
                statusCurrent === "active" ? "inactive" : "active";

            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            formChangeStatus.action = action;
            formChangeStatus.submit();
        });
    });
}
// End Change status
