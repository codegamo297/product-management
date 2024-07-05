// Button status
const btnStatuses = document.querySelectorAll("[button-status]");

if (btnStatuses.length > 0) {
    let url = new URL(window.location.href);

    btnStatuses.forEach((btn) => {
        btn.addEventListener("click", () => {
            const status = btn.getAttribute("button-status");

            status
                ? url.searchParams.set("status", status)
                : url.searchParams.delete("status");

            window.location.href = url.href;
        });
    });
}
// End Button status

// Form search
const formSearch = document.querySelector("#form-search");

if (formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();

        const keyword = e.target.elements.keyword.value.trim();

        keyword
            ? url.searchParams.set("keyword", keyword)
            : url.searchParams.delete("keyword");

        window.location.href = url;
    });
}
// End Form search

// Btn pagination
const btnPaginates = document.querySelectorAll("[button-pagination]");

if (btnPaginates.length > 0) {
    let url = new URL(window.location.href);

    btnPaginates.forEach((btn) => {
        btn.addEventListener("click", () => {
            url.searchParams.set("page", btn.getAttribute("button-pagination"));
            window.location.href = url.href;
        });
    });
}
// End Btn pagination

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );
        const inputIds = formChangeMulti.querySelector("input[name='ids']");
        const typeChange = e.target.elements.type.value;

        if (typeChange === "delete-all") {
            const isConfirm = confirm(
                "Bạn có chắc muốn xóa những sản phẩm này không?"
            );

            if (!isConfirm) return;
        }

        if (inputsChecked.length > 0) {
            let ids = [];

            inputsChecked.forEach((input) => {
                const id = input.value;

                if (typeChange === "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']").value;

                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });
            inputIds.value = ids.join(",");

            formChangeMulti.submit();
        } else {
            alert("Cần chọn ít nhất một bản ghi");
        }
    });
}
// End Form change multi

// Show alert
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = document.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}

// End Show alert

// Upload preview image
const uploadImage = document.querySelector("[upload-image]");

if (uploadImage) {
    const uploadInputImage = uploadImage.querySelector(
        "input[upload-image-input]"
    );
    const wrapPreview = uploadImage.querySelector(".wrap-preview");
    const uploadImagePreview = uploadImage.querySelector(
        "[upload-image-preview]"
    );
    const btnCloseImage = uploadImage.querySelector(".close-image");

    uploadInputImage.addEventListener("change", (e) => {
        const [file] = e.target.files;

        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            wrapPreview.classList.remove("d-none");
        }
    });

    btnCloseImage.addEventListener("click", () => {
        uploadImagePreview.src = "";
        wrapPreview.classList.add("d-none");
        uploadInputImage.value = "";
        uploadInputImage.setAttribute("required", "required");
    });

    if (uploadImagePreview.getAttribute("src")) {
        uploadInputImage.removeAttribute("required");
    }
}
// End Upload preview image

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

// Sort
const sort = document.querySelector("[sort]");

if (sort) {
    const sortSelect = sort.querySelector("select[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    let url = new URL(window.location.href);

    sortSelect.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("-");

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);
        window.location.href = url.href;
    });

    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");
        window.location.href = url.href;
    });

    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if (sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(
            `option[value=${stringSort}]`
        );

        optionSelected.selected = true;
    }
}
// End Sort
