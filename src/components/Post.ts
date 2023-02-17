import Comment from "./Comment";

class Post {
    readonly _postID: string;
    readonly _postDate: Date;
    private _description: string;
    private _imageURL: string;
    private _ratings: Map<string, string>;

    constructor(
        postID: string, 
        postDate: Date,
        description: string,
        imageURL: string = "",
        ratings: Map<string, string>,
    ) {
        this._postID = postID;
        this._postDate = postDate;
        this._description = description;
        this._imageURL = imageURL;
        this._ratings = ratings;
    }

    public get postID(): string {
        return this._postID;
    }

    public get postDate(): Date {
        return this._postDate;
    }

    public get description(): string {
        return this._description;
    }

    public set description(value: string) {
        this._description = value;
    }

    public get imageURL(): string {
        return this._imageURL;
    }

    public set imageURL(value: string) {
        this._imageURL = value;
    }

    public set ratings(value: Map<string, string>) {
        this._ratings = value;
    }

    public get ratings(): Map<string, string> {
        return this._ratings;
    }

    // In the params, 
    // string1 is the userID,
    // string2 is either 'like'/'dislike'/null
    public addRating(rating: [string, string]) {
        const userID = rating[0];
        const rate = rating[1];

        if (rate == null) {
            this._ratings.delete(userID);
            return;
        }

        this._ratings.set(userID, rate);
    }
}

let SAMPLE_POSTS: Post[] = [
    new Post(
        "0b0koxs", 
        new Date(2023, 2, 16, 10, 0), 
        "i heckin love this song!!!!!", 
        "img1.jpg", 
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "dislike"]
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "check this song guys coolsong.mp3",
        "",
        new Map<string, string>([
            ["z0l2pvd", "dislike"],
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "hypergrindcore death grunge ambient experimental prog art country", 
        "", 
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "like"],
            ["z0l2pvd", "like"],
        ])
    ),
];

SAMPLE_POSTS.forEach((post: Post) => {
    console.log(post);
});

export default Post;