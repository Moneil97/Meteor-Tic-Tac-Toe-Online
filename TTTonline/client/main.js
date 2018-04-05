import './TTT.html';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

Template.game.onCreated(function gameOnCreated() {

	this.flip = new ReactiveVar(0);
	this.winner = new ReactiveVar("");
	this.done = new ReactiveVar(0);

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
});

Template.game.events({
	//when any button is clicked
	'click .btn-back': function () {
		Session.set("currentView", "gameSelect");
		return;
	},

	'click button'(event, instance) {

		if (instance.done.get()) {
			return;
		}

		//check if it is your turn
		if (Game.findOne({turn: "X"}) === undefined){
			console.log("Not your turn");
			return;
		}
		else{
			console.log("is your turn");
			//change turn from X to O
			Game.update(Game.findOne({turn: "X"})._id, {
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
