const Branch = require("../../models/Branch");
const Distance = require("geo-distance");
const Location = require("../../models/Location");

async function findLocation(lat, lon) {
  let location = await Location.findOne({ lat, lon });
  if (!location) {
    location = new Location({ lat, lon });
    await location.save();
  }
  return location;
}

async function getNearestRestaurant(currentLocation) {
  const branches = await Branch.find();
  for (let i = 0; i < branches.length; i++) {
    if (Distance.between(branches[i], currentLocation) < Distance("5 km")) {
      chosenBranch = branches[i];
    }
  }
}

module.exports = { findLocation, getNearestRestaurant };
