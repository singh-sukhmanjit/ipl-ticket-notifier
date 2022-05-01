const cron = require('node-cron');
const shell = require('shelljs');

console.log('Scheduler running every 30 seconds');
cron.schedule('*/30 * * * * *', () => {
  if (shell.exec('node index').code !== 0) {
    shell.echo('Notifier failed to executed');
    shell.exit(1);
  } else {
    shell.echo('Notifier executed');
  }
});
