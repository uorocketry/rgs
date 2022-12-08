import { connect, Options } from 'amqplib';


const socketOpts: Options.Connect = {
    hostname: 'localhost',
}



async function main() {
    const rmq = await connect(socketOpts);

    const channel = await rmq.createChannel();
    const queueName = "test";
    const message = "Hello World!";
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(message));
    // Send it twice so we can see it from the management UI
    channel.sendToQueue(queueName, Buffer.from(message));

    console.log("Sent message", message);

    // Consume forever
    // channel.consume(queueName, (msg) => {
    //     console.log("Received message", msg.content.toString());
    // });

    // Consume once
    const msg = await channel.get(queueName);
    if (msg) {
        console.log("Received message", msg.content.toString());
    }
}

main();