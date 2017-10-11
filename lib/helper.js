"use strict";

/**
 * Simulate private properties within class
 * 
 * @return {object} properties
 */
module.exports = function () {
    var priv = new WeakMap();

    return function (obj) {
        if (!priv.has(obj)) priv.set(obj, {});
        return priv.get(obj);
    };
};
//# sourceMappingURL=helper.js.map
