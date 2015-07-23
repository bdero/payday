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
