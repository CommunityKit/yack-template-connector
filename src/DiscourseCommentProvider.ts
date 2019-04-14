import {
    PluginRequestOptions,
    PagedArray,
    PluginContext,
    objectUtils,
    ICommentProvider,
    Comment,
    // ObjectAction,
    PluginUser,
    upndown,
    stringUtils,
    Filter
} from "yack-plugin-framework";
import * as URLAssembler from "url-assembler";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import * as Remarkable from "remarkable";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import * as querystring from "querystring";
import { oc } from "ts-optchain";
import DiscoursePluginConfig from "./DiscoursePluginConfig";
import { IDiscourseConfig } from "./config/IDiscourseConfig";

export class DiscourseCommentProvider implements ICommentProvider {
    private static readonly COMMENTS_PAGE_SIZE = 20;
    private pluginContext: PluginContext;
    private config: IDiscourseConfig;

    constructor(context: PluginContext, config: IDiscourseConfig) {
        this.pluginContext = context;
        this.config = config;
    }

    async getFilters(): Promise<Filter[]> {
        return [];
    }

    async getComments(options: PluginRequestOptions, channelId: string, threadId: string, parentCommentId?: string): Promise<PagedArray<Comment>> {
        const hasUser: boolean = !!options.session.user;
        let url: string;
        let response: any;
        let paginationString = options.nextPageToken;
        let currentPage: number;
        let totalPages: number;
        let hasPageToken: boolean = !!paginationString;

        // Determine commentCount
        let totalComments = data => data.post_stream.stream.length;

        const comments = new PagedArray<Comment>();
        const commentsMap = {};

        // {{base}}/posts/972977/replies.json
        // {{base}}/posts/by_number/119632/1.json
        if (hasPageToken) {
            currentPage = this.setCommentsPageToken(comments, paginationString, true, 20);
            url = `${this.config.rootUrl}/t/${threadId}.json?page=${currentPage}`;
            response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
        } else {
            // if we don't have a nextPageToken yet we need to set it on the first request or if they're aren't anymore pages don't set it
            url = `${this.config.rootUrl}/t/${threadId}.json`;
            response = await this.setUrlToken(hasUser, url, options.session.user ? options.session.accessToken.token : null);
            let commentCount = totalComments(response); // 20 per page
            commentCount >= 20 ? this.setCommentsPageToken(comments, null, false, commentCount) : (comments.nextPageToken = null); // No need for pagination if less than 20 pages
        }

        const threadCommentList = response.post_stream.posts;

        for (let comment of threadCommentList) {
            let replyCount = comment.reply_count;
            let hasRepliesToken = !!comment.repliesNextPageToken;
            let isReply = !!comment.reply_to_post_number;
            let parentComment;
            let commentPostNumber = comment.post_number.toString();

            if (comment.post_number !== 1) {
                switch (replyCount) {
                    case replyCount === 20: {
                        switch (hasRepliesToken) {
                            case hasRepliesToken === true: {
                                this.setRepliesPageToken(comment, comment.repliesNextPageToken, true, 20);
                                break;
                            }
                            default: {
                                this.setRepliesPageToken(comment, null, false, 20);
                                break;
                            }
                        }
                    }
                    case replyCount >= 0 && replyCount < 20: {
                        // has no replies OR has under 20 replies
                        !!commentsMap[commentPostNumber] ? (commentsMap[commentPostNumber] = comment.id.toString()) : null;
                        comment.repliesNextPageToken = null;
                    }
                    default: {
                      // If have parentCommentId
                        !!commentsMap[commentPostNumber] == false ? (commentsMap[commentPostNumber] = comment.id.toString()) : null;
                        if (isReply && !!parentCommentId == false) {
                            parentComment = commentsMap[comment.reply_to_post_number.toString()];
                            comment.parentCommentId = parentComment;
                        } else if (!!parentCommentId == true) {
                            comment.parentCommentId = parentCommentId.toString();
                            // IF comment.reply_count > 20 
                            // THEN set comment.repliesNextPageToken
                            // when called again
                            // SENDS comment.id && comment.nextPageToken (to access the previously set comment.repliesNextPageToken)
                        } else {
                            comment.parentCommentId = null;
                        }
                        break;
                    }
                }
                comment.threadId = threadId;
                let newComment = this.populateComment(comment);
                comments.array.push(newComment);
            }
        }

        return comments;
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

    private populateComment(data: any) {
        const newComment: Comment = {
            id: data.id.toString(),
            ...data.parentCommentId && {parentCommentId: data.parentCommentId},
            ...data.repliesNextPageToken && {repliesNextPageToken: data.repliesNextPageToken},
            threadId: data.threadId,
            content: data.cooked,
            totalScore: data.score,
            createdBy: {
                id: data.user_id,
                fullName: data.name,
                username: data.username
            },
            utcCreateDate: Date.parse(data.created_at),
            utcLastUpdateDate: Date.parse(data.updated_at),

        };
        // !!data.parentCommentId ? (newComment.parentCommentId = data.parentCommentId) : (newComment.parentCommentId = null);
        // newComment.repliesNextPageLength = data.reply_count;
        // data.repliesNextPageToken ? (newComment.repliesNextPageToken = data.repliesNextPageToken) : (newComment.repliesNextPageToken = null);
        // newComment.threadId = data.threadId;
        // newComment.content = newComment.id + "-" + data.cooked;
        // newComment.totalLikes = "";
        // newComment.totalDislikes = "";
        // newComment.totalScore = data.score;
        // newComment.createdBy = new PluginUser({
        //     id: data.user_id,
        //     fullName: data.name,
        //     username: data.username
        // });
        // newComment.utcCreateDate = Date.parse(data.created_at);
        // newComment.utcLastUpdateDate = Date.parse(data.updated_at);
        // newComment.repliesNextPageToken = "";
        // newComment.repliesNextPageLength = "";
        return newComment;
    }
    // TBD
    async saveComment(options: PluginRequestOptions, comment: Comment, parentComment?: Comment): Promise<Comment> {
        return null;
    }

    async deleteComment(options: PluginRequestOptions, commentId: string): Promise<void> {}

    // async saveCommentAction(options: PluginRequestOptions, commentId: string, actionItem: ObjectAction.Item): Promise<void> {}
    async getUserComments(options: PluginRequestOptions, userId: string): Promise<PagedArray<Comment>> {
        return new PagedArray();
    }
}

// TBD need to account for has_accepted_answer 

