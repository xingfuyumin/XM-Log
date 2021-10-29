export type LoggerConfig = {
  // 日志是否保存到文件，默认true,
  file: boolean;
  // 日志是否打印到控制台，默认true,
  console: boolean;
  // 是否开启debug模式，关闭后info和debug类型的日志不再记录，默认true,
  debug: boolean;
  // 日志打印目录
  output: string;
  // 日志文件最大大小，超过后会更换存储文件。单位是Mb， 默认为5
  maxSize: number;
};