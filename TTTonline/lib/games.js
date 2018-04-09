import { Mongo } from 'meteor/mongo';

//might need some way to stop user from clicking anything until database if fully loaded
Games = new Mongo.Collection("games");

Meteor.methods({
  "makeGame"(p1ID) {
    Games.insert({
      player1: p1ID,  //X
      player2: -1,    //O
      turn: p1ID,
      board : "---------",
      win: 0,
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

    if (game.win > 0)
      return;

    //console.log(game);
    if (game.turn === userID){

      var brd = game.board;

      if (brd[cell] != '-')
        return;

      var otherPlayer;
      if (userID === game.player1){
        brd = setCharAt(brd, cell, "X");
        otherPlayer = game.player2;
      }
      else{
        brd = setCharAt(brd, cell, "O");
        otherPlayer = game.player1;
      }

      var win = 0;
      if (checkWin(brd))
        win = game.turn;

      //update board and turn
      Games.update(gameID, {
        $set: {
          board: brd,
          turn: otherPlayer,
          win: win
        },
      });

      console.log(Games.findOne(gameID));
    }
    else {
      console.log("not your turn: " + userID);
    }

  },

});

function checkWin(board){
  //check rows
  for (var i = 0; i < 9; i += 3)
    if (board[i + 0] != "-" && board[i + 0] == board[i + 1] && board[i + 1] == board[i + 2])
      return true;

  //check cols
  for (var i = 0; i < 3; i++)
    if (board[i + 0] != "-" && board[i + 0] == board[i + 3] && board[i + 3] == board[i + 6])
      return true;

  //check diagonals
  if (board[0] != "-" && board[0] == board[4] && board[4] == board[8])
    return true;
  if (board[2] != "-" && board[2] == board[4] && board[4] == board[6])
    return true;

  return false;
}

function setCharAt(str,index,chr) {
  return str.substr(0,index) + chr + str.substr(Number(index)+1);
}

if (Meteor.isServer){

  //clear database when server is restarted (not on client refresh)
  Games.remove({});

  Meteor.publish('games', function myGamePublication() {
    return Games.find();
  });

}

if (Meteor.isClient){
  Meteor.subscribe("games");
}
