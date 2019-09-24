
// Collection prerequest script

function logger(){
    return console.log(`IT WORKED`);
}

const test = logger.toString();

const update = {
        "description": "This is a sample POST request",
        "url": "https://api.getpostman.com/environments/5302990-a5a347b1-b01a-47ac-a729-0cd76449dad0",
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
            "name": "connector",
                "values": [{"key": "test", "value": test}]
        }})
        }
    };


    pm.sendRequest(update, function (err, res) {
        console.log(err ? err : res.json());
      });

// pm.environment.set("test", test);




// Channels prerequest script
if(pm.environment.has('test')){
    // console.log(pm.environment.get('test'));
    // function cb(){
    //     pm.environment.get('test');
    //     return 
    // }
    eval(pm.environment.get('test'));
    logger();
}
