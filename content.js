(function () {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Détection stricte des onglets spécifiques (Images, Vidéos, Actualités, Shopping, etc.)
    const hasTbm = params.has('tbm');
    const hasUdm = params.has('udm');
    const udmVal = params.get('udm');

    // On est sur un onglet spécial SI :
    // - tbm est présent (ex: tbm=isch pour images sur ancien système)
    // - udm est présent ET n'est PAS égal à "14" (ex: udm=2 pour images)
    const isSpecialTab = hasTbm || (hasUdm && udmVal !== '14');

    // Si on est sur Images/Vidéos/etc., STOP TOTAL : on ne redirige pas et on laisse charger normalement
    if (isSpecialTab) {
        return;
    }

    // Si on est sur une recherche globale Web sans udm=14, on l'ajoute
    if (udmVal !== '14') {
        params.set('udm', '14');
        window.location.replace(url.toString());
        return;
    }

    // Injection CSS si on est bien sur la page Web finale avec udm=14
    const injectCSS = () => {
        if (document.getElementById('no-ai-overview-style')) return;
        const style = document.createElement('style');
        style.id = 'no-ai-overview-style';
        style.textContent = `
            div[data-attrid="wa:/description"],
            div[aria-label="Aperçu de l'IA"],
            div[aria-label="AI Overview"],
            #kp-wp-tab-overview {
                display: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    };

    if (document.head || document.documentElement) {
        injectCSS();
    } else {
        document.addEventListener('DOMContentLoaded', injectCSS);
    }
})();
