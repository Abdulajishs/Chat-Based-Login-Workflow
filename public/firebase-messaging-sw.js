importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyAE9wvHiINAMTcNBe5v3D2WTzuMYexojjQ",
    authDomain: "chat-workflow-9e7a6.firebaseapp.com",
    projectId: "chat-workflow-9e7a6",
    storageBucket: "chat-workflow-9e7a6.firebasestorage.app",
    messagingSenderId: "993870645510",
    appId: "1:993870645510:web:f539864aca79eb1976b687"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();



self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Novu usually sends 'cta.data.url' in payload.data
    // Or sometimes nested as payload.data.cta if flattened.
    // We try to find a URL to open.
    const data = event.notification.data;
    let urlToOpen = '/';

    // Try parsing cta if it's a string (common in some FCM payloads)
    if (typeof data.cta === 'string') {
        try {
            const ctaObj = JSON.parse(data.cta);
            urlToOpen = ctaObj?.data?.url || '/';
        } catch (e) {
            // ignore
        }
    } else if (data?.cta?.data?.url) {
        urlToOpen = data.cta.data.url;
    }

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
