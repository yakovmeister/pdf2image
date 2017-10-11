/**
 * Simulate private properties within class
 * 
 * @return {object} properties
 */
module.exports = function() {
    let priv = new WeakMap()
    
    return (obj) => {
        if (!priv.has(obj))
            priv.set(obj, {})
        return priv.get(obj)
    }
}
