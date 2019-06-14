import {
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    // IConversationProvider,
    // Conversation,
    // ConversationMessage,
    //   ConversationMessageActions,
    PluginUser,
    objectUtils,
    ISearchProvider,
    Category,
    Filter,
    stringUtils,
    ObjectTypes
} from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
import uuid = require("uuid");
// import * as Remarkable from "remarkable";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import { SearchResultItem } from "yack-plugin-framework";
import { DiscourseThreadPopulator } from "./populators/DiscourseThreadPopulator";
// import { SearchResultItemType } from "yack-plugin-framework";
import { DiscourseChannelPopulator } from "./populators/DiscourseChannelPopulator";
import { DiscourseCommentPopulator } from "./populators/DiscourseCommentPopulator";
import { DiscourseUserPopulator } from "./populators/DiscourseUserPopulator";
import { IDiscourseConfig } from "./config/IDiscourseConfig";
import { DiscourseFilters } from "./DiscourseFilters";

export class DiscourseSearchProvider implements ISearchProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    //   private timeFilter: Filter = {
    //       id: "timefilter",
    //       name: "From",
    //       type: Filter.Types.SingleSelect,
    //       defaultValue: "all",
    //       childFilters: [
    //           { id: "hour", name: "Past Hour", type: Filter.Types.ListItem },
    //           { id: "day", name: "Past 24 Hours", type: Filter.Types.ListItem },
    //           { id: "week", name: "Past Week", type: Filter.Types.ListItem },
    //           { id: "month", name: "Past Month", type: Filter.Types.ListItem },
    //           { id: "year", name: "Past Year", type: Filter.Types.ListItem },
    //           { id: "all", name: "All Time", type: Filter.Types.ListItem }
    //       ]
    //   };

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    private async getCombinedFilters() {
        // GET Tags List
        const tagUrl = `${this.config.rootUrl}/tags.json`;
        const resp = await this.pluginContext.axios.get(tagUrl);
        const tagList = resp.data.tags;
        let tagsFilter = {
            id: "tag_filter",
            type: Filter.Types.MultiSelect,
            name: "Select Tags",
            childFilters: []
        };
        let formattedChildTagList: Array<object> = [];
        for (const tag of tagList) {
            formattedChildTagList.push({ id: tag.id.toString(), name: tag.text, type: Filter.Types.ListItem });
        }
        tagsFilter.childFilters = formattedChildTagList;

        // Create Parent Tag Toggle Option
        let parentTagFilter = {
            id: "select_all",
            name: "All Tags?",
            type: Filter.Types.SingleSelect,
            childFilters: [{ id: "all", name: "Include All Tags", type: Filter.Types.ListItem }]
        };

        // GET channels List
        let categoriesFilter = {
            id: "categories_filter",
            type: Filter.Types.SingleSelect,
            name: "Category Select",
            childFilters: []
        };
        let formattedChildCategoryList: Array<object> = [];
        const categoriesURL = `${this.config.rootUrl}/categories.json`;
        const response = await this.pluginContext.axios.get(categoriesURL);
        const categoriesList = response.data.category_list.categories;
        for (const category of categoriesList) {
            formattedChildCategoryList.push({ id: category.slug, name: category.name, type: Filter.Types.ListItem });
        }
        categoriesFilter.childFilters = formattedChildCategoryList;

        // Create Date BEFORE/AFTER Toggle Option
        let parentDateFilter = {
            id: "before_after",
            name: "Posted",
            type: Filter.Types.SingleSelect,
            defaultValue: "before",
            childFilters: [{ id: "before", name: "Before", type: Filter.Types.ListItem }, { id: "after", name: "After", type: Filter.Types.ListItem }]
        };

        // Date Input
        let dateFilter = {
            id: "date",
            name: "Date",
            type: Filter.Types.Date,
            defaultValue: Date.now()
        };

        // const combined: Filter[] =  [tagsFilter]
        const baseFilter: Filter[] = objectUtils.clone(DiscourseFilters.SEARCH_THREAD_FILTERS);
        baseFilter.push(parentTagFilter);
        baseFilter.push(tagsFilter);
        baseFilter.push(categoriesFilter);
        baseFilter.push(parentDateFilter);
        baseFilter.push(dateFilter);

        return baseFilter;
    }

    async getCategories(options: PluginRequestOptions): Promise<Category[]> {
        let combined = await this.getCombinedFilters();

        return [
            // {
            //     id: "all",
            //     title: "All",
            //     filters: []
            // },
            {
                id: "threads",
                title: "Threads",
                filters: combined
            },
            {
                id: "comments",
                title: "Comments",
                filters: combined
            },
            // ,
            // {
            //     id: "channels",
            //     title: "Channels",
            //     filters: combined
            // }
            // TBD PENDING FRAMEWORK UPDATE - SHOULDN'T HAVE ANY FILTERS
            {
                id: "users",
                title: "Users",
                filters: combined
            }
        ];
    }

    async search(options: PluginRequestOptions, query: string, categoryId?: string): Promise<PagedArray<SearchResultItem>> {
        let url: string, data: any, userUrl: string, response: any;
        const hasUser = !!options.session.user; // SetHeaders
        // Format search query
        const regex = /\s/g;
        const serializeQueryStr = query.replace(regex, "+");

        // Turn Filters into Object
        const allFiltersForQuery = this.populateFilterObject(options);
        const hasFilters: boolean = !!Object.keys(allFiltersForQuery);

        // Format filters for Querying
        const activeFiltersStr = this.formatQueryString(options, allFiltersForQuery);

        // Creating SearchResults
        const searchResults = new PagedArray<SearchResultItem>();

        switch (categoryId) {
            case "threads": {
                // Set URL based on Query
                hasFilters
                    ? (url = `${this.config.rootUrl}/search.json?q=${serializeQueryStr}${activeFiltersStr}`)
                    : (url = `${this.config.rootUrl}/search.json?q=${serializeQueryStr}`);
                response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                const threadsData = response.topics;
                // const thread = DiscourseThreadPopulator.populateThread(data);
                // searchItem.item = thread;
                // searchItem.itemType = SearchResultItemType.Thread;

                for (const thread of threadsData) {
                    const threadPopulated = DiscourseThreadPopulator.populateThread(thread);
                    thread.item = threadPopulated;
                    thread.itemType = ObjectTypes.thread;
                    thread.id = thread.id.toString()
                    const searchResultItem = this.populateSearchResultItem(thread);
                    searchResults.array.push(searchResultItem);
                }

                break;
            }
            case "comments": {
                // Set URL based on Query
                hasFilters
                    ? (url = `${this.config.rootUrl}/search.json?q=${serializeQueryStr}${activeFiltersStr}`)
                    : (url = `${this.config.rootUrl}/search.json?q=${serializeQueryStr}`);
                response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                const commentsData = response.posts;

                for (const comment of commentsData) {
                    comment.threadId = comment.topic_id;
                    comment.score = comment.like_count;

                    const commentPopulated = DiscourseCommentPopulator.populateComment(comment, options.session.user);
                    comment.item = commentPopulated;
                    comment.itemType = ObjectTypes.comment;
                    comment.id = comment.id.toString()
                    const searchResultItem = this.populateSearchResultItem(comment);
                    searchResults.array.push(searchResultItem);
                }
                break;
            }
            // CHANNELS NEVER RETURN ANYTHING...EVER
            // case "channels": {
            //     const channelsData = response.categories;

            //     if (channelsData.length > 1) {
            //         for (const channel of channelsData) {
            //             channel.threadId = channel.topic_id;
            //             channel.score = channel.like_count;

            //             const channelPopulated = DiscourseChannelPopulator.populateChannel(channel, options.session.user);
            //             channel.item = channelPopulated;
            //             channel.itemType = SearchResultItemType.Channel;
            //             const searchResultItem = this.populateSearchResultItem(channel);
            //             searchResults.array.push(searchResultItem);
            //         }
            //     }
            //         return searchResults;
            //     break;
            // }
            case "users": {
                // https://community.cartalk.com/search/query?term=repair&include_blurbs=true&type_filter=user&_=1553019648877
                // USE THIS ENDPOINT TO SEARCH USERS
                userUrl = `${this.config.rootUrl}/search/query.json?term=${serializeQueryStr}&include_blurbs=true&type_filter=user`;
                response = await this.setUrlToken(hasUser, userUrl, options.session.user ? options.session.accessToken.token : null);

                const usersData = response.users;
                for (const user of usersData) {
                    user.threadId = user.topic_id;
                    user.score = user.like_count;
                    user.partialUrl = this.config.partialUrl
                    user.communityName = this.config.id.replace("_discourse","")
                    const userPopulated = DiscourseUserPopulator.populateUser(user);
                    user.item = userPopulated;
                    user.itemType = ObjectTypes.user;
                    user.id = user.username;
                    

                    // user.id = user.id.toString()
                    const searchResultItem = this.populateSearchResultItem(user);

                    searchResults.array.push(searchResultItem);
                }

                break;
            }
        }

        return searchResults;
    }

    private async setUrlToken(hasUser: boolean, url: string, key?: string) {
        let response: any;
        if (hasUser) {
            response = await this.pluginContext.axios.get(url, {
                responseType: "json",
                headers: {
                    "user-api-key": key
                }
            });
        } else {
            response = await this.pluginContext.axios.get(url);
        }
        return response.data;
    }

    private populateFilterObject(options: PluginRequestOptions) {
        let allFiltersForQuery: object = {};
        // Creating Object of Selected Filter Sorts
        // { filterQueryKey: filterQueryValue }
        const getVal = (filter, filterVal) =>
            filterVal.value !== undefined && filterVal.value !== null ? (allFiltersForQuery[filter] = filterVal.value.toString()) : null;

        //  SORTS (order:) id: "search_sorts"
        const searchSortsFilter = Filter.findFilter(options.filters, "search_sorts");
        getVal("order", searchSortsFilter);

        // POST SORTS (in:) id: "includes"
        const searchIncludedFilter = Filter.findFilter(options.filters, "includes");
        getVal("in", searchIncludedFilter);

        // TOPIC SORTS (status:) id: "status"
        const statusFilter = Filter.findFilter(options.filters, "status");
        getVal("status", statusFilter);

        // TAG FILTERS (tags:) id: "tag_filter"
        const tagsFilter = Filter.findFilter(options.filters, "tag_filter");
        tagsFilter.value !== undefined && tagsFilter.value !== "" ? (allFiltersForQuery["tags"] = tagsFilter.value) : null;

        // CATEGORIES FILTERS id: "categories_filter"
        const categoriesFilter = Filter.findFilter(options.filters, "categories_filter");
        getVal("#", categoriesFilter);

        // DATE FILTERS OPTION id: "before_after" + DATE FILTER id: "date"
        const beforeFilter = Filter.findFilter(options.filters, "before_after");
        const dateOption = beforeFilter.value.toString();
        const dateFilter = Filter.findFilter(options.filters, "date");
        dateFilter.value !== undefined ? (allFiltersForQuery[dateOption] = dateFilter.value) : null;

        return allFiltersForQuery;
    }

    private formatQueryString(options: PluginRequestOptions, allFiltersForQuery: object) {
        let activeFiltersStr: string = "";

        // TAG FILTER OPTION
        const selectAll = Filter.findFilter(options.filters, "select_all");

        const itterableFilters = Object.entries(allFiltersForQuery);
        itterableFilters.forEach(item => {
            if (item[0] === "tags") {
                let allTags: string = ` tags:${item[1]}`;
                let tagRegex = /[,]/g;
                selectAll.value !== undefined ? (allTags = allTags.replace(tagRegex, "+")) : null;
                this.pluginContext.logger.d(`All Tags = ${item[1]}`);
                activeFiltersStr += allTags;
            } else if (item[0] === "#") {
                this.pluginContext.logger.d(`Item = ${item[1]}`);
                // let encoded = encodeURI(` #${item[1]}`);
                let encoded = ` %23${item[1]}`;

                // this.pluginContext.logger.d()
                activeFiltersStr += encoded;
                // this.pluginContext.logger.d(`activeFiltersStr = ${activeFiltersStr}`);
            } else if (item[0] === "before" || item[0] === "after") {
                let month, day, year;
                this.pluginContext.logger.d(item[1]);
                const date = new Date(item[1]);
                this.pluginContext.logger.d(date);
                date.getMonth() < 10 ? (month = `0${date.getMonth() + 1}`) : (month = date.getMonth() + 1);
                date.getDate() < 10 ? (day = `0${date.getDate()}`) : (day = date.getDate());
                year = date.getFullYear();
                const formattedDate = `${year}-${month}-${day}`;
                activeFiltersStr += " " + item[0] + ":" + formattedDate;
            } else {
                activeFiltersStr += " " + item[0] + ":" + item[1];
            }
        });
        this.pluginContext.logger.d(`activeFiltersStr = ${activeFiltersStr}`);
        // url = `${this.config.rootUrl}/search?q=${encodeURI(serializeQueryStr)}${encodeURI(activeFiltersStr)}`;
        // Fetches More Post Results: /search/query.json?term=bugatti
        return activeFiltersStr;
    }

    private populateSearchResultItem(data: any): SearchResultItem {
        const searchItem: SearchResultItem = {
            id: data.id.toString(),
            item: data.item,
        itemType: data.itemType
        };

        

        return searchItem;
    }
}
