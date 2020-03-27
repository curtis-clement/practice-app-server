'use strict';
const Stories = require('../models').story

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      [
        {
          name: 'Paris 2015',
          content: 'This was a great trip. I loved going to Paris. It is a lovely city.',
          imageUrl: 'https://img.huffingtonpost.com/asset/5df949c6240000e70c5a39da.jpeg?cache=k8iXwHWWIe&ops=scalefit_720_noupscale',
          homepageId: 1
        },
        {
          name: 'San Francisco 2017',
          content: 'The Bay Area is Beautiful. You should take a trip there for sure.',
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRG68dWlh7hwasSA3BixFfv3EKzdQeszi_c874yOMFN9rUTfAcB',
          homepageId: 1
        },
        {
          name: 'Donuts',
          content: 'Here is a fantastic recipe for donuts. They are my favorite dessert!',
          imageUrl: '',
          homepageId: 2
        },
        {
          name: 'Beef Stew',
          content: 'This is a great winter recipe. So hearty and will keep you full!',
          imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSLQoejU0GTMTTx55Hrc8njaif-p0c90FVI8egZrdjhHYdweLgB',
          homepageId: 2
        },
      ].map(story => Stories.create(story))
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('stories', null, {});
  }
};
