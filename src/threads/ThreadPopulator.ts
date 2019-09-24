import {
    Thread,
    TextContent,
    Reaction,
    PluginRequestOptions
} from "yack-plugin-framework";
// import * as Remarkable from "remarkable";
import * as htmlEncoderDecoder from "html-encoder-decoder";
import {populateAttachments} from "../threads/AttachmentPopulator"
// import { populateReaction } from "../actions/ReactionPopulator"

    export async function populateThread(data: any): Promise<Thread> {
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
            detailsPrepopulated: true

        }

        return thread;
    }


