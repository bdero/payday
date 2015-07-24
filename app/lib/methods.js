// Throw an exception if the user isn't authenticated
var forceAuthenticated = function() {
  var user = Meteor.user();
  if (Meteor.user() === null) {
    throw new Meteor.Error(
      "not-authorize",
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
