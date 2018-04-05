import { Mongo } from 'meteor/mongo';

Game = new Mongo.Collection("game");

Meteor.methods({
  "game.play"() {

  }

});

if (Meteor.isServer){

  //clear database
  Game.remove({});

  Game.insert({
    val: "hi"
  });
  Game.insert({
    val: "bye"
  });

  Meteor.publish('game', function myGamePublication() {
    return Game.find();
  });


}

if (Meteor.isClient){
  Meteor.subscribe("game");

  //Game.insert({
  //  val: "fuck you"
  //});

  //console.log(Game.findOne().val);
}
