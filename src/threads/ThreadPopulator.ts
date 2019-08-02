import {
    Thread,
    TextContent,
    Reaction,
    PluginRequestOptions
} from "yack-plugin-framework";
// import * as Remarkable from "remarkable";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import {populateAttachments} from "../threads/AttachmentPopulator"
import { populateReaction } from "../actions/ReactionPopulator"

    export async function populateThread(data: any, options: PluginRequestOptions, rootUrl: string): Promise<Thread> {
        let reactionsConfig
        let canUpdate = false;
        const hasUser = !!options.session.user;
       

        // console.warn(`Thread Share Urls: ${rootUrl}/t/${data.id.toString()}`)


        if(options.session.user){
            data.creator_username === options.session.user.username ? canUpdate = true : null;

        // if(data.creator_username === options.session.user.username){
        //     reactionsConfig =  
        //     {
        //         concept: Reaction.Concepts.like,
        //         reactions: [Reaction.none],
        //         canBrowseUserReactions: true
        //     }
        // } 
    }
    let canUndo;
    let reactionCount = 0;
    if("actions_summary" in data){

    if(data["actions_summary"].length > 0 ){
        canUndo = "can_undo" in data.actions_summary[0] === false && data.actions_summary[0].acted
        if("count" in data.actions_summary[0]){
        reactionCount = parseInt(data["actions_summary"][0].count)
        }
        }
    }
    let avatarUrl
    if("avatar_template" in data){
    avatarUrl = data.avatar_template.includes("https://") ? data.avatar_template.replace('{size}','200') : `${rootUrl}${data.avatar_template.replace('{size}','200')}`
}
        const thread: Thread = {
        totalComments: data.reply_count,
        id: data.id.toString(),
        countByReaction: {
            [Reaction.like]: reactionCount,
        },

        
        channelName: data.channelName,
        ...data.channelId && {channelId: data.channelId.toString()},

        ...reactionsConfig && 
        { commentsReactionConfig: 
            reactionsConfig
        },
        ...data.totalComments && {totalComments: data.totalComments},
        ...data.posts_count	&& {totalComments: data.posts_count - 1},
        canSessionUserUpdate: canUpdate,
        canSessionUserDelete: canUpdate,
        canSessionUserComment: true,

        // ...data.category_id &&{channelId: data.category_id.toString()},
        // ...data.slug && {channelId: data.slug},
        
        // channelId: "top:popular",
        ...data.cooked && {content: {
            type: TextContent.Types.html,
            value: data.cooked}},
        detailsPrepopulated: false,
        title: htmlEncoderDecoder.decode(data.title),
        ...data.totalScore && {totalScore: data.totalScore},
        ...data.score && {totalScore: data.score},
        totalViews: data.views,
        utcCreateDate: Date.parse(data.created_at),//convert to milliseconds
        utcLastUpdateDate: Date.parse(data.last_posted_at),
        pinned: data.pinned,
        nsfw: false,
        createdBy: {
           
            id: data.creator_username,
            username: data.creator_username,
            fullName: data.creator_full_name,
            // ...data.avatar_template
            // http://community.yack.io/user_avatar/community.yack.io/katrpilar/200/4_2.png
            ...data.avatar_template && {profileImageUrl: avatarUrl},
        // ...data.custom_avatar_upload_id && {
        // profileImageUrl: `https://discourse-cdn-sjc1.com/${data.communityName}/user_avatar/${data.partialUrl}/${data.creator_username.toLowerCase()}/240/4_2.png`},
        
        },
        ...options.session.user && data.username === options.session.user.username && {sessionUserReactionDisabled: true},
        ...!hasUser && {sessionUserReactionDisabled: true},

        userReactions: [],
        ...data.actions_summary && data.actions_summary[0].acted && { userReactions: populateReaction(options)},

        // ...data.link_counts && {attachments: await populateAttachments(data.link_counts)},

        shareProps: {
            ...data.cooked && {title: htmlEncoderDecoder.decode(data.cooked)},
            // previewImageUrl?: string;
            url: `${rootUrl}/t/${data.id.toString()}`
        },
        };
           // createdBy: PluginUser;
        // commentsSorts?: ObjectsSort[];
        // defaultCommentsSortId?: string;
        // totalDislikes: number;
        // totalScore: number;
        // totalViews: number;
        // totalComments: number;
        // attachments: Attachment[] = [];
        // visited: boolean;
        // tags: string[] = [];
        // data.reply_count == 0 && !!data.posts_count ? thread.totalComments = data.posts_count : thread.totalComments = data.reply_count;
 // id: data["author_fullname"],
            // username: data["author"]
         // !!(data.excerpt) ? content = data.excerpt : content = data.cooked;
        // content = data.excerpt;
        // content = this.remarkableInstance.render(data.excerpt);

        // content = htmlEncoderDecoder.decode(data.excerpt);
        // if (content) {
        //     content = this.remarkableInstance.render(content);
        // }
                // totalLikes = data.like_count;
        // thread.totalDislikes = objectUtils.parseNumber(data["downs"]);
        // thread.totalScore = objectUtils.parseNumber(data["score"]);
        // thread.visited = objectUtils.parseBoolean(data["visited"]);
        // thread.totalComments = objectUtils.parseNumber(data["num_comments"]);

        // const linkFlairText: string = data["link_flair_text"];
        // if (!stringUtils.isNullOrEmpty(linkFlairText)) {
        //     thread.tags.push(linkFlairText);
        // }

        // const authorFalirText: string = data["author_flair_text"];
        // if (!stringUtils.isNullOrEmpty(authorFalirText)) {
        //     thread.createdBy.tags.push(authorFalirText);
        // }

        // const distinguished: string = data["distinguished"];
        // if (!stringUtils.isNullOrEmpty(distinguished) && distinguished == "moderator") {
        //     thread.createdBy.moderator = true;
        // }

        // const attachment = this.populateThreadAttachment(data);
        // if (attachment) {
        //     thread.attachments.push(attachment);
        // }

        // this.populateTestAttachments(thread);

        return thread;
    }


