import { send } from "process";
import { text } from "stream/consumers";

/*
 * A class for the Message data structure
 * 
 * messageID is unique and determined by Firebase when the message is first created.
 * dateTimeSent is readonly and the current time is set as the default, but a separate time can be set.
 * senderID and recipientID can be changed and hold the userID of the sender and reciever of the message.
 * textContent holds the text body of the message that would be typed in the text box.
 * imageURL (nullable) is the URL to the image inside of Firebase.
 * 
 * All parameters have getters, but only senderID, recipientID, textContent, and imageURL have setters.
 * both imageURL and dateTimeSent are optional in the constructor and don't have to be given a value when declaring a new Message. 
 */
class Message {
    readonly _messageID: string;
    readonly _dateTimeSent: Date;
    private _senderID: string;
    private _recipientID: string;
    private _textContent: string;
    private _imageURL: string; 

    constructor(messageID: string, senderID: string, recipientID: string,
                textContent: string, dateTimeSent: Date = new Date(), imageURL: string = '') {
        this._messageID = messageID;
        this._senderID = senderID;
        this._recipientID = recipientID;
        this._textContent = textContent;
        this._dateTimeSent = dateTimeSent;
        this._imageURL = imageURL;
    }

    public get messageID(): string {
        return this._messageID;
    }
    
    public get senderID() : string {
        return this._senderID;
    }
    
    public set senderID(sender : string) {
        this._senderID = sender;
    }
    
    public get recipientID() : string {
        return this._recipientID;
    }
    
    public set recipientID(reciever : string) {
        this._recipientID = reciever;
    }
    
    public get textContent() : string {
        return this._textContent;
    }

    public set textContent(content : string) {
        this._textContent = content;
    }

    public get dateTimeSent() : Date {
        return this._dateTimeSent;
    }
    
    public get imageURL() : string {
        return this._imageURL;
    }
    
    public set image(img : string) {
        this._imageURL = img;
    }
}

// A sample list of messages to play with.
let SAMPLE_MESSAGES: Message[] = [
    new Message("7890654213", "afd3856", "njb4775", "Hello, this is a message with an image", new Date(2023, 2, 16, 10, 0), 'img1.jpg'),
    new Message("0123456789", "njb4775", "afd3856", "How about a reply to the image but without an image.", new Date(2023, 2, 16, 5, 56)),
    new Message("1472580369", "abc1234", "def5678", "I just sent this image, so it is using the current time."),
];