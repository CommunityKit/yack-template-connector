import {
    Thread,
    TextContent,
    Reaction,
    PluginRequestOptions,
    Attachment,
    AttachmentType,
    Thumbnail
} from "yack-plugin-framework";
// import * as Remarkable from "remarkable";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import {populateAttachments} from "../threads/AttachmentPopulator"
// import { populateReaction } from "../actions/ReactionPopulator"

    export async function populateThread(data: any): Promise<Thread> {
        // const thumbnails: [Thumbnail] = [
        //         small: {
        //             width: 3,
        //             height: 3,
        //             url: data.featured_photo
        //         }
        // ]

        const img: Attachment ={
            type: AttachmentType.Image,
            url: data.featured_photo,
            thumbnails: {
                small: {
                    width: 640,
                    height: 480,
                    url: data.featured_photo
                },
                medium: {
                    width: 640,
                    height: 480,
                    url: data.featured_photo
                },
                high: {
                    width: 640,
                    height: 480,
                    url: data.featured_photo
                }
            }
        }

        const thread: Thread = {
            id: data.id,
            channelId: data.channel_id.toString(),
            createdBy: {
                id: data.creator_id,
                username: data.creator_username
            },
            title: data.title,
            content: {
                type: TextContent.Types.plain,
                value: data.body_content
            },
            utcCreateDate: Date.parse(data.created),
            attachments: [img],
            detailsPrepopulated: true

        }

        return thread;
    }


