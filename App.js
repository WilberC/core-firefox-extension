async function getLink() {
    const hostRegex = new RegExp(/(.*(\.com|:5000))/)
    await chrome.tabs.query({currentWindow: true, active: true}, (data) => {
        const url = data[0].url
        localStorage.setItem("domain-link", url.match(hostRegex)[0])
    })
}

async function formatUrl(username) {
    let cleanUsername = username.replace(/\n/g, '').trim()
    return `${localStorage.getItem("domain-link")}/dev/login?email=${cleanUsername}@able.co`
}

async function tabAction(e, type, username = null) {
    e.preventDefault()
    let getUsername = username || document.querySelector("#username").value
    if (type === "save-link") {
        await saveUser(getUsername)
        return;
    }
    let url = {url: await formatUrl(getUsername)}
    console.log(url)
    if (type === "redirect-tab") {
        chrome.tabs.update(url)
    } else if (type === "new-tab") {
        chrome.tabs.create(url);
    }
}

function loadTabOption() {
    if (localStorage.getItem("link-list-option-saved") === null) {
        localStorage.setItem("link-list-option-saved", "new-tab")
    }
    let savedOption = localStorage.getItem("link-list-option-saved")
    let radioSelected = document.getElementById(savedOption)
    radioSelected.checked = true
}

async function deleteUser(username) {
    let user = loadUsers()
    localStorage.setItem("users", JSON.stringify(user.filter(userName => userName !== username)))
    await renderUserList()
}

async function saveUser(username) {
    let user = loadUsers()
    user.push(username)
    localStorage.setItem("users", JSON.stringify(user))
    await renderUserList()
}

function loadUsers() {
    if (localStorage.getItem("users") === null) {
        localStorage.setItem("users", JSON.stringify([]))
    }
    return JSON.parse(localStorage.getItem("users"))
}

async function renderUserList() {
    let users = loadUsers()
    const linkList = document.querySelector(".link_list")
    linkList.innerHTML = ""
    linkList.innerHTML = users.map(
        user => `<li class="link_list__option">
                <a class="link_list__option__click">
                    ${user}
                </a>
                <button class="delete_link" data-user="${user}">
                    delete
                </button>
             </li>
            `).join("")

    document.querySelectorAll(".link_list__option__click").forEach(link => {
        link.addEventListener("click", async (e) => {
            e.preventDefault()
            let username = e.target.text.toLowerCase()
            let tabMode = localStorage.getItem("link-list-option-saved")
            await tabAction(e, tabMode, username)
        })
    })

    document.querySelectorAll(".delete_link").forEach(deleteBtn => {
        deleteBtn.addEventListener("click", async (e) => {
            e.preventDefault()
            await deleteUser(e.target.dataset.user.toLowerCase())
        })
    })
}

async function loadFormOptions() {
    document.querySelectorAll("input[name=link-option]").forEach(radioOption => {
        radioOption.addEventListener("change", (e) => {
            localStorage.setItem("link-list-option-saved", e.target.value)
        })
    })

    document.querySelector("#new-tab-link").addEventListener("click",
        async (e) => tabAction(e, "new-tab"))

    document.querySelector("#redirect-tab-link").addEventListener("click",
        async (e) => tabAction(e, "redirect-tab"))

    document.querySelector("#save-link").addEventListener("click",
        async (e) => tabAction(e, "save-link"))
}


window.addEventListener('DOMContentLoaded', async () => {
    try {
        loadTabOption()
        await getLink()
        await loadFormOptions()
        await renderUserList()
    } catch {
        console.log("loading ...")
    }
});