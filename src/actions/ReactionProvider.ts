import { IReactionProvider, Reaction, PluginRequestOptions, PagedArray, PluginContext, ObjectTypes, cookieUtils } from "yack-plugin-framework";

import { IDiscourseConfig } from "../config/IDiscourseConfig";

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

    }

    // When different types of reactions that the different reaction counts
    async getReactionsSummary(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectId: string): Promise<Reaction.Summary> {
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
        return reactions;
    }

    // objectId is one of [channelId, threadId, commentId]
    async saveReaction(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectId: string, reaction: Reaction): Promise<void> {

        let url, formData, resp;

        const parseActionId = objectId.split(" ")[1]

        if (options.session.user) {
                    // Need to make threadId `${threadId} ${resp.data.post_stream[0].id}`
                    
                    // const userLovesIt = resp.data.actions_summary[0].acted
                 switch (reaction) {
                        case Reaction.like: {
                            url = `${this.config.rootUrl}/post_actions.json`
                            formData = `id=${parseActionId}&post_action_type_id=2&flag_topic=false`;

                            resp = await this.pluginContext.axios.post(url, formData, {
                                responseType: "json",
                                headers: {
                                    "user-api-key": options.session.accessToken.token
                                }
                            });


                            break;
                        }
                       
                        case Reaction.none: {

                            url = `${this.config.rootUrl}/post_actions/${parseActionId}.json`
                            formData = `post_action_type_id=2`;


                            resp = await this.pluginContext.axios.delete(url, { data: formData, 
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