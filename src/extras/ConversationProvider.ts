// import {
//     PluginRequestOptions,
//     PagedArray,
//     PluginContext,
//     // IConversationProvider,
//     Conversation,
//     ConversationMessage,
//     // ObjectAction,
//     PluginUser,
//     objectUtils
// } from "yack-plugin-framework";
// import * as URLAssembler from "url-assembler";
// import uuid = require("uuid");
// import * as Remarkable from "remarkable";
// import * as htmlEncoderDecoder from "html-encoder-decoder";

// export class DiscourseConversationProvider implements IConversationProvider {
//     private pluginContext: PluginContext;
//     private remarkableInstance = new Remarkable({ html: true, linkify: true });

//     constructor(context: PluginContext) {
//         this.pluginContext = context;
//     }

//     async getConversations(options: PluginRequestOptions): Promise<PagedArray<Conversation>> {
//         const urlBuilder = URLAssembler()
//             .template("/message/messages")
//             .query("limit", 10)
//             .query("after", options.nextPageToken ? options.nextPageToken : null);

//         const response = await this.pluginContext.axios.get(urlBuilder.toString(), {
//             headers: {
//                 Authorization: `Bearer ${options.session.accessToken.token}`
//             }
//         });

//         const data = response.data["data"];
//         const children: any[] = data["children"];

//         const conversations = new PagedArray<Conversation>();
//         conversations.nextPageToken = data["after"];

//         //for some fucking reason, reddit returns the last item from previos call in the results, so we skip the first item if there's paging.
//         const startIndex = options.nextPageToken ? 1 : 0;
//         if (children.length > 0) {
//             for (var i = startIndex; i < children.length; i++) {
//                 const child = children[i];
//                 const conversation = await this.populateConversation(child, options.session.user);
//                 conversations.array.push(conversation);
//             }
//         }

//         return conversations;
//     }
//     async getConversationMessages(options: PluginRequestOptions, conversationId: string): Promise<PagedArray<ConversationMessage>> {
//         options.nextPageToken = null;
//         const conversations = await this.getConversations(options);
//         const conversation = conversations.array.find(c => c.id == conversationId);
//         for (const message of conversation.preloadedMessages.array) {
//             message.id = uuid.v4();
//         }
//         return conversation.preloadedMessages;
//     }
//     async saveConversationMessage(options: PluginRequestOptions, message: ConversationMessage): Promise<ConversationMessage> {
//         return null;
//     }
//     async deleteConversation(options: PluginRequestOptions, conversationId: string): Promise<void> {}
//     async deleteConversationMessage(options: PluginRequestOptions, conversationId: string, messageId: string): Promise<void> {}
//     // async saveConversationMessageAction(option: PluginRequestOptions, conversationId: string, action: ObjectAction): Promise<void> {}

//     private async populateConversation(child: any, forUser: PluginUser): Promise<Conversation> {
//         // const data = child["data"];
//         // const conversation: Conversation = {}
//         // conversation.id = data["name"];
//         // conversation.subject = data["subject"];
//         // conversation.participants = [];
//         // conversation.preloadedMessages = new PagedArray<ConversationMessage>();
//         // const author = data["author"];
//         // const subreddit = data["subreddit"];
//         // let participantUsername: string;
//         // if (subreddit) {
//         //     participantUsername = "/r/" + subreddit;
//         // } else {
//         //     if (author == forUser.username) {
//         //         //sent message.
//         //         participantUsername = data["dest"];
//         //     } else {
//         //         participantUsername = data["author"];
//         //     }
//         // }
//         // conversation.participants.push(
//         //     new PluginUser({
//         //         id: participantUsername,
//         //         username: participantUsername
//         //     })
//         // );
//         // conversation.utcCreateDate = objectUtils.parseNumber(data["created_utc"]);

//         // const firstMessage = await this.populateConversationMessage(child);
//         // conversation.preloadedMessages.array.push(firstMessage);

//         // const replies = data["replies"];
//         // if (replies) {
//         //     const repliesData = replies["data"];
//         //     if (repliesData) {
//         //         conversation.preloadedMessages.nextPageToken = repliesData["after"];
//         //         const repliesChildren = repliesData["children"];
//         //         for (const child of repliesChildren) {
//         //             const message = await this.populateConversationMessage(child);
//         //             conversation.preloadedMessages.array.push(message);
//         //         }
//         //     }
//         // }

//         return null;
//     }

//     private async populateConversationMessage(child: any): Promise<ConversationMessage> {
//         const data = child["data"];
//         const message = new ConversationMessage();
//         message.id = data["id"];
//         message.conversationId = data["parent_id"];
//         message.body = htmlEncoderDecoder.decode(data["body"]);
//         if (message.body) {
//             message.body = this.remarkableInstance.render(message.body);
//         }
//         message.author = new PluginUser({
//             id: data["author"],
//             username: data["author"]
//         });
//         message.utcCreateDate = objectUtils.parseNumber(data["created_utc"]);
//         return message;
//     }
// }
