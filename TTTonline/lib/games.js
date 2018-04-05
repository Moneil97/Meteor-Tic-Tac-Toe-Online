import { Mongo } from 'meteor/mongo';

//might need some way to stop user from clicking anything until database if fully loaded
Game = new Mongo.Collection("game");

Meteor.methods({
  "getTurn"() {

  },

});

if (Meteor.isServer){

  //clear database when server is restarted (not on client refresh)
  Game.remove({});

  Game.insert({
    turn: "X"
  });

  Meteor.publish('game', function myGamePublication() {
    return Game.find();
  });

}

if (Meteor.isClient){
  Meteor.subscribe("game");


}
