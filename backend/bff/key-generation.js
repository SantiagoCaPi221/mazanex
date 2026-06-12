const crypto = require('crypto');
const fs = require('fs');

// Generar el par de llaves RSA de 2048 bits
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem' // Formato estándar de texto legible
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Guardar los archivos en tu carpeta
fs.writeFileSync('private.pem', privateKey);
fs.writeFileSync('public.pem', publicKey);

console.log("¡Llaves creadas con éxito!");
console.log("- private.pem (Guárdala en tu Microservicio de Auth)");
console.log("- public.pem (Pégala o úsala en tu KrakenD BFF)");

// convert-pub-to-jwks.js
const fs = require('fs');
const pem2jwk = require('pem-jwk').pem2jwk;
const pub = fs.readFileSync('public.pem','utf8');
const jwk = pem2jwk(pub);
jwk.kid = 'key-1';
console.log(JSON.stringify({ keys: [jwk] }, null, 2));