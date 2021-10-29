"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./logger"));
var fs = require("fs");
var path = require("path");
/**
 * 获取项目根目录
 */
var getRootDir = function () {
    if (__dirname.includes("/node_modules/")) {
        // 当做包被引入时
        return __dirname.split("/node_modules/")[0];
    }
    if (__dirname.includes("/src/")) {
        // 本地开发时
        return __dirname.split("/src/")[0];
    }
    return __dirname; // 保险情况
};
var defaultConfig = {
    file: true,
    console: true,
    debug: true,
    output: getRootDir() + "/log/",
    maxSize: 5,
};
var XmLogger;
(function (XmLogger) {
    var loggerMap = new Map();
    /**
     * 新增/更新logger对象
     */
    XmLogger.addLogger = function (name, config) {
        try {
            var logger = new logger_1.default(name, config);
            loggerMap.set(name, logger);
        }
        catch (err) {
            console.log(err);
        }
    };
    /**
     * 新增logger对象
     */
    XmLogger.removeLogger = function (name) {
        loggerMap.delete(name);
    };
    /**
     * 初始化配置
     */
    XmLogger.init = function () {
        var fileName = getRootDir() + "/xmlogger.json";
        var configObj = {};
        if (fs.existsSync(fileName)) {
            // 文件不存在就用默认配置
            try {
                configObj = JSON.parse(fs.readFileSync(fileName).toString() || "{}");
            }
            catch (_a) { }
        }
        if (!configObj || Object.values(configObj).length === 0) {
            XmLogger.addLogger("default", defaultConfig);
            return;
        }
        Object.keys(configObj).forEach(function (key) {
            var config = configObj[key];
            XmLogger.addLogger(key, config);
        });
    };
    /**
     * 错误日志
     */
    XmLogger.error = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var name = 'default';
        var msg = params[0];
        if (params.length === 2) {
            name = params[0];
            msg = params[1];
        }
        var logger = loggerMap.get(name);
        logger === null || logger === void 0 ? void 0 : logger.log('error', msg);
    };
    /**
     * 信息日志
     */
    XmLogger.info = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var name = 'default';
        var msg = params[0];
        if (params.length === 2) {
            name = params[0];
            msg = params[1];
        }
        var logger = loggerMap.get(name);
        logger === null || logger === void 0 ? void 0 : logger.log('info', msg);
    };
    /**
     * 预警日志
     */
    XmLogger.warn = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var name = 'default';
        var msg = params[0];
        if (params.length === 2) {
            name = params[0];
            msg = params[1];
        }
        var logger = loggerMap.get(name);
        logger === null || logger === void 0 ? void 0 : logger.log('warn', msg);
    };
    /**
     * 调试日志
     */
    XmLogger.debug = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var name = 'default';
        var msg = params[0];
        if (params.length === 2) {
            name = params[0];
            msg = params[1];
        }
        var logger = loggerMap.get(name);
        logger === null || logger === void 0 ? void 0 : logger.log('debug', msg);
    };
})(XmLogger || (XmLogger = {}));
exports.default = XmLogger;
