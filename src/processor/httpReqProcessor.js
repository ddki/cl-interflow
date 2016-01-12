import Processor from '../processor';

/**
 * req is node request object
 * body is request body
 */
module.exports = new Processor({
    packIn: v => v,
    unpackIn: ({req, body}) => {
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