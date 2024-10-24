import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, DeleteMessageBatchCommand, Message } from "@aws-sdk/client-sqs";
import type {S3Event} from 'aws-lambda';
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const sqsClient = new SQSClient({
    region: "",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    }
})

const ecsClient = new ECSClient({
    region: "",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "",
    }
})

const SQS_QUEUE_URL = "queue_url";

const receiveMessage = async (queueUrl: string) => {
    const recCmd = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20, // long-poll
    })
    return await sqsClient.send(recCmd);
}

const deleteSingleMessage = async (Messages: Message[]) => {
    const delCmd = new DeleteMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        ReceiptHandle: Messages[0].ReceiptHandle,
    });
    await sqsClient.send(delCmd);
}

const deleteMultipleMessage = async (Messages: Message[]) => {
    const delCmd = new DeleteMessageBatchCommand({
        QueueUrl: SQS_QUEUE_URL,
        Entries: Messages.map((message) => ({
            Id: message.MessageId,
            ReceiptHandle: message.ReceiptHandle,
        })),
    });
    await sqsClient.send(delCmd);
}

const spinDockerContainer = async (bucketName: string, key: string, transcodedBucketName: string, transcodedBucketKey: string) => { 
    const taskCmd = new RunTaskCommand({
        cluster: "",
        taskDefinition: "",
        launchType: "FARGATE",
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                securityGroups: [],
                subnets: [

                ]
            }
        },
        overrides: {
            containerOverrides: [
                {name: '', environment: [
                    {name: 'BUCKET_NAME', value: bucketName},
                    {name: 'KEY', value: key},
                    {name: 'TRANSCODED_BUCKET_NAME', value: transcodedBucketName},
                    {name: 'TRANSCODED_KEY', value: transcodedBucketKey},
                ]}
            ]
        }
    })

    await ecsClient.send(taskCmd);
}

export async function main() {

    while (1) {

        try {
            const { Messages } = await receiveMessage(SQS_QUEUE_URL);

            if (!Messages) continue;
    
            if (Messages.length === 1) {
    
                const { MessageId, Body } = Messages[0];
    
                console.log(MessageId, Body);
    
                if(!Body) continue;
    
                const event = JSON.parse(Body) as S3Event;
    
                // Skip the Test Events 
                if("Service" in Messages[0] && "Event" in Messages[0]){
                    if(Messages[0].Event === "s3:TestEvent"){
                        await deleteSingleMessage(Messages);
                        continue;
                    }
                }
                
                for(const record of event.Records){
                    const {s3} = record;
                    const {bucket : {name}, object : {key, size}} = s3;
                    await spinDockerContainer(name, key, "transcoded-bucket-name", "transcoded-bucket-key");
                }
    
                await deleteSingleMessage(Messages);
            } else {
                deleteMultipleMessage(Messages)
            }
        } catch (error) {
            console.log("error:", error);
        }

    }
}

main();