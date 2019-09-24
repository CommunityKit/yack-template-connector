// if(pm.environment.has('testing')){
    eval(pm.environment.get('testing'));
// }

    let getById = pm.request.url.path.length > 1;
    let channelId;
    // let getAllChannels = pm.request.url.path[0] === "channels" && pm.request.url.path.length === 1;
    let hasSomeChannels = pm.environment.has("allChannels");
    let validRequest = (pm.request.url.path.length > 1 && pm.request.url.path[0] === "channels" && typeof parseInt(pm.request.url.path[1]) === "number") || (pm.request.url.path.length === 1 && pm.request.url.path[0] === "channels")
    let channels = [
        {
            "id": "205",
            "description": "synthesizing the bus won't do anything, we need to copy the mobile HTTP panel!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Music",
            "nsfw": "true",
            "subscribers": "522",
            "subscriptions": "784"
        },
        {
            "id": "380",
            "description": "If we program the monitor, we can get to the RAM system through the wireless SMS feed!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Health",
            "nsfw": "false",
            "subscribers": "745",
            "subscriptions": "237"
        },
        {
            "id": "124",
            "description": "We need to program the redundant EXE program!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Kids",
            "nsfw": "false",
            "subscribers": "587",
            "subscriptions": "608"
        },
        {
            "id": "580",
            "description": "navigating the sensor won't do anything, we need to copy the bluetooth THX firewall!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Toys",
            "nsfw": "true",
            "subscribers": "880",
            "subscriptions": "305"
        },
        {
            "id": "349",
            "description": "Try to compress the RAM feed, maybe it will synthesize the haptic matrix!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Electronics",
            "nsfw": "false",
            "subscribers": "96",
            "subscriptions": "883"
        },
        {
            "id": "475",
            "description": "I'll parse the redundant GB port, that should alarm the RSS array!",
            "profile_photo": "http://lorempixel.com/640/480/cats",
            "name": "Books",
            "nsfw": "false",
            "subscribers": "912",
            "subscriptions": "50"
        }
    ];

    if(validRequest){
        // if(hasSomeChannels === false){
        //     const makeRandomChannels = makeChannels();
            // updateEnv([{"key": "allChannels", "value": JSON.stringify(makeRandomChannels)}])
        //     channels = makeRandomChannels;
        // }else{
        //     channels = JSON.parse(pm.environment.get("allChannels"));
        // }

        updateEnv([{"key": "allChannels", "value": JSON.stringify(channels)}])

        
        if(getById){
            channelId = pm.request.url.path[1];
            const validChannel = validId(channels, pm.request.url.path[1]);

            if(validChannel){
                // pm.environment.set("selectedChannel", channelId.toString());
                const index = _.findIndex(channels, "id", channelId);
                updateEnv([{"key": "channelById", "value": JSON.stringify(channels[index])}, {"key": "selectedChannel", "value": channelId.toString()}]);
            }else{
                // pm.environment.set("selectedChannel", channelId.toString());
                const badChannel = [
                    {
                        "status": "400",
                        "message": "Bad Request",
                        "info": "Requested channel does not exist"
                    }
                ];
                updateEnv([{"key": "channelById", "value": JSON.stringify(badChannel)}, {"key": "selectedChannel", "value": channelId.toString()}]);
                // Need to figure out how to change the status from 200 to 400
            }
        }
        // else if(getAllChannels){
        //     // if(pm.environment.has("allChannels" === false)){
        //     pm.environment.get("allChannels");
        //     // }

        //     // clear selectedChannel
        //     if(pm.environment.has("selectedChannel")){
        //         pm.environment.unset("selectedChannel");
        //     }
        // }       
        
    }else{
        const fullPath = pm.request.url.path.join('/');
        updateEnv([
            {"key": "requestPath", "value": fullPath}
        ])
        // pm.environment.set("requestPath", fullPath);
    }

    function makeChannels(){
        let randomNum = _.random(5,15);
        let newChannels = [];
        while(randomNum > 0){
            const newChannel = {
                "id": "{{$randomInt}}",
                "description": "{{$randomPhrase}}",
                "profile_photo": "{{$randomCatsImage}}",
                "name": "{{$randomDepartment}}",
                "nsfw": "{{$randomBoolean}}",
                "subscribers": "{{$randomInt}}",
                "subscriptions": "{{$randomInt}}"
            };
            randomNum = randomNum - 1;
            newChannels.push(newChannel);
        }
        return newChannels;
    }



    function validId(envVarData, id){
        const isValidItem = _.some(envVarData, "id", id);
        return isValidItem;
    }
    

  
  
  

// const channels = [
//     {
//         "id": 625,
//         "description": "fermentum donec ut mauris eget massa tempor convallis nulla neque libero convallis eget eleifend luctus ultricies eu nibh quisque",
//         "profile_photo": "https://robohash.org/corporiseumofficiis.jpg?size=50x50&set=set1",
//         "name": "Comedy|Drama",
//         "nsfw": true,
//         "subscribers": 952,
//         "subscriptions": 27
//     },
//     {
//         "id": 402,
//         "description": null,
//         "profile_photo": "https://robohash.org/quibusdamnostrumeius.jpg?size=50x50&set=set1",
//         "name": "Comedy",
//         "nsfw": true,
//         "subscribers": 61,
//         "subscriptions": 33
//     },
//     {
//         "id": 734,
//         "description": null,
//         "profile_photo": "https://robohash.org/ipsaquasireiciendis.jpg?size=50x50&set=set1",
//         "name": "Comedy|Fantasy|Sci-Fi",
//         "nsfw": false,
//         "subscribers": null,
//         "subscriptions": 99
//     },
//     {
//         "id": 417,
//         "description": "dictumst aliquam augue quam sollicitudin vitae consectetuer eget rutrum at lorem integer tincidunt ante vel ipsum praesent blandit",
//         "profile_photo": "https://robohash.org/velmagniblanditiis.jpg?size=50x50&set=set1",
//         "name": "Action|Adventure|Animation|Children|Comedy|Sci-Fi",
//         "nsfw": false,
//         "subscribers": null,
//         "subscriptions": 21
//     },
//     {
//         "id": 593,
//         "description": "augue vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae donec pharetra magna vestibulum aliquet",
//         "profile_photo": "https://robohash.org/quoaccusamusqui.jpg?size=50x50&set=set1",
//         "name": "Action|Crime|Drama",
//         "nsfw": false,
//         "subscribers": 1879,
//         "subscriptions": 4
//     },
//     {
//         "id": 987,
//         "description": "nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis elementum ligula vehicula consequat morbi a ipsum",
//         "profile_photo": "https://robohash.org/nequequibusdamnesciunt.jpg?size=50x50&set=set1",
//         "name": "Comedy",
//         "nsfw": true,
//         "subscribers": null,
//         "subscriptions": 28
//     },
//     {
//         "id": 629,
//         "description": "mi integer ac neque duis bibendum morbi non quam nec dui luctus rutrum nulla tellus in",
//         "profile_photo": "https://robohash.org/occaecativoluptasodit.jpg?size=50x50&set=set1",
//         "name": "Thriller",
//         "nsfw": false,
//         "subscribers": 5335,
//         "subscriptions": 24
//     },
//     {
//         "id": 140,
//         "description": "malesuada in imperdiet et commodo vulputate justo in blandit ultrices enim lorem",
//         "profile_photo": "https://robohash.org/sitplaceatimpedit.jpg?size=50x50&set=set1",
//         "name": "Action|Crime|Drama",
//         "nsfw": false,
//         "subscribers": 9683,
//         "subscriptions": 38
//     },
//     {
//         "id": 24,
//         "description": null,
//         "profile_photo": "https://robohash.org/autdoloribusaliquid.jpg?size=50x50&set=set1",
//         "name": "Action|Drama|War",
//         "nsfw": false,
//         "subscribers": 9289,
//         "subscriptions": 86
//     },
//     {
//         "id": 620,
//         "description": null,
//         "profile_photo": "https://robohash.org/doloresquasivoluptatum.jpg?size=50x50&set=set1",
//         "name": "Action|Sci-Fi",
//         "nsfw": false,
//         "subscribers": null,
//         "subscriptions": 34
//     }
// ];

// if(pm.request.url.path[0] === "channels" && pm.request.url.path.length > 1){
//     pm.environment.set("selectedChannel", pm.request.url.path[1]);
//     const index = _.findIndex(channels, "id", parseInt(pm.request.url.path[1]));
//     updateChannel(channels[index]);
//     // // JSON.stringify(channels[index])
//     // pm.environment.set("channelById", JSON.stringify(channels[0]));
    
//     pm.sendRequest('https://api.getpostman.com/environments/{{environment_uid}}')
// }else if(pm.environment.has("selectedChannel")){
//     pm.environment.unset("selectedChannel");
// }

// function updateChannel(someData){
//     const update = {
//         "description": "This is a sample POST request",
//         "url": "https://api.getpostman.com/environments/5302990-a5a347b1-b01a-47ac-a729-0cd76449dad0",
//         "method": "PUT",
//         "header": [
//             {
//                 "key": "Content-Type",
//                 "value": "application/json"
//             },
//             {
//                 "key": "x-api-key",
//                 "value": "3a464852f4e04cdba66ac7d998bc5d9a"
//             }
//         ],
//         "body": {
//             'mode': 'raw',
//             'raw': JSON.stringify({
//             "environment": {
//             "name": "connector",
//                 "values": [
//                     {"key": "channelById", "value": JSON.stringify(someData)}
//                 ]
//         }})
//         }
//     };


//     pm.sendRequest(update, function (err, res) {
//       console.log(err ? err : res.json());
//     });
// }


// console.log(JSON.stringify(pm.request));
