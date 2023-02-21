import Comment from "./Comment";

class Post {
    readonly _postID: string;
    readonly _postDate: Date;
    private _description: string;
    private _interest: string;
    private _imageURL: string;
    private _ratings: Map<string, string>;

    constructor(
        postID: string, 
        postDate: Date,
        description: string,
        interest: string,
        imageURL: string = "",
        ratings: Map<string, string>,
    ) {
        this._postID = postID;
        this._postDate = postDate;
        this._description = description;
        this._interest = interest;
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

    public set description(newDescription: string) {
        this._description = newDescription;
    }

    public get interest(): string {
        return this._interest;
    }

    public set interest(newInterest: string) {
        this._interest = newInterest;
    }

    public get imageURL(): string {
        return this._imageURL;
    }

    public set imageURL(newURL: string) {
        this._imageURL = newURL;
    }

    public set ratings(ratings: Map<string, string>) {
        this._ratings = ratings;
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
        "music",
        "img1.jpg", 
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "dislike"]
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "can i get uhhhhhhhh 2 fries",
        "food",
        "",
        new Map<string, string>([
            ["z0l2pvd", "dislike"],
        ])
    ),
    new Post(
        "8fSD8930bFg", 
        new Date(2023, 2, 16, 10, 0), 
        "hypergrindcore death grunge ambient experimental prog art country",
        "music",
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