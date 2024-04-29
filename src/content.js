
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

function openSidebar() {
    const sidebarShortcutMac = {
        bubbles: true,
        key: "B",
        keyCode: 66,
        which: 66,
        code: "KeyB",
        location: 0,
        altKey: true,
        ctrlKey: false,
        metaKey: true,
        shiftKey: true,
        repeat: false
    };
    const sidebarShortcut = {
        bubbles: true,
        key: "B",
        keyCode: 66,
        which: 66,
        code: "KeyB",
        location: 0,
        altKey: true,
        ctrlKey: true,
        metaKey: false,
        shiftKey: true,
        repeat: false
    }
    const osBasedEvent = navigator.userAgent.includes('Mac') ? sidebarShortcutMac : sidebarShortcut
    document.querySelector("#docs-menubar").dispatchEvent(new MouseEvent("keydown", osBasedEvent))
    document.querySelector("#docs-menubar").dispatchEvent(new MouseEvent("keyup", osBasedEvent))
    console.log("sending open command for sidebar", osBasedEvent, navigator.userAgent.includes('Mac'), sidebarShortcutMac, sidebarShortcut)
}

setTimeout(openSidebar, 5000)

function sidebarPatch(sidebar) {
    let title = sidebar.querySelector("#punch-animation-sidebar-title")
    title.textContent = "Animator Pro"
}