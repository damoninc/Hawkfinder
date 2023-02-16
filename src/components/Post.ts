import Comment from "./Comment";

class Post {
    private _postID: string;
    public description: string;
    public image?: HTMLImageElement;
    public postDate: Date;
    public ratings: Map<string, string>;

    constructor(
        _postID: string, 
        description: string,
        postDate: Date,
        ratings: Map<string, string>,
        image?: HTMLImageElement,
    ) {
        this._postID = _postID;
        this.description = description;
        this.image = image;
        this.postDate = postDate;
        this.ratings = ratings;
    }

    get postID() {
        return this._postID;
    }

    // In the params, 
    // string1 is the userID,
    // string2 is either 'like'/'dislike'/null
    set setRating(newRating: [string, string]) {
        const userID = newRating[0];
        const rate = newRating[1];

        if (rate == null) {
            this.ratings.delete(userID);
            return;
        }

        this.ratings.set(userID, rate);
    }
}

export default Post;