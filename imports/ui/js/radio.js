/**
 * Created by quphi on 03/03/17.
 */
import { Template } from 'meteor/templating';

Tracks = new Meteor.Collection("tracks");

if (Meteor.isClient) {
    Meteor.subscribe("tracks");

    Template.playlist.events({
        'keyup #new_track': function(e) {
            if (e.type == "keyup" && e.which == 13) {
                console.log("add track()");
                console.log(e.target.value);
                _addTrack(e.target.value);
                e.target.value = "";
                e.target.focus();
            }
        }
    });

    _addTrack = function(link) {
        var youtube_id = link.replace('https://www.youtube.com/watch?v=', '');
        var api_url_video_info = 'https://www.googleapis.com/youtube/v3/videos?id='+ youtube_id +'&key=AIzaSyAFYbhBOfUDANOZg2uzqufER99sCTydtR8&part=snippet';
        $.getJSON(api_url_video_info, function(data) {
            var title = data.items[0].snippet.title;
            console.log(title);
            Tracks.insert({
                owner: Meteor.user().services.facebook.name,
                owner_email: Meteor.user().services.facebook.email,
                video_url: link,
                youtube_id: youtube_id,
                ts: new Date(),
                source: 'youtube',
                title: title,
                playlist: 'General'
            });
        });
        console.log('done add track()');
    };

    Template.playlist.helpers({
        tracks: function() {
            return Tracks.find({}, {sort: {ts: 1}});
        }
    });
}