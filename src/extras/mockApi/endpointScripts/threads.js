
const channels = JSON.parse(pm.environment.get('channels'));
const threads = JSON.parse(pm.environment.get('threads'));
const users = JSON.parse(pm.environment.get('users'));
const comments = JSON.parse(pm.environment.get('comments'));
const postmanApiKey = pm.variables.get('postmanApiKey');

// const channels = JSON.parse(pm.variables.get('channels'));
// const threads = JSON.parse(pm.variables.get('threads'));

// console.log(JSON.stringify(channels));
const baseUrl = pm.variables.get('baseUrl');

let getById = pm.request.url.path.length > 1;
let channelId;
// let getAllChannels = pm.request.url.path[0] === "channels" && pm.request.url.path.length === 1;
let hasSomeChannels = pm.environment.has("channels");
let validRequest = (pm.request.url.path.length > 1 && pm.request.url.path[1] === "threads" && typeof parseInt(pm.request.url.variables.get('channel_id')) === "number") || (pm.request.url.path.length === 1 && pm.request.url.path[0] === "threads")
// let channels = JSON.parse(pm.environment.get('channels'));

if(validRequest){
    if(getById){
        channelId = parseInt(pm.request.url.variables.get('channel_id'));
        const validChannel = _.some(threads, "channel_id", channelId);
        console.log('validChannel:' + validChannel);

        if(validChannel){
            const threadsList = _.filter(threads, "channel_id", channelId);
            const update = {
                "description": "This is a sample POST request",
                "url": "https://api.getpostman.com/environments/5302990-eccd6cd8-5772-48df-b6ff-c675e8530224",
                "method": "PUT",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    },
                    {
                        "key": "x-api-key",
                        "value": postmanApiKey
                    }
                ],
                "body": {
                    'mode': 'raw',
                    'raw': JSON.stringify({
                    "environment": {
                    "name": "refactor",
                        "values": [
                            {"key": "baseUrl", "value": baseUrl},
                            {"key": "channels", "value": JSON.stringify(channels)},
                            {"key": "threads", "value": JSON.stringify(threads)},
                            {"key": "users", "value": JSON.stringify(users)},
                            {"key": "comments", "value": JSON.stringify(comments)},
                            {"key": "threadsById", "value": JSON.stringify(threadsList)},
                            {"key": "selectedChannel", "value": channelId.toString()}
                        ]
                }})
                }
            };
        
        
            pm.sendRequest(update, function (err, res) {
              console.log(err ? err : res.json());
            });
            // pm.environment.set('selectedChannel', channelId);

            // pm.environment.set('channelById', JSON.stringify(channels[index]));
        }else{
            const badChannel = [
                {
                    "status": "400",
                    "message": "Bad Request",
                    "info": "Requested channel does not exist"
                }
            ];

            const update = {
                "description": "This is a sample POST request",
                "url": "https://api.getpostman.com/environments/5302990-eccd6cd8-5772-48df-b6ff-c675e8530224",
                "method": "PUT",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    },
                    {
                        "key": "x-api-key",
                        "value": postmanApiKey
                    }
                ],
                "body": {
                    'mode': 'raw',
                    'raw': JSON.stringify({
                    "environment": {
                    "name": "refactor",
                        "values": [
                            {"key": "baseUrl", "value": baseUrl},
                            {"key": "channels", "value": JSON.stringify(channels)},
                            {"key": "threads", "value": JSON.stringify(threads)},
                            {"key": "users", "value": JSON.stringify(users)},
                            {"key": "comments", "value": JSON.stringify(comments)},
                            {"key": "threadsById", "value": JSON.stringify(badChannel)},
                            {"key": "selectedChannel", "value": channelId.toString()}
                        ]
                }})
                }
            };
        
        
            pm.sendRequest(update, function (err, res) {
              console.log(err ? err : res.json());
            });

            // pm.environment.set('selectedChannel', channelId);
            // pm.environment.set('channelById', JSON.stringify(badChannel));
            // Need to figure out how to change the status from 200 to 400
        }
    }else{
        // Get all threads
        // pm.environment.set('threads', JSON.stringify(threads));
        const update = {
            "description": "This is a sample POST request",
            "url": "https://api.getpostman.com/environments/5302990-eccd6cd8-5772-48df-b6ff-c675e8530224",
            "method": "PUT",
            "header": [
                {
                    "key": "Content-Type",
                    "value": "application/json"
                },
                {
                    "key": "x-api-key",
                    "value": postmanApiKey
                }
            ],
            "body": {
                'mode': 'raw',
                'raw': JSON.stringify({
                "environment": {
                "name": "refactor",
                    "values": [
                        {"key": "baseUrl", "value": baseUrl},
                        {"key": "channels", "value": JSON.stringify(channels)},
                            {"key": "threads", "value": JSON.stringify(threads)},
                            {"key": "users", "value": JSON.stringify(users)},
                            {"key": "comments", "value": JSON.stringify(comments)},
                        {"key": "threads", "value": JSON.stringify(threads)}
                    ]
            }})
            }
        };
    
    
        pm.sendRequest(update, function (err, res) {
          console.log(err ? err : res.json());
        });
    } 
    
}
