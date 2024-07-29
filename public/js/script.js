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

// Top act search
// const topActSearch = document.querySelector(".top-act__search");

// if (topActSearch) {
//     const input = topActSearch.querySelector("input");
//     const separate = topActSearch.querySelector(".top-act__separate");

//     if (input.value) {
//         input.style.display = "block";
//         separate.style.opacity = "1";
//     }

//     input.addEventListener("focus", (e) => {
//         input.style.display = "block";
//         separate.style.opacity = "1";
//     });

//     input.addEventListener("blur", (e) => {
//         if (!e.target.value) {
//             input.style.removeProperty("display");
//             separate.style.removeProperty("opacity");
//         }
//     });

//     input.addEventListener("change", (e) => {
//         if (e.target.value) {
//             input.style.display = "block";
//         } else {
//             input.style.removeProperty("display");
//         }
//     });
// }
