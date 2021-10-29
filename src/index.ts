import Logger from "./logger";
import { LoggerConfig } from "./type";

const fs = require("fs");
const path = require("path");

/**
 * 获取项目根目录
 */
const getRootDir = () => {
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

const defaultConfig = {
  file: true,
  console: true,
  debug: true,
  output: `${getRootDir()}/log/`,
  maxSize: 5,
} as LoggerConfig;

namespace XmLogger {
  const loggerMap = new Map<string, Logger>();
  /**
   * 新增/更新logger对象
   */
  export const addLogger = (name: string, config: LoggerConfig) => {
    try {
      const logger = new Logger(name, config);
      loggerMap.set(name, logger);
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * 新增logger对象
   */
  export const removeLogger = (name: string) => {
    loggerMap.delete(name);
  };

  /**
   * 初始化配置
   */
  export const init = () => {
    const fileName = `${getRootDir()}/xmlogger.json`;
    let configObj = {} as { [key: string]: LoggerConfig };
    if (fs.existsSync(fileName)) {
      // 文件不存在就用默认配置
      try {
        configObj = JSON.parse(fs.readFileSync(fileName).toString() || "{}");
      } catch {}
    }
    if (!configObj || Object.values(configObj).length === 0) {
      addLogger("default", defaultConfig);
      return;
    }
    Object.keys(configObj).forEach((key) => {
      const config = configObj[key] as LoggerConfig;
      addLogger(key, config);
    });
  };

  /**
   * 错误日志
   */
  export const error = (...params: any[]) => {
    let name = 'default'
    let msg = params[0];
    if (params.length === 2) {
      name = params[0];
      msg = params[1];
    }
    const logger = loggerMap.get(name);
    logger?.log('error', msg);
  };

  /**
   * 信息日志
   */
   export const info = (...params: any[]) => {
    let name = 'default'
    let msg = params[0];
    if (params.length === 2) {
      name = params[0];
      msg = params[1];
    }
    const logger = loggerMap.get(name);
    logger?.log('info', msg);
  };

  /**
   * 预警日志
   */
   export const warn = (...params: any[]) => {
    let name = 'default'
    let msg = params[0];
    if (params.length === 2) {
      name = params[0];
      msg = params[1];
    }
    const logger = loggerMap.get(name);
    logger?.log('warn', msg);
  };

  /**
   * 调试日志
   */
   export const debug = (...params: any[]) => {
    let name = 'default'
    let msg = params[0];
    if (params.length === 2) {
      name = params[0];
      msg = params[1];
    }
    const logger = loggerMap.get(name);
    logger?.log('debug', msg);
  }
}
export default XmLogger;
