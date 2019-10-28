import {Injectable} from '@angular/core';
import {Message} from '../models/message';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MessagesService {
    public messages: Message[] = [];
    private messagesUpdated = new Subject<Message[]>();

    searchedMessage;

    constructor(private http: HttpClient) {
    }

    getMessage(messageId: string) {
        this.searchedMessage = {...this.messages.find(m => m.id === messageId)};
        return this.searchedMessage;
    }

    getMessages() {
        this.http
            .get<{ message: string, messages: any }>(
                'http://localhost:3000/api/messages'
            )
            .pipe(map((messageData) => {
                return messageData.messages.map(message => {
                    return {
                        // senderId: message.senderId,
                        // receiverId: message.receiverId,
                        // message: message.message,
                        staffs: message.staffs,
                        texts: message.texts,
                        id: message._id
                    };
                });
            }))
            .subscribe(messageData => {
                this.messages = messageData;
                this.messagesUpdated.next([...this.messages]);
            });
    }

    getMessageUpdatedListener() {
        return this.messagesUpdated.asObservable();
    }

    addMessage(message: Message) {
        this.http.post<{ message: string, messageId: string }>('http://localhost:3000/api/messages', message)
            .subscribe((response) => {
                message.id = response.messageId;
                this.messages.push(message);
                this.messagesUpdated.next([...this.messages]);
                this.searchedMessage = message;
            });
    }

    updateMessage(messageId: string, texts: any[]) {
        this.http.post<{ message: string }>('http://localhost:3000/api/messages/update/' + messageId, texts)
            .subscribe((response) => {
                this.getMessages();
                this.searchedMessage.texts = texts;
            });
    }
}
