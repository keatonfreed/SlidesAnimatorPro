
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

async function openAnimatorMenu() {
    openAnimSidebar()
    if (document.querySelector(".punch-animation-sidebar-add-section").firstChild.classList.contains("goog-flat-button-disabled")) return

    if (!animProMenu) {
        await sleep(200)
    }
    document.querySelector(".punch-animation-sidebar-scroll").style.display = "none"
    animProMenu.style.display = "block"
}

let overlay, overlayText
function setOverlay(active, current) {
    console.log("OVERLAY", active, current, overlay)
    if (!document.querySelector(".slides-animator-pro-overlay")) {
        overlay = document.createElement("div")
        overlay.className = "slides-animator-pro-overlay"
        overlayText = document.createElement("h1")
        overlayText.textContent = `Generating: 0/0`
        overlay.appendChild(overlayText)
        document.body.appendChild(overlay)
    }
    if (active) {
        overlay.style.display = "flex"
        overlay.style.opacity = 1
        overlayText.textContent = `Generating: ${current}/${AnimAmount}`
    } else {
        overlay.style.opacity = 0
        overlay.style.display = "none"
    }
}

let animProMenu, animProMenuAmtTip, animProMenuAmount
function sidebarPatch(sidebar) {
    let title = sidebar.querySelector("#punch-animation-sidebar-title")
    title.textContent = "Animator Pro"

    let addBar = document.querySelector(".punch-animation-sidebar-controls .punch-animation-sidebar-add-section")
    let newButton = document.createElement("button")
    newButton.className = "goog-inline-block jfk-button jfk-button-standard goog-flat-button punch-animation-sidebar-add slides-animator-pro-add"
    addBar.appendChild(newButton)
    let addSVG = document.createElement("svg")
    newButton.appendChild(addSVG)
    addSVG.outerHTML = `<svg class="punch-animation-sidebar-add-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 10H10V15h-2V10H3v-2h5V3h2v5H15v1.5z" fill="#f29900"></path></svg>`
    let newButtonText = document.createElement("div")
    newButtonText.textContent = "Animator Pro Animation"
    newButtonText.className = "punch-animation-sidebar-add-text"
    newButton.appendChild(newButtonText)

    animProMenu = document.createElement("div")
    animProMenu.className = "slides-animator-pro-menu"
    animProMenu.style.display = "none"
    document.querySelector(".punch-animation-sidebar").appendChild(animProMenu)

    let animProMenuHeader = document.createElement("div")
    animProMenuHeader.className = "slides-animator-pro-menu-header"
    animProMenu.appendChild(animProMenuHeader)

    let animProMenuBack = document.createElement("button")
    animProMenuBack.onclick = () => {
        document.querySelector(".punch-animation-sidebar-scroll").style.display = "block"
        animProMenu.style.display = "none"
    }
    animProMenuBack.textContent = "Back"
    animProMenuHeader.appendChild(animProMenuBack)

    let animProMenuTitle = document.createElement("h1")
    animProMenuTitle.textContent = "New - Pro Animation"
    animProMenuHeader.appendChild(animProMenuTitle)


    let animProMenuStartTip = document.createElement("h1")
    animProMenuStartTip.textContent = `Start`
    animProMenu.appendChild(animProMenuStartTip)

    let animProMenuStart = document.createElement("button")
    animProMenuStart.textContent = "Reset"
    animProMenu.appendChild(animProMenuStart)
    animProMenuStart.onclick = (e) => {
        initAnim()
    }

    animProMenuAmtTip = document.createElement("h1")
    animProMenuAmtTip.textContent = `Amount (${AnimAmount})`
    animProMenu.appendChild(animProMenuAmtTip)

    animProMenuAmount = document.createElement("input")
    animProMenuAmount.type = "range"
    animProMenuAmount.min = 0
    animProMenuAmount.max = 30
    animProMenuAmount.value = AnimAmount
    animProMenuAmount.oninput = (e) => {
        AnimAmount = Number(e.target.value) || 0
        animProMenuAmtTip.textContent = `Amount (${AnimAmount})`
    }
    animProMenu.appendChild(animProMenuAmount)

    let animProMenuRun = document.createElement("button")
    animProMenuRun.textContent = "Generate"
    animProMenu.appendChild(animProMenuRun)
    animProMenuRun.onclick = (e) => {
        generateAnim()
    }


    newButton.onclick = openAnimatorMenu
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

async function addAnimation(animType, animStart, time) {
    openAnimSidebar()
    runClick(document.querySelector(".punch-animation-sidebar-add"))
    let latestAnim = document.querySelector(".punch-animation-sidebar-tile-container .punch-sidebar-tile:last-child")
    selectDropdown(latestAnim.querySelector(".punch-sidebar-tile-options .punch-sidebar-tile-type-select[title='Animation type']"), (el) => el.firstChild.textContent === animType)
    // await sleep(1000)
    selectDropdown(latestAnim.querySelector(".punch-sidebar-tile-options .punch-sidebar-tile-type-select[title='Start condition']"), (el) => el.firstChild.textContent === animStart)

    if (time) {
        // await sleep(550)
        let slider = latestAnim.querySelector(".docs-material-slider.docs-material-slider-horizontal")
        let tooltip = slider.querySelector(".jfk-tooltip")
        for (let i = 0; i < 10; i++) {
            let prev = Number(tooltip.textContent.slice(0, 3))
            // console.log(tooltip.textContent, tooltip.textContent.slice(0, 3), prev, time.toFixed(1), time.toFixed(1) > prev)
            if (time.toFixed(1) > prev) {
                slider.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", keyCode: 37 }))
                slider.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowLeft", keyCode: 37 }))
            } else {
                slider.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", keyCode: 39 }))
                slider.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowRight", keyCode: 39 }))
            }
            // await sleep(50)
            if (tooltip.textContent === `${time.toFixed(1)} seconds`) {
                break
            }
        }
        await sleep(500)
    }
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

async function initAnim() {

    await openFormatOptions()
    Pos1 = getFormatPosition()
    await openAnimatorMenu()
}
async function endAnim() {
    await openFormatOptions()
    Pos2 = getFormatPosition()
    await openAnimatorMenu()
}
async function generateAnim() {
    if (!Pos1.length || !Pos2.length) return alert("Start or end position missing!")

    // const MidPos = [Math.round((Pos2[0] + Pos1[0]) / 2), Math.round((Pos2[1] + Pos1[1]) / 2)]
    console.log("Start", Pos1, "End", Pos2)
    let interpolatedCoords = interpolateCoordinates([Pos1, Pos2], AnimAmount)
    console.log(interpolatedCoords)

    setOverlay(true, 0)
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
        setOverlay(true, i)
        await focusEditor()
        // await sleep(5000)

        openFormatOptions()
        duplicateElement()
        // await sleep(1000)
        await setFormatPosition(interpolatedCoords[i])

        // await sleep(3000)
        await addAnimation("Appear", "With previous",)
        if (i !== interpolatedCoords.length - 1) {
            await addAnimation("Zoom out", "After previous", 0.1)
        }
        // await sleep(3000)
    }
    setOverlay(false)

}


let _State = 0
let Pos1 = []
let Pos2 = []
let AnimAmount = 10

chrome.runtime.onMessage.addListener(async (message) => {
    console.log(message)
    const command = message.animatorCommand
    if (command) {

        if (command === "init") {
            await initAnim()
        } else if (command === "finish") {
            await endAnim()
            await generateAnim()
        }
    }
})