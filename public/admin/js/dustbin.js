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

// Delete product
const btnDeletes = document.querySelectorAll("[btn-delete]");

if (btnDeletes) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    btnDeletes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm(
                "Bạn có muốn xóa vĩnh viễn sản phẩm này?"
            );

            if (isConfirm) {
                const id = btn.getAttribute("data-id");
                const action = path + `/${id}?_method=DELETE`;

                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        });
    });
}
// EndDelete product
