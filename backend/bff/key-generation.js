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

const crypto = require('crypto');
const MASTER_KEY = Buffer.from(process.env.MASTER_KEY, 'hex'); // 32 bytes
function encryptPrivatePem(pem) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', MASTER_KEY, iv);
  const ct = Buffer.concat([cipher.update(pem, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ct]).toString('base64');
}

// descifrar
function decryptPrivatePem(b64) {
  const buf = Buffer.from(b64, 'base64');
  const iv = buf.slice(0,12);
  const tag = buf.slice(12,28);
  const ct = buf.slice(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', MASTER_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8');
}