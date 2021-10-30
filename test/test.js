const XmLogger = require('../dist/index').default;

XmLogger.init();
XmLogger.error('test', ['', true]);
XmLogger.info('test', ['', true]);
XmLogger.warn('test', ['', true]);
XmLogger.debug('test', ['', true]);