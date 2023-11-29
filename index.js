const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres'
})

const Food = sequelize.define('Food', {
    id_makanan: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    rasa: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

const Users = sequelize.define('Users', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_makanan: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

sequelize.sync()

const app = express()

app.get('', (req, res) => {
    res.send('Welcome')
})

// test connection database
app.get('/test-connection', async (req, res) => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (e) {
        console.error('Unable to connect to the database:', e)
    }
    res.send('Hello express')
})

// contoh menambah data di table food
app.post('/food', async (req, res) => {
    try {
        await Food.create({
            id_makanan: 1,
            rasa: 'Pedas',
        })
        res.send('Food created')
    } catch (e) {
        console.error(e)
    }
})

// contoh menambah data di table user
app.post('/user', async (req, res) => {
    try {
        await Users.create({
            id_user: 1,
            nama: 'Rizky',
            id_makanan: 1
        })
        res.send('User created')
    } catch (e) {
        console.error(e)
        res.send('Error' + e)
    }
})

// contoh mengambil data di table user tapi gabung dengan table food
app.get('/user-food', async (req, res) => {
    try {
        // cara untuk join table
        const [results] = await sequelize.query(`
            SELECT u.nama, f.rasa
            FROM "Users" u
            JOIN "Food" f
            ON u.id_makanan = f.id_makanan
        `)
        res.send(results)
    } catch (e) {
        console.error(e)
    }
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})