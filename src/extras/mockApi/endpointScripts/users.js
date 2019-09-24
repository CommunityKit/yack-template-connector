const channels = JSON.parse(pm.environment.get('channels'));
const threads = JSON.parse(pm.environment.get('threads'));
const users = JSON.parse(pm.environment.get('users'));
const comments = JSON.parse(pm.environment.get('comments'));
const postmanApiKey = pm.variables.get('postmanApiKey');

// const comments = JSON.parse(pm.variables.get('comments'));
// const threads = JSON.parse(pm.variables.get('threads'));
// const users = JSON.parse(pm.variables.get('users'));


// console.log(JSON.stringify(channels));
const baseUrl = pm.variables.get('baseUrl');



let getById = typeof parseInt(pm.request.url.variables.get('user_id')) === "number" && pm.request.url.path.length > 1;
let threadsByUser = typeof parseInt(pm.request.url.variables.get('user_id')) === "number" && pm.request.url.path.length == 3 && pm.request.url.path[2] === "threads";
let commentsByUser = typeof parseInt(pm.request.url.variables.get('user_id')) === "number" && pm.request.url.path.length == 3 && pm.request.url.path[2] === "comments";

let userId;
// let getAllChannels = pm.request.url.path[0] === "channels" && pm.request.url.path.length === 1;
// let hasSomeChannels = pm.environment.has("users");
let validRequest = getById || threadsByUser || commentsByUser || (pm.request.url.path.length === 1 && pm.request.url.path[0] === "users")
// let channels = JSON.parse(pm.environment.get('channels'));

console.log("users Request")

if(validRequest){
    console.log('validRequest')
    if(getById){
        userId = parseInt(pm.request.url.variables.get('user_id'));
        const validUser = _.some(users, "id", userId);
        console.log('validUser:' + validUser);

        if(validUser){
            console.log('validUser')
            if(threadsByUser){
                console.log('threadsByUser')

                // Get user's threads
                const threadsList = _.filter(threads, "creator_id", userId);
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
                                {"key": "threadsByUserId", "value": JSON.stringify(threadsList)},
                                {"key": "selectedUser", "value": userId.toString()}
                            ]
                    }})
                    }
                };
            
            
                pm.sendRequest(update, function (err, res) {
                  console.log(err ? err : res.json());
                });
                // pm.environment.set('selectedChannel', channelId);

                // pm.environment.set('channelById', JSON.stringify(channels[index]));
            }else if(commentsByUser){
                console.log('commentsByUser')

                // Get user's threads
                const commentsList = _.filter(comments, "creator_id", userId);
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
                                {"key": "commentsByUserId", "value": JSON.stringify(commentsList)},
                                {"key": "selectedUser", "value": userId.toString()}
                            ]
                    }})
                    }
                };
            
            
                pm.sendRequest(update, function (err, res) {
                  console.log(err ? err : res.json());
                });
            }else{
                // find single user
                const index = _.findIndex(users, "id", userId);
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
                                {"key": "userById", "value": JSON.stringify(users[index])},
                                {"key": "selectedUser", "value": userId.toString()}
                            ]
                    }})
                    }
                };
            
            
                pm.sendRequest(update, function (err, res) {
                  console.log(err ? err : res.json());
                });
                // pm.environment.set('selectedChannel', channelId);

                // pm.environment.set('channelById', JSON.stringify(channels[index]));

            }
            
        }else{
            const badChannel = [
                {
                    "status": "400",
                    "message": "Bad Request",
                    "info": "Requested user does not exist"
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
                            {"key": "userById", "value": JSON.stringify(badChannel)},
                            {"key": "selectedUser", "value": userId.toString()}
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
        // get all users
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
                            {"key": "comments", "value": JSON.stringify(comments)}
                    ]
            }})
            }
        };
    
    
        pm.sendRequest(update, function (err, res) {
          console.log(err ? err : res.json());
        });
    }  
    
}
// } else{
//         const fullPath = pm.request.url.path.join('/');
//         pm.environment.set('requestPath', fullPath)
// }