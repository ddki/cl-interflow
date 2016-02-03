/**
 * TODO support koa mid directly
 */
import requestor from 'cl-requestor';
import getProcessor from './getProcessor';
import processors from './processors';

let originMidForm = (processor, method) => (req, res, body) => {
    let {
        unpackIn, packOut
    } = processor;
    let $ = {
        req, res, body
    };
    return new Promise((resolve, reject) => {
        let ins = unpackIn({
            req, body
        });
        let out = method(ins, $);
        out = wrapValue(out);
        out.then((outv) => {
            let rawout = packOut(outv);
            if (rawout.headers) {
                res.writeHead(200, rawout.headers);
            }
            //
            res.end(rawout.body);
            resolve(rawout);
        }).catch((err) => reject(err));
    });
};


let getCaller = (processor, connect) => {
    let {packIn, unpackOut} = processor;
    return (ins) => new Promise ((resolve, reject) => {
        let rawIns = packIn(ins);
        let rawout = connect(rawIns);
        rawout = wrapValue(rawout);
        rawout.then(rawoutv => {
            let out = unpackOut(rawoutv);
            resolve(out);
        }).catch(err => reject(err));
    });
};

let wrapValue = v => {
    if (isPromise(v)) {
        return v;
    } else {
        return Promise.resolve(v);
    }
};

let isPromise = v => v && typeof v === 'object' && typeof v.then === 'function';

/**
 * opts = {
 *     type : http | https,
 *     processor,
 *     midForm, // define middleware form
 *     lowProcessor
 * }
 *
 * processor = new Processor({ packIn, unpackIn, packOut, unPackout })
 *
 * lowProcessor = new Processor({ packIn, unpackIn, packOut, unPackout })
 *
 * midForm ::: (processor, method) -> mid
 *
 */
let plainhttp = (opts = {}) => {
    let midForm = opts.midForm || originMidForm;
    if(typeof midForm !== 'function') {
        throw new Error('Expect function for midForm');
    }
    let processor = getProcessor(opts);
    //
    let request = requestor(opts.type);

    /**
     * rawIn = {
     *     options,
     *     body
     * }
     */
    let connect = (rawIn) => request(rawIn.options, rawIn.body);

    // get caller
    let caller =  getCaller(processor, connect);

    // builde mider
    let mider = (method) => midForm(processor, method);

    return {
        caller,
        mider
    };
};

plainhttp.processors = processors;

export
default plainhttp;
