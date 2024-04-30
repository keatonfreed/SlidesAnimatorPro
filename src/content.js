
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

function getOSShortcut(key, ctrl, shift, alt, override) {
    const shortcutMac = {
        bubbles: true,
        key: key,
        keyCode: override || key.charCodeAt(0),
        which: override || key.charCodeAt(0),
        code: override ? key : "Key" + key,
        location: 0,
        altKey: !!alt,
        ctrlKey: false,
        metaKey: !!ctrl,
        shiftKey: !!shift,
        repeat: false
    };
    const shortcut = {
        bubbles: true,
        key: key,
        keyCode: override || key.charCodeAt(0),
        which: override || key.charCodeAt(0),
        code: override ? key : "Key" + key,
        location: 0,
        altKey: !!alt,
        ctrlKey: !!ctrl,
        metaKey: false,
        shiftKey: !!shift,
        repeat: false
    }
    return navigator.userAgent.includes('Mac') ? shortcutMac : shortcut
}

function openAnimSidebar() {
    if (document.querySelector(".punch-animation-sidebar") && document.querySelector(".punch-animation-sidebar").style.display !== "none") return
    const osBasedEvent = getOSShortcut("B", true, true, true)
    document.querySelector("#docs-menubar").dispatchEvent(new KeyboardEvent("keydown", osBasedEvent))
    document.querySelector("#docs-menubar").dispatchEvent(new KeyboardEvent("keyup", osBasedEvent))
    console.log("sending open command for sidebar", osBasedEvent, navigator.userAgent.includes('Mac'))
}

function runClick(el, onClick) {
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
    if (onClick) {
        point.dispatchEvent(downEvent)
        point.dispatchEvent(upEvent)
    } else {
        el.dispatchEvent(downEvent)
        el.dispatchEvent(upEvent)
    }
    console.log("Element clicked.", x, y, point)
}

function sidebarPatch(sidebar) {
    let title = sidebar.querySelector("#punch-animation-sidebar-title")
    title.textContent = "Animator Pro"
}

async function openFormatOptions() {
    if (document.querySelector(".docs-tiled-sidebar") && document.querySelector(".docs-tiled-sidebar").style.display !== "none") return

    const menuMore = document.querySelector("#moreButton")
    if (menuMore.getAttribute("aria-hidden") === "false") {
        runClick(menuMore)
    }

    let formatButton = document.querySelector("#formatOptionsButton").style.display !== "none" ? document.querySelector("#formatOptionsButton") : document.querySelector("#animationButton")
    runClick(formatButton)
    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile > .docs-sidebar-tile-header.goog-zippy-collapsed")?.click()
    // await new Promise((res) => { setTimeout(res, 3000) })
}

function getFormatPosition() {

    return [Number(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input input").value), Number(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input input").value)]
}

function duplicateElement() {
    const osBasedEvent = getOSShortcut("D", true, false, false)
    document.querySelector("#docs-editor").dispatchEvent(new KeyboardEvent("keydown", osBasedEvent))
    document.querySelector("#docs-editor").dispatchEvent(new KeyboardEvent("keyup", osBasedEvent))
    console.log("sending duplicate command for element", osBasedEvent)

}

async function setFormatPosition(Pos) {
    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input input").value = (Pos[0] + 0.1).toString()
    runClick(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-x-input .docs-number-input-down-button"))
    await new Promise((res) => { setTimeout(res, 200) })

    document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input input").value = (Pos[1] + 0.1).toString()
    runClick(document.querySelector(".docs-sidebar-tile.sketchy-format-options-position-tile .sketchy-position-y-input .docs-number-input-down-button"))
    await new Promise((res) => { setTimeout(res, 200) })
}

function selectDropdown(dropdownEl, option) {
    // console.log(dropdownEl)
    runClick(dropdownEl)
    let dropdownPreSelected = document.getElementById(dropdownEl.getAttribute("aria-owns"))
    // console.log(dropdown, latestAnimtype.getAttribute("aria-owns"))
    let dropdownOptions = dropdownPreSelected.parentElement.childNodes
    // console.log(dropdownOptions)
    let optionButton = Array.from(dropdownOptions)?.find(option)
    // console.log(optionButton)
    runClick(optionButton)
    runClick(optionButton)
}

async function addAnimation(animType, animStart) {
    openAnimSidebar()
    runClick(document.querySelector(".punch-animation-sidebar-add"))
    let latestAnim = document.querySelector(".punch-animation-sidebar-tile-container .punch-sidebar-tile:last-child")
    selectDropdown(latestAnim.querySelector(".punch-sidebar-tile-options .punch-sidebar-tile-type-select[title='Animation type']"), (el) => el.firstChild.textContent === animType)
    // await sleep(1000)
    selectDropdown(latestAnim.querySelector(".punch-sidebar-tile-options .punch-sidebar-tile-type-select[title='Start condition']"), (el) => el.firstChild.textContent === animStart)
}

async function focusEditor() {

    // await sleep(3000)
    let selectedPath = document.querySelector(`#pages g>g>path[stroke="#8ab4f8"][stroke-opacity="0.6"]`)
    // console.log("SELECTED", selectedPath)
    runClick(selectedPath)
}

function interpolateCoordinates(coordsList, numCoords) {
    const result = [];
    for (let i = 0; i < coordsList.length - 1; i++) {
        const [x1, y1] = coordsList[i];
        const [x2, y2] = coordsList[i + 1];
        const deltaX = (x2 - x1) / (numCoords + 1);
        const deltaY = (y2 - y1) / (numCoords + 1);
        for (let j = 1; j <= numCoords; j++) {
            const newX = x1 + j * deltaX;
            const newY = y1 + j * deltaY;
            result.push([newX, newY]);
        }
        result.push(coordsList[i + 1]);
    }
    return result;
}

function sleep(time) {
    return new Promise((res) => { setTimeout(res, time) })
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
            let interpolatedCoords = interpolateCoordinates([Pos1, Pos2], 3)
            console.log(interpolatedCoords)

            await focusEditor()
            // await sleep(5000)
            // return
            // copyElement()
            // duplicateElement()
            // return
            await setFormatPosition(Pos1)
            addAnimation("Zoom out", "On click")
            // await sleep(1000)

            for (let i = 0; i < interpolatedCoords.length; i += 1) {
                await focusEditor()
                // await sleep(5000)

                openFormatOptions()
                duplicateElement()
                // await sleep(1000)
                await setFormatPosition(interpolatedCoords[i])

                // await sleep(3000)
                await addAnimation("Fade in", "With previous")
                await sleep(600)
                if (i !== interpolatedCoords.length - 1) {
                    await addAnimation("Zoom out", "After previous")
                }
                // await sleep(3000)
            }
        }
    }
})