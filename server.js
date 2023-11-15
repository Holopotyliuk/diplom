const app = require('./app')
const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('./certificate/key.pem', 'utf8');
const certificate = fs.readFileSync('./certificate/certificate.crt', 'utf8');
const passphrase = 'veronichka';
const credentials = { key: privateKey, cert: certificate, passphrase: passphrase };
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, () => {
    console.log(`Server started at localhost:443`);
});
