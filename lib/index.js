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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require("babel-polyfill");
require('es8-polyfill');

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
     * @param {Page} page page number to be converted
     * @return {Object} image status
     */


    _createClass(PDF2IMG, [{
        key: "convert",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pdf_path) {
                var page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
                var output, pages;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.isValidPDF(pdf_path);
                                this.fileExists(pdf_path);

                                output = _path2.default.basename(pdf_path, _path2.default.extname(_path2.default.basename(pdf_path)));

                                // Set output dir

                                if (this.get("savedir")) this.set("savedir", this.get("savedir") + _path2.default.sep);else this.set("savedir", output + _path2.default.sep);

                                _fsExtra2.default.mkdirsSync(this.get("savedir"));

                                if (!this.get("savename")) this.set("savename", output);

                                _context.next = 8;
                                return this.getPageCount(pdf_path);

                            case 8:
                                pages = _context.sent;

                                if (!(page > pages)) {
                                    _context.next = 11;
                                    break;
                                }

                                throw { error: "InvalidPageSelection", message: "Cannot convert non-existent page" };

                            case 11:
                                _context.next = 13;
                                return this.toImage(pdf_path, page);

                            case 13:
                                return _context.abrupt("return", _context.sent);

                            case 14:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function convert(_x3) {
                return _ref.apply(this, arguments);
            }

            return convert;
        }()

        /**
         * Intialize converter, well the bulk version
         * @param {String} pdf_path path to file
         * @param {Page} page page number to be converted (-1 for all pages)
         * @return {Object} image status
         */

    }, {
        key: "convertBulk",
        value: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(pdf_path) {
                var pages = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
                var result;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                result = [];

                                if (!(pages === -1)) {
                                    _context3.next = 7;
                                    break;
                                }

                                _context3.next = 4;
                                return this.getPage(pdf_path);

                            case 4:
                                _context3.t0 = _context3.sent;
                                _context3.next = 8;
                                break;

                            case 7:
                                _context3.t0 = Array.isArray(pages) ? pages : [1];

                            case 8:
                                pages = _context3.t0;
                                _context3.next = 11;
                                return _bluebird2.default.each(pages, function () {
                                    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(each) {
                                        return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        _context2.t0 = result;
                                                        _context2.next = 3;
                                                        return this.convert(pdf_path, each);

                                                    case 3:
                                                        _context2.t1 = _context2.sent;

                                                        _context2.t0.push.call(_context2.t0, _context2.t1);

                                                    case 5:
                                                    case "end":
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, this);
                                    }));

                                    return function (_x6) {
                                        return _ref3.apply(this, arguments);
                                    };
                                }().bind(this));

                            case 11:
                                return _context3.abrupt("return", result);

                            case 12:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function convertBulk(_x5) {
                return _ref2.apply(this, arguments);
            }

            return convertBulk;
        }()

        /**
         * Get how many pages are there in the pdf file
         * @param {String} pdf_path path to file
         * @return {Integer} number of pages
         */

    }, {
        key: "getPageCount",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(pdf_path) {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return this.getPage(pdf_path).length;

                            case 2:
                                return _context4.abrupt("return", _context4.sent);

                            case 3:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function getPageCount(_x7) {
                return _ref4.apply(this, arguments);
            }

            return getPageCount;
        }()

        /**
         * Get pages numbers
         * @param {String} pdf_path path to file
         * @return {Array} pages
         */

    }, {
        key: "getPage",
        value: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(pdf_path) {
                var page;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return Private(this).identify(pdf_path, "%p ");

                            case 2:
                                page = _context5.sent;

                                page = page.split(" ");

                                return _context5.abrupt("return", page);

                            case 5:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));

            function getPage(_x8) {
                return _ref5.apply(this, arguments);
            }

            return getPage;
        }()

        /**
         * Converts pdf to image
         * @param {String} pdf_path 
         * @param {Integer} page
         * @return {Promise} 
         */

    }, {
        key: "toImage",
        value: function () {
            var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(pdf_path, page) {
                var iStream, file, filename;
                return regeneratorRuntime.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                iStream = _fsExtra2.default.createReadStream(pdf_path);
                                file = "" + this.get("savedir") + this.get("savename") + "_" + page + "." + this.get("format");
                                filename = this.getFilePath(iStream) + "[" + (page - 1) + "]";
                                _context6.next = 5;
                                return Private(this).writeImage(iStream, file, filename, page);

                            case 5:
                                return _context6.abrupt("return", _context6.sent);

                            case 6:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function toImage(_x9, _x10) {
                return _ref6.apply(this, arguments);
            }

            return toImage;
        }()

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
