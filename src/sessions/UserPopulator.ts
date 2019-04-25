import { PluginUser } from "yack-plugin-framework";
import { setDateFormat as format, kFormatter } from "../utils/PluginUtils"
import { userInfo } from "os";

export function populateUser(data:any): PluginUser{
    const summary = data.summary

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
        tags: [
            `${summary.days_visited} days visited`,
            `${format(summary.time_read)} read time`,
            `${format(summary.recent_time_read)} recent read time`,
            `${kFormatter(summary.topics_entered)} topics viewed`,
            `${kFormatter(summary.posts_read_count)} posts read`,
            `${kFormatter(summary.likes_given)} ❤️ given`,
            `${kFormatter(summary.topic_count)} topics created`,
            `${kFormatter(summary.post_count)} posts created`,
            `${kFormatter(summary.likes_received)} ❤️ received`,
            `${kFormatter(summary.solved_count)} solutions`,
            // `${summary}`,
            // `${summary}`,
            // `${summary}`,
        ],
        metadata: {}
    }

    return user;
}


export function badgeToTag(data:any){

}