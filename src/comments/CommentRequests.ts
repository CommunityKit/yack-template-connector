// export async function getUserCreatedContent(get, rootUrl, userId: string, currentPageToken){

//     // CHANGE TO THIS ENDPOINT: https://community.cartalk.com/user_actions.json?offset=0&username=b.l.e&filter=5&no_results_help_key=user_activity.no_replies&_=1556298757193
//     // NEXT PAGE: https://community.cartalk.com/user_actions.json?offset=30&username=b.l.e&filter=5&no_results_help_key=user_activity.no_replies&_=1556298757194
//     // offset starts at 0 and increments by 30
//     // nextPage Token = total pages + nextpageNum
//     const perPageSize = 30;
//     let nextToken;
//     // let nextToken;

//     const incrementToken = (num: number) => {
//         return num + perPageSize
//     }
//     const setNextToken = (maxPageToken, nextToken) => {
//         return `${maxPageToken} ${nextToken}`
//     }

//     if(currentPageToken){
//         const maxPageToken = currentPageToken.split(" ")[0]
//         if(currentPageToken < maxPageToken){
//             nextToken = setNextToken(maxPageToken, incrementToken(currentPageToken))
//             // nextToken = `${maxPageToken} ${incrementToken(currentPageToken)}`
//             // Increment token
//         }else{
//             nextToken = null
//         }

//     }else{
//         // check if has enough content for pagination
//         const summaryUrl = `${rootUrl}/u/${userId}/summary.json`
//         const userResp = await get(summaryUrl)
//         const topicCount = userResp.data.user_summary.topic_count;
//         if(topicCount > 30){
//             // nextPageToken = `maxToken currentToken`
//             const maxPageToken = Math.ceil(topicCount / perPageSize) * perPageSize;
//             nextToken = setNextToken(maxPageToken, incrementToken(currentPageToken))

//                 // nextToken = `${maxPageToken} ${incrementToken(currentPageToken)}`
//                 // totalPages = Math.ceil(topicCount / perPageSize);
//             // requires pagination
//             // calculate and set the nextPageToken
//         }else{
//             nextToken = null
//         }

//         // set nextPageToken if do
//     }

//     const url = `${rootUrl}/user_actions.json?offset=${currentPageToken}&username=${userId}&filter=5&no_results_help_key=user_activity.no_replies`
//     // const url = `${rootUrl}/u/${userId}/activity.json`
//     const response = await get(url, {
//         headers: {
//             "content-type": "application/json; charset=utf-8",
//             "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3"
//         }
//     })

//     const userThreads = response.data.user_actions
//     userThreads.nextPageToken = nextToken;

//     return userThreads;
//     // const userThreads = filterUserthreads(response.data)
//     // const userComments = filterUserComments(response.data)
//     // return {userThreads: userThreads, userComments: userComments} ;
// }