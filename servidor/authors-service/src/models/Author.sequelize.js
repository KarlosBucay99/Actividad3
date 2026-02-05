import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Modelo Sequelize para Author
 * 
 * Mapea la tabla 'authors' en la base de datos a un objeto JavaScript.
 * Combina los atributos de las clases Person y Author.
 * 
 * Patrón: ORM (Object-Relational Mapping)
 * Principio SOLID: SRP - Este archivo es responsable solo del mapeo ORM
 */

const AuthorModel = sequelize.define(
  'Author',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [2, 255],
          msg: 'Name must be between 2 and 255 characters',
        },
        notEmpty: {
          msg: 'Name is required',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email already exists',
      },
      validate: {
        isEmail: {
          msg: 'Must be a valid email address',
        },
        notEmpty: {
          msg: 'Email is required',
        },
      },
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Bio must be less than 1000 characters',
        },
      },
    },
    expertise: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: {
          args: [0, 255],
          msg: 'Expertise must be less than 255 characters',
        },
      },
    },
    nationality: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: {
          args: [0, 100],
          msg: 'Nationality must be less than 100 characters',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'authors',
    timestamps: false, // Manejamos createdAt manualmente
    underscored: false,
  }
);

export default AuthorModel;
