import {
    objectUtils,
    Comment,
    TextContent, Reaction
} from "yack-plugin-framework";
import { threadId } from "worker_threads";

    export function populateComment(data: any, options: any, rootUrl:string): Comment {

        const hasUser = !!options.session.user;

        let canUpdate = false;
        if(options.session.user){
        data.username === options.session.user.username ? canUpdate = true :null;
        }

        let reactionCount = 0;
        if("actions_summary" in data){
        if(data.actions_summary.length > 0 ){
            if("count" in data.actions_summary[0]){
            reactionCount = parseInt(data.actions_summary[0].count)
        }
        }}

        let avatarUrl;
        if("avatar_template" in data){
            avatarUrl = data.avatar_template.includes("https://") ? data.avatar_template.replace('{size}','200') : `${rootUrl}${data.avatar_template.replace('{size}','200')}`
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
            ...!hasUser && {canSessionUserUpdate: false},
            ...!hasUser && {canSessionUserDelete: false},
            ...!hasUser && {canSessionUserComment: false},


            createdBy: {
                id: data.username,
                ...data.user_id && {id: data.user_id},
                fullName: data.name,
                username: data.username,
                ...data.avatar_template && {profileImageUrl: avatarUrl},

            },
            utcCreateDate: Date.parse(data.created_at),
            ...data.updated_at && {utcLastUpdateDate: Date.parse(data.updated_at)},
            ...options.session.user && {sessionUserReactionDisabled: (data.creator_username === options.session.user.username )},
            ...!hasUser && {sessionUserReactionDisabled: true},

            // sessionUserReactionDisabled: (data.username === options.session.user.username),

        };
        return newComment;
    }
