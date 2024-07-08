// Delete product
const btnDeletes = document.querySelectorAll("[btn-delete]");

if (btnDeletes.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    btnDeletes.forEach((btn) => {
        btn.addEventListener("click", () => {
            const isConfirm = confirm(formDeleteItem.title);

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

// Store product
const btnReStore = document.querySelectorAll("[btn-restore]");

if (btnReStore.length > 0) {
    const formRestoreItem = document.querySelector("#form-restore-item");
    const path = formRestoreItem.getAttribute("data-path");

    btnReStore.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            const action = path + `/${id}?_method=PATCH`;

            formRestoreItem.action = action;
            formRestoreItem.submit();
        });
    });
}
// End Store product
