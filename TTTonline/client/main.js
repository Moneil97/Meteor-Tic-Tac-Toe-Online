import './TTT.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.game.onCreated(function gameOnCreated() {
	this.winner = new ReactiveVar("");
	this.ID = new ReactiveVar(Math.floor(Math.random() * 100000));
	this.gameID = new ReactiveVar(-1);
	this.currentBoard = new ReactiveVar("---------");
});

Template.game.helpers({
	winner() {
		return Template.instance().winner.get();
	},
	ID() {
		return Template.instance().ID.get();
	},
	gameID() {
		return Template.instance().gameID.get();
	},
	currentBoard() {
		return Template.instance().currentBoard.get();
	},
});

Template.game.events({

	'click .btn-back': function () {
		Session.set("currentView", "gameSelect");
		return;
	},
	'click .btn-start'(event, instance) {

		console.log("your user ID is: " + instance.ID.get());

		if (Games.findOne({player2: -1}) === undefined){
			console.log("creating a game");
			instance.gameID.set(Meteor.apply("makeGame", [instance.ID.get()], {returnStubValue: true}));
			console.log("gameID: " + instance.gameID.get());
		}
		else{
			console.log("found a game");
			console.log(Games.findOne({player2: -1}).player1);
			instance.gameID.set(Games.findOne({player2: -1})._id);
			Meteor.call("joinGame", Games.findOne({player2: -1})._id, instance.ID.get());
		}

		//Run any time Games updates
		Games.find(instance.gameID.get()).observeChanges({
		 changed: function (id, fields) {
       console.log("changed");
			 //check if board has changed
			 var game = Games.findOne(id);
			 if (game.board != instance.currentBoard.get()){
				 console.log("board has changed");
				 instance.currentBoard.set(game.board);
				 var i = 0;
				 for (; i <= 8; i++)
					 document.getElementById(i).innerText = game.board[i];

				 if (game.win > 0){
					 if (game.win == instance.ID.get())
						 instance.winner.set("You Win!");
					 else
					 	instance.winner.set("You Lost");
				 }
			 }
		 },
		});

		return;
	},
	'click .grid-item'(event, instance) {
		Meteor.call("makeMove", instance.gameID.get(), instance.ID.get(), event.currentTarget.id);
		return;
	},
});
