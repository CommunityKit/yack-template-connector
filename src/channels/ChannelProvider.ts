import {
    IChannelProvider,
    Channel,
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    objectUtils,
    Category,
    Filter,
    TextContent,
    Result,
    PluginUser
} from "yack-plugin-framework";
import { populateChannel } from "./ChannelPopulator";
import * as filter from "../search/Filters";

/**
 * SAMPLE DATA
 * For this example we're mapping users to channels and all of said user's posts are threads
 * Data Source Example: https://jsonplaceholder.typicode.com/posts?userId=2
 * --------------------------------------
 */

export class ChannelProvider implements IChannelProvider {
    private pluginContext: PluginContext;

    constructor(context: PluginContext) {
        this.pluginContext = context;
    }


    // TBD
    async getCategories(options: PluginRequestOptions): Promise<Result<PagedArray<Category>>> {
        return Result.success(new PagedArray());
    }

    // Read more about Fixed/Default channels in the Channel interface in the yack-connector-framework docs
    async getFixedChannels(options: PluginRequestOptions): Promise<Result<Channel[]>> {
        let fixedChannels: Channel[];

        
        if (!options.session.user) {
            // Anonymous user
            fixedChannels = [
                {
                    id: "fixed:latest",
                    icon: Channel.Icons.home,
                    name: "home",
                    description: {type: TextContent.Types.plain, value: "User id 2 as a channel"},

                    // Sometimes a content source only makes thread filter details available at the channel level
                    threadsFilters: [],

                    // Read more about meatadata: https://communitykit.github.io/yack-developers-docs/about/concepts#metadata
                    // and passing data via ObjectQueries to other providers: https://communitykit.github.io/yack-developers-docs/about/concepts#objectquery
                    metadata: {anything: "You can put anything you need in here"},
                    channelProfileDisabled: true,
                    canSessionUserPostNewThread: false
                }
            ];
        } else if (!!options.session.user) {
            // Authenticated user
            fixedChannels = [
                {
                    id: "fixed:2",
                    icon: Channel.Icons.home,
                    name: "home",
                    description: {type: TextContent.Types.plain, value: "User id 2 as a channel"},

                    // Sometimes a content source only makes thread filter details available at the channel level
                    threadsFilters: [],

                    // Read more about meatadata: https://communitykit.github.io/yack-developers-docs/about/concepts#metadata
                    // and passing data via ObjectQueries to other providers: https://communitykit.github.io/yack-developers-docs/about/concepts#objectquery
                    metadata: {anything: "You can put anything you need in here"},
                    channelProfileDisabled: true,
                    canSessionUserPostNewThread: false
                },
                {
                    id: "top:3",
                    icon: Channel.Icons.popular,
                    name: "top",
                    description: {type: TextContent.Types.plain, value: "User 3 as the trending channel"},
                    threadsFilters: this.getTopChannelFilters(options),
                    metadata: {},
                    channelProfileDisabled: true
                },
            ];
        }
        return Result.success(fixedChannels)
        // return fixedChannels;
    }

    async getAllChannels(options: PluginRequestOptions, categoryId?: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // TBD
    async getChannelsByCategoryId(options: PluginRequestOptions, categoryId: string): Promise<PagedArray<Channel>> {
        return new PagedArray();
    }

    // TBD
    async getChannelInfo(options: PluginRequestOptions, channelId: string): Promise<Channel> {
        return null;
    }

    private getTopChannelFilters(options: PluginRequestOptions): Filter[] {
        const topThreadsFilters = objectUtils.clone(filter.TOP_THREADS_FILTERS);
        return topThreadsFilters;
    }

    private getLatestChannelSortFilters(options: PluginRequestOptions): Filter[] {
        const latestFilters = objectUtils.clone(filter.LATEST_CATEGORY_SORT_ALPHABETICALLY);
        return latestFilters;
    }

    async getChannelsByUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PagedArray<Channel>>> {
        const channels = new PagedArray<Channel>();
        // Getting all users to set them as channels
        // const response = await this.pluginContext.axios.get('https://jsonplaceholder.typicode.com/users')
        // TBD dynamically populate mock server url
        const response = await this.pluginContext.axios.get(`https://d899d168-2db1-49a0-b15f-d1bae097dc5d.mock.pstmn.io/channels`)
        let userChannels;
        
        if (!options.session.user) {
            // Anonymous user
            
            // Limiting channels b/c mock anonymous user

            // userChannels = response.data.slice(0,3);
            userChannels = response.data;

        } else if (!!options.session.user) {
            // Authenticated user
            userChannels = response.data;
        }

        for(const channelData of userChannels){
            const populated = populateChannel(channelData);
            channels.array.push(populated);
        }

        return Result.success(channels)
    }

    async getChannel(options: PluginRequestOptions, channelQuery: Channel.Query): Promise<Result<Channel>> {

        // channel_by_thread_id_

        console.warn(`channelQuery: ${JSON.stringify(channelQuery)}`)
        let channelId
        if(channelQuery.id.includes("channel_by_thread_id_")){
            const threadId = channelQuery.id.replace("channel_by_thread_id_", "");
            const hasUser = !!options.session.user;
            let url ;
            // = `${this.config.rootUrl}/t/${threadId}.json`;
            let response
            if (hasUser) {
                response = await this.pluginContext.axios.get(url, {
                    responseType: "json",
                    // headers: {
                    //     "user-api-key": options.session.accessToken.token
                    // }
                    // headers: {
                    //     [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                    // }
                });
            } else {
                response = await this.pluginContext.axios.get(url);
            }
            channelId = response.data.category_id;
        }else{
            channelId = typeof parseInt(channelQuery.id) === "number" ? parseInt(channelQuery.id) : channelQuery.id;
        }

        let url;
        // const url = `${this.config.rootUrl}/site.json`;
        let resp, channel, channelSlug, parentChannelSlug;

        if(typeof channelId !== "number"){
            if(channelId.includes("/")){
                // Check if channel is a subcategory channel
                parentChannelSlug = channelId.split('/')[0]
                channelId = channelId.split('/')[1]
            } 
        }

 
        if(options.session.user){
            resp = await this.pluginContext.axios.get(url, {
                responseType: "json",
                // headers: {
                //     [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                // }
            });
        }else{
            resp = await this.pluginContext.axios.get(url)
        }

        const categoryList = resp.data.categories;

        if(typeof channelId !== "number"){
            if(parentChannelSlug){
                const channelItem = categoryList.filter(elem => elem.slug === channelId)[0]
                channel = populateChannel(channelItem);
                channel.id = channelId;
            }else{
                const channelItem = categoryList.filter(elem => elem.slug === channelId)[0]
                channel = populateChannel(channelItem);
                channel.id = channelId
                channel.metadata = {...channel.metadata, categoryId: channelItem.id}

            }
        }else if(typeof channelId === "number"){
            
            // Used for search results
            const channelItem = categoryList.filter(elem => elem.id.toString() == channelId.toString())[0]
            if("parent_category_id" in channelItem){
                const parentSlug = categoryList.filter(elem => elem.id === channelItem.parent_category_id)[0]
                channelItem.slug = `${parentSlug.slug}/${channelItem.slug}`
            }
            channel = populateChannel(channelItem);
            channel.metadata = {categoryId: channelItem.id}
            // channel.id = channelId

        }

        // const channelsList = resp.data.category_list.categories
        // const channelItem = channelsList.filter(elem => elem.slug === channelId)[0]
        return Result.success(channel)
        // return channel;
    }

    async getChannelByThreadId(options: PluginRequestOptions, threadId: string): Promise<Channel> {
        return null;
    }
}
