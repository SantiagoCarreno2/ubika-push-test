// Service Worker UBIKA — Canal de Alarma
// Crea un canal Android de alta prioridad la primera vez

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) {}

  var title   = (data.notification && data.notification.title) || data.title || '🚨 UBIKA';
  var body    = (data.notification && data.notification.body)  || data.body  || 'Tienes una alerta pendiente.';

  var options = {
    body:               body,
    icon:               'https://santiagocarreno2.github.io/ubika-push-test/icon.png',
    badge:              'https://santiagocarreno2.github.io/ubika-push-test/icon.png',
    // Vibración larga y repetida — mucho más agresiva que WhatsApp
    vibrate:            [500, 200, 500, 200, 500, 200, 500, 200, 500],
    requireInteraction: true,   // no desaparece sola — el usuario debe cerrarla
    tag:                'ubika-alarma',
    renotify:           true,   // vuelve a sonar aunque ya haya una notificación del mismo tag
    silent:             false,
    data:               { url: self.location.origin }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/ubika-push-test/');
      }
    })
  );
});
