/**
 * Created by quphi on 27/02/17.
 */
import { Template } from 'meteor/templating';

import '../templates/body.html';
//import '../templates/chat.html';
import '../templates/radio.html';
//import '/imports/ui/js/chat.js';
import '/imports/ui/js/radio.js';

Template.facebooklogin.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({requestPermissions: ['user_friends', 'public_profile', 'email']}, function(err){
            if (err) {
                console.log('Handle errors here: ', err);
            } else {
                console.log(Meteor.user());
            }
        });
    },

    'click #facebook-logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            } else {
                console.log("Log out of facebook");
            }
        })
    }
});