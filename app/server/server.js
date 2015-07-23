// Define publications
Meteor.publish("bills", function() {
  return Bills.find({});
});
Meteor.publish("users", function() {
  return Meteor.users.find({});
});