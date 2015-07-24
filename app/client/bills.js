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
