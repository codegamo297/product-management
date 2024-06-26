// Button status
const btnStatus = document.querySelectorAll("[button-status]");

if (btnStatus.length > 0) {
    let url = new URL(window.location.href);

    btnStatus.forEach((btn) => {
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
