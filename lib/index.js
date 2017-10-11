"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _gm = require("gm");

var _gm2 = _interopRequireDefault(_gm);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fsExtra = require("fs-extra");

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _helper = require("./helper");

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Private = (0, _helper2.default)();

var PDF2IMG = function () {
    function PDF2IMG(options) {
        var _this = this;

        _classCallCheck(this, PDF2IMG);

        Private(this).quality = 100;
        Private(this).format = options.format || "png";
        Private(this).size = options.size || 600;
        Private(this).density = options.density || 200;
        Private(this).savedir = options.savedir || undefined;
        Private(this).savename = options.savename || undefined;

        /**
         * GM command - identify
         * @access private
         * @param {String} file_path path to valid file
         * @param {Mixed} argument gm identify argument
         * @return {Promise} 
         */
        Private(this).identify = function (file_path) {
            var argument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

            var image = (0, _gm2.default)(file_path);

            return new _bluebird2.default(function (resolve, reject) {
                if (argument) image.identify(argument, function (error, data) {
                    if (error) return reject(error);

                    return resolve(data);
                });else image.identify(function (error, data) {
                    if (error) return reject(error);

                    return resolve(data);
                });
            });
        };

        /**
         * GM command - write
         * @access private
         * @param {Stream} stream
         * @param {String} output
         * @param {String} filename
         * @param {Integer} page
         * @return {Promise} 
         */
        Private(this).writeImage = function (stream, output, filename, page) {
            return new _bluebird2.default(function (resolve, reject) {
                (0, _gm2.default)(stream, filename).density(Private(_this).density, Private(_this).density).resize(Private(_this).size).quality(Private(_this).quality).write(output, function (error) {
                    if (error) return reject(error);

                    return resolve({
                        name: _path2.default.basename(output),
                        size: _fsExtra2.default.statSync(output)['size'] / 1000.0,
                        path: output,
                        page: page
                    });
                });
            });
        };
    }

    /**
     * Intialize converter
     * @param {String} pdf_path path to file
     * @param {Page} page page number to be converted (-1 for all pages)
     * @return {Object} image status
     */


    _createClass(PDF2IMG, [{
        key: "convert",
        value: async function convert(pdf_path) {
            var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

            this.isValidPDF(pdf_path);
            this.fileExists(pdf_path);

            var output = _path2.default.basename(pdf_path, _path2.default.extname(_path2.default.basename(pdf_path)));

            // Set output dir
            if (this.get("savedir")) this.set("savedir", this.get("savedir") + _path2.default.sep);else this.set("savedir", output + _path2.default.sep);

            _fsExtra2.default.mkdirsSync(this.get("savedir"));

            if (!this.get("savename")) this.set("savename", output);

            var pages = await this.getPageCount(pdf_path);

            if (page > pages) throw { error: "InvalidPageSelection", message: "Cannot convert non-existent page" };

            return await this.toImage(pdf_path, page);
        }
    }, {
        key: "convertBulk",
        value: async function convertBulk(pdf_path) {
            var pages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

            var result = [];

            pages = pages === -1 ? await this.getPage(pdf_path) : Array.isArray(pages) ? pages : [1];

            await _bluebird2.default.each(pages, async function (each) {
                result.push((await this.convert(pdf_path, each)));
            }.bind(this));

            return result;
        }

        /**
         * Get how many pages are there in the pdf file
         * @param {String} pdf_path path to file
         * @return {Integer} number of pages
         */

    }, {
        key: "getPageCount",
        value: async function getPageCount(pdf_path) {
            return await this.getPage(pdf_path).length;
        }

        /**
         * Get pages numbers
         * @param {String} pdf_path path to file
         * @return {Array} pages
         */

    }, {
        key: "getPage",
        value: async function getPage(pdf_path) {
            var page = await Private(this).identify(pdf_path, "%p ");
            page = page.split(" ");

            return page;
        }

        /**
         * Converts pdf to image
         * @param {String} pdf_path 
         * @param {Integer} page
         * @return {Promise} 
         */

    }, {
        key: "toImage",
        value: async function toImage(pdf_path, page) {
            var iStream = _fsExtra2.default.createReadStream(pdf_path);
            var file = "" + this.get("savedir") + this.get("savename") + "_" + page + "." + this.get("format");
            var filename = this.getFilePath(iStream) + "[" + (page - 1) + "]";

            return await Private(this).writeImage(iStream, file, filename, page);
        }

        /**
         * Get file path
         * @param {Stream} stream
         * @return {String} path
         */

    }, {
        key: "getFilePath",
        value: function getFilePath(stream) {
            if (!stream) throw { error: "InvalidPath", message: "Invalid Path" };

            return stream.path;
        }

        /**
         * Checks if the supplied file has the exact file format
         * @param {String} pdf_path path to file
         * @return {Mixed} file status
         */

    }, {
        key: "isValidPDF",
        value: function isValidPDF(pdf_path) {
            if (_path2.default.extname(_path2.default.basename(pdf_path)) != '.pdf') throw { error: "InvalidPDF", message: "File supplied is not a valid PDF" };

            return true;
        }

        /**
         * Checks if the supplied file has exists
         * @param {String} pdf_path path to file
         * @return {Mixed} file status
         */

    }, {
        key: "fileExists",
        value: function fileExists(pdf_path) {
            if (!_fsExtra2.default.existsSync(pdf_path)) throw { error: "FileNotFound", message: "File supplied cannot be found" };

            return true;
        }

        /**
         * Get value from private property
         * @param {String} property
         * @return {Mixed} value of the property 
         */

    }, {
        key: "get",
        value: function get(property) {
            return Private(this)[property];
        }

        /**
         * Add/set value as private property
         * @param {String} property 
         * @param {String} value
         * @return {Object} this 
         */

    }, {
        key: "set",
        value: function set(property, value) {
            Private(this)[property] = value;

            return this;
        }
    }]);

    return PDF2IMG;
}();

module.exports = PDF2IMG;
//# sourceMappingURL=index.js.map
