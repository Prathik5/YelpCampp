const mongoose = require("mongoose");
const cities = require("./cities");
const CampGround = require("../models/campGround");
const { descriptors, places } = require("./seedHelpers");
const { words } = require("./seedHelpers");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelpCamp");
  console.log("Connected");
}

main().catch((err) => console.log("Error!!!"));

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await CampGround.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    const random1000 = Math.floor(Math.random() * 150);
    const price = Math.floor(Math.random() * 20) + 1000;
    const camp = new CampGround({
      author: "6537d9774b1b0fd1c0dd29f1",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dhqx7hzxc/image/upload/v1705237498/YelpCamp/kiynssfpqvjxjlra9hqj.jpg",
          filename: "YelpCamp/kiynssfpqvjxjlra9hqj",
        },
        {
          url: "https://res.cloudinary.com/dhqx7hzxc/image/upload/v1705237505/YelpCamp/z4qw7laqr4kewzgofcrk.jpg",
          filename: "YelpCamp/z4qw7laqr4kewzgofcrk",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, aut at numquam omnis nihil in, esse adipisci labore ex distinctio suscipit provident porro architecto! Et maiores ex cumque ea. Ea!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
