import './TTT.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.game.onCreated(function gameOnCreated() {

	this.flip = new ReactiveVar(0);
	this.winner = new ReactiveVar("");
	this.done = new ReactiveVar(0);
	this.ID = new ReactiveVar(Math.floor(Math.random() * 100000));
	this.gameID = new ReactiveVar(0);
});

Template.game.helpers({
	flip() {
		return Template.instance().flip.get();
	},
	winner() {
		return Template.instance().winner.get();
	},
	done() {
		return Template.instance().done.get();
	},
	ID() {
		return Template.instance().ID.get();
	},
	gameID() {
		return Template.instance().gameID.get();
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
			//Meteor.call("makeGame", instance.ID.get());
			instance.gameID.set(Meteor.apply("makeGame", [instance.ID.get()], {returnStubValue: true}));
			console.log("gameID: " + instance.gameID.get());
		}
		else{
			console.log("found a game");
			console.log(Games.findOne({player2: -1}).player1);
			instance.gameID.set(Games.findOne({player2: -1})._id);
			Meteor.call("joinGame", Games.findOne({player2: -1})._id, instance.ID.get());
		}

		return;
	},
	'click .grid-item'(event, instance) {

		if (instance.done.get()) {
			return;
		}
		else{
			Meteor.call("makeMove", instance.gameID.get(), instance.ID.get(), "boob");
			return;
		}

		//nothing below will run

		//check if it is your turn
		if (Games.findOne({turn: "X"}) === undefined){
			console.log("Not your turn");
			return;
		}
		else{
			console.log("is your turn");
			//change turn from X to O
			Games.update(Games.findOne({turn: "X"})._id, {
      	$set: { turn: "O" },
    	});
		}

		if (event.target.innerText == "-") {
			if (instance.flip.get() == 0) {
				instance.flip.set(1);
				event.target.innerText = "X";
			} else {
				instance.flip.set(0);
				event.target.innerText = "O";
			}

			//check for winner
			var cells = document.getElementsByClassName("grid-item");

			//check rows
			for (var i = 0; i < 9; i += 3) {
				if (cells[i + 0].innerText != "-" && cells[i + 0].innerText == cells[i + 1].innerText && cells[i + 1].innerText == cells[i + 2].innerText) {
					console.log("win on row: " + i / 3);
					instance.winner.set(cells[i + 0].innerText + " wins!");
					instance.done.set(1);
					return;
				}
			}

			//check cols
			for (var i = 0; i < 3; i++) {
				if (cells[i + 0].innerText != "-" && cells[i + 0].innerText == cells[i + 3].innerText && cells[i + 3].innerText == cells[i + 6].innerText) {
					console.log("win on col: " + i);
					instance.winner.set(cells[i + 0].innerText + " wins!");
					instance.done.set(1);
					return;
				}
			}

			//check diagonals
			if (cells[0].innerText != "-" && cells[0].innerText == cells[4].innerText && cells[4].innerText == cells[8].innerText) {
				instance.winner.set(cells[0].innerText + " wins!");
				instance.done.set(1);
				return;
			}
			if (cells[2].innerText != "-" && cells[2].innerText == cells[4].innerText && cells[4].innerText == cells[6].innerText) {
				instance.winner.set(cells[2].innerText + " wins!");
				instance.done.set(1);
				return;
			}
		}

	},
});
