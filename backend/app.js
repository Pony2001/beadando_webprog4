const { response } = require('express');
const express = require('express')
const path = require('path')
require('dotenv').config()
// {path: path.resolve(__dirname, `/backend/.env`)}
const cors = require('cors')
const fs = require('fs')

// import express from 'express'
const app = express()
const port = process.env.PORT

app.use(cors())


app.get('/pets', (req, res) => {

  //res.header({'Content-Type': 'application/json'})

  const petsRead = fs.readFileSync(`${__dirname}/db/pets.json`, 'utf-8')
  // , (err, content) => {
  //   if(err){
      
  //     res.status(404).send(JSON.stringify({
  //       success: false,
  //       errorMessage: "Nem találtunk megfelelő háziállat adatot" 
  //     }))
  //     return
  //   }
  //   return content
  // })
 
const petsResult = JSON.parse(petsRead)
//console.log({petsResult})

  //registryResult
  const registryRead = fs.readFileSync(`${__dirname}/db/registry.json`, 'utf-8')
  // , (err, content) => {
  //   if(err){
      
  //     res.status(404).send(JSON.stringify({
  //       success: false,
  //       errorMessage: "Nem találtunk megfelelő kapcsolatot a vendégek és az állatok adatai közt" 
  //     }))
  //     return
  //   }
  //   // console.log('registryResult:')
  //   // console.log(JSON.parse(content))
  //   return JSON.parse(content)
  // })

  const registryResult = JSON.parse(registryRead)
  //console.log({registryResult})

  //customersResult
  const customersRead = fs.readFileSync(`${__dirname}/db/customers.json`, 'utf-8')
  // , (err, content) => {
  //   if(err){
      
  //     res.status(404).send(JSON.stringify({
  //       success: false,
  //       errorMessage: "Nem találtunk megfelelő vendég adatot" 
  //     }))
  //     return
  //   }
  //   // console.log('customersResult:')
  //   // console.log(JSON.parse(content))
  //   return JSON.parse(content)
  // })
  const customersResult = JSON.parse(customersRead)
  //console.log({customersResult})

  const treatmentForPetsRead = fs.readFileSync(`${__dirname}/db/treatmentForPets.json`, 'utf-8')
  // , (err, content) => {
  //   if(err){
      
  //     res.status(404).send(JSON.stringify({
  //       success: false,
  //       errorMessage: "Nem találtunk megfelelő kapcsolatot az állatok és az ellátások adatai közt" 
  //     }))
  //     return
  //   }
  //   return JSON.parse(content)
  // })
  const treatmentForPetsResult = JSON.parse(treatmentForPetsRead)

  //treatmentsResult
  const treatmentsRead = fs.readFileSync(`${__dirname}/db/treatments.json`, 'utf-8')
  // , (err, content) => {
  //   if(err){
      
  //     res.status(404).send(JSON.stringify({
  //       success: false,
  //       errorMessage: "Nem találtunk megfelelő ellátás adatot" 
  //     }))
  //     return
  //   }
  //   // console.log('treatmentsResult:')
  //   // console.log(JSON.parse(content))
  //   return JSON.parse(content)
  // })

  const treatmentsResult = JSON.parse(treatmentsRead)
  //console.log({treatmentsResult})

  const returningResults = petsResult.map(pet=>{
    //gazda id-k adott állatkára:
    
    const customerIds = registryResult.filter(registry => pet.id === registry.pet_id).map(registryEntry => registryEntry.customer_id)
    const customers = customersResult.filter(customer => customerIds.includes(customer.id))

    const filteredTreatmentForPets = treatmentForPetsResult.filter(treatment => pet.id === treatment.pet_id)
    .map(filteredTreatment => {
      const treatmentName = treatmentsResult.find(procedure => procedure.id === filteredTreatment.treatment_id).type

      return {
        ...filteredTreatment, treatmentName: treatmentName
    }})

    const petData ={
      name: pet.name,
      owners:customers,
      species:pet.species,
      treatments: filteredTreatmentForPets,
    }
    
    console.log({petData})

    
    return petData 
    })


  res.status(200).send(JSON.stringify({
    success: true,
    pets: returningResults
  }))
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})