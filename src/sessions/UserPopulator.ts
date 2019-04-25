import { PluginUser } from "yack-plugin-framework";
import { setDateFormat as format, kFormatter } from "../utils/PluginUtils"
import { userInfo } from "os";
import { stat } from "fs";

export function populateUser(data:any): PluginUser{
    const summary = data.summary
    let badges = []
    data.badges ? data.badges.forEach(element => {
        badges.push(element.name)
    }) : null;

    let stats = []
    // for(const summary of data.summary){
        summary.days_visited > 0 ? stats.push(`${summary.days_visited} days visited`): null;
            format(summary.time_read) != 0 ? stats.push(`${format(summary.time_read)} read time`): null;
            format(summary.recent_time_read) != 0 ? stats.push(`${format(summary.recent_time_read)} recent read time`): null;
            parseInt(kFormatter(summary.topics_entered)) > 0 ? stats.push(`${kFormatter(summary.topics_entered)} topics viewed`): null;
            parseInt(kFormatter(summary.posts_read_count)) > 0 ? stats.push(`${kFormatter(summary.posts_read_count)} posts read`): null;
            parseInt(kFormatter(summary.likes_given)) > 0 ? stats.push(`${kFormatter(summary.likes_given)} ❤️ given`): null;
            parseInt(kFormatter(summary.topic_count)) > 0 ? stats.push(`${kFormatter(summary.topic_count)} topics created`)   : null   ;      
            parseInt(kFormatter(summary.post_count)) > 0 ? stats.push(`${kFormatter(summary.post_count)} posts created`) : null;
            parseInt(kFormatter(summary.likes_received)) > 0 ? stats.push(`${kFormatter(summary.likes_received)} ❤️ received`): null;
            parseInt(kFormatter(summary.solved_count)) > 0 ? stats.push(`${kFormatter(summary.solved_count)} solutions`): null;
    // }
    let tags = stats
    for(const item of badges){
        tags.push(item)
    }

    console.log(`YOUR UGLY FACE ${`https://discourse-cdn-sjc1.com/${data.communityName}/user_avatar/${data.partialUrl}/${data.userInfo.username.toLowerCase()}/240/${data.userInfo.custom_avatar_upload_id}_2.png`}`)

    const user: PluginUser = {
        // summary badges userInfo
        id: data.userInfo.username,
        username:  data.userInfo.username,
        fullName:  data.userInfo.name,
        about: data.userInfo.bio_cooked,
        utcCreateDate: Date.parse(data.userInfo.created_at),
        profileImageUrl: `https://discourse-cdn-sjc1.com/${data.communityName}/user_avatar/${data.partialUrl}/${data.userInfo.username.toLowerCase()}/240/${data.userInfo.custom_avatar_upload_id}_2.png`,
        // https://discourse-cdn-sjc1.com/cartalk/user_avatar/community.cartalk.com/barkydog/240/2470_2.png
        moderator: data.userInfo.moderator,
        tags: tags,
            
            // summary.days_visited > 0 && `${summary.days_visited} days visited`,
            // format(summary.time_read) != 0 && `${format(summary.time_read)} read time`,
            // format(summary.recent_time_read) != 0 && `${format(summary.recent_time_read)} recent read time`,
            // parseInt(kFormatter(summary.topics_entered)) > 0 && `${kFormatter(summary.topics_entered)} topics viewed`,
            // parseInt(kFormatter(summary.posts_read_count)) > 0 && `${kFormatter(summary.posts_read_count)} posts read`,
            // parseInt(kFormatter(summary.likes_given)) > 0 && `${kFormatter(summary.likes_given)} ❤️ given`,
            // parseInt(kFormatter(summary.topic_count)) > 0 && `${kFormatter(summary.topic_count)} topics created`,
            // parseInt(kFormatter(summary.post_count)) > 0 && `${kFormatter(summary.post_count)} posts created`,
            // parseInt(kFormatter(summary.likes_received)) > 0 && `${kFormatter(summary.likes_received)} ❤️ received`,
            // parseInt(kFormatter(summary.solved_count)) > 0 && `${kFormatter(summary.solved_count)} solutions`,
            // `${summary}`,
            // `${summary}`,
            // `${summary}`,
        metadata: {}
    }

    return user;
}


export function badgeToTag(data:any){

}