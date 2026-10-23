
require('dotenv').config();
const mongoose = require('mongoose');

const Admin = require('../models/adminModel');
const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');

async function seedDatabase() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in server/.env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Create admin only when all required details are configured.
    const adminName = process.env.ADMIN_NAME;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminName && adminEmail && adminPassword) {
      const existingAdmin = await Admin.findOne({ email: adminEmail });

      if (!existingAdmin) {
        await Admin.create({
          name: adminName,
          email: adminEmail,
          password: adminPassword
        });

        console.log(`Admin created: ${adminEmail}`);
      } else {
        console.log('Admin already exists');
      }
    } else {
      console.log(
        'Admin not created: add ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD to .env'
      );
    }

    // Add sample movies only if no movies exist.
     {
      const day = 24 * 60 * 60 * 1000;

      const sampleMovies = [
  {
    title: 'Space Voyagers',
    description: 'A crew races to save humanity.',
    genre: ['Sci-Fi', 'Adventure'],
    language: 'English',
    duration: 140,
    director: 'A. Rao',
    cast: [
      { name: 'Ravi Kumar', role: 'Captain' },
      { name: 'Mina Shah', role: 'Pilot' }
    ],
    poster: '/posters/space-voyagers.png',
    releaseDate: new Date(Date.now() - 7 * day)
  },
  {
    title: 'Monsoon Melody',
    description: 'A musical love story.',
    genre: ['Romance', 'Drama'],
    language: 'English',
    duration: 125,
    director: 'S. Mehta',
    cast: [{ name: 'Anaya Singh', role: 'Meera' }],
    poster: '/posters/monsoon-melody.png',
    releaseDate: new Date(Date.now() - 2 * day)
  },
  {
    title: 'Future Strike',
    description: 'Coming soon!',
    genre: ['Action'],
    language: 'English',
    duration: 150,
    director: 'R. Sharma',
    cast: [],
    poster: '/posters/future-strike.png',
    releaseDate: new Date(Date.now() + 30 * day)
  }
];

const movies = [];

for (const movieData of sampleMovies) {
  let movie = await Movie.findOne({ title: movieData.title });

  if (!movie) {
  movie = await Movie.create(movieData);
  console.log(`Added movie: ${movie.title}`);
} else {
  console.log(`Movie already exists: ${movie.title}`);
}

if (movieData.poster && movie.poster !== movieData.poster) {
  movie.poster = movieData.poster;
  await movie.save();
  console.log(`Updated poster: ${movie.title}`);
}

movies.push(movie);
}
     const theatre = await Theatre.findOneAndUpdate(
  { name: 'iMovies Cinemas', city: 'Indore' },
  {
    $setOnInsert: {
      name: 'iMovies Cinemas',
      city: 'Indore',
      address: 'MG Road',
      screens: [
        {
          name: 'Screen 1',
          layout: [
            { row: 'A', seats: 10, type: 'Regular' },
            { row: 'B', seats: 10, type: 'Regular' },
            { row: 'C', seats: 10, type: 'Premium' },
            { row: 'D', seats: 8, type: 'Recliner' }
          ]
        }
      ]
    }
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const screen = theatre.screens[0];

for (const movie of movies.slice(0, 2)) {
  const existingShow = await Show.findOne({
    movie: movie._id,
    theatre: theatre._id
  });

  if (!existingShow) {
    const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Show.create({
      movie: movie._id,
      theatre: theatre._id,
      screenId: screen._id,
      screenName: screen.name,
      startTime,
      endTime: new Date(
        startTime.getTime() + (movie.duration + 15) * 60 * 1000
      )
    });

    console.log(`Show created for: ${movie.title}`);
  } else {
    console.log(`Show already exists for: ${movie.title}`);
  }
}

console.log('Sample theatre and shows checked');
    }
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
}

seedDatabase();
