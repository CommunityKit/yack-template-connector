import { IReactionProvider, Reaction, PluginRequestOptions, PagedArray, PluginContext, ObjectTypes, cookieUtils } from "yack-plugin-framework";

import { IDiscourseConfig } from "../config/IDiscourseConfig";
import {getThreadPostId} from "../threads/ThreadRequests"

import * as URLAssembler from "url-assembler";
// import { fetchVideo } from "../threads/ThreadRequests";
// import { getCommentById } from "../comments/CommentRequests";

export class ReactionProvider implements IReactionProvider {
    reactionConfigByObjectType = {
        [ObjectTypes.thread]: {
            concept: Reaction.Concepts.like,
            reactions: [Reaction.like, Reaction.none],
            canBrowseUserReactions: true
        },
        [ObjectTypes.comment]: {
            concept: Reaction.Concepts.like,
            reactions: [Reaction.like, Reaction.none],
            canBrowseUserReactions: true
        }
    };

    private pluginContext: PluginContext;
    private config: IDiscourseConfig;


    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
        // this.reactionConfigByObjectType
    }

    private async setReactionConfig(options: PluginRequestOptions, threadId:string, postId:number, objectType: Reaction.ObjectTypes){
        // const parsedThreadId = objectId.split(" ")[0]
        // const postId = objectId.split(" ")[1]
        const url = `${this.config.rootUrl}/t/${threadId}/posts.json?posts_ids[]=${postId}.json`

        const resp = await this.pluginContext.axios.get(url, {
            responseType: "json",
            headers: {
                "user-api-key": options.session.accessToken.token
            }
        });
        const selectPostAction = resp.data.post_stream.posts.filter(elem => elem.id.toString() === postId)[0].actions_summary[0];
        const acted = selectPostAction.acted;
        let allowedToUndo, updateConfigObj;
        if(acted){
            if("can_undo" in selectPostAction){
                selectPostAction.can_undo ? allowedToUndo = true : allowedToUndo = false;
            }else{
                allowedToUndo = false;
            }
        }

        

        if(allowedToUndo === false){
            switch(objectType){
                case "thread": {
                  this.reactionConfigByObjectType[ObjectTypes.thread].reactions = []
                  return false;
                }
                case "comment": {
                  this.reactionConfigByObjectType[ObjectTypes.comment].reactions = []
                  return false;
                }
            }
        }
        return true;
    }

    // When different types of reactions that the different reaction counts
    async getReactionsSummary(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectId: string): Promise<Reaction.Summary> {
        console.warn(`getReactionsSummmary() ObjectId: ${objectId}`)
        return null;
    }

    // Only for ReactionsSummary()
    // Lists the list of user that reacted for any given reation
    async getReactions(
        options: PluginRequestOptions,
        objectType: Reaction.ObjectTypes,
        objectId: string,
        reaction: Reaction
    ): Promise<PagedArray<Reaction.UserReaction>> {
        const reactions = new PagedArray<Reaction.UserReaction>();
        console.warn(`getReactions() ObjectId: ${objectId}`)

        return reactions;
    }

    // objectId is one of [channelId, threadId, commentId]
    async saveReaction(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectId: string, reaction: Reaction): Promise<void> {

        let url, formData, resp;
        console.warn(`saveReaction() ObjectId ${objectId}`)
        // const parsedThreadId = objectId.split(" ")[0]
        // const postId = objectId.split(" ")[1]
        const postId = await getThreadPostId(this.config.rootUrl, this.pluginContext.axios.get, options, objectId)
        // const canUndo = await this.setReactionConfig(options, objectId, postId, objectType)
        if (options.session.user) {

        // if (options.session.user && canUndo) {
                    // Need to make threadId `${threadId} ${resp.data.post_stream[0].id}`
                    
                    // const userLovesIt = resp.data.actions_summary[0].acted
                
                // Need to update switch statement
                // IF user already likes the post and clicks like again then we need to fetch the post and check if the user can still undo their like
                // IF they can't undo their like then do nothing
                // IF they can undo their action DELETE request
                 switch (reaction) {
                        case Reaction.like: {
                            url = `${this.config.rootUrl}/post_actions.json`
                            formData = `id=${postId}&post_action_type_id=2&flag_topic=false`;

                            resp = await this.pluginContext.axios.post(url, formData, {
                                responseType: "json",
                                headers: {
                                    "user-api-key": options.session.accessToken.token
                                }
                            });


                            break;
                        }
                       
                        case Reaction.none: {

                            url = `${this.config.rootUrl}/post_actions/${postId}.json`
                            formData = `post_action_type_id=2`;


                            resp = await this.pluginContext.axios.delete(url, { data: {post_action_type_id: 2}, 
                                responseType: "json",
                                headers: {
                                    "user-api-key": options.session.accessToken.token
                                }
                            });

                            // resp = await this.pluginContext.axios.delete(url, formData);


                            break;
                        }

                    }
                }
            }


}