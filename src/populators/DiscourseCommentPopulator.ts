import {
    Thread,
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
    Channel,
    Comment,
    TextContent, Reaction
    // PostType
} from "yack-plugin-framework";

export namespace DiscourseCommentPopulator {
    export function populateComment(data: any, sessionUser: PluginUser): Comment {
        const newComment: Comment = {
            id: data.id.toString(),
            ...data.parentCommentId && {parentCommentId: data.parentCommentId},
            ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
            threadId: data.threadId,
            ...data.topic_id && {threadId: data.topic_id.toString()},
                        content: {
                type: TextContent.Types.html,
                ...data.blurb && {value: data.blurb},
                ...data.cooked && {value: data.cooked}
            },
            // ...data.actions_summary && {}, 
            ...data.actions_summary && {countByReaction: {
                [Reaction.love]: objectUtils.parseNumber(data.actions_summary[0].count),
            }},
            totalScore: data.score,
            createdBy: {
                id: data.username,
                ...data.user_id && {id: data.user_id},
                fullName: data.name,
                username: data.username
            },
            utcCreateDate: Date.parse(data.created_at),
            ...data.updated_at && {utcLastUpdateDate: Date.parse(data.updated_at)}
        };
        // newComment.id = data.id.toString();
        // !!data.parentCommentId ? (newComment.parentCommentId = data.parentCommentId) : (newComment.parentCommentId = null);
        // newComment.repliesNextPageLength = data.reply_count;
        // data.repliesNextPageToken ? (newComment.repliesNextPageToken = data.repliesNextPageToken) : (newComment.repliesNextPageToken = null);
        // newComment.threadId = data.threadId;
        // newComment.content = newComment.id + "-" + data.cooked;
        // newComment.totalLikes = "";
        // newComment.totalDislikes = "";
        // newComment.totalScore = data.score;
        // newComment.createdBy = new PluginUser({
        //     id: data.user_id,
        //     fullName: data.name,
        //     username: data.username
        // });
        // newComment.utcCreateDate = Date.parse(data.created_at);
        // newComment.utcLastUpdateDate = Date.parse(data.updated_at);
        // newComment.repliesNextPageToken = "";
        // newComment.repliesNextPageLength = "";
        return newComment;
    }
}
