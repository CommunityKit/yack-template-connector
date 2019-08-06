import {
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    ICommentProvider,
    Comment,
    Filter,
    Form, Action, Result, Thread, PluginUser, TextContent, UploadFileResult,     File as YackFile, Channel

} from "yack-plugin-framework";
import * as querystring from "querystring";
import { IDiscourseConfig } from "../config/IDiscourseConfig";
import uuid = require("uuid");
import { populateComment } from "./CommentPopulator";
import { CancelToken, AxiosResponse, AxiosError } from "axios";
import * as FormData from "form-data";




export class CommentProvider implements ICommentProvider {
    private static readonly COMMENTS_PAGE_SIZE = 20;
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;
    actions = [Action.save, Action.report];


    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    async getFilters(): Promise<Result<Filter[]>> {
        return Result.success([]);
    }

    async getCommentsByThread(options: PluginRequestOptions, threadQuery: Thread.Query, parentCommentQuery: Comment.Query): Promise<Result<PagedArray<Comment>>> {
        let currentPage, totalPages, response, url, nextPageNumber;
        const threadId = threadQuery.id;
        const parentCommentId = !!parentCommentQuery ? parentCommentQuery.id : null;
        const hasUser: boolean = !!options.session.user;
        let paginationString = options.nextPageToken;
        let hasPageToken: boolean = !!paginationString;

        const comments = new PagedArray<Comment>();

        // TOP LEVEL COMMENTS - Determine commentCount
        let totalComments = data => data.post_stream.stream.length;

        if (hasPageToken) {
            // currentPage = this.setCommentsPageToken(comments, paginationString, true, 20);
            currentPage = paginationString
            url = `${this.config.rootUrl}/t/${threadId}.json?page=${currentPage}`;
            response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
            const commentCount = totalComments(response); // 20 per page
            nextPageNumber = commentCount === 20 ? parseInt(currentPage) + 1 : null
        } else {
            // if we don't have a nextPageToken yet we need to set it on the first request or if they're aren't anymore pages don't set it
            currentPage = 1
            url = `${this.config.rootUrl}/t/${threadId}.json?page=${currentPage}`;
            response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
            const commentCount = totalComments(response); // 20 per page
            nextPageNumber = commentCount === 20 ? currentPage + 1 : null // No need for pagination if less than 20 pages
        }
        comments.nextPageToken = nextPageNumber;
        // ----------------------------------

        // ITTERATE COMMENTS + REPLIES PAGINATION
        const threadCommentList = response.post_stream.posts;
        for (let comment of threadCommentList) {
            let replyCount = comment.reply_count;
            let isReply = !!comment.reply_to_post_number;
            // if(isReply === false){
            //     comment.id = comment.post_number.toString();
            // }

            if (comment.post_number !== 1) { // first post is the topic
                if (isReply) {
                    // SET PARENT COMMENT ID IF REPLY
                    comment.parentCommentId = !!parentCommentId ? parentCommentId.toString() : comment.reply_to_post_number.toString();

                    // SET REPLY PAGNIATION IF REPLYCOUNT === 20 REPLIES
                    let hasRepliesToken = !!comment.repliesNextPageToken;
                    if(replyCount === 20){
                        // can't find any test data for this
                        // Discourse doesn't fetch replies in their own paginiated format
                        // Instead they only fetch comments/replies by date posted
                    }
                }

                // PUSH to array
                comment.threadId = threadId;
                let newComment = populateComment(comment, options, this.config.rootUrl);
                // console.log(`Comment: ${JSON.stringify(comment)}`)

                comments.array.push(newComment);
                // console.log(`ALL COMMENTS: ${JSON.stringify(comments)}`)
            }
                
            }
        return Result.success(comments);
        // return comments;
    }

    async getCommentsByUser(
        options: PluginRequestOptions,
        userQuery: PluginUser.Query,
        parentCommentQuery: Comment.Query
    ): Promise<Result<PagedArray<Comment>>> {
        return Result.success(new PagedArray());
    }

    private async setUrlToken(hasUser: boolean, url: string, key?: string) {
        let response: any;
        if (hasUser) {
            response = await this.pluginContext.axios.get(url, {
                responseType: "json",
                headers: {
                    [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: key
                }
            });
        } else {
            response = await this.pluginContext.axios.get(url);
        }
        return response.data;
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

    private setCommentsPageToken(boundComments: any, paginationString?: string, increment?: boolean, perPage?: number) {
        let pageCount: number;
        let oldPage: number;
        let newPageString: string;
        let nextPageNumber: number;
        if (increment) {
            oldPage = this.parseNextPageToken(paginationString);
            pageCount = this.parseTotalPages(paginationString);
            newPageString = this.incrementPageToken(oldPage, pageCount);
            nextPageNumber = this.parseNextPageToken(newPageString);
            boundComments.nextPageToken = newPageString; //set nextPageToken
            return nextPageNumber;
        } else {
            pageCount = Math.ceil(pageCount / perPage);
            boundComments.nextPageToken = `1 ${pageCount}`;
            nextPageNumber = this.parseNextPageToken(boundComments.nextPageToken);
            return nextPageNumber;
        }
    }

    private setRepliesPageToken(boundComments: any, paginationString?: string, increment?: boolean, perPage?: number) {
        let pageCount: number;
        let oldPage: number;
        let newPageString: string;
        let nextPageNumber: number;
        if (increment) {
            oldPage = this.parseNextPageToken(paginationString);
            pageCount = this.parseTotalPages(paginationString);
            newPageString = this.incrementPageToken(oldPage, pageCount);
            nextPageNumber = this.parseNextPageToken(newPageString);
            boundComments.repliesNextPageToken = newPageString; //set repliesNextPageToken
            return nextPageNumber;
        } else {
            pageCount = Math.ceil(pageCount / perPage);
            boundComments.repliesNextPageToken = `1 ${pageCount}`;
            nextPageNumber = this.parseNextPageToken(boundComments.nextPageToken);
            return nextPageNumber;
        }
    }

    // private populateComment(data: any, options: PluginRequestOptions) {
    //     let canUpdate;
    //     data.username === options.session.user.username ? canUpdate = true :canUpdate = false;

    //     const newComment: Comment = {
    //         id: data.id.toString(),
    //         ...data.parentCommentId && {parentCommentId: data.parentCommentId},
    //         ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
    //         threadId: data.threadId,
    //         content: {
    //             type: TextContent.Types.html,
    //             value: data.cooked},
    //         totalScore: data.score,
    //         canSessionUserUpdate: canUpdate,
    //         canSessionUserDelete: canUpdate,

    //         createdBy: {
    //             id: data.user_id,
    //             fullName: data.name,
    //             username: data.username
    //         },
    //         utcCreateDate: Date.parse(data.created_at),
    //         utcLastUpdateDate: Date.parse(data.updated_at),

    //     };
    //     // !!data.parentCommentId ? (newComment.parentCommentId = data.parentCommentId) : (newComment.parentCommentId = null);
    //     // newComment.repliesNextPageLength = data.reply_count;
    //     // data.repliesNextPageToken ? (newComment.repliesNextPageToken = data.repliesNextPageToken) : (newComment.repliesNextPageToken = null);
    //     // newComment.threadId = data.threadId;
    //     // newComment.content = newComment.id + "-" + data.cooked;
    //     // newComment.totalLikes = "";
    //     // newComment.totalDislikes = "";
    //     // newComment.totalScore = data.score;
    //     // newComment.createdBy = new PluginUser({
    //     //     id: data.user_id,
    //     //     fullName: data.name,
    //     //     username: data.username
    //     // });
    //     // newComment.utcCreateDate = Date.parse(data.created_at);
    //     // newComment.utcLastUpdateDate = Date.parse(data.updated_at);
    //     // newComment.repliesNextPageToken = "";
    //     // newComment.repliesNextPageLength = "";
    //     return newComment;
    // }
    // TBD
    // async saveComment(options: PluginRequestOptions, comment: Comment, parentComment?: Comment): Promise<Comment> {
    //     return null;
    // }



    // IF there's a parentComment => reply to comment
    // IF no parentComment => reply to thread
    // IF comment => you're editing that comment
        // To access comment data => comment.id
    async getSaveCommentForm?(options: PluginRequestOptions, threadQuery: Thread.Query, parentCommentQuery: Comment.Query, commentQuery: Comment.Query): Promise<Result<Form>> {
        const threadId = threadQuery.id;
        const parentComment = parentCommentQuery;
        const comment = commentQuery;
        // console.log(threadId, parentComment, comment);
    
        // Discourse has strikethrough and heading options but they are only accessible through Markdown/Html
        // Not sure if Discourse preformatted text is related to codeblock (dont think it is)
        // Add later: "heading", "strikethrough", "codeblock"
        const bodyField: Form.RichTextField = {
            type: Form.Field.Types.richText,
            options: [Form.RichTextField.Options.bold,
                Form.RichTextField.Options.italic,
            Form.RichTextField.Options.link,
           Form.RichTextField.Options.imageupload,
            Form.RichTextField.Options.bulletedlist,
            Form.RichTextField.Options.numberedlist,
            Form.RichTextField.Options.quoteblock,
            Form.RichTextField.Options.emoji],
            valueType: comment && comment.content ? comment.content.type : TextContent.Types.html,
            value: comment && comment.content ? comment.content.value : ""
        };
        const form: Form = {
            id: uuid.v4(),
            fieldById: {
                body: bodyField
            }
        };

        return Result.success(form);
        // return form;
    }

    async saveCommentForm?(
        options: PluginRequestOptions,
        threadQuery: Thread.Query,
        parentCommentQuery: Comment.Query,
        commentQuery: Comment.Query,
        formValue: Form.Value
    ): Promise<Result<Comment>> {
        const threadId = threadQuery.id;
        const parentComment = parentCommentQuery;
        const comment = commentQuery;
        // console.log(`commentQuery: ${JSON.stringify(commentQuery)}`)
        // console.log(threadId, parentComment, comment);
        const body = formValue.valueByFieldId["body"];
        let formData
        let url: string;

        if(!!commentQuery){
            // user is editing post
            url = `${this.config.rootUrl}/posts/${commentQuery.metadata.reactionId}.json`;
            // formData = {
            //     "topic_id": parseInt(threadId),
            //     "raw": body,
            //     ...parentComment && {"reply_to_post_number": parentComment.id}

            //     // ...parentCommentQuery && {"reply_to_post_number": parentComment.id}
            //     // "created_at": "2017-01-31"
            // };

            formData = {
                "post[raw]": body
                }
                const response = await this.pluginContext.axios.put(url, querystring.stringify(formData), 
                    {
                        responseType: "json",
                        headers: {
                            "content-type": "application/x-www-form-urlencoded",
                            [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                        }
                    }
                );
        const data = response.data;

            if("errors" in data){
                return Result.validationError(data.errors)
            }else{
                // data.id = commentQuery.id
                
                const newComment = populateComment(data.post, options, this.config.rootUrl);
                if(parentCommentQuery !== null){
                    newComment.parentCommentId = parentCommentQuery.id;
                }
                newComment.createdBy = commentQuery.createdBy;
                return Result.success(newComment);
            }
        }else{
            //user is creating new post
        url = `${this.config.rootUrl}/posts.json`;

        // if (comment) {
            formData = {
                "topic_id": parseInt(threadId),
                "raw": body,
                ...parentComment && {"reply_to_post_number": parentComment.id}

                // ...parentCommentQuery && {"reply_to_post_number": parentComment.id}
                // "created_at": "2017-01-31"
            }; 
            const response = await this.pluginContext.axios.post(url, querystring.stringify(formData), {responseType: "json",
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
            }
       });
    //    console.log(`Empty Comment Body: ${body}`)
        const data = response.data;

        if("errors" in data){
            return Result.validationError(data.errors)
        }else{
            // console.log(`Created Comment id: ${data.id}`);
            const newComment = populateComment(data, options, this.config.rootUrl);
            if(parentCommentQuery !== null){
                newComment.parentCommentId = parentCommentQuery.id;
            }
            // console.log(`newComment Id: ${newComment.id}`);

            return Result.success(newComment);
        }
    }
        // return {
        //     resultObject: newComment
        // };
            
            // formData["thing_id"] = `${Kinds.comment}_${comment.id}`;
        // } 
        // else {
        //     formData = {
        //         "title": "string",
        //         "topic_id": 0,
        //         "raw": "string",
        //         "category": 0,
        //         "target_usernames": "discourse1,discourse2",
        //         "archetype": "private_message",
        //         "created_at": "2017-01-31"
        //         }
        //     // formData["thing_id"] = parentComment ? `${Kinds.comment}_${parentComment.id}` : `${Kinds.link}_${threadId}`;
        // }

        
    }
    // async deleteComment(options: PluginRequestOptions, commentQuery: Comment.Query): Promise<Result<void>> {
    //     return Result.success(null)
    // }

    async uploadSaveCommentFormFile(
        options: PluginRequestOptions,
        threadQuery: Thread.Query,
        commentQuery: Comment.Query, 
        parentCommentQuery: Comment.Query,
        file: YackFile,
        requestCancelToken: CancelToken
    ): Promise<Result<UploadFileResult>> {
        // console.log(`called uploadSaveThreadFormFile()`)
        // console.log(`file: ${file.content}`)
        // console.log(`isBuffer: ${Buffer.isBuffer(file.content)}`)
        // console.log(`Buffer.from: ${Buffer.isEncoding(file.content)}`)




        const uploadUrl = `${this.config.rootUrl}/uploads.json`;
            
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

                // console.log(`transformed: ${transformed}`)
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
                        [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                    }                 
                });
            // }

            // {"failed":"FAILED","message":"undefined method `tempfile' for #<String:0x00007fd2c7136cc0>"}
            // {"errors":["param is missing or the value is empty: type"]}

            if("failed" in response.data || "errors" in response.data || "error" in response.data){
                // console.log(JSON.stringify(response.data));
                return Result.error("something went wrong")
            }else{
                // console.log(JSON.stringify(response.data));
                const uploadFileResult: UploadFileResult = { fileId: response.data.id.toString(), srcUrl: `https:${response.data.url}` };
                return Result.success(uploadFileResult)
            }
    }

    async deleteSaveCommentFormFile?(
        ptions: PluginRequestOptions, 
        threadQuery: Thread.Query, 
        commentQuery: Comment.Query, 
        parentCommentQuery: Comment.Query,
        fileQuery: YackFile.Query
    ): Promise<Result<void>> {
        // await this.imgUrProvider.deleteImagebyId(fileQuery.id);
        return Result.success(null);
    }

    async deleteComment(options: PluginRequestOptions, commentQuery: Comment.Query): Promise<Result<void>> {

        if(this.config.yackManagedSession){
            const url = `${this.config.rootUrl}/posts/${commentQuery.metadata.reactionId}.json`;


            const formData = {
                "post[raw]": '[deleted]'
                }
                const response = await this.pluginContext.axios.put(url, querystring.stringify(formData), 
                    {
                        responseType: "json",
                        headers: {
                            "content-type": "application/x-www-form-urlencoded",
                            [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                        }
                    }
                );
        const data = response.data;
    
            if("errors" in data){
                return Result.validationError(data.errors)
            }else{ 
                // data.id = commentQuery.id
                const newComment = populateComment(data.post, options, this.config.rootUrl);
                newComment.createdBy = commentQuery.createdBy;
                return Result.success(null);
            }
        }else if (!this.config.yackManagedSession){
        // const commentId = commentQuery.id
        // const commentId = commentQuery.metadata.postId;
        
        // const thread = await this.getCommentById(options,commentId);
        // if(thread.createdBy.username === options.session.user.username){
            let url = `${this.config.rootUrl}/posts/${commentQuery.metadata.reactionId}.json`; // only using first element so don't need pagination
            await this.pluginContext.axios.delete(url, {
                responseType: "json",
                headers: {
                    [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                }
            }); 
            return Result.success(null)
        // }else{
        //     return null;
        // }
        }
        
        
    }

    // async saveCommentAction(options: PluginRequestOptions, commentId: string, actionItem: ObjectAction.Item): Promise<void> {}
    async saveAction(options: PluginRequestOptions, commentQuery: Comment.Query, action: Action, actionType: Action.Types): Promise<Result<void>> {
        const commentId = commentQuery.id
        let url, response, data, formData;
        if (action == Action.report) {
            url = `${this.config.rootUrl}/post_actions.json`
            formData = `id=${commentQuery.metadata.reactionId}&post_action_type_id=${8}&flag_topic=true`
            await this.pluginContext.axios.post(url, formData, {
                responseType: "json",
                headers: {
                    [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                }
            }); 
        } else if (action == Action.save) {
            url = `${this.config.rootUrl}/t/${commentQuery.metadata.reactionId}/bookmark.json`
            await this.pluginContext.axios.put(url,'', {
                // responseType: "json",
                headers: {
                    [this.config.yackManagedSession ? "Api-Key" : "user-api-key"]: options.session.accessToken.token
                }
            }); 
        } else {
            throw new Error(`Not implemented`);
        }

        return Result.success(null)
    }

    async getUserComments(options: PluginRequestOptions, userId: string): Promise<PagedArray<Comment>> {
        return new PagedArray();
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

// TBD need to account for has_accepted_answer 

