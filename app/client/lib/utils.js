getUserWithDisplay = function(user) {
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
