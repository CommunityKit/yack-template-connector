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
    TextContent,
    UploadFileResult
} from "yack-plugin-framework";
import { populateThread } from "./ThreadPopulator";
import * as filter from "../search/Filters";
import { getUserCreatedContent } from "./ThreadRequests";
import uuid = require("uuid");
import * as querystring from "querystring";
// import {catchErrors} from "../utils/PluginUtils"
import { CancelToken, AxiosResponse, AxiosError } from "axios";
import * as FormData from "form-data";


export class ThreadProvider implements IThreadProvider {
    private pluginContext: PluginContext;
    private channelProvider: IChannelProvider;
    actions = [Action.save, Action.report];

    constructor(context: PluginContext, channelProvider: IChannelProvider) {
        this.pluginContext = context;
        this.channelProvider = channelProvider;
    }

    threadDisplayProperties: ThreadDisplayProperties[] = [ThreadDisplayProperties.title, ThreadDisplayProperties.attachments];

    async getFilters(options: PluginRequestOptions): Promise<Result<Filter[]>> {
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
        let currentPage: any;
        let hasPageToken: boolean = !!paginationString;

        // Lookup channelName by Category Id
        // let categoryDictionary: object = await this.createCategoryDictionary(options);
        // this.pluginContext.logger.d(`Category Dictionary Test = ${categoryDictionary}`);

        // Determine threadCount
        let totalThreads = data => data.topic_list.topics.length;

        const threads = new PagedArray<Thread>();

        switch (channelId) {
            case "fixed:latest": {
                if (hasPageToken) {
                    // 50 per page - can set this in request
                    // currentPage = this.setPageToken(options.nextPageToken);
                    // url = `${ROOT_URL}/top${this.getTopChannelFilters(
                    //     options
                    // )}.json?page=${options.nextPageToken}&no_subcategories=false&per_page=50${this.getSolvedFilters(options)}`;
                    // response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                    // let threadCount = totalThreads(response.data); // 50 max per page

                    // threadCount === 50 ? threads.nextPageToken = this.setPageToken(options.nextPageToken) : null;

                } else {
                   
                    // if(catchErrors(response)){
                    //     return catchErrors(response)
                    // }else{
                    //     let threadCount = totalThreads(response.data); // 50 max per page
                    //     threadCount === 50 ? threads.nextPageToken = this.setPageToken("0") : null;
                    // }
                }
                break;
            }
            default: {
                // if (hasPageToken) {
                //     // currentPage = this.setPageToken(threads, paginationString, true, 30);
                //     url = `${ROOT_URL}/c/${channelId}.json?${this.getOrderChannelFilters(
                //         options
                //     )}exclude_category_ids%5B%5D=1&no_definitions=true&no_subcategories=false&page=${options.nextPageToken}${this.getSolvedFilters(options)}`;
                //     response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                //     let threadCount = totalThreads(response.data); // 30 per page
                //     threadCount === 30 ? threads.nextPageToken = this.setPageToken(options.nextPageToken) : null; 
                // } else {
                //     url = `${ROOT_URL}/c/${channelId}.json?${this.getOrderChannelFilters(options)}${this.getSolvedFilters(options)}`;
                //     response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
                //     if(catchErrors(response)){
                //         return catchErrors(response);
                //     }else{
                //         let threadCount = totalThreads(response.data); // 30 per page
                //         threadCount === 30 ? threads.nextPageToken = this.setPageToken("0") : null; // No need for pagination if less than 30 pages
                //         this.pluginContext.logger.d(`Set PageToken = ${threads.nextPageToken}`);
                //     }
                // }

                url = `https://d899d168-2db1-49a0-b15f-d1bae097dc5d.mock.pstmn.io/${channelId}/threads`;
                response = await this.pluginContext.axios.get(url);
                console.warn(response);
                break;
            }
        }

        // this.pluginContext.logger.d(`Debug = ${JSON.stringify(response.topic_list.topics)}`);
        // if(catchErrors(response)){
        //     return catchErrors(response);
        // }else{
            response = response.data;

            console.log(`Your channelQuery: ${JSON.stringify(channelQuery)}`)
        for (const thread of response) {
            const newThread = await populateThread(thread);
            threads.array.push(newThread);
        }
        
        return Result.success(threads);
    // }
        // return threads;
    }

    async getThread(options: PluginRequestOptions, threadQuery: Thread.Query): Promise<Result<Thread>> {

        const threadId = threadQuery.id;
        let url = `${MOCK_SERVER_URL}/threads/${threadId}.json`; // only using first element so don't need pagination
        const response = await this.pluginContext.axios.get(url)
        const thread = await populateThread(response);
        return Result.success(thread);
    }

    async saveThread(options: PluginRequestOptions, channelId: string, thread: Thread): Promise<Thread> {
        return null;
    }

    async deleteThread(options: PluginRequestOptions, threadQuery: Thread.Query): Promise<Result<void>> {
        const threadId = threadQuery.id;
        // const thread = await this.getThreadById(options,threadId);
        // if(thread.createdBy.username === options.session.user.username){
            const postId = threadQuery.metadata.postId;

            const formData = {
                "post[topic_id]": threadId,
                "post[raw]": '[deleted]'
            };  

            const url = `${ROOT_URL}/posts/${postId}.json`;

            const response = await this.pluginContext.axios.put(url, querystring.stringify(formData), {
                responseType: "json",
                headers: {
                    "content-type": "application/x-www-form-urlencoded", 
                    "user-api-key": options.session.accessToken.token
                }                
            });
            // if(catchErrors(response)){
            //     return catchErrors(response);
            // }else{
                return Result.success(null);
            // }



        // let url = `${ROOT_URL}/t/${threadId}.json`; // only using first element so don't need pagination
        // const response = await this.pluginContext.axios.delete(url, {
        //     responseType: "json",
        //     headers: {
        //         "user-api-key": options.session.accessToken.token
        //     }
        // });
        // if(catchErrors(response)){
        //     return catchErrors(response);
        // }else{
            return Result.success(null);
        // }
    }

    // async saveThreadAction(options: PluginRequestOptions, threadId: string, actionItem: ObjectAction.Item): Promise<void> {}
    async saveAction(options: PluginRequestOptions, threadQuery: Thread.Query, action: Action, actionType: Action.Types): Promise<Result<void>> {
        const threadId = threadQuery.id;
        let url, response, data, formData;
        if (action == Action.report) {
            url = `${ROOT_URL}/post_actions.json`;
            formData = `id=${threadId}&post_action_type_id=${8}&flag_topic=true`;
            response = await this.pluginContext.axios.post(url, formData, {
                responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
        } else if (action == Action.save) {
            url = `${ROOT_URL}/t/${threadId}/bookmark.json`;
            response = await this.pluginContext.axios.put(url, "", {
                // responseType: "json",
                headers: {
                    "user-api-key": options.session.accessToken.token
                }
            });
        } else {
            throw new Error(`Not implemented`);
        }
        // if(catchErrors(response)){
        //     return catchErrors(response);
        // }else{
            return Result.success(null);
        // }
    }

    async getThreadsByUser(options: PluginRequestOptions, userQuery: PluginUser.Query): Promise<Result<PagedArray<Thread>>> {
        const userId = userQuery.id;
        // Pagination???
        // https://community.cartalk.com/user_actions.json?offset=0&username=b.l.e&filter=5&no_results_help_key=user_activity.no_replies&_=1556298757193
        const userThreads = new PagedArray<Thread>();
        const userThreadsData = await getUserCreatedContent(this.pluginContext.axios.get, ROOT_URL, userId, options.nextPageToken, options, null);
        for (const threadData of userThreadsData) {
            // populate thr

        

            const thread = await populateThread(threadData);
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
        // const uploadField: Form.UploadField = {
        //     type: Form.Field.Types.upload,
        //     title: "Upload Images & Videos",
        //     maxItems: 50,
        //     supportedTypes: [Form.UploadField.Types.image],
        //     maxImageFileSizeInMB: 40,
        //     maxVideoFileSizeInMB: 0,
        //     maxAnyFileSizeInMB: 0,
        //     disabled: thread != null
        // };

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

        // const imageVideoFieldsById: Form.ChildrenById = {
        //     title: titleField,
        //     upload: uploadField
        // };

        postFieldsById["postProps"] = {
            type: Form.Field.Types.group,
            childrenById: {}
        };

        // imageVideoFieldsById["postProps"] = {
        //     type: Form.Field.Types.group,
        //     childrenById: {}
        // };

        const postTypesField: Form.TabsField = {
            type: Form.Field.Types.tabs,
            itemsById: {
                post: {
                    title: "Post",
                    childrenById: postFieldsById
                }
                // ,
                // image_video: {
                //     title: "Image & Video",
                //     childrenById: imageVideoFieldsById
                // }
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
        // const files = valueByFieldId["upload"] as YackFile[];
        // const postType = valueByFieldId["postTypes"] as string;
        // const spoiler = valueByFieldId["spoiler"] ? (valueByFieldId["spoiler"] as boolean) : false;

        if(!!title === false){
            return Result.validationError(["Title is required"]);
        }
        // else if(title.length < 15){
        //     return Result.validationError(["Title must be at least 15 characters"]);
        // }else if(body.length < 20){
        //     return Result.validationError(["Post must be at least 20 characters"]);
        // }

        // if(files.length > 0){
            // upload image to server
            // const uploadUrl = `${ROOT_URL}/uploads.json`;
            
            // for(const image in files){
            //     const uploadFormData = new FormData();
            //     uploadFormData.set("type", "composer")
            //     uploadFormData.set("synchronous", "true")
            //     const transformed = new Buffer(image, 'binary').toString('base64');
            //     uploadFormData.append("files[]", transformed); 
            //     const response = await this.pluginContext.axios.post(uploadUrl, uploadFormData, {
            //         responseType: "json",
            //         headers: {
            //             "content-type": "application/x-www-form-urlencoded",
            //             "user-api-key": options.session.accessToken.token
            //         }
            //     });
            //     console.log(JSON.stringify(response.data));
            // }

            // const uploadData = {
            //     "type": "composer",
            //     "synchronous": true,
            // }
            

        // }

        if (threadId) {
            // IF threadId update the current thread
            // TBD
            const postId = threadQuery.metadata.postId;

            const formData = {
                "post[topic_id]": threadId,
                "post[raw]": body
            };

            const url = `${ROOT_URL}/posts/${postId}.json`;

            const response = await this.pluginContext.axios.put(url, querystring.stringify(formData), {
                responseType: "json",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "user-api-key": options.session.accessToken.token
                }                
            });

            // {"action":"create_post","errors":["Title seems unclear, is it a complete sentence?"]}
            
            // if(!catchErrors(response)){
            //     const data = response.data;
            //     // , channelQuery: channelQuery
            //     const thread = await this.getThread(options, {id: threadQuery.id});

            //     // const thread = await this.getThread(options, {id: threadQuery.id, channelId: threadQuery.channelId });
            //     return Result.success(thread.result)
            // }else{
            //     return catchErrors(response)
            // }
        } else {
            const formData = {
                title: title,
                raw: body,
                category: channelQuery.metadata.categoryId
            };

            const url = `${ROOT_URL}/posts.json`;

            const response = await this.pluginContext.axios.post(url, querystring.stringify(formData), {
                responseType: "json",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "user-api-key": options.session.accessToken.token
                }
                
                
            });

           
            //  if(!catchErrors(response)){
            //     const data = response.data;
            //     const newThreadId = data.topic_id;
            //     // , channelId: channelQuery.id
            //     const thread = await this.getThread(options, { id: newThreadId.toString()});
            //     return Result.success(thread.result)
            // }else{
            //     return catchErrors(response)
            // }      
        }
    }

    async uploadSaveThreadFormFile(
        options: PluginRequestOptions,
        channelQuery: Channel.Query,
        threadQuery: Thread.Query,
        file: YackFile,
        requestCancelToken: CancelToken
    ): Promise<Result<UploadFileResult>> {
        console.log(`called uploadSaveThreadFormFile()`)
        console.log(`file: ${file.content}`)
        console.log(`isBuffer: ${Buffer.isBuffer(file.content)}`)
        // console.log(`Buffer.from: ${Buffer.isEncoding(file.content)}`)




        const uploadUrl = `${ROOT_URL}/uploads.json`;
            
            // for(const image in files){
                
                // uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType }); 
                // var blob = new Blob([file.content], { type: file.contentType});

                // var blob = new Blob([file.content], { type: "text/xml"});
                // uploadFormData.append("file", blob.toString(), file.name); 


                // uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType }); 
                // const transformed = file.content.toString('base64')
                // const transformed = new Buffer(file.content.toString(), 'binary').toString('base64');
                // const transformed = Buffer.from(file.content, file.content.byteOffset, file.content.length).toString('base64')
                const transformed = Buffer.from(file.content, file.content.byteOffset, file.content.length).toString('base64')

                console.log(`transformed: ${transformed}`)
                // uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType }); 
                // uploadFormData.append("file", transformed, file.name); 
                // const transformed = new Blob([file.content])
                // uploadFormData.append("file", transformed, { filename: file.name, contentType: file.contentType }); 
                // const blob = new Blob([file.content])
                // uploadFormData.append("file", blob, file.name); 
                // uploadFormData.append("file", btoa(file.content.toString('base64'))); 
                // uploadFormData.append("file", btoa(transformed).toString()); 
                // const buff = Buffer.from(file.content)
                
                // const blob = new Blob([new Uint8Array(file.content, file.content.byteOffset, file.content.length)]);
                // console.log(`blob: ${blob}`)
                // uploadFormData.append("file", blob);

                // const buff = Buffer.from(file.content)
                // uploadFormData.append("file", buff);

                // uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType }); 
                

                // uploadFormData.append("file", file.content.toString())
                const uploadFormData = new FormData();
                uploadFormData.append("type", "composer")
                uploadFormData.append("synchronous", "true")
                uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType });   
                // uploadFormData.append("file", file.content.toString('base64'), file.name);   
                // uploadFormData.append("file", file.name)

                // uploadFormData.app              // uploadFormData.append("file", transformed); 
                // let buff = Buffer.from(file.content)
                let setContentType = uploadFormData.getHeaders()
                setContentType = setContentType["content-type"]

                // uploadFormData.append("file", file.content, { filename: file.name, contentType: file.contentType }); 
                const formDataToBufferObject = this.formDataToBuffer(uploadFormData);

                // const formData = {
                //     'type': "composer",
                //     'synchronous': true,
                //     'file': file.content
                // }

                // const testForm = new FormData(formData)



                const response = await this.pluginContext.axios.post(uploadUrl, formDataToBufferObject, {
                    // body: formData,
                    // data: uploadFormData,
                    // responseType: "json",
                    headers: {
                        "content-type": setContentType,
                        "user-api-key": options.session.accessToken.token
                    }                 
                });
            // }

            // {"failed":"FAILED","message":"undefined method `tempfile' for #<String:0x00007fd2c7136cc0>"}
            // {"errors":["param is missing or the value is empty: type"]}

            if("failed" in response.data || "errors" in response.data || "error" in response.data){
                console.log(JSON.stringify(response.data));
                return Result.error("something went wrong")
            }else{
                console.log(JSON.stringify(response.data));
                const uploadFileResult: UploadFileResult = { fileId: response.data.id.toString(), srcUrl: `https:${response.data.url}` };
                return Result.success(uploadFileResult)
            }
    }

    async deleteSaveThreadFormFile?(
        options: PluginRequestOptions,
        channelQuery: Channel.Query,
        threadQuery: Thread.Query,
        fileQuery: YackFile.Query
    ): Promise<Result<void>> {
        // await this.imgUrProvider.deleteImagebyId(fileQuery.id);
        return Result.success(null);
    }


    private async getCategories(get, options) {
        let url: string;
        url = `${ROOT_URL}/site.json`;

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
    private formDataToBuffer(formData) {
        let dataBuffer = new Buffer(0);
        let boundary = formData.getBoundary();
        for (let i = 0, len = formData._streams.length; i < len; i++) {
            if (typeof formData._streams[i] !== "function") {
                dataBuffer = this.bufferWrite(dataBuffer, formData._streams[i]);

                // The item have 2 more "-" in the boundary. No clue why
                // rfc7578 specifies (4.1): "The boundary is supplied as a "boundary"
                //    parameter to the multipart/form-data type.  As noted in Section 5.1
                //    of [RFC2046], the boundary delimiter MUST NOT appear inside any of
                //    the encapsulated parts, and it is often necessary to enclose the
                //    "boundary" parameter values in quotes in the Content-Type header
                //    field."
                // This means, that we can use the boundary as unique value, indicating that
                // we do NOT need to add a break (\r\n). These are added by data-form package.
                //
                // As seen in this example (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST#Example)
                // the boundary is preceded by 2x "-". If thus --Boundary exists, do not add the break.
                if (typeof formData._streams[i] !== "string" || formData._streams[i].substring(2, boundary.length + 2) !== boundary) {
                    dataBuffer = this.bufferWrite(dataBuffer, "\r\n");
                }
            }
        }

        // Close the request
        dataBuffer = this.bufferWrite(dataBuffer, "--" + boundary + "--");

        return dataBuffer;
    }

    // Below function appends the data to the Buffer.
    private bufferWrite(buffer, data) {
        let addBuffer;
        if (typeof data === "string") {
            addBuffer = Buffer.from(data);
        } else if (typeof data === "object" && Buffer.isBuffer(data)) {
            addBuffer = data;
        }

        return Buffer.concat([buffer, addBuffer]);
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


