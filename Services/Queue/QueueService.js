const { QueueServiceClient } = require('@azure/storage-queue');
const BlobService = require('../Blob/BlobService.js');
const sharp = require('sharp');
const connectionString = "AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;DefaultEndpointsProtocol=http;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;";



const convertQueueMonitor = async (queueName) => { 
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = queueServiceClient.getQueueClient(queueName);
    while (true) {
        const messages = await queueClient.receiveMessages({ numberOfMessages: 1 });
        if (messages.receivedMessageItems.length > 0) {
            const message = messages.receivedMessageItems[0];
            let json = JSON.parse(message.messageText);
            sharp(`./images/${json.image}`)
            .resize(64,64)
            .toFile(`./images/thumbnail-${json.image}`)
            .then(() => {
                BlobService.uploadWTS(`thumbnail-${json.imageTS}`,`./images/thumbnail-${json.image}`,"goods");
            })
            
          await queueClient.deleteMessage(message.messageId, message.popReceipt);
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

const create = async (queueName) => {
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
    await queueServiceClient.createQueue(queueName);
};

const send = async (queueName, message) => {
    const queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = queueServiceClient.getQueueClient(queueName);
    const messageText = JSON.stringify(message);
    await queueClient.sendMessage(messageText);
};

module.exports = {
    convertQueueMonitor,
    create,
    send
};