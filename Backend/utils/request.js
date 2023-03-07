module.exports.keyStore = class {
    key;
    _id;
    constructor(id, key) {
        _id = id;
        this.key = key;
    }
};
