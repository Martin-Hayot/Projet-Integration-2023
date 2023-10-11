const  express = require("express")
const AquariumControleur = require("../models/Aquarium")
const router  = express.Router()

exports.createAquarium = (request, response)=>{
        const aquarium = new AquariumControleur({
            aquariumName: request.body.aquariumName,
            aquariumSize: request.body.aquariumSize,
            aquariumDatePurchase:request.body.aquariumDatePurchase,
            aquariumOwner: request.body.aquariumOwner
        })
        aquarium.save()
        .then(()=>{
            response.status(201).json({message: "Aquarium saved succesfully !"})
            console.log('Super')
        })
        .catch((error)=>{
            response.status(400).json({error: error})
            console.log('Zut')
        })
}


exports.ShowOneAquarium = (request, response) =>{
    AquariumControleur.findOne(_id.request.params.id)
    .then((aquarium)=>{
        response.status(200).json({message:'Aquarium find' (aquarium)})
    })
    .catch((error)=>{
        response.status(404).json({error:error})
    })
}


exports.showAllAquarium = (request,response)=>{
    AquariumControleur.find()
    .then((user)=>{
        response.status(200).json(user)
    })
    .catch((error)=>{
        response.status(400).json({error:error})
    })
}

exports.modifyAquarium = (request,response)=>{
    const aquarium = new AquariumControleur({
        _id: request.params.id,
        aquariumName: request.body.aquariumName,
        aquariumSize: request.body.aquariumSize,
        aquariumDatePurchase:request.body.aquariumDatePurchase,
        aquariumOwner: request.body.aquariumOwner
    })
    Aquarium.updateOne({_id:request.params.id}, aquarium)
    .then(()=>{
        response.status(201).json({message:"Aquarium is updated successfully !"})})
    .catch((error)=>{
        response.status(400).json({error:error})})
    }

exports.deleteAquarium = (request, response)=>{
    AquariumControleur.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"User deleted succesfully !"})
        })
    .catch((error)=>{
        response.status(400).json({error:error})})
    }


   