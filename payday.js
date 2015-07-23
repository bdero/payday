var Bills = new Mongo.Collection("bills");

if (Meteor.isServer) {
  Meteor.publish("bills", function() {
    return Bills.find({});
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("bills");

  Template.bills.helpers({
    bills: function () {
      return Bills.find({});
    }
  });
}

Meteor.methods({
  createBill: function(bill) {
    // Make sure the user is authenticated
    var user = Meteor.user();
    if (Meteor.user() === null) {
      throw new Meteor.Error(
        "not-authorized",
        "User not authorized to perform this action"
      );
    }

    // Validate types
    check(bill, {
      name: String,
      price: Number,
      period: String,
      due: Number,
      owner: String
    });

    // Validate that the selected user exists
    if (Meteor.users.findOne({_id: bill.owner})) {
      throw new Meteor.Error(
        "invalid-user",
        "Couldn't find user with ID: " + bill.owner
      );
    }

    Bills.insert(bill);
  }
});
