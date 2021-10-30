## 介绍

XM-Logger是给桌面应用和后台服务提供日志打印保存的服务，你可以通过`npm install xm-log`来安装。支持控制台打印和文件保存，日志文件过大时支持自动切换。

## 使用说明

包安装好后可以通过`import XMLogger from 'xm-logger';`来引入对象。通过`const logger = XMLogger.init()`即可获得日志对象。

### 默认配置
默认创建一个'default'的日志打印服务，可以通过
```javascript
logger.info('default', 日志内容);  
logger.debug('default', 日志内容);  
logger.warn('default', 日志内容);  
logger.err('default', 日志内容);  
```
来实现打印，默认情况下文件日志会保存，控制台日志也会打印出来，同时日志保存在项目目录的`log`目录下。
### 配置文件配置
在项目目录下新建`xmlogger.json`配置文件，配置内容参考如下：  
```javascript
{  
    "test": { // 服务名，可以有多个，调用时函数第一个参数填此    
        "file": true, // 为true时日志保存文件;默认true
        "console": true, // 为true时日志打印到控制台;默认true  
        "debug": false, // 为true时所有级别日志都打印，false时只打印error日志;默认true  
        "maxSize": 5, // 单个日志文件最大大小，单位为MB，超过后会换一个文件继续保存。默认5  
        "output": "D:\\Users\\工作\\Desktop\\XM-Logger\\logger\\" // 日志保存目录。填写绝对路径。默认当前项目的log目录  
    }
}
 
```
### 自定义件配置
如果想自定义配置。在执行` XMLogger.init()`后通过`XMLogger.addLogger(name, config)`来新增或修改配置，通过`XMLogger.removeLogger(name)`来移除配置。其中config为上面配置文件的json形式

## 结尾
如果大家用的时候有什么问题可以在邮箱联系我1459736624@qq.com
