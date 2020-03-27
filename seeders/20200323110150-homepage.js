'use strict';
const HomePage = require('../models').homepage

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        {
          title: 'My Travel Adventures',
          description: 'Welcome to my blog. This details my adventrues and my thoughts on the places I have traveld around the wordl.',
          userId: 1
        },
        {
          title: 'Cooking is for Cool Kids',
          description: 'I love to cook and eat and I wanted to share my passion with you! Here I will be sharing recipes of thigns I have created and hopefully inspire you to do the same.',
          userId: 2
        },
      ].map(homepage => HomePage.create(homepage))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('homepage', null, {});
  }
};
