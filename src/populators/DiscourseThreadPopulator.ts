import {
    Thread,
    TextContent,
    upndown,
    PluginUser,
    objectUtils,
    stringUtils,
    Attachment,
    AttachmentType,
    AttachmentProviderType,
    urlUtils,
    // ContentType,
    Thumbnails,
    Thumbnail, 
    Reaction,
    ObjectTypes
} from "yack-plugin-framework";
// import * as Remarkable from "remarkable";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import {populateAttachments} from "../threads/AttachmentPopulator"

export namespace DiscourseThreadPopulator {
    export async function populateThread(data: any, options): Promise<Thread> {
        let reactionsConfig;
        if(options.session.user){
        if(data.creator_username === options.session.user.username){
            reactionsConfig =  
            {
                concept: Reaction.Concepts.like,
                reactions: [Reaction.none],
                canBrowseUserReactions: true
            }
        } 
    }
        console.warn(`ThreadPopulator() id: ${data.id}`)
        const thread: Thread = {
        totalComments: data.reply_count,
        id: data.id.toString(),
        channelName: data.channelName,
        channelId: data.channelId,

        ...reactionsConfig && 
        { commentsReactionConfig: 
            reactionsConfig
        },

        ...data.category_id &&{channelId: data.category_id.toString()},
        // ...data.slug && {channelId: data.slug},
        
        // channelId: "top:popular",
        ...data.cooked && {content: {
            type: TextContent.Types.html,
            value: data.cooked}},
        detailsPrepopulated: false,
        title: data.title,
        ...data.totalScore && {totalScore: data.totalScore},
        ...data.score && {totalScore: data.score},
        totalViews: data.views,
        utcCreateDate: Date.parse(data.created_at),//convert to milliseconds
        utcLastUpdateDate: Date.parse(data.last_posted_at),
        pinned: data.pinned,
        nsfw: false,
        createdBy: {
           
            id: data.creator_id,
            username: data.creator_username,
            fullName: data.creator_full_name
        },
        ...data.link_counts && {attachments: await populateAttachments(data.link_counts)}
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
}

