const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Users = require('../albanero-technical-assignment/models/User');

require('dotenv/config');

const app = express();

app.use(bodyParser.json());

// get all the users who are signedUp

app.get('/', async(req, res) => {
    try{
        const allUsers = await Users.find();
        res.json(allUsers);
    } catch(error) {
        res.send({
            message: error,
        })
    }
})

// Create Users API

app.post('/signup', async(req, res) => {
    const newUser = new Users({
        username: req.body.username,
        fullName: req.body.fullName,
        emailID: req.body.emailID,
        password: req.body.password
    });
    try{
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch(error) {
        res.send({
            message: error,
        })
    }
});

// Follow a particular User by his UserName

app.post('/follow/:currentUser', async(req, res) => {
    try {
        const currentUser = req.params.currentUser;
        const followUser = req.body.followUser;
        const getFollowers1 = await Users.findOneAndUpdate(
            { username: followUser },
            { $push: {
                followers: currentUser,    
            }}
        );
        const getFollowers2 = await Users.findOneAndUpdate(
            { username: currentUser },
            {
                $push: {
                    following: followUser,
                }
            }
        )
        res.json({
            message: `Followed the ${currentUser}`
        })
    } catch (error) {
        res.json({
            message: error,
        })
    }
});

// Get the followers for Current User

app.post('/followers/:currentUser', async(req, res) => {
    try {
        const currentUser = req.params.currentUser;
        const details = await Users.find({ username: currentUser }).select('followers');
        res.json(details);
    } catch (error) {
        res.json({
            message: error,
        })
    }
});

// Get the following Users for Current User

app.post('/following/:currentUser', async(req, res) => {
    try {
        const currentUser = req.params.currentUser;
        const details = await Users.find({ username: currentUser }).select('following');
        res.json(details);
    } catch (error) {
        res.json({
            message: error,
        })
    }
});

// Create a Post for Current User

app.post('/post/:myUser', async(req, res) => {
    try {
        const newPost = req.body.post;
        const currentUser = req.params.myUser;
        const updatePost = await Users.findOneAndUpdate(
            { username: currentUser },
            { $push: {
                posts: newPost,    
            }}
        );
        res.json(updatePost);
    } catch (error) {
        res.json(
            {
                message: error,
            }
        )
    }
});

// Get feed of my posts and also following users

app.post('/feed/:myUser', async(req, res) => {
    try {
        const result = [];
        const currentUser = req.params.myUser;
        const currentPost = await User.find({ username: currentUser }).select('posts');
        result.push(currentPost[0].posts);
        const res = await User.find({ username: currentUser}).select('following');
        for(let i=0; i<res[0].following.length; ++i) {
            const getEach = await User.find({ username: res[0].following[i] }).select('posts');
            result.push(getEach[0].posts);
        }
        console.log(result);
        res.send({
            message: result,
        });
    } catch (error) {
        res.json({message: error,});
    }
});

// MongoDB connection 

mongoose.connect(process.env.DB_CONNECTION, 
    { useUnifiedTopology: true, useNewUrlParser: true }, 
    () => console.log('Connected')
);

app.listen(3000);