const webPush = require('web-push');

const vapidKeys = webPush.generateVAPIDKeys();
console.log('Vapid Public Key:', vapidKeys.publicKey);
console.log('Vapid Private Key:', vapidKeys.privateKey);