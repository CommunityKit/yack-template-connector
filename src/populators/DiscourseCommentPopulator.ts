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
    TextContent
    // PostType
} from "yack-plugin-framework";

export namespace DiscourseCommentPopulator {
    export function populateComment(data: any, sessionUser: PluginUser): Comment {
        const newComment: Comment = {
            id: data.id.toString(),
            ...data.parentCommentId && {parentCommentId: data.parentCommentId},
            ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
            threadId: data.threadId,
            content: {
                type: TextContent.Types.markdown,
                value: data.cooked},
            totalScore: data.score,
            createdBy: {
                id: data.user_id,
                fullName: data.name,
                username: data.username
            },
            utcCreateDate: Date.parse(data.created_at),
            utcLastUpdateDate: Date.parse(data.updated_at)
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
