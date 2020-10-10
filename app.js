const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute')
const app = express();
const cookieParser = require('cookie-parser')
const { requireAuth } = require('./middleware/AuthMiddleware');
// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/jwt_auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(8000,console.log("Listening for port 8000")))
  .catch((err) => res.json());

// routes
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes)

