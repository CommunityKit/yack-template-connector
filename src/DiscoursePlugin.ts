import {
    IPlugin,
    IPluginOAuthClient,
    PluginAuthTypes,
    PluginContext,
    IChannelProvider,
    IThreadProvider,
    ICommentProvider,
    IUserProvider,
    // INotificationProvider,
    // IConversationProvider,
    ISearchProvider
} from "yack-plugin-framework";
import { DiscourseOAuthClient } from "./DiscourseOAuthClient";
import { DiscourseChannelProvider } from "./DiscourseChannelProvider";
import { DiscourseThreadProvider } from "./DiscourseThreadProvider";
import { DiscourseCommentProvider } from "./DiscourseCommentProvider";
import { DiscourseUserProvider } from "./DiscourseUserProvider";
import { IDiscourseConfig } from "./config/IDiscourseConfig";
import { DiscourseSearchProvider } from "./DiscourseSearchProvider";
// import { DiscourseNotificationProvider } from "./DiscourseNotificationProvider";
// import { DiscourseConversationProvider } from "./DiscourseConversationProvider";

export class DiscoursePlugin implements IPlugin {
    authType = PluginAuthTypes.OAuth;
    oauthClient: IPluginOAuthClient;
    channelProvider?: IChannelProvider;
    threadProvider?: IThreadProvider;
    commentProvider?: ICommentProvider;
    userProvider?: IUserProvider;
    // notificationProvider?: INotificationProvider;
    // conversationProvider?: IConversationProvider;
    // conversationMessageProvider?: IConversationMessageProvider;
    searchProvider?: ISearchProvider;

    private config: IDiscourseConfig;
    id: string;
    name: string;
    iconBase64: any;
    accentColor: string;

    constructor(configuration: IDiscourseConfig) {
        this.config = configuration;
        this.id = this.config.id;
        this.name = this.config.name;
        this.iconBase64 = this.config.iconBase64;
        this.accentColor = this.config.accentColor;
    }

    async init(context: PluginContext) {
        this.oauthClient = new DiscourseOAuthClient(context, this.config);
        this.channelProvider = new DiscourseChannelProvider(context, this.config);
        this.threadProvider = new DiscourseThreadProvider(context, this.config);
        this.userProvider = new DiscourseUserProvider(context, this.config);
        this.commentProvider = new DiscourseCommentProvider(context, this.config);
        // this.notificationProvider = new DiscourseNotificationProvider(context);
        // this.conversationProvider = new DiscourseConversationProvider(context);
        // this.conversationMessageProvider = new RedditConversationMessageProvider(context);
        this.searchProvider = new DiscourseSearchProvider(context, this.config);
    }
}
