const fs = require('fs');
const https = require('https');
const app = require('./app');

app.set('port', process.env.PORT || 3001);


const privateKey = fs.readFileSync('/home/debian/cert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/home/debian/cert/cert.pem', 'utf8');
const ca = fs.readFileSync('/home/debian/cert/chain.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
};

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(process.env.PORT || 3001);