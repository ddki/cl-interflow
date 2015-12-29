import Processor from '../processor';

module.exports = new Processor({
    packIn: v => v,
    unpackIn: ({req, body}) => {
        body = body ? JSON.parse(body + '') : '';
        let rawIn = {
            options: {
                path: req.url,
                method: req.method,
                headers: req.headers
            },
            body
        };
        return rawIn;
    }
});