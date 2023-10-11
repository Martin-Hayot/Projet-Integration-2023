const  express = require("express")
const ChemicalComponent = require("../models/ChemicalComponent")
const router  = express.Router()

exports.createChemicalComponent = (request, response)=>{
        const chemicalComponent = new ChemicalComponent({
            chemicalComponentName: request.body.chemicalComponentName,
            chemicalComponentMinumumValue: request.body.chemicalComponentMinumumValue,
            chemicalComponentMaximumValue: request.body.chemicalComponentMaximumValue
        })
        chemicalComponent.save()
        .then(()=>{
            response.status(201).json({message: "ChemicalComponent saved succesfully !"})
        })
        .catch((error)=>{
            response.status(400).json({error: error})
        })
}


exports.ShowOneChemicalComponent = (request, response) =>{
    ChemicalComponent.findOne(_id.request.params.id)
    .then((chemicalComponent)=>{
        response.status(200).json({message:' find' (chemicalComponent)})
    })
    .catch((error)=>{
        response.status(404).json({error:error})
    })
}


exports.showAllChemicalComponent = (request,response)=>{
    ChemicalComponent.find()
    .then((user)=>{
        response.status(200).json(user)
    })
    .catch((error)=>{
        response.status(400).json({error:error})
    })
}

exports.modifyChemicalComponent = (request,response)=>{
    const chemicalComponent = new ChemicalComponent({
        _id: request.params.id,
        chemicalComponentName: request.body.chemicalComponentName,
        chemicalComponentMinumumValue: request.body.chemicalComponentMinumumValue,
        chemicalComponentMaximumValue:request.body.chemicalComponentMaximumValue
    })
    ChemicalComponent.updateOne({_id:request.params.id}, chemicalComponent)
    .then(()=>{
        response.status(201).json({message:"chemicalComponent  is updated successfully !"})})
    .catch((error)=>{
        response.status(400).json({error:error})})
    }

exports.deleteChemicalComponent = (request, response)=>{
    ChemicalComponent.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"User deleted succesfully !"})
        })
    .catch((error)=>{
        response.status(400).json({error:error})})
    }


   