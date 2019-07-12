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
import { DiscourseOAuthClient } from "./sessions/OAuthClient";
import { DiscourseChannelProvider } from "./channels/ChannelProvider";
import { DiscourseThreadProvider } from "./threads/ThreadProvider";
import { DiscourseCommentProvider } from "./comments/CommentProvider";
import { DiscourseUserProvider } from "./sessions/UserProvider";
import { IDiscourseConfig } from "./config/IDiscourseConfig";
import { DiscourseSearchProvider } from "./search/SearchProvider";
import { ReactionProvider } from "./actions/ReactionProvider";

// import { DiscourseNotificationProvider } from "./DiscourseNotificationProvider";
// import { DiscourseConversationProvider } from "./DiscourseConversationProvider";

export class DiscoursePlugin implements IPlugin {
    authType = PluginAuthTypes.OAuth;
    oauthClient: IPluginOAuthClient;
    channelProvider?: IChannelProvider;
    threadProvider?: IThreadProvider;
    commentProvider?: ICommentProvider;
    userProvider?: IUserProvider;
    reactionProvider: ReactionProvider;

    // notificationProvider?: INotificationProvider;
    // conversationProvider?: IConversationProvider;
    // conversationMessageProvider?: IConversationMessageProvider;
    searchProvider?: ISearchProvider;
    primaryColor: string;
    secondaryColor: string;

    private config: IDiscourseConfig;
    id: string;
    name: string;
    iconBase64: any;
    // accentColor: string;

    constructor(configuration: IDiscourseConfig) {
        this.config = configuration;
        this.id = this.config.id;
        this.name = this.config.name;
        this.iconBase64 = this.config.iconBase64;
        // this.accentColor = this.config.accentColor;
        this.primaryColor = this.config.accentColor;
        this.secondaryColor = this.config.accentColor;

    }
    // primaryColor = this.config.accentColor;
    // secondaryColor = this.config.accentColor;

    async init(context: PluginContext) {
        this.oauthClient = new DiscourseOAuthClient(context, this.config);
        this.channelProvider = new DiscourseChannelProvider(context, this.config);
        this.threadProvider = new DiscourseThreadProvider(context, this.config, this.channelProvider);
        this.userProvider = new DiscourseUserProvider(context, this.config);
        this.commentProvider = new DiscourseCommentProvider(context, this.config);
        // this.notificationProvider = new DiscourseNotificationProvider(context);
        // this.conversationProvider = new DiscourseConversationProvider(context);
        // this.conversationMessageProvider = new RedditConversationMessageProvider(context);
        this.searchProvider = new DiscourseSearchProvider(context, this.config);
        this.reactionProvider = new ReactionProvider(context, this.config);

    }
}
