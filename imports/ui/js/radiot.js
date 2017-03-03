/**
 * Created by quphi on 03/03/17.
 */
import { Template } from 'meteor/templating';


Tracks = new Meteor.Collection("tracks");
if (Meteor.isClient) {

    Meteor.subscribe("tracks");

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
            return Messages.find({room: Session.get("roomname")}, {sort: {ts: 1}});
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
        return Messages.find({}, { ts: 1 }).fetch();
    });
}