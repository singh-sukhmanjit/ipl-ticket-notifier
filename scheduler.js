const cron = require('node-cron');
const shell = require('shelljs');
require('dotenv').config();

console.log(
  'Scheduler running with pattern',
  process.env.NOTIFICATION_INTERVAL
);
cron.schedule(process.env.NOTIFICATION_INTERVAL, () => {
  if (shell.exec('node index').code !== 0) {
    shell.echo('Notifier failed to executed');
    shell.exit(1);
  } else {
    shell.echo('Notifier executed');
  }
});
