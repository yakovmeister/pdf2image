# Migration Guide

## Upgrading from v2.x to v3.x

From the v3 we are deprecating boolean `convertOptions`.

In v2.x, you could get a response in base64 format by providing `true` as the 2nd parameter to the convert function:
```javascript
const convert = fromPath(filePath, options);
const base64Response = convert(page, true);
```

In v3.x, you need to change it to `{ responseType: 'base64' }`, like so:
```javascript
const convert = fromPath(filePath, options);
const base64Response = convert(page, { responseType: 'base64' })
```

The same migration applies for convert `fromBuffer` and `fromBase64` functions.