import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Modelo Sequelize para Publication
 * Mapea la entidad Publication a la tabla 'publications' en PostgreSQL
 * 
 * Principio SOLID: Single Responsibility Principle (SRP)
 * Esta clase solo es responsable de definir la estructura de datos
 * y sus validaciones a nivel ORM
 */

const PublicationModel = sequelize.define(
  'Publication',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      trim: true,
      validate: {
        len: {
          args: [3, 200],
          msg: 'Title must be between 3 and 200 characters',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: {
          args: [10, 5000],
          msg: 'Description must be between 10 and 5000 characters',
        },
      },
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Foreign key reference to Authors Service',
    },
    status: {
      type: DataTypes.ENUM(
        'DRAFT',
        'IN_REVIEW',
        'APPROVED',
        'PUBLISHED',
        'REJECTED'
      ),
      defaultValue: 'DRAFT',
      allowNull: false,
    },
    reviewComments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    publishedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'publications',
    timestamps: true,
    underscored: false,
  }
);

export default PublicationModel;
