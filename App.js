async function getLink() {
    const hostRegex = new RegExp(/(.*(\.com|:5000))/)
    let hostUrl = (await browser.tabs.query({currentWindow: true, active: true}))[0].url
    return hostUrl.match(hostRegex)[0]
}

async function tabAction(e, type, username = null) {
    e.preventDefault()
    let getUsername = username || document.querySelector("#username").value
    let url = {url: `${await getLink()}/dev/login?email=${getUsername}@able.co`}
    if (type === "redirect-tab") {
        browser.tabs.update(url)
    } else if (type === "new-tab") {
        browser.tabs.create(url);
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem("link-list-option-saved") === null) {
        localStorage.setItem("link-list-option-saved", "new-tab")
    }
    let savedOption = localStorage.getItem("link-list-option-saved")
    let radioSelected = await document.getElementById(savedOption)
    radioSelected.checked = true
    document.querySelectorAll("input[name=link-option]").forEach(radioOption => {
        radioOption.addEventListener("change", (e) => {
            localStorage.setItem("link-list-option-saved", e.target.value)
        })
    })
    document.querySelector("#new-tab-link").addEventListener("click",
        async (e) => tabAction(e, "new-tab"))
    document.querySelector("#redirect-tab-link").addEventListener("click",
        async (e) => tabAction(e, "redirect-tab"))
    document.querySelectorAll(".link_list__option__click").forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault()
            let username = e.target.text.toLowerCase()
            let tabMode = localStorage.getItem("link-list-option-saved")
            await tabAction(e, tabMode, username)
        })
    })
});