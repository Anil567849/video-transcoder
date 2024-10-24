import type {S3Event} from 'aws-lambda';
import { AWSHelper } from "./lib/aws";
import { SQS_QUEUE_URL } from "./lib/constants";

export async function main() {

    while (1) {

        try {
            const { Messages } = await AWSHelper.receiveMessage(SQS_QUEUE_URL);

            if (!Messages) continue;
    
            if (Messages.length === 1) {
    
                const { Body } = Messages[0];
    
                // console.log(Body);
    
                if(!Body) continue;
    
                const event = JSON.parse(Body) as S3Event;
    
                // Skip the Test Events 
                if("Service" in Messages[0] && "Event" in Messages[0]){
                    if(Messages[0].Event === "s3:TestEvent"){
                        await AWSHelper.deleteSingleMessage(Messages, SQS_QUEUE_URL);
                        continue;
                    }
                }
                
                for(const record of event.Records){
                    const {s3} = record;
                    const {bucket : {name}, object : {key}} = s3;
                    await AWSHelper.spinDockerContainer(name, key, "transcoded-bucket-name", "transcoded-bucket-key");
                }
    
                await AWSHelper.deleteSingleMessage(Messages, SQS_QUEUE_URL);
                
            } else {

                AWSHelper.deleteMultipleMessage(Messages, SQS_QUEUE_URL)

            }
        } catch (error) {

            console.log("error:", error);
            
        }

    }
}

main();