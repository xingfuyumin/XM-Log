import { ElectronLog } from "electron-log";
import { LoggerConfig } from "./type";

const electronLog = require("electron-log");
const dayjs = require("dayjs");
const fs = require("fs");

const defaultConfig = {
  file: true,
  console: true,
  debug: true,
  output: "./log/",
  maxSize: 5,
} as LoggerConfig;

// 日志文件名过滤规则
const fileNameNumRule = /.*?-[0-9]{4}-[0-9]{2}-[0-9]{2}(-[0-9]+)*.log/;

class Logger {
  private logger: ElectronLog;
  private config = defaultConfig;
  private name = '';
  private num = -1; // 当前日志文件编号，大小超过maxSize就会自动+1，不需要用户配置
  private output = '';

  constructor(name: string, config: LoggerConfig = defaultConfig) {
    const { file, console, debug, output, maxSize } = config;
    this.logger = electronLog.create(name);
    if (!this.logger) {
      throw new Error(`创建日志对象：${name}失败！`);
    }
    this.config = { ...defaultConfig, ...config } as any;
    this.name = name;
    this.getNum();
    this.getFileName();
    this.logger.transports.console.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
    this.logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
    this.logger.transports.file.level = file ? (debug ? 'debug' : 'error') : false;
    this.logger.transports.console.level = console ? (debug ? 'debug' : 'error') : false;
    this.logger.transports.file.resolvePath = () => this.output;
    this.logger.transports.file.maxSize = Number.MAX_SAFE_INTEGER;
  }

  /**
   * 根据文件名找到今日最新的序列号
   */
  private getNum = () => {
    const { output } = this.config;
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output);
    }
    let num = -1;
    const pathList = fs.readdirSync(output);
    pathList.forEach((path: string) => {
      const fileName = path.substring(path.lastIndexOf("/") + 1);
      const result = fileNameNumRule.exec(fileName);
      if (result) {
        let newNum = -1;
        if (result[1]) {
          newNum = Number(result[1].substring(1));
        }
        if (newNum > num) {
          num = newNum;
        }
      }
    });
    this.num = num;
  };

  /**
   * 获取文件名称
   * @returns 
   */
  private getFileName = () => {
    const { output } = this.config;
    this.output = `${output}${this.name}-${dayjs().format('YYYY-MM-DD')}${this.num === -1 ? '' : '-'}${this.num === -1 ? '' : this.num}.log`
  }

  /**
   * 检查文件大小，如果超限就另开一个文件读写
   */
  private checkFileSize = () => {
    const { maxSize } = this.config;
    if (!fs.existsSync(this.output)) {
      fs.writeFileSync(this.output, '');
    }
    const size = fs.statSync(this.output)?.size / 1048576;
    if (maxSize < size) {
      this.num += 1;
      this.getFileName();
      this.logger.transports.file.resolvePath = () => this.output;
    }
  }

  log = (level: 'info' | 'debug' | 'error' | 'warn', msg: any) => {
    if (!this.logger) {
      return;
    }
    this.checkFileSize();
    const { debug } = this.config;
    if (!debug && (level === 'info' || level === 'debug' || level === 'warn')) {
      return;
    }
    const error = new Error().stack?.split('\n')[3];
    const str = error?.substring(error.indexOf('/'), error.lastIndexOf(':')) || '';
    this.logger[level](`[${str}]`, msg);
  }
}

export default Logger;
