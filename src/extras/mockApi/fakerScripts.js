
console.log('hello world');


const faker = require('faker');
const _ = require('lodash');


function makeChannels(){
    let randomNum = _.random(5,15);
    let newChannels = [];
    while(randomNum > 0){
        const newChannel = {
            "id": faker.random.number(),
            "description": faker.company.catchPhrase(),
            "profile_photo": faker.image.cats(),
            "name": faker.commerce.department(),
            "nsfw": faker.random.boolean(),
            "subscribers":  faker.random.number(),
            "subscriptions":  faker.random.number()
        };
        randomNum = randomNum - 1;
        newChannels.push(newChannel);
    }
        return newChannels;
}

const allChannels = makeChannels();

function makeThreads(channelId){
    let numberOfThreads = _.random(2, 8);
    let newThreads = [];
    while(numberOfThreads > 0){
        const newThread = {
            "id": faker.random.number(),
            "featured_photo": faker.image.cats(),
            "channel_id": channelId,
            "body_content": faker.lorem.sentence(),
            "likes": faker.random.number(),
            "title": faker.company.catchPhrase(),
            "created": faker.date.recent(),
            "creator_id": faker.random.number(),
            "creator_username": faker.internet.userName()
        };
        numberOfThreads = numberOfThreads - 1;
        newThreads.push(newThread);

        // push to allThreads persisted obj
        // threads.push(newThread);
    }
    return newThreads;
}

function makeUser(userId, userName){
        const newUser = {
    "id": userId,
       "subscribers":faker.random.number(),
    "subscriptions": faker.random.number(),
    "username": userName,
    "about": faker.hacker.phrase(),
    "email":faker.internet.email(),
    "profile_picture": faker.image.avatar(),
    "created": faker.date.past(),
    "moderator": faker.random.boolean(),
    "verified": faker.random.boolean()
  }
    return newUser;
}

const topComments = [];

let tmpReplies = [];


function makeComments(userId, threadId){
    const newComment = {
        "id":faker.random.number(),
        "content": faker.lorem.sentence(),
        "created":faker.date.recent(),
        "thread_id": threadId,
        "creator_id": userId,
        "reply_to_comment_id":null
    };
    topComments.push(newComment);

    if(newComment.id % 2 == 0){
        // making replies for all the even comment ids
        makeReply(newComment.creator_id, newComment.thread_id, newComment.id, newComment.created);
    }  
}

function makeReply(userId, threadId, commentId){
    const newComment = {
        "id":faker.random.number(),
        "content": faker.lorem.sentence(),
        "created":faker.date.recent(),
        "thread_id": threadId,
        "creator_id": userId,
        "reply_to_comment_id":commentId
    };
    tmpReplies.push(newComment);
    if(newComment.id % 2 != 0 && newComment.id > 4000){
        // making replies for some odd replies
        makeReply(newComment.creator_id, newComment.thread_id, newComment.id, newComment.created);
    }    
}


let allThreads = [];

for(const item of allChannels){
  const newThreads = makeThreads(item.id);
  allThreads.push(newThreads);
}

allThreads = _.flatten(allThreads);

const allUsers = [];

for(const thread of allThreads){
  const newUser = makeUser(thread.creator_id, thread.creator_userName);
  allUsers.push(newUser);
     // console.log('thread id:' + thread.id);

  if(thread.id % 2 == 0){
    //generate a random number of comments
    let numberOfComments = _.random(1, 15);
    makeComments(thread.creator_id, thread.id);
    while(numberOfComments > 0){
        makeComments(thread.creator_id, thread.id);
        numberOfComments = numberOfComments - 1;
    }
  }
}

let allComments = _.flatten(tmpReplies, topComments);




console.log('Channel Count:' + allChannels.length + ',' + 'Threads Count:' + allThreads.length + ',' + 'Users Count:' + allUsers.length + ',' + 'Top Comments:' + topComments.length + ',' + 'Replies Count:' + tmpReplies.length);

console.log(JSON.stringify(allChannels));
console.log(JSON.stringify(allThreads));
console.log(JSON.stringify(allUsers));
console.log(JSON.stringify(allComments));