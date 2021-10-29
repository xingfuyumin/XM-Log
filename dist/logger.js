"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electronLog = require("electron-log");
var dayjs = require("dayjs");
var fs = require("fs");
var defaultConfig = {
    file: true,
    console: true,
    debug: true,
    output: "./log/",
    maxSize: 5,
};
// 日志文件名过滤规则
var fileNameNumRule = /.*?-[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]+)*.log/;
var Logger = /** @class */ (function () {
    function Logger(name, config) {
        var _this = this;
        if (config === void 0) { config = defaultConfig; }
        this.config = defaultConfig;
        this.name = '';
        this.num = -1; // 当前日志文件编号，大小超过maxSize就会自动+1，不需要用户配置
        /**
         * 根据文件名找到今日最新的序列号
         */
        this.getNum = function () {
            var output = _this.config.output;
            if (!fs.existsSync(output)) {
                fs.mkdirSync(output);
            }
            var num = -1;
            var pathList = fs.readdirSync(output);
            pathList.forEach(function (path) {
                var fileName = path.substring(path.lastIndexOf("/") + 1);
                var result = fileNameNumRule.exec(fileName);
                if (result) {
                    var newNum = -1;
                    if (result[1]) {
                        newNum = Number(result[1].substring(1));
                    }
                    if (newNum > num) {
                        num = newNum;
                    }
                }
            });
            _this.num = num;
        };
        /**
         * 获取文件名称
         * @returns
         */
        this.getFileName = function () {
            var output = _this.config.output;
            return "" + output + _this.name + "-" + dayjs().format('YYYY-MM-DD') + (_this.num === -1 ? '' : '-') + (_this.num === -1 ? '' : _this.num) + ".log";
        };
        /**
         * 检查文件大小，如果超限就另开一个文件读写
         */
        this.checkFileSize = function () {
            var _a;
            var maxSize = _this.config.maxSize;
            var fileName = _this.getFileName();
            if (!fs.existsSync(fileName)) {
                fs.writeFileSync(fileName, '');
            }
            var size = ((_a = fs.statSync(fileName)) === null || _a === void 0 ? void 0 : _a.size) / 1048576;
            if (maxSize < size) {
                _this.num += 1;
                _this.logger.transports.file.file = _this.getFileName();
            }
        };
        this.log = function (level, msg) {
            if (!_this.logger) {
                return;
            }
            _this.checkFileSize();
            var debug = _this.config.debug;
            if (!debug && (level === 'info' || level === 'debug' || level === 'warn')) {
                return;
            }
            _this.logger[level](msg);
        };
        var file = config.file, console = config.console, debug = config.debug, output = config.output, maxSize = config.maxSize;
        this.logger = electronLog.create(name);
        if (!this.logger) {
            throw new Error("\u521B\u5EFA\u65E5\u5FD7\u5BF9\u8C61\uFF1A" + name + "\u5931\u8D25\uFF01");
        }
        this.config = config;
        this.name = name;
        this.getNum();
        this.logger.transports.file.level = file ? (debug ? 'debug' : 'error') : false;
        this.logger.transports.console.level = console ? (debug ? 'debug' : 'error') : false;
        this.logger.transports.file.file = this.getFileName();
        this.logger.transports.file.maxSize = Number.MAX_SAFE_INTEGER;
    }
    return Logger;
}());
exports.default = Logger;
