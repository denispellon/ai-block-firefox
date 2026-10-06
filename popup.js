document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleState');

    // Charge state at startup
    browser.storage.local.get({ enabled: true }).then((data) => {
        toggle.checked = data.enabled;
    }).catch((error) => {
        console.error("Error while reading:", error);
    });

    // Save changes
    toggle.addEventListener('change', () => {
        browser.storage.local.set({ enabled: toggle.checked }).then(() => {
            console.log("State:", toggle.checked);
        }).catch((error) => {
            console.error("Error while writing:", error);
        });
    });
});