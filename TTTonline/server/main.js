import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  //do I need to pass userID or can I get it another way?
  "selection"(userID, cell) {
    //check db to see if it is user's turn
    //if so then apply selection to cell
    //update turn
  },
  "addJim"() {
    Game.insert({
      val: "jim"
    });
    console.log("added Jim");
  },
});
