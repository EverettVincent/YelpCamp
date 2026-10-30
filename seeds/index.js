//
// file: seeds/index.js
// desc: run once to seed db
//

// connect to mongoose and use model
import mongoose from "mongoose";

//from a default export
import Campground from "../models/campground.js";
import somecities from "./cities.js";
import { descriptors, places } from "./seedHelpers.js";

// connect with mongoose to mongoDB to local Exodus
// mongoose
//   .connect(process.env.LOCAL_DB_URL)
//   .then(() => {
//     console.log(
//       "MONGO DB CONNECTION OPEN TO campgroundDB For Seeding Purposes!!!!!",
//     );
//   })
//   .catch((e) => {
//     console.log("FAILED TO CONNECT TO campgroundDB!");
//     console.log(e);
//   });

// connect with mongoose to cloud mongoDB at cloud.mongodb.com
mongoose
  .connect(process.env.MONGO_ATLAS_DB_URL)
  .then(() => {
    console.log(
      "MONGO DB CONNECTION OPEN TO campgroundDB For Seeding Purposes!!!!!",
    );
  })
  .catch((e) => {
    console.log("FAILED TO CONNECT TO campgroundDB!");
    console.log(e);
  });

// test for one record
// const seedDB = async () => {
//   await Campground.deleteMany({});
//   const c = new Campground({
//     title: "Strawberry fields forever!",
//     price: "99.99",
//   });
//   await c.save();
//   console.log("The seeding is finished.");
// };

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 4; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const randomPrice = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${somecities[random1000].city}, ${somecities[random1000].state}`,
      title: `${sample(descriptors)},  ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolor qui alias, quaerat id magnam eius veritati",
      price: randomPrice,
    });
    await camp.save();
  }
  console.log("The seeding is finished.");
};

// seedDB() returns a Promise because it is async, so can chain a .then() to it
seedDB().then(() => {
  mongoose.connection.close();
});
