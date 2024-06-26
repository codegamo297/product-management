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
