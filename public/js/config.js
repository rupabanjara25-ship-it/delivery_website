/**
 * 🔧 App Configuration
 * Auto-detects environment — no manual switching needed.
 * Local development uses relative paths, production uses the Render URL.
 */
const APP_CONFIG = (() => {
    const PRODUCTION_URL = 'https://delivery-website-msg5.onrender.com';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    return {
        API_URL: isLocal ? '/api' : `${PRODUCTION_URL}/api`,
        BASE_URL: isLocal ? '' : PRODUCTION_URL,
        IS_PRODUCTION: !isLocal
    };
})();
