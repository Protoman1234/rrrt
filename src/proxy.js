const fetch = require('node-fetch');
// TODO: drop lodash.pick in favor of a native destructure.
const pick = require('lodash.pick');
const shouldCompress = require('./shouldCompress');
const redirect = require('./redirect');
const compress = require('./compress');
const bypass = require('./bypass');
const copyHeaders = require('./copyHeaders');

function proxy(req, res) {
    fetch(
        req.params.url,
        {
            headers: {
                ...pick(req.headers, ['dnt', 'referer']),
                'user-agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; en-AU; rv:126.0) Gecko/20220911 Firefox/126.0',
                'x-forwarded-for': req.headers['x-forwarded-for']
            },
            timeout: 10000,
      maxRedirects: 5,
      encoding: null,
      strictSSL: false,
      gzip: true,
      jar: false
        })
        .then(origin => {
            if (!origin.ok) {
                return redirect(req, res);
            }
            req.params.originType = origin.headers.get('content-type') || '';
            origin.buffer().then(buffer => {
                req.params.originSize = buffer.length;
                copyHeaders(origin, res);
                res.setHeader('content-encoding', 'identity');
                if (shouldCompress(req)) {
                    compress(req, res, buffer)
                } else {
                    bypass(req, res, buffer)
                }
            })
        })
        .catch(e => console.log(e));
}

module.exports = proxy;
