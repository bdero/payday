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
    $("#createBill #due option[value='']").attr("selected", "selected");
  },
  "click #createBill input[type='submit']": function(event) {
    event.preventDefault();

    // Collect fields
    var form = $("#createBill")[0].elements;
    var bill = {
      name: form.name.value,
      price: Number.parseFloat(form.price.value),
      owner: form.owner.value,
      period: form.period.value,
      due: Number.parseInt(form.due.value)
    };

    Meteor.call("createBill", bill);
  }
});

Template.dueSelect.helpers({
  dueMap: dueMap
});
