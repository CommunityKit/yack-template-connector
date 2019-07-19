import {
    objectUtils,
    Comment,
    TextContent, Reaction
} from "yack-plugin-framework";
import { threadId } from "worker_threads";

    export function populateComment(data: any, options: any, rootUrl:string): Comment {
        // console.log(`Comment Share Url: ${rootUrl}/t/${data.threadId}/${data.id.toString()}`)
        let canUpdate = false;
        if(options.session.user){
        data.username === options.session.user.username ? canUpdate = true :null;
        }

        let reactionCount = 0;
        if(data.actions_summary.length > 0 ){
            if("count" in data.actions_summary[0]){
            reactionCount = parseInt(data.actions_summary[0].count)
        }
        }
        // console.warn(`threadId: ${data.threadId} - commentId: ${data.id.toString()}`);
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

            shareProps: {
                // title?: string;
                ...data.blurb && {description: data.blurb},
                ...data.cooked && {description: data.cooked},
                // previewImageUrl?: string;
                url: `${rootUrl}/t/${data.threadId}/${data.id.toString()}`
            },
            // ...data.actions_summary && {}, 
           countByReaction: {
                [Reaction.like]: reactionCount,
            },
            totalScore: data.score,
            canSessionUserUpdate: canUpdate,
            canSessionUserDelete: canUpdate,
            canSessionUserComment: true,
            createdBy: {
                id: data.username,
                ...data.user_id && {id: data.user_id},
                fullName: data.name,
                username: data.username
            },
            utcCreateDate: Date.parse(data.created_at),
            ...data.updated_at && {utcLastUpdateDate: Date.parse(data.updated_at)},
            sessionUserReactionDisabled: (data.username === options.session.user.username),

        };
        return newComment;
    }
