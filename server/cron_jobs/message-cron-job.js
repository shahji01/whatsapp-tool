const nodeCron = require("node-cron");
const { sendInstanceMessage,sendWebhookMessage } = require('../controllers/messageController')



exports.initScheduledJobs = () => {
    nodeCron.schedule("*/1 * * * *", function () {
        sendInstanceMessage()
    });
    
    nodeCron.schedule("*/3 * * * *", function () {
        sendWebhookMessage()
    });
}