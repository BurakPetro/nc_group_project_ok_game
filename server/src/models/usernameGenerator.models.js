const robotNames = ["R2-D2", "C-3P0", "Wall-E", "RoboCop", "T-800", "Baymax"];

const animals = [
  "Lion",
  "Elephant",
  "Giraffe",
  "Zebra",
  "Monkey",
  "Kangaroo",
  "Tiger",
  "Penguin",
  "Dolphin",
  "Cheetah",
];

const nouns = [
  "Detective",
  "Wizard",
  "Samurai",
  "Ninja",
  "Guardian",
  "Explorer",
  "Maverick",
  "Aviator",
  "Conqueror",
  "Nomad",
  "Wanderer",
  "Oracle",
  "Alchemist",
  "Jester",
  "Knight",
  "Voyager",
  "Trailblazer",
  "Doctor",
  "Pirate",
  "Captain",
];

function funUserNames(assignedPlayers) {
  const playersGeneratedNames = {};
  const usedNames = new Set();

  for (const player in assignedPlayers) {
    let name;

    if (assignedPlayers[player] === "bot") {
      // Assign a name from robotNames for bots
      do {
        name = robotNames[Math.floor(Math.random() * robotNames.length)];
      } while (usedNames.has(name));
    } else if (assignedPlayers[player] === null) {
      // Assign a name from nouns + animals for null users
      do {
        name = `${nouns[Math.floor(Math.random() * nouns.length)]}\n${
          animals[Math.floor(Math.random() * animals.length)]
        }`;
      } while (usedNames.has(name));
    }

    // Ensure the name is not repeated
    usedNames.add(name);
    playersGeneratedNames[player] = name;
  }

  console.log(playersGeneratedNames);
  return playersGeneratedNames;
}

module.exports = { funUserNames };
