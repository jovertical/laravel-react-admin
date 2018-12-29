/**
 * Register the service worker file.
 */
export function _register(serviceWorkerFile) {
    if ('serviceWorker' in navigator) {
        if (serviceWorkerFile) {
            navigator.serviceWorker
                .register(`${serviceWorkerFile}`)
                .then(() => {
                    let deferredPrompt;

                    window.addEventListener('beforeinstallprompt', e => {
                        // Prevent Chrome 67 and earlier from automatically showing the prompt
                        e.preventDefault();
                        // Stash the event so it can be triggered later.
                        deferredPrompt = e;
                        // Update UI notify the user they can add to home screen
                        btnAdd.style.display = 'block';
                    });

                    btnAdd.addEventListener('click', e => {
                        // hide our user interface that shows our A2HS button
                        btnAdd.style.display = 'none';
                        // Show the prompt
                        deferredPrompt.prompt();
                        // Wait for the user to respond to the prompt
                        deferredPrompt.userChoice.then(choiceResult => {
                            deferredPrompt = null;
                        });
                    });
                })
                .catch(error => console.error(error));
        }
    }
}
