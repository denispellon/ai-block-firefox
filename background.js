let isEnabled = true;

// Startup state
browser.storage.local.get({ enabled: true }).then((data) => {
    isEnabled = data.enabled;
});

// Switch change
browser.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.enabled !== undefined) {
        isEnabled = changes.enabled.newValue;

        // Updating tab
        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            for (let tab of tabs) {
                if (tab.url && (tab.url.includes('google.com/search') || tab.url.includes('google.fr/search'))) {
                    try {
                        const url = new URL(tab.url);
                        const udmVal = url.searchParams.get('udm');

                        if (isEnabled && udmVal !== '14' && udmVal !== '50' && !url.searchParams.has('tbm')) {
                            url.searchParams.set('udm', '14');
                            browser.tabs.update(tab.id, { url: url.toString() });
                        } else if (!isEnabled && udmVal === '14') {
                            url.searchParams.delete('udm');
                            browser.tabs.update(tab.id, { url: url.toString() });
                        }
                    } catch (e) {
                        console.error("Error :", e);
                    }
                }
            }
        });
    }
});

// Interception
browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (!isEnabled) return {};

        if (details.type !== 'main_frame') return {};

        try {
            const url = new URL(details.url);
            
            // Needs to has 'q' in Google Search
            if (!url.searchParams.has('q')) return {};

            const udmVal = url.searchParams.get('udm');
            const hasTbm = url.searchParams.has('tbm');

            // Ignore if :
            // - Specific tab (tbm, specific udm)
            // - IA Mode (udm=50)
            // - Is already udm=14
            if (hasTbm || udmVal === '14' || udmVal === '50' || (udmVal && udmVal !== '14')) {
                return {};
            }

            // Force udm=14
            url.searchParams.set('udm', '14');

            return { redirectUrl: url.toString() };
        } catch (e) {
            console.error("webRequest error:", e);
        }

        return {};
    },
    {
        urls: [
            "*://*.google.com/search*",
            "*://*.google.fr/search*"
        ],
        types: ["main_frame"]
    },
    ["blocking"]
);