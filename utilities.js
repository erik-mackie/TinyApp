module.exports = {

  randomNumber: function() {
    return Math.round((Math.pow(36, 6 + 1) - Math.random() * Math.pow(36, 6))).toString(36).slice(1);
  },
  searchUsers: function(users, passedKey, passedValue) {
    for (let obj in users) {
      if(users[obj][passedKey] === passedValue) {
      return true;
      }
    }
      return false;
  }
}