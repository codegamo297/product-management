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

// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkAll']");
    const inputIds = checkboxMulti.querySelectorAll("input[name='id']");
    const inputsArray = Array.from(inputIds);

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputIds.forEach((input) => {
                input.checked = true;
            });
        } else {
            inputIds.forEach((input) => {
                input.checked = false;
            });
        }
    });

    inputIds.forEach((input) => {
        input.addEventListener("click", () => {
            if (
                inputIds.length ===
                inputsArray.filter((input) => input.checked).length
            ) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox multi

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
    const btnSubmit = formChangeMulti.querySelector("button[type='submit']");

    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );
        const inputIds = formChangeMulti.querySelector("input[name='ids']");

        if (inputsChecked.length > 0) {
            // btnSubmit.removeAttribute("disabled");

            let ids = [];

            inputsChecked.forEach((input) => {
                const id = input.value;
                ids.push(id);
            });
            inputIds.value = ids.join(",");

            formChangeMulti.submit();
        } else {
            // btnSubmit.setAttribute("disabled", "disabled");
            alert("Cần chọn ít nhất một bản ghi");
        }
    });
}
// End Form change multi
