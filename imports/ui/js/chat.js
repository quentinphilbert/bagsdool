/**
 * Created by quphi on 27/02/17.
 */
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
}
