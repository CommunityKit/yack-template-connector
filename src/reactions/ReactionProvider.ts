// import { IReactionProvider, Reaction, PluginRequestOptions, PagedArray, PluginContext, ObjectTypes, cookieUtils, Result } from "yack-plugin-framework";

// import {getThreadPostId} from "../threads/ThreadRequests"

// export class ReactionProvider implements IReactionProvider {
//     reactionConfigByObjectType = {
//         [ObjectTypes.thread]: {
//             concept: Reaction.Concepts.like,
//             reactions: [Reaction.like],
//             canBrowseUserReactions: true
//         },
//         [ObjectTypes.comment]: {
//             concept: Reaction.Concepts.like,
//             reactions: [Reaction.like],
//             canBrowseUserReactions: true
//         }
//     };

//     private pluginContext: PluginContext;


//     constructor(context: PluginContext) {
//         this.pluginContext = context;
//         // this.reactionConfigByObjectType
//     }

//     // private async setReactionConfig(options: PluginRequestOptions, threadId:string, postId:number, objectType: Reaction.ObjectTypes){
//     //     // const parsedThreadId = objectId.split(" ")[0]
//     //     // const postId = objectId.split(" ")[1]
//     //     const url = `${ROOT_URL}/t/${threadId}/posts.json?posts_ids[]=${postId}.json`

//     //     const resp = await this.pluginContext.axios.get(url, {
//     //         responseType: "json",
//     //         headers: {
//     //             [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
//     //         }
//     //     });
//     //     const selectPostAction = resp.data.post_stream.posts.filter(elem => elem.id.toString() === postId)[0].actions_summary[0];
//     //     const acted = selectPostAction.acted;
//     //     let allowedToUndo, updateConfigObj;
//     //     if(acted){
//     //         if("can_undo" in selectPostAction){
//     //             selectPostAction.can_undo ? allowedToUndo = true : allowedToUndo = false;
//     //         }else{
//     //             allowedToUndo = false;
//     //         }
//     //     }

        

//     //     // if(allowedToUndo === false){
//     //     //     switch(objectType){
//     //     //         case "thread": {
//     //     //           this.reactionConfigByObjectType[ObjectTypes.thread].reactions = []
//     //     //           return false;
//     //     //         }
//     //     //         case "comment": {
//     //     //           this.reactionConfigByObjectType[ObjectTypes.comment].reactions = []
//     //     //           return false;
//     //     //         }
//     //     //     }
//     //     // }
//     //     return true;
//     // }

//     // When different types of reactions that the different reaction counts
//     async getReactionsSummary(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectQuery: Reaction.ObjectQueryTypes): Promise<Result<Reaction.Summary>> {
//         const objectId = objectQuery.id;
//         console.warn(`getReactionsSummmary() ObjectId: ${objectId}`)
//         return Result.success(null);
//     }

//     // Only for ReactionsSummary()
//     // Lists the list of user that reacted for any given reation
//     async getReactions(
//         options: PluginRequestOptions,
//         objectType: Reaction.ObjectTypes,
//         objectQuery: Reaction.ObjectQueryTypes,
//         reaction: Reaction
//     ): Promise<Result<PagedArray<Reaction.UserReaction>>> {
//         const objectId = objectQuery.id;
//         const reactions = new PagedArray<Reaction.UserReaction>();
//         console.warn(`getReactions() ObjectId: ${objectId}`)

//         return Result.success(reactions);
//     }

//     // objectId is one of [channelId, threadId, commentId]
//     async saveReaction(options: PluginRequestOptions, objectType: Reaction.ObjectTypes, objectQuery: Reaction.ObjectQueryTypes, reaction: Reaction): Promise<Result<void>> {
//         const objectId = objectQuery.id;
//         let url, formData, resp;
//         console.warn(`saveReaction() ObjectId ${objectId}`)
//         // const parsedThreadId = objectId.split(" ")[0]
//         // const postId = objectId.split(" ")[1]
//         let postId;
//         if(objectType === ObjectTypes.comment){
//             postId = objectQuery.metadata.reactionId
//             // postId = objectQuery.id
//         }else{
//         postId = objectQuery.metadata.postId
//         }
//         // const postId = await getThreadPostId(ROOT_URL, this.pluginContext.axios.get, options, objectQuery, objectType);


        
//         // const canUndo = await this.setReactionConfig(options, objectId, postId, objectType)
//         if (options.session.user) {

//         // if (options.session.user && canUndo) {
//                     // Need to make threadId `${threadId} ${resp.data.post_stream[0].id}`
                    
//                     // const userLovesIt = resp.data.actions_summary[0].acted
                
//                 // Need to update switch statement
//                 // IF user already likes the post and clicks like again then we need to fetch the post and check if the user can still undo their like
//                 // IF they can't undo their like then do nothing
//                 // IF they can undo their action DELETE request
//                  switch (reaction) {
//                         case Reaction.like: {
//                             url = `${ROOT_URL}/post_actions.json`
//                             formData = `id=${postId}&post_action_type_id=2&flag_topic=false`;

//                             resp = await this.pluginContext.axios.post(url, formData, {
//                                 responseType: "json",
//                                 headers: {
//                                     [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
//                                 }
//                             });


//                             break;
//                         }
                       
//                         case Reaction.none: {

//                             url = `${ROOT_URL}/post_actions/${postId}.json`
//                             formData = `post_action_type_id=2`;


//                             resp = await this.pluginContext.axios.delete(url, { data: {post_action_type_id: 2}, 
//                                 responseType: "json",
//                                 headers: {
//                                     [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
//                                 }
//                             });

//                             // resp = await this.pluginContext.axios.delete(url, formData);


//                             break;
//                         }

//                     }
//                 }
//                 if (options.session.user.username === objectQuery.createdBy.username) {
//                     return Result.error(`Error: You cannot like your own content.`);
//                 }else if(resp.status != 200) {
//                     return Result.error(`Error: You can no longer react to this content.`);
//                 }

               

//                 return Result.success(null)
//             }


// }