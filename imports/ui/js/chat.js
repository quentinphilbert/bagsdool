/**
 * Created by quphi on 27/02/17.
 */

/*
$( "div.chat_window" ).ready(function() {
    (function () {
        var Message;
        Message = function (arg) {
            this.text = arg.text, this.message_side = arg.message_side;
            this.draw = function (_this) {
                return function () {
                    var $message;
                    $message = $($('.message_template').clone().html());
                    $message.addClass(_this.message_side).find('.text').html(_this.text);
                    $('.messages').append($message);
                    return setTimeout(function () {
                        return $message.addClass('appeared');
                    }, 0);
                };
            }(this);
            return this;
        };
        $(function () {
            var getMessageText, message_side, sendMessage;
            message_side = 'right';
            getMessageText = function () {
                var $message_input;
                $message_input = $('.message_input');
                return $message_input.val();
            };
            sendMessage = function (text) {
                var $messages, message;
                if (text.trim() === '') {
                    return;
                }
                $('.message_input').val('');
                $messages = $('.messages');
                message_side = message_side === 'left' ? 'right' : 'left';
                message = new Message({
                    text: text,
                    message_side: message_side
                });
                message.draw();
                return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
            };
            console.log('hiha');
            console.log($('.send_message'));
            console.log($('.message_input'));
            $('.send_message').click(function (e) {
                console.log('sendmessage()');
                return sendMessage(getMessageText());
            });
            $('.message_input').keyup(function (e) {
                console.log('type enter');
                if (e.which === 13) {
                    return sendMessage(getMessageText());
                }
            });
            setTimeout(function () {
                return sendMessage('Hello Philip! :)');
            }, 1000);
            setTimeout(function () {
                return sendMessage('Hi Sandy! How are you?');
            }, 1000);
            return setTimeout(function () {
                return sendMessage('I\'m fine, thank you!');
            }, 2000);
        });
    }.call(this));
});*/
import { Template } from 'meteor/templating';


Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");
if (Meteor.isClient) {

    Meteor.subscribe("rooms");
    Meteor.subscribe("messages");
    Session.setDefault("roomname", "Bagsdool");

    Template.input.events({
        'click div.send_message': function(e) {
            console.log("send message");
            _sendMessage();
        },
        'keyup #message_input': function(e) {
            if (e.type == "keyup" && e.which == 13) {
                console.log("type enter");
                _sendMessage();
            }
        }
    });

    _sendMessage = function() {
        console.log(document.getElementById("message_input").value);
        var el = document.getElementById("message_input");
        Messages.insert({
            user: Meteor.user().services.facebook.first_name,
            msg: el.value,
            ts: new Date(),
            room: Session.get("roomname")
        });

        el.value = "";
        el.focus();
    };

    Template.messages.helpers({
        messages: function() {
            return Messages.find({room: Session.get("roomname")}, {sort: {ts: -1}});
        },
        roomname: function() {
            return Session.get("roomname");
        }
    });

    Template.message.helpers({
        timestamp: function() {
            return this.ts.toLocaleString();
        }
    });

    Template.chat.helpers({
        release: function() {
            return Meteor.release;
        }
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Messages.remove({});
        Rooms.remove({});
        if (Rooms.find().count() === 0) {
            ["Bagsdool"].forEach(function(r) {
                Rooms.insert({roomname: r});
            });
        }
    });

    Rooms.deny({
        insert: function (userId, doc) {
            return true;
        },
        update: function (userId, doc, fieldNames, modifier) {
            return true;
        },
        remove: function (userId, doc) {
            return true;
        }
    });
    Messages.deny({
        insert: function (userId, doc) {
            return (userId === null);
        },
        update: function (userId, doc, fieldNames, modifier) {
            return true;
        },
        remove: function (userId, doc) {
            return true;
        }
    });
    Messages.allow({
        insert: function (userId, doc) {
            return (userId !== null);
        }
    });

    Meteor.publish("rooms", function () {
        return Rooms.find();
    });
    Meteor.publish("messages", function () {
        console.log("publish()");
        console.log("publish()");
        return Messages.find().fetch();
    });
}
