import { Template } from 'meteor/templating';

Tracks = new Mongo.Collection("tracks");

if (Meteor.isClient) {
    Meteor.subscribe("tracks");

    Template.input.events({
        'keyup #new_link': function(link) {
            console.log("new link :");
            console.log(link.target.val);
            _addTrack(link.target.val);
        }
    });

    _addTrack = function(link) {
        console.log("add track of () :");
        console.log(link);

        Tracks.insert({
            video_id: id_link,
            title: "",
            owner: Meteor.user().services.facebook.name,
            ts: new Date(),
            source : source,
        });

        link.value = "";
        link.focus();
    };

    Template.playlist.helpers({
        tracks: function() {
            return Tracks.find({}, {sort: {ts: 1}});
        }
    });
}