
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
    document.querySelector("#docs-menubar").dispatchEvent(new KeyboardEvent("keydown", osBasedEvent))
    document.querySelector("#docs-menubar").dispatchEvent(new KeyboardEvent("keyup", osBasedEvent))
    console.log("sending open command for sidebar", osBasedEvent, navigator.userAgent.includes('Mac'), sidebarShortcutMac, sidebarShortcut)

    // setTimeout(runClick, 2000)
}



// setTimeout(openSidebar, 3000)

function runClick(el) {
    // console.log(el)
    // el = document.querySelector(".punch-sidebar-tile-delete")
    let t = el.getBoundingClientRect();
    const x = window.screenX + t.left;
    const y = window.screenY + t.top

    downEvent = new MouseEvent("mousedown", {
        view: window,
        bubbles: true,
        cancelable: false,
        screenX: x,
        screenY: y
    })
    upEvent = new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: false,
        screenX: x,
        screenY: y
    })
    let point = document.elementFromPoint(x, y)
    if (!x && !y && point !== el) {
        console.log("Abort click, element not visible.", x, y, point, el)
        return false
    }
    // point.dispatchEvent(downEvent)
    // point.dispatchEvent(upEvent)
    el.dispatchEvent(downEvent)
    el.dispatchEvent(upEvent)
    console.log("Element clicked.", x, y, point)
}

function sidebarPatch(sidebar) {
    let title = sidebar.querySelector("#punch-animation-sidebar-title")
    title.textContent = "Animator Pro"
}

async function openFormatOptions() {
    const menuMore = document.querySelector("#moreButton")
    if (menuMore.getAttribute("aria-hidden") === "false") {
        runClick(menuMore)
    }
    runClick(document.querySelector("#formatOptionsButton"))
    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile > .docs-sidebar-tile-header.goog-zippy-collapsed")?.click()
    // await new Promise((res) => { setTimeout(res, 3000) })
}

function getFormatPosition() {

    return [Number(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input input").value), Number(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input input").value)]
}

function duplicateElement() {
    const duplicateShortcutMac = {
        bubbles: true,
        key: "D",
        keyCode: 68,
        which: 68,
        code: "KeyD",
        location: 0,
        altKey: false,
        ctrlKey: false,
        metaKey: true,
        shiftKey: false,
        repeat: false
    };
    const duplicateShortcut = {
        bubbles: true,
        key: "D",
        keyCode: 68,
        which: 68,
        code: "KeyD",
        location: 0,
        altKey: false,
        ctrlKey: true,
        metaKey: false,
        shiftKey: false,
        repeat: false
    }
    const osBasedEvent = navigator.userAgent.includes('Mac') ? duplicateShortcutMac : duplicateShortcut
    document.querySelector("#docs-editor").dispatchEvent(new KeyboardEvent("keydown", osBasedEvent))
    document.querySelector("#docs-editor").dispatchEvent(new KeyboardEvent("keyup", osBasedEvent))
    console.log("sending duplicate command for element")

}

async function setFormatPosition(Pos) {
    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input input").value = (Pos[0] + 0.1).toString()
    runClick(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input .docs-number-input-down-button"))
    await new Promise((res) => { setTimeout(res, 200) })

    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input input").value = (Pos[1] + 0.1).toString()
    runClick(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input .docs-number-input-down-button"))
    await new Promise((res) => { setTimeout(res, 200) })
}

function interpolateCoordinates(coordsList, numCoords) {
    const result = [];
    for (let i = 0; i < coordsList.length - 1; i++) {
        const [x1, y1] = coordsList[i];
        const [x2, y2] = coordsList[i + 1];
        const deltaX = (x2 - x1) / (numCoords + 1);
        const deltaY = (y2 - y1) / (numCoords + 1);
        for (let j = 0; j <= numCoords; j++) {
            const newX = x1 + j * deltaX;
            const newY = y1 + j * deltaY;
            result.push([newX, newY]);
        }
    }
    return result;
}



let _State = 0
let Pos1 = []
let Pos2 = []

chrome.runtime.onMessage.addListener(async (message) => {
    console.log(message)
    const command = message.animatorCommand
    if (command) {
        await openFormatOptions()

        if (command === "init") {
            Pos1 = getFormatPosition()
        } else if (command === "finish") {
            if (!Pos1) return alert("No Pos 1")
            Pos2 = getFormatPosition()

            // const MidPos = [Math.round((Pos2[0] + Pos1[0]) / 2), Math.round((Pos2[1] + Pos1[1]) / 2)]
            console.log("Start", Pos1, "End", Pos2)
            let interpolatedCoords = interpolateCoordinates([Pos1, Pos2], 50)
            console.log(interpolatedCoords)
            for (let i = 0; i < interpolatedCoords.length; ++i) {
                duplicateElement()
                await setFormatPosition(interpolatedCoords[i])
            }
        }
    }
})