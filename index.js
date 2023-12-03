const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
// import cors
const cors = require('cors')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mysql'
})

// Membuat model (table) food
const Food = sequelize.define('Food', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    rasa: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

// Membuat model (table) user
const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})

// Food to user has a relationship of 1:N relationship
Food.hasMany(Users, {
    foreignKey: 'id_makanan',
});
// User to food has a relationship of 1:1 relationship
Users.belongsTo(Food, {
    foreignKey: 'id_makanan',
});

// Membuat table di database jika tidak ada
sequelize.sync({ alter: true }) // tambah force: true untuk menghapus table yang sudah ada

const app = express()

app.use(cors())

// API endpoint untuk homepage
app.get('', (req, res) => {
    res.send('Welcome')
})

// API endpoint untuk test connection database
app.get('/test-connection', async (req, res) => {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    } catch (e) {
        console.error('Unable to connect to the database:', e)
    }
    res.send('Hello express')
})

// API endpoint untuk contoh menambah data di table food
app.post('/food', async (req, res) => {
    try {
        await Food.create({
            rasa: 'Pedas',
        })
        res.send('Food created')
    } catch (e) {
        console.error(e)
    }
})

// API endpoint untuk contoh menambah data di table user
app.post('/user', async (req, res) => {
    try {
        // await sequelize.query(`
        //     INSERT INTO Users (nama, id_makanan) VALUES ('Zaki', 1)
        // `)
        await Users.create({
            nama: 'Daffa',
            id_makanan: 1,
        })
        res.send('User created')
    } catch (e) {
        console.error(e)
        res.send('Error' + e)
    }
})

// API endpoint untuk contoh mengambil data di table user tapi gabung dengan table food
app.get('/user-food', async (req, res) => {
    try {
        // cara untuk join table menggunakan raw query
        // const [results] = await sequelize.query(`
        //     SELECT *
        //     FROM "Users" u
        //     JOIN "Food" f
        //     ON u.id_makanan = f.id
        // `)
        // cara untuk join table menggunakan sequelize include
        const results = await Users.findAll({
            include: Food,
        })
        res.send(results)
    } catch (e) {
        console.error(e)
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log('Server is up on port 3000.')
})