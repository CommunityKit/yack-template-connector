import {
    objectUtils,
    Comment,
    TextContent, Reaction
} from "yack-plugin-framework";

    export function populateComment(data: any, options: any, rootUrl:string): Comment {
        console.log(`Comment Share Url: ${rootUrl}/t/${data.threadId}/${data.id.toString()}`)
        let canUpdate;
        data.username === options.session.user.username ? canUpdate = true :canUpdate = false;

        
        const newComment: Comment = {
            id: data.id.toString(),
            ...data.parentCommentId && {parentCommentId: data.parentCommentId},
            ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
            threadId: data.threadId,
            shareUrl: `${rootUrl}/t/${data.threadId}/${data.id.toString()}`,
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
            canSessionUserUpdate: canUpdate,
            canSessionUserDelete: canUpdate,
            createdBy: {
                id: data.username,
                ...data.user_id && {id: data.user_id},
                fullName: data.name,
                username: data.username
            },
            utcCreateDate: Date.parse(data.created_at),
            ...data.updated_at && {utcLastUpdateDate: Date.parse(data.updated_at)}
        };
        return newComment;
    }
