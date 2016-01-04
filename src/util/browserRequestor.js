/**
 * XmlHttpRequest's getAllResponseHeaders() method returns a string of response
 * headers according to the format described here:
 * http://www.w3.org/TR/XMLHttpRequest/#the-getallresponseheaders-method
 * This method parses that string into a user-friendly key/value pair object.
 */
function parseResponseHeaders (headerStr) {
    var headers = {};
    if (!headerStr) {
        return headers;
    }
    var headerPairs = headerStr.split('\u000d\u000a');
    for (var i = 0; i < headerPairs.length; i++) {
        var headerPair = headerPairs[i];
        // Can't use split() here because it does the wrong thing
        // if the header value has the string ": " in it.
        var index = headerPair.indexOf('\u003a\u0020');
        if (index > 0) {
            var key = headerPair.substring(0, index);
            var val = headerPair.substring(index + 2);
            headers[key] = val;
        }
    }
    return headers;
}

module.exports = (opts = {}) => {
    let { optionsWraper, bodyParser } = opts;
    let request = (options = {}, reqBody = '') => new Promise((resolve, reject) => {
        if(optionsWraper)
            options = optionsWraper(options);

        let httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === 4) {
                if (httpRequest.status === 200) {
                    let body = httpRequest.responseText;
                    let headers = parseResponseHeaders(httpRequest.getAllResponseHeaders());
                    if(bodyParser)
                        body = bodyParser(body);
                    resolve({
                        body,
                        headers
                    });
                } else {
                    reject({
                        status: httpRequest.status,
                        statusText: httpRequest.statusText,
                        responseText: httpRequest.responseText
                    });
                }
            }
        };
        // set headers
        if (options.headers) {
            for (let name in options.headers) {
                httpRequest.setRequestHeader(name, options.headers[name]);
            }
        }
        let method = options.method || 'GET';
        method = method.toUpperCase();
        httpRequest.open(method, options.url || options.path);
        httpRequest.send(reqBody);
    });

    return request;
};