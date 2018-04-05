import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  "addJim"() {
    Game.insert({
      val: "jim"
    });
    console.log("added Jim");
  },
});
