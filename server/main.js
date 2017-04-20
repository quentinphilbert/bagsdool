import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

Tracks = new Meteor.Collection("tracks");
Messages = new Meteor.Collection("messages");
Meteor.startup(() => {
    // code to run on server at startup
    Tracks.remove({});
    Messages.remove({});

    ServiceConfiguration.configurations.upsert(
        { service: 'facebook' },
        {
            $set: {
                appId: '1116334645162869',
                loginStyle: 'popup',
                secret: '8d3a25087aedbacb269574be6c46adce',
            },
        }
    );


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
    return Tracks.find({}, { ts: 1 });
});

Meteor.publish("messages", function () {
    console.log("publish chat()");
    return Messages.find({}, { ts: 1 }).fetch();
});
