import { Meteor } from 'meteor/meteor';
Tracks = new Mongo.Collection("tracks");
Meteor.startup(() => {
  // code to run on server at startup
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

Meteor.publish("tracks", function () {
    console.log("publish tracks()");

    var allTracks = Tracks.find({}, { ts: 1 }).fetch();
    var track = allTracks[1];
    console.log(track);
    return track;
    //return Tracks.find({}, { ts: 1 }).fetch();
});
