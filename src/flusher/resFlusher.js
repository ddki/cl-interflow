module.exports = (res) => (rawOut) => {
    let outBody = rawOut.body ? JSON.stringify(rawOut.body) : '';
    let outHeaders = rawOut.headers;
    if(outBody.headers) {
        res.writeHead(200, outHeaders);
    }
    //
    res.end(outBody);
};