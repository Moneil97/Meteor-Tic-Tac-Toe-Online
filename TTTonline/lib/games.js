import { Mongo } from 'meteor/mongo';

//might need some way to stop user from clicking anything until database if fully loaded
Games = new Mongo.Collection("games");

Meteor.methods({
  "makeGame"(p1ID) {
    console.log("makeGame");
    //console.log("player1 = " + player1);
    Games.insert({
      player1: p1ID, //X
      player2: -1,               //O
      turn: p1ID,
      board : "*********"
    });

    return Games.findOne({player1: p1ID})._id;
  },
  "joinGame"(gameID, userID) {

    //Add 2nd player
    Games.update(gameID, {
      $set: { player2: userID },
    });

    console.log(Games.findOne(gameID));
  },
  "makeMove"(gameID, userID, cell) {

    var game = Games.findOne(gameID);

    if (game === undefined){
      console.log("could not find game");
    }

    //console.log(game);
    if (game.turn === userID){

      //figure out who is the other player
      var other;
      if (userID === game.player1)
        other = game.player2;
      else
        other = game.player1;

      //set turn to other player
      Games.update(gameID, {
        $set: { turn: other},
      });

      console.log(Games.findOne(gameID));
    }
    else {
      console.log("not your turn: " + userID);
    }

  },

});

if (Meteor.isServer){

  //clear database when server is restarted (not on client refresh)
  Games.remove({});

  //Games.insert({
    //turn: "X"
  //});

  Meteor.publish('games', function myGamePublication() {
    return Games.find();
  });

}

if (Meteor.isClient){
  Meteor.subscribe("games");
}
