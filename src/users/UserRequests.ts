export async function getUserStats(rootUrl, get, userId: string, options, config){
    const url = `${rootUrl}/u/${userId}/summary.json`
    let response;

    if (!!options.session.user) {
        response = await get(url, {
            responseType: "json",
            headers: {
                [config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
            }
        });
    } else {
        response = await get(url);
    }
    // response = await get(url)
    const stats = response.data;
    return stats
}

export async function getUserData(rootUrl, get, userId: string, options, config){
    const url = `${rootUrl}/u/${userId}.json`
    let response;

    if (!!options.session.user) {
        response = await get(url, {
            responseType: "json",
            headers: {
                [config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
            }
        });
    } else {
        response = await get(url);
    }
    const data = response.data;
    return data
}