
// if(pm.request.url.path.length === 1){
// }
let mergedThreadsList;
if(pm.environment.has("idResponse")){
    // Check if thread with id already exists
    threadsList = JSON.parse(pm.environment.get("allThreads"));
    
    const inList = _.some(threadsList, "channel_id", parseInt(pm.request.url.path[0]));
    if(inList === false){
        const oldThreads = pm.environment.get("allThreads");
        const newThreads = JSON.parse(responseBody);
        const combinedThreads = _.merge(oldThreads, newThreads);
        pm.environment.set("allThreads", JSON.stringify(combinedThreads));
    }
}else{
    pm.environment.set("allThreads", responseBody);
}