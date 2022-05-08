const cron = require('node-cron');
const shell = require('shelljs');

console.log('Scheduler running every 2 hrs');
cron.schedule('* */2 * * *', () => {
  if (shell.exec('node index').code !== 0) {
    shell.echo('Notifier failed to executed');
    shell.exit(1);
  } else {
    shell.echo('Notifier executed');
  }
});
