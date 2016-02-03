import http from 'http';
import {
    rloader
}
from '../../../../index';
import fs from 'fs';
import path from 'path';

// ./node_modules/.bin/babel-node --presets es2015,stage-0 test/browser/quickHttp/server.js

let listen = (server, port) => new Promise((resolve) => {
    server.listen(port, () => {
        resolve(server);
    });
});

let getReqBody = (req) => new Promise((r) => {
    let chunks = [];
    req.on('data', (chunk) => {
        chunks.push(chunk);
    });

    req.on('end', () => {
        let body = chunks.join('');
        r(body);
    });
});

let {
    mid
} = rloader({
    root: __dirname
});

let app = async() => {
    // create http server
    let server = http.createServer(async(req, res) => {
        console.log(req.url);
        if (req.url === '/page' || req.url === '/') {
            let readStream = fs.createReadStream(path.join(__dirname, './page.html'));
            readStream.pipe(res);
        } else if (req.url === '/browser/rloader.js') {
            let readStream = fs.createReadStream(path.join(__dirname, '../../../../browser/rloader.js'));
            readStream.pipe(res);
        } else {
            let body = await getReqBody(req);
            mid(req, res, body);
        }
    });

    await listen(server, 9000);

    let port = server.address().port;

    console.log('browser:server port is ' + port);
};

app();
