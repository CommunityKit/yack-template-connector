const baseUrl = eval(pm.environment.get('baseUrl'));
const channels = eval(pm.environment.get('channels'));
const users = eval(pm.environment.get('users'));
const threads = eval(pm.environment.get('threads'));
const comments = eval(pm.environment.get('comments'));


eval(baseUrl);
eval(channels);
eval(users);
eval(threads);
eval(comments);

    let getById = pm.request.url.path.length > 1;
    let channelId;
    // let getAllChannels = pm.request.url.path[0] === "channels" && pm.request.url.path.length === 1;
    let hasSomeChannels = pm.environment.has("channels");
    let validRequest = (pm.request.url.path.length > 1 && pm.request.url.path[0] === "channels" && typeof parseInt(pm.request.url.path[1]) === "number") || (pm.request.url.path.length === 1 && pm.request.url.path[0] === "channels")
    // let channels = JSON.parse(pm.environment.get('channels'));

    if(validRequest){
        if(getById){
            channelId = parseInt(pm.request.url.path[1]);
            const validChannel = _.some(channels, "id", channelId);
            console.log('validChannel:' + validChannel);

            if(validChannel){
                const index = _.findIndex(channels, "id", channelId);
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
                            "value": "3a464852f4e04cdba66ac7d998bc5d9a"
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
                                {"key": "channelById", "value": JSON.stringify(channels[index])},
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
                            "value": "3a464852f4e04cdba66ac7d998bc5d9a"
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
                                {"key": "channelById", "value": JSON.stringify(badChannel)},
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
        }  
        
    }
// } else{
//         const fullPath = pm.request.url.path.join('/');
//         pm.environment.set('requestPath', fullPath)
// }