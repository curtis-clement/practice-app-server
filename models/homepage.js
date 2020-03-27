'use strict';
module.exports = (sequelize, DataTypes) => {
  const homepage = sequelize.define(
    'homepage', 
    {
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: '#FFFFFF'
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#000000'
    }
  }, {});
  homepage.associate = function(models) {
    homepage.belongsTo(models.user);
    homepage.hasMany(models.story);
  };
  return homepage;
};