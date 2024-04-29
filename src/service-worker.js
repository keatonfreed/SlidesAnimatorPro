
console.log("This prints to the console of the service worker (background script)")

chrome.commands.onCommand.addListener(function (command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { animatorCommand: command });
    });


});
