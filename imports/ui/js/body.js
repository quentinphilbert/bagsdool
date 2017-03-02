/**
 * Created by quphi on 27/02/17.
 */
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base'

import '../templates/header.html';
import '../templates/body.html';
import '../templates/menu.html';
import '../templates/chat.html';
import '/imports/ui/js/chat.js';

Template.facebooklogin.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({}, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            } else {
                console.log(Meteor.user().services.facebook);
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