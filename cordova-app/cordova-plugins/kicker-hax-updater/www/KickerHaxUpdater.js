const exec = require('cordova/exec');

module.exports = {
  downloadAndInstall(url, success, error) {
    exec(success, error, 'KickerHaxUpdater', 'downloadAndInstall', [url]);
  },
  notifyUpdate(version, success, error) {
    exec(success, error, 'KickerHaxUpdater', 'notifyUpdate', [version]);
  },
  prepareNotifications(success, error) {
    exec(success, error, 'KickerHaxUpdater', 'prepareNotifications', []);
  }
};
