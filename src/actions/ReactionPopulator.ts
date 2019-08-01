import { Reaction } from "yack-plugin-framework";

export function populateReaction(options): Reaction.UserReaction[] {
    let newReaction: Reaction;
    newReaction = Reaction.like;
    // let userReaction;
    // switch (data) {
    //     case "LIKE": {
    //         newReaction = Reaction.like;
    //         break;
    //     }
    //     case "INDIFFERENT": {
    //         newReaction = Reaction.none;
    //         break;
    //     }
    // }

    // if (options.session.user) {
        const userReaction: Reaction.UserReaction = {
            reaction: newReaction,
            user: { id: options.session.user.id, username: options.session.user.username }
        };
        return [userReaction];
    // }
    // return [{ user: options.session.user, reaction: newReaction }];
}