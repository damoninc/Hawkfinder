/**
 * The class for Posts
 *
 * Each post will have a postID and post date that is created
 * when the Post objects is initialized. The description,
 * image, and imageURL are initialized by the user. If the user
 * does not provide an image, the imageURL will be an empty
 * string. The ratings is initialized as an empty map but can be
 * changed by the user as they upvote or downvote a comment.
 *
 */

class Post {
  readonly _postID: string;
  readonly _postDate: Date;
  private _description: string;
  private _interest: string;
  private _imageURL: string;
  private _ratings: Map<string, string>;
  // public _rating: number;

  constructor(
    postID: string,
    postDate: Date,
    description: string,
    interest: string,
    imageURL = "",
    ratings: Map<string, string>
    // rating: number = 0
  ) {
    this._postID = postID;
    this._postDate = postDate;
    this._description = description;
    this._interest = interest;
    this._imageURL = imageURL;
    this._ratings = ratings;
    // this._rating = rating;
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

  /**
   * In the params, string1 is the userID,
   * string2 is either 'upvote'/'downvote'/null
   * @param rating[string, string]
   */
  public addRating(rating: [string, string]) {
    const userID = rating[0];
    const rate = rating[1];

    if (rate == null) {
      this._ratings.delete(userID);
      return;
    }

    this._ratings.set(userID, rate);
  }

  /**
   * This function is not a setter as it does not
   * require a parameter, but will still set the rating
   */
  public calculateRating() {
    let rating = 0;

    this._ratings.forEach((value: string, key: string) => {
      if (value === "upvote") {
        rating += 1;
      } else if (value === "downvote") {
        rating -= 1;
      }
    });

    return rating;
  }
}

export default Post;
