import {
    IPlugin,
    IPluginOAuthClient,
    PluginAuthTypes,
    PluginContext,
    IChannelProvider,
    IThreadProvider,
    ICommentProvider,
    IUserProvider,
    ISearchProvider
} from "yack-plugin-framework";
import { OAuthClient } from "./authentication/OAuthClient";
import { ChannelProvider } from "./channels/ChannelProvider";
import { ThreadProvider } from "./threads/ThreadProvider";
// import { CommentProvider } from "./comments/CommentProvider";
import { UserProvider } from "./users/UserProvider";
// import { SearchProvider } from "./search/SearchProvider";
// import { ReactionProvider } from "./actions/ReactionProvider";
import icon from "./config/icon.base64";


export class TemplateConnector implements IPlugin {
    // Set basic Connector display info
    id = "template";
    name = "Template Connector";
    iconBase64 = icon;
    primaryColor = "#fd5854";
    secondaryColor = "#f95456";

    /**
     * SET CONNECTOR SOURCE USER AUTH TYPE
     * --------------------------------------
     * Has API based authentication available must use OAuth
     * `authType = PluginAuthTypes.OAuth;`
     *  
     * Does not have an API but needs user login
     * `authType = PluginAuthTypes.Basic;`
     * 
     * No user session model available in Connector Source (Ex: Rss feeds, some blogs, etc.)
     * `authType = PluginAuthTypes.None;`
     * */
    authType = PluginAuthTypes.OAuth;
    

     /**
     * Some communities, such as Instagram requires user authentication by default. 
     * If set to true, Yack Browser will ask user to login as soon as they tap on the plugin icon
     */
    requiresAuthForBrowsing = false;


    /**
     * RECOMMENDED IMPLEMENTATION ORDER
     * 1. Auth Client
     * 2. User Provider
     * 3. Channel Provider
     * 4. Thread Provider
     * 5. Comment Provider
     * 6. Reaction Provider
     * 7. Search Provider
     */

    /**
     * ADD EACH OF THE PROVIDERS ONE-BY-ONE AS YOU'RE READY TO IMPLEMENT THEM
     * Otherwise, you'll encounter a lot of typescript errors
     * --------------------------------------
     * oauthClient: IPluginOAuthClient;
     * userProvider?: IUserProvider;
     * channelProvider?: IChannelProvider;
     * threadProvider?: IThreadProvider;
     * commentProvider?: ICommentProvider;
     * reactionProvider?: ReactionProvider;
     * searchProvider?: ISearchProvider;
     */
    
     oauthClient: IPluginOAuthClient;
     userProvider?: IUserProvider;
     channelProvider?: IChannelProvider;
     threadProvider?: IThreadProvider;

     /**
      * NEED TO PASS ADDITIONAL DATA TO CERTAIN PROVIDERS?
      * Creating a config file is a great way to pass info in
      * --------------------------------------
      * ```ts
      * constructor(configuration: ICustomConfig) {
      * this.config = configuration;
      * }```
      */

    async init(context: PluginContext) {
        /**
         * With custom config example: 
         * `this.oauthClient = new OAuthClient(context, this.config);`
         * 
        */

        this.oauthClient = new OAuthClient(context);
        this.userProvider = new UserProvider(context);
        this.channelProvider = new ChannelProvider(context);
        this.threadProvider = new ThreadProvider(context, this.channelProvider);
        // this.commentProvider = new CommentProvider(context);
        // this.searchProvider = new SearchProvider(context);
        // this.reactionProvider = new ReactionProvider(context);
    }
}
