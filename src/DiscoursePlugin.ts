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
import { OAuthClient } from "./sessions/OAuthClient";
import { ChannelProvider } from "./channels/ChannelProvider";
import { ThreadProvider } from "./threads/ThreadProvider";
import { CommentProvider } from "./comments/CommentProvider";
import { UserProvider } from "./sessions/UserProvider";
import { IDiscourseConfig } from "./config/IDiscourseConfig";
import { SearchProvider } from "./search/SearchProvider";
import { ReactionProvider } from "./actions/ReactionProvider";

// import { DiscourseNotificationProvider } from "./DiscourseNotificationProvider";
// import { DiscourseConversationProvider } from "./DiscourseConversationProvider";

export class DiscoursePlugin implements IPlugin {
    authType = PluginAuthTypes.OAuth;
    requiresAuthForBrowsing = true;
    oauthClient: IPluginOAuthClient;
    channelProvider?: IChannelProvider;
    threadProvider?: IThreadProvider;
    commentProvider?: ICommentProvider;
    userProvider?: IUserProvider;
    reactionProvider?: ReactionProvider;

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
    // requiresAuthForBrowsing: boolean;
    // accentColor: string;

    constructor(configuration: IDiscourseConfig) {
        this.config = configuration;
        this.id = this.config.id;
        this.name = this.config.name;
        this.iconBase64 = this.config.iconBase64;
        // this.accentColor = this.config.accentColor;
        this.primaryColor = this.config.primaryColor;
        this.secondaryColor = this.config.secondaryColor;
        // this.requiresAuthForBrowsing = this.config.id === "yack_discourse" ? true : false;

    }
    // primaryColor = this.config.accentColor;
    // secondaryColor = this.config.accentColor;

    async init(context: PluginContext) {
        this.oauthClient = new OAuthClient(context, this.config);
        this.channelProvider = new ChannelProvider(context, this.config);
        this.threadProvider = new ThreadProvider(context, this.config, this.channelProvider);
        this.userProvider = new UserProvider(context, this.config);
        this.commentProvider = new CommentProvider(context, this.config);
        // this.notificationProvider = new DiscourseNotificationProvider(context);
        // this.conversationProvider = new DiscourseConversationProvider(context);
        // this.conversationMessageProvider = new RedditConversationMessageProvider(context);
        this.searchProvider = new SearchProvider(context, this.config);
        this.reactionProvider = new ReactionProvider(context, this.config);
    }
}
