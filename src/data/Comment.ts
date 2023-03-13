/**
 * The class for Comments
 * 
 * Each comment will have a unique ID and date that both will never change
 * The text is also something that the user cannot change but since it is 
 * not initialized by firebase, we won't set it to private. The ratings is 
 * initialized as an empty map but can be changed by the user as they upvote
 * or downvote a comment.
 */

class Comment {
    readonly _commentID: string;
    readonly _commentDate: Date;
    private _text: string;
    private _ratings: Map<string, string>;


    constructor(
        commentID: string,
        commentDate: Date,
        text: string,
        rating: Map<string, string>,
    ) {
        this._commentID = commentID;
        this._commentDate = commentDate;
        this._text = text;
        this._ratings = rating;
    }

    public get commentID(): string {
        return this._commentID;
    }

    public get commentDate(): Date {
        return this._commentDate;
    }

    public get text(): string {
        return this._text;
    }

    public set text(newText: string) {
        this._text = newText;
    }

    public get ratings(): Map<string, string> {
        return this._ratings;
    }

    public set ratings(newRating: Map<string, string>) {
        this._ratings = newRating;
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

export const SAMPLE_COMMENTS: Comment[] = [
    new Comment(
        "92k0ksk",
        new Date(2023, 2, 16, 10, 0),
        "this song sucks lol...",
        new Map<string, string>([
            ["39kvfsb", "like"],
            ["b929kcs", "like"]
        ])
    ),
    new Comment(
        "92k0ksk",
        new Date(2023, 2, 16, 10, 0),
        "nice",
        new Map<string, string>([
            ["b92lsab", "like"],
            ["0blpa2n", "like"]
        ])
    ),
    new Comment(
        "92k0ksk",
        new Date(2023, 2, 16, 10, 0),
        "very cool very swag i like it",
        new Map<string, string>([
            ["bxo2oxa", "dislike"]
        ])
    ),
];

SAMPLE_COMMENTS.forEach((comment: Comment) => {
    console.log(comment)
});

export default Comment;