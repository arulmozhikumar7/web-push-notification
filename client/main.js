if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);

      return registration.pushManager.getSubscription().then((subscription) => {
        if (subscription) {
          return subscription;
        }

        const publicVapidKey =
          "BCLrGGt8gZfeD_FfQO4HnP9oKYB8OpCtNmZwxPyL--RznIuii9TobS3I2Hi5usSC9fUYdWhVmfkUcRVvGm6vH5Y";
        const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      });
    })
    .then((subscription) => {
      console.log("Push subscription:", subscription);
      fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
          "content-type": "application/json",
        },
      });
    })
    .catch((error) =>
      console.error(
        "Service Worker registration or push subscription failed:",
        error
      )
    );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
