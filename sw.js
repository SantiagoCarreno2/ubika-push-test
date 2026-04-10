self.addEventListener('push', function(event) {
  var data = event.data ? event.data.json() : {};
  var title = data.title || 'UBIKA';
  var options = {
    body:    data.body    || 'Tienes un mensaje.',
    icon:    data.icon    || '',
    badge:   data.badge   || '',
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
    tag:  'ubika-alerta'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
