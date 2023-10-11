const  express = require("express")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router  = express.Router()

exports.createUser = (request, response)=>{
    bcrypt.hash(request.body.userPassword,10)
    .then(hash =>{
        const user = new User({
            userName: request.body.userName,
            userEmail: request.body.userEmail,
            userPassword:hash,
            userConfirmPassword: hash
        })
        user.save()
        .then(()=>{
            response.status(201).json({message: "User saved succesfully !"})
            console.log('Super')
        })
        .catch((error)=>{
            response.status(400).json({error: error})
            console.log('Zut')
        })
    })
}


exports.ShowOneUser = (request, response) =>{
    User.findOne(_id.request.params.id)
    .then((user)=>{
        response.status(200).json({message:'user find' (user)})
    })
    .catch((error)=>{
        response.status(404).json({error:error})
    })
}

exports.searchEmail =(request, response)=>{
    console.log(request.params.email)
    User.findOne({ userEmail: request.params.userEmail })
        .then((user)=>{
            response.status(200).json(user)})
        .catch((error)=>{
            response.status(404).json({error:error})})
    }


exports.showAllUsers = (request,response)=>{
    User.find()
    .then((user)=>{
        response.status(200).json(user)
    })
    .catch((error)=>{
        response.status(400).json({error:error})
    })
}

exports.modifyUser = (request,response)=>{
    const user = new User({
        _id: request.params.id,
        userName: request.body.userName,
        userEmail: request.body.userEmail,
        userPassword:request.body.userPassword,
        userConfirmPassword: request.body.userConfirmPassword
    })
    User.updateOne({_id:request.params.id}, user)
    .then(()=>{
        response.status(201).json({message:"User is updated successfully !"})})
    .catch((error)=>{
        response.status(400).json({error:error})})
    }

exports.deleteUser = (request, response)=>{
    User.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"User deleted succesfully !"})
        })
    .catch((error)=>{
        response.status(400).json({error:error})})
    }


    exports.login = (request, response)=>{
        User.findOne({userEmail: request.body.userEmail})
        .then(user =>{
            console.log(user)
            if (!user){
                return response.status(401).json({error: 'email ou mot de passe incorrect !'});
            }
            bcrypt.compare(request.body.userPassword, user.userPassword)
            .then(valid =>{
                console.log('Connexion réussie');
                if(!valid){
                   return response.status(401).json({error: 'Mot de passe incorrect!'});
                }
                response.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        {userId: user._id},
                        'RANDOM_TOKEN_SECRET',
                        {expiresIn:'24h'}
                    )
                });
            })
            .catch(error=> response.status(500).json({error}));
        })
        .catch(error=>response.status(500).json({error}));
    }
