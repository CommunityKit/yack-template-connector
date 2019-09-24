const channels = JSON.parse(pm.environment.get('channels'));
const threads = JSON.parse(pm.environment.get('threads'));
const users = JSON.parse(pm.environment.get('users'));
const comments = JSON.parse(pm.environment.get('comments'));
const postmanApiKey = pm.variables.get('postmanApiKey');

// const comments = JSON.parse(pm.variables.get('comments'));
// const threads = JSON.parse(pm.variables.get('threads'));

// console.log(JSON.stringify(channels));
const baseUrl = pm.variables.get('baseUrl');
// let testPath = {"url":{"path":["comments",":comment_id","replies"],"host":["{{baseUrl}}"],"query":[],"variable":[{"type":"any","value":"22619","key":"comment_id"}]},"header":[{"key":"Content-Type","value":"application/json"}],"method":"GET"}    
    
    let getCommentsByThreadId = pm.request.url.path.length == 2 && pm.request.url.path[0] === ":thread_id" && typeof parseInt(pm.request.url.variables.get('thread_id')) == "number";
    let getReplies = pm.request.url.path.length == 3 && pm.request.url.path[1] === ":comment_id" && typeof parseInt(pm.request.url.variables.get('comment_id')) == "number" && pm.request.url.path[2] == "replies";
    let threadId;
    let validRequest = getCommentsByThreadId || getReplies;
    // let channels = JSON.parse(pm.environment.get('channels'));

    if(validRequest){
        if(getCommentsByThreadId){
            threadId = parseInt(pm.request.url.variables.get('thread_id'));
            const validThread = _.some(threads, "id", threadId);
            console.log('validThread:' + validThread);

            if(validThread){
                // const index = _.findIndex(channels, "id", threadId);
                const commentsByThread = _.filter(comments, "thread_id", threadId);
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
                                {"key": "commentsByThread", "value": JSON.stringify(commentsByThread)},
                                {"key": "selectedThread", "value": threadId.toString()}
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
                const badThread = [
                    {
                        "status": "400",
                        "message": "Bad Request",
                        "info": "Requested thread comments do not exist - invalid thread id."
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
                                {"key": "commentsByThread", "value": JSON.stringify(badThread)},
                                {"key": "selectedThread", "value": threadId.toString()}
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
        } else if(getReplies){
            commentId = parseInt(pm.request.url.variables.get('comment_id'));
            const validComment = _.some(comments, "id", commentId);
            console.log('validComment:' + validComment);

            if(validComment){
                // const index = _.findIndex(channels, "id", threadId);
                const repliesByCommentId = _.filter(comments, "reply_to_comment_id", commentId);
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
                                {"key": "repliesByCommentId", "value": JSON.stringify(repliesByCommentId)},
                                {"key": "selectedComment", "value": commentId.toString()}
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
               
                const badComment = [
                    {
                        "status": "400",
                        "message": "Bad Request",
                        "info": "Requested comment replies do not exist - invalid comment id."
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
                                {"key": "repliesByCommentId", "value": JSON.stringify(badComment)},
                                {"key": "selectedComment", "value": commentId.toString()}
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
    // }else{
    //     // TBD UPDATE THIS TO RETURN AN ERROR FOR AN INVALID REQUEST
    //     // const replies = _.filter(comments, item => item.reply_to_comment_id != null);
    //     // console.log(JSON.stringify(replies));
    //     // const badComments = _.filter(replies, item => !(_.some(comments, "id", item["reply_to_comment_id"])));
    //     // console.log('YOU HAVE MALFORMED COMMENTS' + badComments.length);

    //     // console.log(JSON.stringify(badComments));

    // }
// } else{
//         const fullPath = pm.request.url.path.join('/');
//         pm.environment.set('requestPath', fullPath)
// }