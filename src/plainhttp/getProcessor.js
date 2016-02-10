import Processor from '../processor';

let idProcessor = new Processor();
/**
 * req is request object in node.
 *
 * body is the request body, could be undefined.
 */
let stdLowProcessor = new Processor({
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

export default (opts) => {
    let processor = opts.processor || idProcessor;
    let lowProcessor = opts.lowProcessor || stdLowProcessor;
    // pack the low processor
    processor = processor.pack(lowProcessor);
    return processor;
};
