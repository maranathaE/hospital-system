import {Component, OnInit} from '@angular/core';
import {MessagesService} from '../../services/messages.service';
import {MatSnackBar} from '@angular/material';
import {AuthService} from '../../services/auth.service';
import {FormControl} from '@angular/forms';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    message;
    messages = [];
    with;

    displayedMessagesColumns = ['message'];

    messageCtrl = new FormControl();
    sendButton = new FormControl();

    constructor(
        private messagesService: MessagesService,
        private snackBar: MatSnackBar,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.message = this.messagesService.searchedMessage;

        console.log(this.message);
        // for (const text of this.message.texts) {
        //     if (text.message === null && text.from === null) {
        //         continue;
        //     }
        //     let outgoing = false;
        //     if (text.from === this.authService.loggedInStaff.id) {
        //         outgoing = true;
        //     }
        //     const msg = {
        //         message: text.message,
        //         sent: outgoing,
        //         at: new Date(text.at).getDate() + '/' +
        //             (new Date(text.at).getMonth() + 1) + '/' +
        //             new Date(text.at).getFullYear() + ' ' +
        //             new Date(text.at).getHours() + ':' +
        //             new Date(text.at).getMinutes()
        //     };
        //     this.messages.push(msg);
        // }
        this.updateMessages();

        this.with = this.message.staffs[0] === this.authService.loggedInStaff.id ? this.message.staffs[1] : this.message.staffs[0];
        console.log(this.with);
    }

    updateMessages() {
        this.messages = [];

        for (const text of this.message.texts) {
            if (text.message === null && text.from === null) {
                continue;
            }
            let outgoing = false;
            if (text.from === this.authService.loggedInStaff.id) {
                outgoing = true;
            }
            const msg = {
                message: text.message,
                sent: outgoing,
                at: new Date(text.at).getDate() + '/' +
                    (new Date(text.at).getMonth() + 1) + '/' +
                    new Date(text.at).getFullYear() + ' ' +
                    new Date(text.at).getHours() + ':' +
                    new Date(text.at).getMinutes()
            };
            this.messages.push(msg);
        }
    }

    sendMessage() {
        if (isNullOrUndefined(this.messageCtrl.value) || this.messageCtrl.value === '') {
            this.snackBar.open('Please write a message first.', 'Dismiss', {duration: 3000});
        } else {
            let texts;
            if (this.message.texts.length === 1 && (this.message.texts[0].message === null && this.message.texts[0].from === null)) {
                const txts = [{
                    message: this.messageCtrl.value,
                    from: this.authService.loggedInStaff.id,
                    at: Date.now()
                }];
                this.message.texts = txts;
                texts = txts;
            } else {
                this.message.texts.push({
                    message: this.messageCtrl.value,
                    from: this.authService.loggedInStaff.id,
                    at: Date.now()
                });
                texts = this.message.texts;
            }

            this.messagesService.updateMessage(this.message.id, texts);
            this.updateMessages();

            this.messageCtrl.setValue(null);
        }
    }

}
