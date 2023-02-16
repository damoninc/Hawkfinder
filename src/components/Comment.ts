class Comment {
    private _commentID: string;
    public text: string;
    public date: Date;
    public ratings: Map<string, string>;

    constructor(
        commentID: string,
        text: string,
        date: Date,
        rating: Map<string, string>,
    ) {
        this._commentID = commentID;
        this.text = text;
        this.date = date;
        this.ratings = rating;
    }

    get commentID() {
        return this._commentID;
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

export default Comment;