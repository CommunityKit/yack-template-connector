import { PluginUser } from "yack-plugin-framework";
import { setDateFormat as format, kFormatter } from "../utils/PluginUtils";
import { userInfo } from "os";
import { stat } from "fs";

export function populateUser(data: any, rootUrl: string): PluginUser {
    const summary = data.summary;

    let badges = [];
    data.badges
        ? data.badges.forEach(element => {
              badges.push({ id: element.name, title: element.name });
          })
        : null;

    let stats = [];
    // for(const summary of data.summary){
    if (summary) {
        summary.days_visited > 0 ? stats.push({ id: "days_visited", title: `${summary.days_visited} days visited` }) : null;
        format(summary.time_read) != 0 ? stats.push({ id: "read-time", title: `${format(summary.time_read)} read time` }) : null;
        format(summary.recent_time_read) != 0
            ? stats.push({ id: "recent_read_time", title: `${format(summary.recent_time_read)} recent read time` })
            : null;
        parseInt(kFormatter(summary.topics_entered)) > 0
            ? stats.push({ id: "topics_viewed", title: `${kFormatter(summary.topics_entered)} topics viewed` })
            : null;
        parseInt(kFormatter(summary.posts_read_count)) > 0
            ? stats.push({ id: "posts_read", title: `${kFormatter(summary.posts_read_count)} posts read` })
            : null;
        parseInt(kFormatter(summary.likes_given)) > 0
            ? stats.push({ id: "hearts_given", title: `${kFormatter(summary.likes_given)} ❤️ given` })
            : null;
        parseInt(kFormatter(summary.topic_count)) > 0
            ? stats.push({ id: "topics_created", title: `${kFormatter(summary.topic_count)} topics created` })
            : null;
        parseInt(kFormatter(summary.post_count)) > 0
            ? stats.push({ id: "posts_created", title: `${kFormatter(summary.post_count)} posts created` })
            : null;
        parseInt(kFormatter(summary.likes_received)) > 0
            ? stats.push({ id: "hearts_received", title: `${kFormatter(summary.likes_received)} ❤️ received` })
            : null;
        parseInt(kFormatter(summary.solved_count)) > 0
            ? stats.push({ id: "solutions", title: `${kFormatter(summary.solved_count)} solutions` })
            : null;
        // }}
    }
    let tags = stats;
    for (const item of badges) {
        tags.push(item);
    }

    let avatarUrl;
    if("userInfo" in data){
        if ("avatar_template" in data.userInfo) {
            avatarUrl = data.userInfo.avatar_template.includes("https://")
                ? data.userInfo.avatar_template.replace("{size}", "200")
                : `${rootUrl}${data.userInfo.avatar_template.replace("{size}", "200")}`;
            console.log(avatarUrl);
        }
    }else if("current_user" in data){
        data.userInfo = data.current_user;
        if ("avatar_template" in data.current_user) {
            avatarUrl = data.current_user.avatar_template.includes("https://")
                ? data.current_user.avatar_template.replace("{size}", "200")
                : `${rootUrl}${data.current_user.avatar_template.replace("{size}", "200")}`;
            console.log(avatarUrl);
        }
    }


    const user: PluginUser = {
        // summary badges userInfo
        id: data.userInfo.username,
        username: data.userInfo.username,
        fullName: data.userInfo.name,
        about: data.userInfo.bio_cooked,
        utcCreateDate: Date.parse(data.userInfo.created_at),
        profileImageUrl: avatarUrl,
        // ...data.userInfo.avatar_template && {profileImageUrl: data.userInfo.avatar_template.replace('{size}','200')},
        // ...data.userInfo.custom_avatar_upload_id && {
        // profileImageUrl: `https://discourse-cdn-sjc1.com/${data.communityName}/user_avatar/${data.partialUrl}/${data.userInfo.username.toLowerCase()}/240/${data.userInfo.custom_avatar_upload_id}_2.png`},
        // // https://discourse-cdn-sjc1.com/cartalk/user_avatar/community.cartalk.com/barkydog/240/2470_2.png
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
    };

    return user;
}

// export function populateSearchUser(data: any): PluginUser {
//     // ADDING SIZE TO PHOTO URLS
//     let avatar;
//     if(data.avatar_template.includes("https:")){
//         avatar = data.avatar_template.replace("{size}", "240")
//         // const ava = `https://avatars.discourse.org/v2/letter/c/da6949/{size}.png`
//     }else{
//         const ava = data.avatar_template;
//         const regex = /{size}/g;
//         const photoSized = ava.replace("{size}", "240");
//         avatar = `https://discourse-cdn-sjc1.com/${data.communityName}${photoSized}`
//     }

//     const user: PluginUser ={
//         id: data.username,

//         username: data.username,
//         fullName: data.name,
//         profileImageUrl: avatar
//     };
//     return user;
// }

export function badgeToTag(data: any) {}
