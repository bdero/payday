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

var daySelection = _.range(1, 32);
var dueWordMap = {
  "weekly": {
    selectName: "Weekday",
    prefix: "on",
    selection: _.zip(
      _.range(7),
      [
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
      ]
    )
  },
  "monthly": {
    selectName: "Day",
    prefix: "on day",
    selection: _.zip(
      daySelection,
      _.map(daySelection, function(day) {
        return day.toString();
      })
    )
  },
  "yearly": {
    selectName: "Month",
    prefix: "in the month of",
    selection: _.zip(
      _.range(12),
      [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ]
    )
  },
};
var dueMap = function() {
  return dueWordMap[Session.get("periodSelected")];
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
  },
  periodSelected: function() {
    return Session.get("periodSelected")
  },
  dueMap: dueMap
});
Template.createBillForm.events({
  "change #createBill #period": function(event) {
    Session.set("periodSelected", $("#createBill #period")[0].value);

    // Set due selection
    $("#createBill #due option:selected").attr("selected", null);
    $("#createBill #due option[value=\"\"]").attr("selected", "selected");
  }
});

Template.dueSelect.helpers({
  dueMap: dueMap
});
