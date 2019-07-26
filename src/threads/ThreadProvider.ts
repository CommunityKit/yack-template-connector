import {
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    IThreadProvider,
    Thread,
    stringUtils,
    File as YackFile,
    Filter,
    IChannelProvider,
    Form,
    Channel,
    Result,
    Action,
    ThreadDisplayProperties,
    PluginUser,
    TextContent
} from "yack-plugin-framework";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import { populateThread } from "./ThreadPopulator";
import * as filter from "../search/Filters";
import { getUserCreatedContent } from "./ThreadRequests";
import uuid = require("uuid");
import * as querystring from "querystring";

export class ThreadProvider implements IThreadProvider {
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;
    private channelProvider: IChannelProvider;
    actions = [Action.save, Action.report];

    constructor(context: PluginContext, config: IDiscourseConfig, channelProvider: IChannelProvider) {
        this.pluginContext = context;
        this.config = config;
        this.channelProvider = channelProvider;
    }

    threadDisplayProperties: ThreadDisplayProperties[] = [ThreadDisplayProperties.title, ThreadDisplayProperties.attachments];

    async getFilters(options: PluginRequestOptions): Promise<Result<Filter[]>> {
        // return DiscourseFilters.TOP_THREADS_FILTERS;
        // return filter.DEFAULT_CHANNELS_THREADS_FILTERS;
        return Result.success(filter.DEFAULT_CHANNELS_THREADS_FILTERS);
    }

    async getThreadsByChannel(options: PluginRequestOptions, channelQuery: Channel.Query): Promise<Result<PagedArray<Thread>>> {
        // SetHeaders
        const channelId = channelQuery.id;
        const hasUser = !!options.session.user;

        // Axios Request
        let url: string;
        let response: any;

        // nextPageToken
        let paginationString = options.nextPageToken;
        let currentPage: number;
        let hasPageToken: boolean = !!paginationString;

        // Lookup channelName by Category Id
        // let categoryDictionary: object = await this.createCategoryDictionary(options);
        // this.pluginContext.logger.d(`Category Dictionary Test = ${categoryDictionary}`);

        // Determine threadCount
        let totalThreads = data => data.topic_list.topics.length;

        const threads = new PagedArray<Thread>();

        switch (channelId) {
            case "top:popular": {
                // options.filters = DiscourseFilters.TOP_THREADS_FILTERS;
                if (hasPageToken) {
                    // 50 per page - can set this in request
                    currentPage = this.setPageToken(threads, paginationString, true, 50);
                    url = `${this.config.rootUrl}/top${this.getTopChannelFilters(
                        options
                    )}.json?page=${currentPage}&no_subcategories=false&per_page=50${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                } else {
                    url = `${this.config.rootUrl}/top${this.getTopChannelFilters(options)}.json?${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                    let threadCount = totalThreads(response); // 50 max per page
                    threadCount === 50 ? this.setPageToken(threads, null, false, threadCount) : (threads.nextPageToken = null);
                }
                break;
            }
            case "fixed:latest": {
                if (hasPageToken) {
                    currentPage = this.setPageToken(threads, paginationString, true, 30);
                    url = `${this.config.rootUrl}/latest.json?page=${currentPage}&${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                } else {
                    url = `${this.config.rootUrl}/latest.json?${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                    let threadCount = totalThreads(response); // 30 per page
                    threadCount === 30 ? this.setPageToken(threads, null, false, threadCount) : (threads.nextPageToken = null); // No need for pagination if less than 30 pages
                }
                break;
            }
            case "unread": {
                if (hasPageToken) {
                    currentPage = this.setPageToken(threads, paginationString, true, 30);
                    url = `${this.config.rootUrl}/unread.json?page=${currentPage}`;
                    response = await this.setUrlToken(hasUser, url, options.session.accessToken.token);
                } else {
                    url = `${this.config.rootUrl}/unread.json`;
                    response = await this.setUrlToken(hasUser, url, options.session.accessToken.token);
                    let threadCount = totalThreads(response); // 30 per page
                    threadCount === 30 ? this.setPageToken(threads, null, false, threadCount) : (threads.nextPageToken = null); // No need for pagination if less than 30 pages
                }
                break;
            }
            default: {
                if (hasPageToken) {
                    currentPage = this.setPageToken(threads, paginationString, true, 30);
                    url = `${this.config.rootUrl}/c/${channelId}.json?${this.getOrderChannelFilters(
                        options
                    )}exclude_category_ids%5B%5D=1&no_definitions=true&no_subcategories=false&page=${currentPage}${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                } else {
                    url = `${this.config.rootUrl}/c/${channelId}.json?${this.getOrderChannelFilters(options)}${this.getSolvedFilters(options)}`;
                    response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                    let threadCount = totalThreads(response); // 30 per page
                    threadCount >= 30 ? this.setPageToken(threads, null, false, threadCount) : (threads.nextPageToken = null); // No need for pagination if less than 30 pages
                    this.pluginContext.logger.d(`Set PageToken = ${threads.nextPageToken}`);
                }
                break;
            }
        }

        // this.pluginContext.logger.d(`Debug = ${JSON.stringify(response.topic_list.topics)}`);
        const users = response.users;
        const topicsList = response.topic_list.topics;

        for (const topic of topicsList) {
            // Map Channel info to Topic
            // topic.channelId = channelId;
            topic.channelId = topic.category_id;
            topic.channelName = channelQuery.metadata.categoryMap[topic.category_id];
            // topic.channelName = categoryDictionary[topic.category_id.toString()];

            // Determine the thread topic creator
            // Get User Id
            // Set Topic Creator User Info
            let creator = topic.posters.filter(poster => poster.description.split(", ").includes("Original Poster"))[0];
            let userObject = users.filter(user => user.id == creator.user_id)[0];
            topic.creator_id = userObject.id.toString();
            topic.creator_full_name = userObject.name;
            topic.creator_username = userObject.username;
            // this.pluginContext.logger.d(`Topic = ${JSON.stringify(topic)}`);
            topic.communityName = this.config.id.replace("_discourse", "");
            topic.partialUrl = this.config.partialUrl;

            const thread = await populateThread(topic, options, this.config.rootUrl);
            thread.metadata = {};
            // this.populateTestAttachments(thread);
            threads.array.push(thread);
        }
        return Result.success(threads);
        // return threads;
    }

    async getThread(options: PluginRequestOptions, threadQuery: Thread.Query): Promise<Result<Thread>> {
        // const tId = threadId.split(" ")[0]
        // const postId = threadId.split(" ")[1]
        const threadId = threadQuery.id;

        const hasUser = !!options.session.user;
        let url = `${this.config.rootUrl}/t/${threadId}.json`; // only using first element so don't need pagination
        const data = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);

        const posts = data.post_stream.posts;
        const postId = data.post_stream.posts[0].id;

        const firstPostInThread = posts[0];
        // if(postId === true){
        //     return firstPostInThread.id;
        // }

        // firstPostInThread.channelId = channelId;
        // firstPostInThread.channelName = channelId;

        // Set Topic Creator User Info
        firstPostInThread.creator_id = firstPostInThread.user_id;
        firstPostInThread.creator_full_name = firstPostInThread.name;
        firstPostInThread.creator_username = firstPostInThread.username;
        // firstPostInThread.cooked = firstPostInThread.cooked
        firstPostInThread.id = threadId;

        // firstPostInThread.id = `${threadId} ${firstPostInThread.id}`;
        // console.warn(`TESTING NEW THREAD ID: ${firstPostInThread.id}`)
        firstPostInThread.title = data.fancy_title ? data.fancy_title : null;
        firstPostInThread.totalScore = firstPostInThread.score ? firstPostInThread.score : null;
        firstPostInThread.views = data.views ? data.views : null;
        firstPostInThread.created_at = firstPostInThread.created_at;
        firstPostInThread.last_posted_at = firstPostInThread.last_posted_at;
        firstPostInThread.pinned = data.pinned ? data.pinned : null;
        firstPostInThread.channelId = data.category_id;
        firstPostInThread.communityName = this.config.id.replace("_discourse", "");
        firstPostInThread.partialUrl = this.config.partialUrl;
        firstPostInThread.totalComments = posts.length - 1;

        const thread = await populateThread(firstPostInThread, options, this.config.rootUrl);

        thread.metadata = { postId: postId };
        thread.channelId = threadQuery.channelId;
        thread.channelName = threadQuery.channelName;
        // thread.detailsPrepopulated = true;
        // return thread;
        return Result.success(thread);
    }

    async saveThread(options: PluginRequestOptions, channelId: string, thread: Thread): Promise<Thread> {
        return null;
    }

    async deleteThread(options: PluginRequestOptions, threadQuery: Thread.Query): Promise<Result<void>> {
        const threadId = threadQuery.id;
        // const thread = await this.getThreadById(options,threadId);
        // if(thread.createdBy.username === options.session.user.username){
        let url = `${this.config.rootUrl}/t/${threadId}.json`; // only using first element so don't need pagination
        await this.pluginContext.axios.delete(url, {
            responseType: "json",
            headers: {
                "user-api-key": options.session.accessToken.token
            }
        });
        return Result.success(null);
        // }else{
        //     return null;
        // }
    }

    // async saveThreadAction(options: PluginRequestOptions, threadId: string, actionItem: ObjectAction.Item): Promise<void> {}
    async saveAction(options: PluginRequestOptions, threadQuery: Thread.Query, action: Action, actionType: Action.Types): Promise<Result<void>> {
        const threadId = threadQuery.id;
        let url, response, data, formData;
        if (action == Action.report) {
            url = `${this.config.rootUrl}/post_actions.json`;
            formData = `id=${threadId}&post_action_type_id=${8}&flag_topic=true`;
            await this.pluginContext.axios.post(url, formData, {
                responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
        } else if (action == Action.save) {
            url = `${this.config.rootUrl}/t/${threadId}/bookmark.json`;
            await this.pluginContext.axios.put(url, "", {
                // responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
        } else {
            throw new Error(`Not implemented`);
        }
        return Result.success(null);
    }

    private async getTopicStream() {
        return null;
    }

    private async createCategoryDictionary(options: PluginRequestOptions) {
        let categoryDictionary: object = {};
        const hasUser = !!options.session.user;
        let url = `${this.config.rootUrl}/site.json`;
        const allData = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
        // this.pluginContext.logger.d(`createCategoryDictionary Response = ${JSON.stringify(allData.categories)}`);
        const categories = allData.categories;
        categories.forEach(category => (categoryDictionary[category.id.toString()] = category.name));
        // this.pluginContext.logger.d(`Completed Dictionary: ${JSON.stringify(categoryDictionary)}`);
        return categoryDictionary;
    }

    // private getLatestChannelFilters(options: PluginRequestOptions): string {
    //     //Get Order Filter
    //     const orderByFilter = Filter.findFilter(options.filters, "sort_by_category");
    //     const sortValue = orderByFilter.value.toString();
    //     if(sortValue !== "null"){
    //         let bool: string;
    //         sortValue === "ascending_true" ? bool = `true` : bool = `false`;
    //         return `order=category&ascending=${bool}`;
    //     }else{
    //         return '';
    //     }
    // }

    private getTopChannelFilters(options: PluginRequestOptions): string {
        const sortByFilter = Filter.findFilter(options.filters, "sort_interval");
        const sortId = sortByFilter.value.toString();
        if (sortId === "default") {
            return "";
        } else {
            const partialUrl = `/${sortId}`;
            // const topThreadsFilters = objectUtils.clone(DiscourseFilters.TOP_THREADS_FILTERS);
            return partialUrl;
        }
    }

    private getSolvedFilters(options: PluginRequestOptions): string {
        //GET Solved filter
        const solvedByFilter = Filter.findFilter(options.filters, "solved?");
        const solvedId = solvedByFilter.value.toString();

        if (solvedId !== "all") {
            let solvedVal: string;
            solvedId === "solved_yes" ? (solvedVal = "yes") : (solvedVal = "unsolved");
            const solvedPartialUrl = `&solved=${solvedVal}`;
            return solvedPartialUrl;
        } else {
            return "";
        }
    }

    private getOrderChannelFilters(options: PluginRequestOptions): string {
        //GET order filter
        const orderByFilter = Filter.findFilter(options.filters, "order_by");
        const orderValue = orderByFilter.value.toString();
        const partialUrl = `order=${orderValue}`;

        if (orderValue === "views") {
            return `${partialUrl}&ascending=false`;
        } else {
            return partialUrl;
        }
    }

    private async setUrlToken(hasUser: boolean, url: string, key?: string) {
        let response: any;
        if (key) {
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
        // if(response.success){
        //     return response.data;
        // }else{
        //     console.log('FAILED RESPONSE'+response)
        //     console.log(response)
        //     console.log(url)

        // }
    }

    private parseNextPageToken(pageToken: string) {
        let ary = pageToken.split(" ");
        let nextPage = parseInt(ary[0]);
        return nextPage;
    }

    private parseTotalPages(pageToken: string) {
        let ary = pageToken.split(" ");
        let totalPages = parseInt(ary[1]);
        return totalPages;
    }

    private incrementPageToken(currentPage: number, totalPages: number) {
        return `${(currentPage + 1).toString()} ${totalPages}`;
    }

    private setPageToken(boundThreads: any, paginationString?: string, increment?: boolean, perPage?: number) {
        let pageCount: number;
        let oldPage: number;
        let newPageString: string;
        let nextPageNumber: number;
        if (increment) {
            oldPage = this.parseNextPageToken(paginationString);
            pageCount = this.parseTotalPages(paginationString);
            newPageString = this.incrementPageToken(oldPage, pageCount);
            nextPageNumber = this.parseNextPageToken(newPageString);
            boundThreads.nextPageToken = newPageString; //set nextPageToken
            return nextPageNumber;
        } else {
            pageCount = Math.ceil(pageCount / perPage);
            boundThreads.nextPageToken = `1 ${pageCount}`;
            nextPageNumber = this.parseNextPageToken(boundThreads.nextPageToken);
            return nextPageNumber;
        }
    }
    async getThreadsByUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PagedArray<Thread>>> {
        const userId = userQuery.id;
        // Pagination???
        // https://community.cartalk.com/user_actions.json?offset=0&username=b.l.e&filter=5&no_results_help_key=user_activity.no_replies&_=1556298757193
        const userThreads = new PagedArray<Thread>();
        const userThreadsData = await getUserCreatedContent(this.pluginContext.axios.get, this.config.rootUrl, userId, options.nextPageToken, options);
        for (const threadData of userThreadsData) {
            // populate thread
            threadData.partialUrl = this.config.partialUrl;

            threadData.communityName = this.config.id.replace("_discourse", "");

            const thread = await populateThread(threadData, options, this.config.rootUrl);
            thread.channelName = userId;
            thread.channelId = userId;
            // thread.detailsPrepopulated = true;
            userThreads.array.push(thread);
            // push to PagedArray
        }
        return Result.success(userThreads);
        // return userThreads;
    }

    // IF threadId: user is trying to edit a thread
    async getSaveThreadForm(options: PluginRequestOptions, channelQuery: Channel.Query, threadQuery: Thread.Query): Promise<Result<Form>> {
        let thread, channel, threadId;
        channel = channelQuery;
        threadQuery ? (threadId = threadQuery.id) : (threadId = null);

        console.warn("in getSaveThreadForm ThreadQuery:" + JSON.stringify(threadQuery));
        // const channelId = channelQuery.id;
        if (threadId) {
            thread = threadQuery;
            // thread = await this.getThread(options, threadQuery);
            // channel = await this.channelProvider.getChannel(options, channelQuery);
        } else {
            // channel = await this.channelProvider.getChannel(options, channelQuery);
        }

        const titleField: Form.TextField = {
            title: "Title",
            type: Form.Field.Types.text,
            value: thread ? thread.title : null,
            disabled: false
        };

        const bodyField: Form.RichTextField = {
            title: "Text",
            type: Form.Field.Types.richText,
            options: [
                Form.RichTextField.Options.bold,
                Form.RichTextField.Options.italic,
                Form.RichTextField.Options.link,
                Form.RichTextField.Options.imageupload,
                Form.RichTextField.Options.heading,
                Form.RichTextField.Options.bulletedlist,
                Form.RichTextField.Options.numberedlist,
                Form.RichTextField.Options.quoteblock,
                Form.RichTextField.Options.emoji,
                Form.RichTextField.Options.codeblock
            ],
            valueType: thread && thread.content ? thread.content.type : TextContent.Types.html,
            value: thread && thread.content ? thread.content.value : ""
        };

        // Can't upload videos to discourse
        const uploadField: Form.UploadField = {
            type: Form.Field.Types.upload,
            title: "Upload Images & Videos",
            maxItems: 50,
            supportedTypes: [Form.UploadField.Types.image],
            maxImageFileSizeInMB: 40,
            maxVideoFileSizeInMB: 0,
            maxAnyFileSizeInMB: 0,
            disabled: thread != null
        };

        const categories = await this.getCategories(this.pluginContext.axios.get, options);
        let categoryIds: number[] = [];
        categories.forEach(element => categoryIds.push(element.id));

        let categoryNames: string[] = [];
        categories.forEach(element => categoryNames.push(element.name));

        const categoriesField: Form.SelectField = {
            title: "Category",
            multiSelect: false,
            type: Form.Field.Types.select,
            itemsById: {},
            value: null,
            compact: true
        };

        for (const category of categories) {
            categoriesField.itemsById[category.id] = {
                title: category.name
            };
        }

        // const flairs = await this.getFlairs(options, channelId);

        const postFieldsById: Form.ChildrenById = {
            title: titleField,
            body: bodyField
        };

        const imageVideoFieldsById: Form.ChildrenById = {
            title: titleField,
            upload: uploadField
        };

        postFieldsById["postProps"] = {
            type: Form.Field.Types.group,
            childrenById: {}
        };

        imageVideoFieldsById["postProps"] = {
            type: Form.Field.Types.group,
            childrenById: {}
        };

        const postTypesField: Form.TabsField = {
            type: Form.Field.Types.tabs,
            itemsById: {
                post: {
                    title: "Post",
                    childrenById: postFieldsById
                },
                image_video: {
                    title: "Image & Video",
                    childrenById: imageVideoFieldsById
                }
            },
            defaultValue: "post"
        };

        if (thread) {
            postTypesField.disabled = true;

            postTypesField.value = "post";
        }

        const form: Form = {
            id: uuid.v4(),
            fieldById: {
                postTypes: postTypesField
            }
        };

        return Result.success(form);
    }

    async saveThreadForm(
        options: PluginRequestOptions,
        channelQuery: Channel.Query,
        threadQuery: Thread.Query,
        formValue: Form.Value
    ): Promise<Result<Thread>> {
        let threadId;
        // const channelId = channelQuery.id;
        threadQuery ? (threadId = threadQuery.id) : (threadId = null);

        // const threadId = threadQuery.id;
        const valueByFieldId = formValue.valueByFieldId;
        const title = valueByFieldId["title"] as string;
        const body = valueByFieldId["body"] as string;
        // const url = valueByFieldId["url"] as string;
        const files = valueByFieldId["upload"] as YackFile[];
        // const postType = valueByFieldId["postTypes"] as string;
        // const spoiler = valueByFieldId["spoiler"] ? (valueByFieldId["spoiler"] as boolean) : false;

        if(title.length < 15){
            return Result.validationError(["Title must be at least 15 characters"]);
        }else if(body.length < 20){
            return Result.validationError(["Post must be at least 20 characters"]);
        }

        if (threadId) {
            // IF threadId update the current thread
            // TBD
            const postId = threadQuery.metadata.postId;

            const formData = {
                "post[topic_id]": threadId,
                "post[raw]": body
            };

            const url = `${this.config.rootUrl}/posts/${postId}.json`;

            const response = await this.pluginContext.axios.put(url, querystring.stringify(formData), {
                responseType: "json",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "user-api-key": options.session.accessToken.token
                }
            });

            const data = response.data;
            // {"action":"create_post","errors":["Title seems unclear, is it a complete sentence?"]}
            if("errors" in data){
                return Result.validationError(data.errors)
            }else{
                const thread = await this.getThread(options, { ...threadQuery, channelId: channelQuery.id });
                return Result.success(thread.result);
            }
        } else {
            const formData = {
                title: title,
                raw: body,
                category: channelQuery.metadata.categoryId
            };

            const url = `${this.config.rootUrl}/posts.json`;

            const response = await this.pluginContext.axios.post(url, querystring.stringify(formData), {
                responseType: "json",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "user-api-key": options.session.accessToken.token
                }
            });

            const data = response.data;

            const newThreadId = data.topic_id;
            if("errors" in data){
                return Result.validationError(data.errors)
            }else{
                const thread = await this.getThread(options, { id: newThreadId });

                return Result.success(thread.result);
            }        }


        

        // return {
        //     resultObject: thread
        // };
    }

    // async uploadSaveThreadFormFile(
    //     options: PluginRequestOptions,
    //     channelId: string,
    //     threadId: string,
    //     file: YackFile,
    //     requestCancelToken: CancelToken
    // ): Promise<UploadFileResult> {
    //     return;

    // }

    private async getCategories(get, options) {
        let url: string;
        url = `${this.config.rootUrl}/site.json`;

        const channelsResponse = await this.pluginContext.axios.get(url, {
            responseType: "json",
            headers: {
                "user-api-key": options.session.accessToken.token
            }
        });
        const categoryList = channelsResponse.data.categories;

        let selectableCategories = [];

        for (const category of categoryList) {
            selectableCategories.push({ id: category.id, name: category.name });
        }
        return selectableCategories;
    }
}

// Refactor to only request content on click to ensure we don't hit the rate limits

// Turn Sub-Categories into channels

// "topic_featured_link_allowed_category_ids": [
//   9,
//   11,
//   17,
//   12,
//   2,
//   4,
//   13,
//   15,
//   7,
//   10,
//   18,
//   16,
//   8,
//   14,
//   1
// ]

// Add content Filters
// Add attachment capabilities

// Gif attachment is breaking

// Need to build way to use Twitter emojis

// Large image is breaking responsiveness of content
// Ex: ReadMe First: Getting Started article

// How does discourse handle pagination?
