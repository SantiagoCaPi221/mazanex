const fs = require('fs');

let pem2jwk;
try {
  pem2jwk = require('pem-jwk').pem2jwk;
} catch (e) {
  console.error('Dependency missing: run `npm install pem-jwk` in backend/bff');
  process.exit(1);
}

const pubPath = 'public.pem';
if (!fs.existsSync(pubPath)) {
  console.error('public.pem not found in current directory.');
  process.exit(1);
}

const pub = fs.readFileSync(pubPath, 'utf8');
const jwk = pem2jwk(pub);
jwk.kid = process.argv[2] || 'key-1';

const jwks = { keys: [jwk] };
fs.writeFileSync('jwks.json', JSON.stringify(jwks, null, 2), 'utf8');
console.log('jwks.json written (kid=' + jwk.kid + ')');
