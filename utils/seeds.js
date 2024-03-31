const connection = require("../config/connection");
const { User } = require("../models");

const usernames = [
        "alexred",
        "baileygold",
        "caseysilver",
        "drewbronze",
        "elliottcopper",
        "frankieruby",
        "glensapphire",
        "harperemerald",
        "izzytopaz",
        "jordandiamond",
        "krisamethyst",
        "leslieopal",
        "morganonyx",
        "nickypearl",
        "olliejade",
        "patquartz",
        "quinngarnet",
        "rileyturquoise",
        "skyleramber",
      ];

      const emails = [
        "alexred@gmail.com",
        "baileygold@yahoo.com",
        "caseysilver@hotmail.com",
        "drewbronze@aol.com",
        "elliottcopper@icloud.com",
        "frankieruby@outlook.com",
        "glensapphire@me.com",
        "harperemerald@live.com",
        "izzytopaz@msn.com",
        "jordandiamond@comcast.net",
        "krisamethyst@verizon.net",
        "leslieopal@att.net",
        "morganonyx@charter.net",
        "nickypearl@cox.net",
        "olliejade@centurylink.net",
        "patquartz@earthlink.net",
        "quinngarnet@bellsouth.net",
        "rileyturquoise@gmail.com",
        "skyleramber@yahoo.com",
      ];
      

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");
  await User.deleteMany({});

  const users = [];

  for (i = 0; i < 19; i++) {
    const username = usernames[i];
    const email = emails[i];

    users.push({
      username,
      email,
      thoughts: [],
      friends: [],
    });
  }

  await User.collection.insertMany(users);

  console.table(users);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});