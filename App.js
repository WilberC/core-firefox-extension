// document.addEventListener("click", function (e) {
//     if (!e.target.classList.contains("page-choice")) {
//         return;
//     }
//
//     let chosenPage = "https://" + e.target.textContent;
//     browser.tabs.create({
//         url: chosenPage
//     });
//
// });

function redirect(e, username = null) {
    e.preventDefault()
    const formData = new FormData(e.target)
    browser.tabs.create({
        url: `http://0.0.0.0:5000/dev/login?email=${username || formData.get("username")}@able.co`
    });
}

document.addEventListener("submit", (e) => redirect(e))