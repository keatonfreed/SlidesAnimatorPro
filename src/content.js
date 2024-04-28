
console.log("Slides Animator Pro: Loaded")

document.querySelector("div")

const motionPanelCallback = (mutations, observer) => {
    for (mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes?.length) {
            let added = Array.from(mutation.addedNodes)
            let sidebar = added?.find((el) => el.classList.contains("punch-animation-sidebar"))
            if (sidebar) {
                console.log("Found Motion Pane", sidebar)
                sidebarPatch(sidebar)
            }
        }
    }
}

const motionPanelConfig = { attributes: false, childList: true, subtree: false };

const motionPanelObserver = new MutationObserver(motionPanelCallback);

motionPanelObserver.observe(document.body, motionPanelConfig)


function sidebarPatch(sidebar) {
    let title = sidebar.querySelector("#punch-animation-sidebar-title")
    title.textContent = "Animator Pro"
}