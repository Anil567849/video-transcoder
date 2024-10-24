import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, DeleteMessageBatchCommand, Message } from "@aws-sdk/client-sqs";
import type {S3Event} from 'aws-lambda';
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import { SQS_QUEUE_URL } from "../constants";


export class AWSHelper {

    public static sqsClient = new SQSClient({
        region: "",
        credentials: {
            accessKeyId: "",
            secretAccessKey: "",
        }
    })
    
    public static ecsClient = new ECSClient({
        region: "",
        credentials: {
            accessKeyId: "",
            secretAccessKey: "",
        }
    })

    public static receiveMessage = async (queueUrl: string) => {
        const recCmd = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 20, // long-poll
        })
        return await this.sqsClient.send(recCmd);
    }
    
    public static deleteSingleMessage = async (Messages: Message[], queueUrl: string) => {
        const delCmd = new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: Messages[0].ReceiptHandle,
        });
        await this.sqsClient.send(delCmd);
    }
    
    public static deleteMultipleMessage = async (Messages: Message[], queueUrl: string) => {
        const delCmd = new DeleteMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: Messages.map((message) => ({
                Id: message.MessageId,
                ReceiptHandle: message.ReceiptHandle,
            })),
        });
        await this.sqsClient.send(delCmd);
    }
    
    public static spinDockerContainer = async (bucketName: string, key: string, transcodedBucketName: string, transcodedBucketKey: string) => { 
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
    
        await this.ecsClient.send(taskCmd);
    }

}