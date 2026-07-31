const url = new URL(window.location.href)
if (!url.searchParams.has('udm')) {
    url.searchParams.set('udm', '14');
    window.location.replace(url.toString());
}

const style = document.createElement('style');
style.textContent = `
    div[data-attrid="wa:/description"],
    div[aria-label="Aperçu de l'IA"],
    div[aria-label="AI Overview"],
    #kp-wp-tab-overview {
        display: none !important;
    }
`;
(document.head || document.documentElement).appendChild(style);