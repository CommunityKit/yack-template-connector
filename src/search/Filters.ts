import { Filter } from "yack-plugin-framework";

    // https://meta.discourse.org/t/filter-topic-with-specific-tag-inside-single-category/21916
    // IF site has thread_filters enabled then we need to use tags as filters on threads/topics

    // ?ascending=true
    // - ?order=posts
    // - ?order=views
    // - ?order=activity
    // - ?order=created
    // - ?order=likes
    // { id: "op_likes", name: "Thread Likes", type: Filter.Types.ListItem },
    // - ?order=orginal_post_likes
    // { id: "likes", name: "Total Likes", type: Filter.Types.ListItem },
    // - ?order=posters
    // - ?accepted_answer=true
    // - ?order=category (Sorts by category name alphabetically descending Z-A)
    // - ?solved=yes
    // - ?solved=unsolved
    export const DEFAULT_CHANNELS_THREADS_FILTERS: Filter[] = [
        {
            id: "solved?",
            name: "solved?",
            type: Filter.Types.SingleSelect,
            defaultValue: "all",
            childFilters: [
                { id: "all", name: "All", type: Filter.Types.ListItem },
                { id: "solved_yes", name: "Solved", type: Filter.Types.ListItem },
                { id: "unsolved", name: "Unsolved", type: Filter.Types.ListItem }
            ]
        },
        {
            id: "order_by",
            name: "Order by",
            type: Filter.Types.SingleSelect,
            defaultValue: "activity",
            childFilters: [
                { id: "activity", name: "Activity", type: Filter.Types.ListItem },
                { id: "views", name: "Views", type: Filter.Types.ListItem },
                // { id: "orginal_post_likes", name: "Thread Likes", type: Filter.Types.ListItem },
                { id: "likes", name: "Likes", type: Filter.Types.ListItem },
                { id: "posts", name: "Comments", type: Filter.Types.ListItem },
                // { id: "posters", name: "Commentors", type: Filter.Types.ListItem },
                { id: "created", name: "Date", type: Filter.Types.ListItem }
                // { id: "accepted_answer", name: "Accepted Answer", type: Filter.Types.ListItem },
                // { id: "category", name: "Category", type: Filter.Types.ListItem,
                //     childFilters: [{
                //         id: "sort",
                //         name: "Sort",
                //         defaultValue: "ascending_false",
                //         type: Filter.Types.SingleSelect,
                //         childFilters: [
                //             { id: "ascending_true", name: "A-Z", type: Filter.Types.ListItem },
                //             { id: "ascending_false", name: "Z-A", type: Filter.Types.ListItem }
                //         ]
                //     }]
                // }
            ]
        }
    ];

    export const SOLVED_THREAD_FILTERS: Filter[] = [
        {
            id: "solved?",
            name: "solved?",
            type: Filter.Types.SingleSelect,
            defaultValue: "all",
            childFilters: [
                { id: "all", name: "All", type: Filter.Types.ListItem },
                { id: "solved_yes", name: "Solved", type: Filter.Types.ListItem },
                { id: "unsolved", name: "Unsolved", type: Filter.Types.ListItem }
            ]
        }
    ];

    export const TOP_THREADS_FILTERS: Filter[] = [
        // - /top/{:flag}/yearly
        // - /top/{:flag}/quarterly
        // - /top/{:flag}/monthly
        // - /top/{:flag}/weekly
        // - /top/{:flag}/daily
        {
            id: "solved?",
            name: "solved?",
            type: Filter.Types.SingleSelect,
            defaultValue: "all",
            childFilters: [
                { id: "all", name: "All", type: Filter.Types.ListItem },
                { id: "solved_yes", name: "Solved", type: Filter.Types.ListItem },
                { id: "unsolved", name: "Unsolved", type: Filter.Types.ListItem }
            ]
        },
        {
            id: "sort_interval",
            name: "Sort interval",
            type: Filter.Types.Sort,
            childFilters: [
                { id: "default", name: "Default", type: Filter.Types.ListItem },
                { id: "daily", name: "Daily", type: Filter.Types.ListItem },
                { id: "weekly", name: "Weekly", type: Filter.Types.ListItem },
                { id: "monthly", name: "Monthly", type: Filter.Types.ListItem },
                { id: "quarterly", name: "Quarterly", type: Filter.Types.ListItem },
                { id: "yearly", name: "Yearly", type: Filter.Types.ListItem }
            ],
            defaultValue: "default"
        }
    ];

    export const LATEST_CATEGORY_SORT_ALPHABETICALLY: Filter[] = [
        {
            id: "solved?",
            name: "solved?",
            type: Filter.Types.SingleSelect,
            defaultValue: "all",
            childFilters: [
                { id: "all", name: "All", type: Filter.Types.ListItem },
                { id: "solved_yes", name: "Solved", type: Filter.Types.ListItem },
                { id: "unsolved", name: "Unsolved", type: Filter.Types.ListItem }
            ]
        }
        // {
        //     id: "sort_by_category",
        //     name: "Category Sort",
        //     type: Filter.Types.Sort,
        //     defaultValue: "null",
        //     childFilters: [
        //         { id: "null", name: "None", type: Filter.Types.ListItem },
        //         { id: "ascending_true", name: "A-Z", type: Filter.Types.ListItem },
        //         { id: "ascending_false", name: "Z-A", type: Filter.Types.ListItem }
        //     ]
        // }
    ];

    export const USER_SEARCH: Filter[] = [
        {
            id: "user",
            name: "By User",
            defaultValue: "",
            type: Filter.Types.String
        }
    ];

    export const SEARCH_THREAD_FILTERS: Filter[] = [
        {
            //  SORTS (order:)
            id: "search_sorts",
            name: "Sort",
            type: Filter.Types.Sort,
            defaultValue: "latest",
            childFilters: [
                { id: "latest", name: "Latest", type: Filter.Types.ListItem },
                { id: "likes", name: "Likes", type: Filter.Types.ListItem },
                { id: "views", name: "Views", type: Filter.Types.ListItem },
                // { id: "latest_topic", name: "Latest Topic", type: Filter.Types.ListItem }
            ]
        },
        {
            // POST SORTS (in:)
            id: "includes",
            name: "Includes",
            type: Filter.Types.SingleSelect,
            childFilters: [
                // { id: "first", name: "Thread Topic", type: Filter.Types.ListItem },
                { id: "pinned", name: "Pinned", type: Filter.Types.ListItem },
                { id: "unpinned", name: "Not Pinned", type: Filter.Types.ListItem },
                { id: "images", name: "Images", type: Filter.Types.ListItem }
            ]
        },
        {
            // TOPIC SORTS (status:)
            id: "status",
            name: "Status",
            type: Filter.Types.SingleSelect,
            childFilters: [
                { id: "open", name: "Open", type: Filter.Types.ListItem },
                { id: "closed", name: "Closed", type: Filter.Types.ListItem },
                { id: "archived", name: "Archived", type: Filter.Types.ListItem }
                // { id: "noreplies", name: "No Replies", type: Filter.Types.ListItem },
                // { id: "single_user", name: "Single User", type: Filter.Types.ListItem }
            ]
        }
        // ,
        // {
        //     id: "user",
        //     name: "By User",
        //     type: Filter.Types.String
        // }

        // Need to fetch all Tags and Create filter options from tags
    ];

/*
/////////SEARCH/////////
-> Entire Post Stream: /search.json?q=bugatti (Default sorted by relevance)
    -> Post Query 
        - Decoded: /search?q=bugatti car
        - Encoded: /search?q=bugatti%20car
        - TOPICS ONLY
            - in: first
            - ** Need to find way to only get comments **
    -> SORTS (Single Select)
        - Options: latest, likes, views, latest_topic
        - Encoded: /search?q=bugatti%20order%3Alikes
        - Decoded: /search?q=bugatti order:likes
    - POST SORTS (Single Select)
        - Options: first (very first post), pinned, unpinned (not pinned), wiki, images (include images)
        - Encoded: /search?q=bugatti%20in%3Afirst
        - Decoded: /search?q=bugatti in:first
    - TAG SORTS (Multi-select)
        - Encoded: /search?q=tags%3Atoyota%2Bsubaru
        - Decoded: /search?q=tags:toyota+subaru
    - TOPIC SORTS (Single Select)
        - Options: open, closed, archived, noreplies (zero replies), single_user (contain single user)
        - Encoded: /search?q=bugatti%20status%3Aopen
        - Decoded: /search?q=bugatti status:open
    - CATEGORY/CHANNEL SORTS (Single Select) *Cannot select subcategories*
        - Encoded: /search?q=bugatti%20%23repair-and-maintenance
        - Decoded: /search?q=bugatti #repair-and-maintenance
        - Decoded: category:bug
    - USER SORTS
        - user:cpradio
    - DATE POSTED SORTS (Multi????) 
    https://meta.discourse.org/t/how-to-search-for-posts-within-a-timeframe/41011
        - Options(Two steps):  FIRST: before, after => THEN: 2019-03-31 (Date Format: YYYY-MM-DD)
        - Encoded: /search?q=bugatti%20before%3A2019-03-09
        - Decoded: /search?q=bugatti before:2019-03-09
        - DATE RANGE
            - before:2014 (Year sorts)
            - after:friday (Day of week)
            - after:2016-01-12 before:2016-01-20
            - after:june before:july (between last June and last July)
            - after:10 before:8 (Days ago)

    - MIN POST COUNT(Number)
        - Encoded: /search?q=bugatti%20min_post_count%3A2
        - Decoded: /search?q=bugatti min_post_count:2
    -> USER SEARCH 
        - Encoded: /u/search/users.json?term=car&page=2 (Usually paginated)
-> QUERY PARAMS
    - &page=1
*/

/*
/////////THREADS/////////
----ANONYMOUS USER----
-> TOP
    - Default Anonymous: /top/{:flag} OR /top/{:flag}/all
    - /top/{:flag}/yearly
    - /top/{:flag}/quarterly
    - /top/{:flag}/monthly
    - /top/{:flag}/weekly (Default Sort)
    - /top/{:flag}/daily
-> SELECT_TAG *IF admin site has this enabled - NOT enabled by default*
    - /tags/{:tag_id}
-> SELECT_TOP_LEVEL_CHANNEL (Type?)
    - Default Anonymous: /c/{:channel_name} OR /c/{:channel_name}/l/latest
    - Anonymous: /c/{:channel_name}/l/top
    - Logged In: /c/{:channel_name}/l/unread
    - Logged In: /c/{:channel_name}/l/new
    -> QUERY PARAMS
        - ?solved=yes
        - ?solved=unsolved
    -> SELECT_TAG (Single Select)
        - Default Anonymous: /tags/c/{:category_slug}/{:tag} OR /tags/c/{:category_slug}/{:tag}/latest
        - Anonymous: /tags/c/{:category_slug}/{:tag}/top
        - Logged In: /tags/c/{:category_slug}/{:tag}/unread
        - Logged In: /tags/c/{:category_slug}/{:tag}/new
    -> SELECT_SUBCATEGORY (Type?) *IF channel has subcategories - Top level category required*
        - Default Anonymous: /tags/c/{:category_slug}/{:subcategory_slug} OR /tags/c/{:category_slug}/{:subcategory_slug}/latest
        - Anonymous: /tags/c/{:category_slug}/{:subcategory_slug}/top
        - Logged In: /tags/c/{:category_slug}/{:subcategory_slug}/unread
        - Logged In: /tags/c/{:category_slug}/{:subcategory_slug}/new
        -> SELECT_TAG (Single Select)
            - Default Anonymous: /tags/c/{:category_slug}/{:subcategory_slug}/{:tag} OR /tags/c/{:category_slug}/{:subcategory_slug}/{:tag}/latest
            - Anonymous: /tags/c/{:category_slug}/{:subcategory_slug}/{:tag}/top
            - Logged In: /tags/c/{:category_slug}/{:subcategory_slug}/{:tag}/unread
            - Logged In: /tags/c/{:category_slug}/{:subcategory_slug}/{:tag}/new
-> QUERY PARAMS
    - ?ascending=true (pair this with one of the below params)
        - ?order=posts
        - ?order=views
        - ?order=activity
        - ?order=created
        - ?order=likes
        - ?order=orginal_post_likes
        - ?order=posters
        - ?order=category (Sorts by category name alphabetically descending Z-A)
        - ?accepted_answer=true

----LOGGED IN USER----
-> Threads
    - /new.json
    - /unread.json
    - /read.json
    - /posted.json
    - /bookmarks.json
*/

/*
//////////POST (COMMENTS)/////////
    -> BY TOPIC
        - /t/:topic_id/posts.json
    -> BY USER
        - /p/:post_id/:user_id
    -> QUERY PARAMS
        - /posts.json?accepted_answer=true
*/

/*
//////////CHANNEL THREAD FILTER/////////
    -> /c/8.json
    -> QUERY PARAMS
        - ?sort_ascending=true
*/

/*
 ------------------------------------
 ----NOTES----
- Search: posts, topics, users, categories, not tags, groups
- Search Snapshot: /search/query.json?term=bugatti
- https://forums.envato.com/search/query.json?term=shopify (page=2 doesn't work here)
- include_burbs=true => returns a shortened post description on the posts object
 */
