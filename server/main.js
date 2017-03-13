import { Meteor } from 'meteor/meteor';

Tracks = new Meteor.Collection("tracks");
Messages = new Meteor.Collection("messages");
Rooms = new Meteor.Collection("rooms");
Meteor.startup(() => {
    // code to run on server at startup
    Tracks.remove({});

    Messages.remove({});
    Rooms.remove({});
    if (Rooms.find().count() === 0) {
        ["Bagsdool"].forEach(function(r) {
            Rooms.insert({roomname: r});
        });
    }


});

Tracks.deny({
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
Tracks.allow({
    insert: function (userId, doc) {
        return (userId !== null);
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

Meteor.publish("tracks", function () {
    console.log("publish tracks()");
    console.log(Tracks.find({}, { ts: 1 }).fetch());
    return Tracks.find({}, { ts: 1 }).fetch();
});

Meteor.publish("messages", function () {
    console.log("publish chat()");
    return Messages.find({}, { ts: 1 }).fetch();
});
