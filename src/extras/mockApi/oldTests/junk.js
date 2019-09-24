
const channels = JSON.parse(pm.variables.get('channels'));
console.log(JSON.stringify(channels));
const baseUrl = pm.variables.get('baseUrl');


let getById = pm.request.url.path.length > 1;
let channelId;
// let getAllChannels = pm.request.url.path[0] === "channels" && pm.request.url.path.length === 1;
let validRequest = (pm.request.url.path.length > 1 && pm.request.url.path[0] === "channels" && typeof parseInt(pm.request.url.variables.get('id')) === "number") || (pm.request.url.path.length === 1 && pm.request.url.path[0] === "channels")
// let channels = JSON.parse(pm.environment.get('channels'));

if(validRequest){
    if(getById){
        console.log('getById');
        channelId = parseInt(pm.request.url.variables.get('id'));
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
    }else{
        // Get all channels
        pm.environment.set('channels', JSON.stringify(channels));
    } 
    
}
// } else{
//         const fullPath = pm.request.url.path.join('/');
//         pm.environment.set('requestPath', fullPath)
// }




'https://runkit.runkit.io/endpoint-demo-1/branches/master'

'https://katrpilar.runkit.io/5d89007669cc89001363b43d/branches/master'

'https://katrpilar.runkit.io/5d89007669cc89001363b43d/branches/master'

'curl https://katrpilar.runkit.sh/5d89007669cc89001363b43d/branches/master'

'https://runkit.io/katrpilar/5d89007669cc89001363b43d/branches/master'

'https://untitled-0152ci1z87r0.runkit.sh/'

'https://create-mock-data-0152ci1z87r0.runkit.sh/'

