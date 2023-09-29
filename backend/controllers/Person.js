const  express = require("express")
const  router = express.Router()
const Person = require("../models/Person")

exports.createPerson = (request, response)=> {
    const PersonObject = JSON.parse(request.body.band)
    let person = new Person({
        personName: request.body.personName,
        personEmail: request.body.personEmail,
    })
    console.log("Données chargées"+ person)
    person.save()
        .then(()=>{
            console.log('la réponse est '+response)
            response.status(201).json({message: "Post saved succefully !"})
        })
        .catch((error)=>{
            response.status(400).json({error:error})
            })
    }

exports.modifyPerson = (request,response)=>{
    const person = new person({
        _id: request.params.id,
        personName: request.body.personName,
        personEmail: request.body.personEmail,
    })
    Person.updateOne({_id:request.params.id}, person)
    .then(()=>{
        response.status(201).json({message:"Band is updated successfully !"})})
    .catch((error)=>{
        response.status(400).json({error:error})})
    }

exports.deletePerson = (request, response)=>{
    Person.deleteOne({_id:request.params.id})
        .then(()=>{
            response.status(200).json({message:"Deleted !"})
        })
    .catch((error)=>{
        response.status(400).json({error:error})})
    }


exports.getPerson = (request,response)=>{
    Person.find({}, (err, items)=>{
        if(err){
            console.log(err)
            response.status(500).send("Une erreur s'est produite", err)
        }
        else{
            response.render('imagesPage',{items:items})
        }
    })
}