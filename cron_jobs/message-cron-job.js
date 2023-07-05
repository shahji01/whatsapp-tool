const nodeCron = require("node-cron");
const { sendInstanceMessage,sendWebhookMessage } = require('../controllers/messageController')



exports.initScheduledJobs = () => {
    nodeCron.schedule("*/2 * * * *", function () {
        sendInstanceMessage()
    });
    
    nodeCron.schedule("*/4 * * * *", function () {
        sendWebhookMessage()
    });
}