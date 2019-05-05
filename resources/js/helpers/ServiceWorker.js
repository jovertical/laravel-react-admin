/**
 * Register the service worker file.
 */
export function register(serviceWorkerFile) {
    if ('serviceWorker' in navigator) {
        if (serviceWorkerFile) {
            navigator.serviceWorker
                .register(`${serviceWorkerFile}`)
                .then()
                .catch();
        }
    }
}
