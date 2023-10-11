const express = require('express')
const MesureAquarium = require('../models/MesureAquarium')
const router = express.Router()

exports.createMesure = (request, response)=>{
    const mesureAquarium = new MesureAquarium({
        mesureAquarium: request.body.mesureAquarium,
        mesureComponent: request.body.mesureComponent,
        mesureDate: request.body.mesureDate,
        MesureTime: request.body.mesureTime,
        mesureValue: request.body.mesureValue
    })
    mesureAquarium.save()
    .then(()=>{
        response.status(201).json({message: 'Mesure saved succesfully'})
    })
    .catch((error)=>{
        response.status(404).json({error})
    })
}


exports.showAllMesureAquarim = (request,response)=>{
    mesureAquarium.find()
    .then((user)=>{
        response.status(200).json(user)
    })
    .catch((error)=>{
        response.status(400).json({error:error})
    })
}

exports.deleteMesureAquarium = (request, response)=>{
    MesureAquarium.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"User deleted succesfully !"})
        })
    .catch((error)=>{
        response.status(400).json({error:error})})
    }
