var Bills = new Mongo.Collection("bills");

if (Meteor.isServer) {
  // Define publications
  Meteor.publish("bills", function() {
    return Bills.find({});
  });
  Meteor.publish("users", function() {
    return Meteor.users.find({});
  });
}

if (Meteor.isClient) {
  // Define subscriptions
  Meteor.subscribe("bills");
  Meteor.subscribe("users");

  var getUserWithDisplay = function(user) {
    if (!user) {
      user = {displayName: "Unknown User"};
    } else {
      user.displayName = (
        user.hasOwnProperty("profile")
        && user.profile.hasOwnProperty("name")
      )
        ? user.profile.name
        : user.emails[0].address;
    }

    return user;
  };

  Template.bills.helpers({
    bills: function () {
      return Bills.find({}).map(function(bill) {
        // Resolve user IDs
        var owner = Meteor.users.findOne({_id: bill.owner})
        bill.owner = getUserWithDisplay(owner);
        return bill;
      });
    }
  });
  Template.bills.events({
    "click .remove": function(event) {
      Meteor.call("removeBill", this._id);
    }
  });

  Template.createBillForm.helpers({
    users: function() {
      return Meteor.users.find({}).map(function(user) {
        return getUserWithDisplay(user);
      });
    },
    currentUserIdIs: function(userId) {
      return Meteor.user()._id === this._id;
    }
  });
}

// Throw an exception if the user isn't authenticated
var forceAuthenticated = function() {
  var user = Meteor.user();
  if (Meteor.user() === null) {
    throw new Meteor.Error(
      "not-authorized",
      "User not authorized to perform this action"
    );
  }
};

Meteor.methods({
  createBill: function(bill) {
    forceAuthenticated();

    // Validate types
    check(bill, {
      name: String,
      price: Number,
      period: String,
      due: Number,
      owner: String
    });

    // Validate that the selected user exists
    if (!Meteor.users.findOne({_id: bill.owner})) {
      throw new Meteor.Error(
        "invalid-user",
        "Couldn't find user with ID: " + bill.owner
      );
    }

    Bills.insert(bill);
  },
  removeBill: function(billId) {
    forceAuthenticated();

    check(billId, String);
    Bills.remove({_id: billId});
  }
});
