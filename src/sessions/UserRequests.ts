export async function getUserStats(rootUrl, get, userId: string){
    const url = `${rootUrl}/u/${userId}/summary.json`
    const response = await get(url)
    const stats = response.data;
    return stats
}

export async function getUserData(rootUrl, get, userId: string){
    const url = `${rootUrl}/u/${userId}.json`
    const response = await get(url)
    const data = response.data;
    return data
}