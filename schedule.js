const schedule = require('node-schedule')
const core = require('./core')

core.run();
schedule.scheduleJob('0 * * * 1-5', function(){
    console.log('schedule:', (new Date).toISOString())
    core.run();
});