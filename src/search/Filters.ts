import { Filter } from "yack-plugin-framework";
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
