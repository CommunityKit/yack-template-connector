import {
    objectUtils,
    Comment,
    TextContent, Reaction
} from "yack-plugin-framework";
import { threadId } from "worker_threads";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import { populateReaction } from "../actions/ReactionPopulator"


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
            id: data.post_number.toString(),
            ...data.parentCommentId && {parentCommentId: data.parentCommentId.toString()},
            ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
            threadId: data.threadId,
            
            ...data.topic_id && {threadId: data.topic_id.toString()},
            content: {
                type: TextContent.Types.html,
                ...data.blurb && {value: data.blurb},
                ...data.cooked && {value: data.cooked}
            },
            userReactions: [],
            ...data.actions_summary && data.actions_summary[0].acted && { userReactions: populateReaction(options)},
            

            shareProps: {
                // title?: string;
                ...data.blurb && {description: htmlEncoderDecoder.decode(data.blurb)},
                ...data.cooked && {description: htmlEncoderDecoder.decode(data.cooked)},
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
                // ...data.user_id && {id: data.user_id},
                fullName: data.name,
                username: data.username,
                ...data.avatar_template && {profileImageUrl: avatarUrl},

            },
            utcCreateDate: Date.parse(data.created_at),
            ...data.updated_at && {utcLastUpdateDate: Date.parse(data.updated_at)},
            ...options.session.user && data.username === options.session.user.username && {sessionUserReactionDisabled: true},

            // ...options.session.user && {sessionUserReactionDisabled: (data.creator_username === options.session.user.username )},
            ...!hasUser && {sessionUserReactionDisabled: true},


            // comments have a post_number AND an id
            // We're using post_number as the comment.id
            // but we need the post.id for reacions
            metadata: {
                reactionId: data.id.toString()
            }


            // sessionUserReactionDisabled: (data.username === options.session.user.username),

        };
        return newComment;
    }
