import {Component, OnInit} from '@angular/core';
import {MessagesService} from '../../services/messages.service';
import {StaffsService} from '../../services/staffs.service';
import {AuthService} from '../../services/auth.service';
import {FormControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Message} from '../../models/message';
import {isNullOrUndefined} from 'util';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {ChatComponent} from '../chat/chat.component';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
    messages;
    private messagesSub: Subscription;
    staffs;
    receivers = [];

    userMessages = [];

    sentMessages = [];
    receivedMessages = [];

    message;

    messagess = [
        {
            with: 'Dagime Teshome',
            time: '10/10/2010',
            type: 'sent'
        },
        {
            with: 'Abel Tatek',
            time: '11/10/2010',
            type: 'sent'
        },
        {
            with: 'Mesfin Haile',
            time: '12/10/2010',
            type: 'received'
        },
        {
            with: 'Helina Abere',
            time: '13/10/2010',
            type: 'sent'
        }
    ];
    searchedMessages;
    searchCtrl = new FormControl();
    dataSource: any = new MatTableDataSource(this.searchedMessages);

    displayedMessagesColumns = ['with', 'at', 'type'];
    displayedReceivedMessagesColumns = ['from', 'message'];
    displayedSentMessagesColumns = ['to', 'message'];

    selectedReceiver;
    messageCtrl = new FormControl();
    sendButton = new FormControl();

    showReceivers = false;
    receiverSelected = false;

    constructor(
        private messagesService: MessagesService,
        private staffsService: StaffsService,
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) {
    }

    ngOnInit() {
        this.messages = this.messagesService.messages;
        this.messagesSub = this.messagesService.getMessageUpdatedListener()
            .subscribe((messages: Message[]) => {
                this.messages = messages;

                for (const message of this.messages) {
                    if (message.staffs.includes(this.authService.loggedInStaff.id)) {
                        const m = {
                            id: message.id,
                            with: '',
                            at: new Date(message.texts[message.texts.length - 1].at).getDate() + '/' +
                                (new Date(message.texts[message.texts.length - 1].at).getMonth() + 1) + '/' +
                                new Date(message.texts[message.texts.length - 1].at).getFullYear() + ' ' +
                                new Date(message.texts[message.texts.length - 1].at).getHours() + ':' +
                                new Date(message.texts[message.texts.length - 1].at).getMinutes(),
                            type: 'received'
                        };
                        // if (message.staffs.includes(this.authService.loggedInStaff.id)) {
                        m.with = message.staffs.indexOf(this.authService.loggedInStaff.id) === 0 ?
                            this.staffsService.getStaff(message.staffs[1]).name :
                            this.staffsService.getStaff(message.staffs[0]).name;
                        // if (message.staffs)
                        // if (message.staffs.indexOf(this.authService.loggedInStaff.id) === 0) {
                        //     m.with = this.staffsService.getStaff(message.staffs[1]).name;
                        // } else if (message.staffs.indexOf(this.authService.loggedInStaff.id) === 1) {
                        //     m.with = this.staffsService.getStaff(message.staffs[0]).name;
                        // }
                        // }
                        if (message.texts[message.texts.length - 1].from === this.authService.loggedInStaff.id) {
                            m.type = 'sent';
                        }
                        this.userMessages.push(m);
                    }
                }
                this.searchedMessages = this.userMessages;
            });
        this.staffs = this.staffsService.staffs;
        this.staffs.forEach((staff) => {
            if (staff.id !== this.authService.loggedInStaff.id) {
                this.receivers.push(staff);
            }
        });

        for (const message of this.messages) {
            if (message.staffs.includes(this.authService.loggedInStaff.id)) {
                const m = {
                    id: message.id,
                    with: '',
                    at: new Date(message.texts[message.texts.length - 1].at).getDate() + '/' +
                        (new Date(message.texts[message.texts.length - 1].at).getMonth() + 1) + '/' +
                        new Date(message.texts[message.texts.length - 1].at).getFullYear() + ' ' +
                        new Date(message.texts[message.texts.length - 1].at).getHours() + ':' +
                        new Date(message.texts[message.texts.length - 1].at).getMinutes(),
                    type: 'received'
                };
                // if (message.staffs.includes(this.authService.loggedInStaff.id)) {
                if (message.staffs.indexOf(this.authService.loggedInStaff.id) === 0) {
                    m.with = this.staffsService.getStaff(message.staffs[1]).name;
                } else if (message.staffs.indexOf(this.authService.loggedInStaff.id) === 1) {
                    m.with = this.staffsService.getStaff(message.staffs[0]).name;
                }
                // }
                if (message.texts[message.texts.length - 1].from === this.authService.loggedInStaff.id) {
                    m.type = 'sent';
                } else if (message.texts[message.texts.length - 1].from === null) {
                    m.type = 'none';
                }
                this.userMessages.push(m);
            }
        }
        this.searchedMessages = this.userMessages;
    }

    receiverSelectChange() {
        this.receiverSelected = !isNullOrUndefined(this.selectedReceiver);
    }

    createChat() {
        this.showReceivers = false;
        this.receiverSelected = false;
        for (const msg of this.messages) {
            if (msg.staffs.includes(this.authService.loggedInStaff.id) && msg.staffs.includes(this.selectedReceiver)) {
                console.log('opening existing chat');
                this.openChat(msg.id);
                return;
            }
        }

        const txts: any[] = [{
            message: null,
            from: null,
            at: Date.now()
        }];

        const message = {
            id: null,
            staffs: [this.authService.loggedInStaff.id, this.selectedReceiver],
            texts: txts
        };
        this.messagesService.addMessage(message);
        console.log(this.messages);
    }

    searchBySender() {
        this.searchedMessages = [];
        this.userMessages.forEach((message) => {
            if (message.with.toLowerCase().startsWith(this.searchCtrl.value.toString().toLowerCase())) {
                this.searchedMessages.push(message);
            }
        });
    }

    openChat(value) {
        this.openDialog();
        this.message = this.messagesService.getMessage(value);
    }

    openDialog() {
        this.dialog.open(ChatComponent, {height: '80%', width: '70%'});
    }

}
