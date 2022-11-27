import {useState} from 'react'

export default function Treatments({displayedTreatments, setDisplayedTreatments}){

   //jelenlegi választott állat
   const [currentTreatment, setCurrentTreatment]=useState(null)


   return(
   <>
      <h1>Treatments!</h1>
      {displayedTreatments.map(treatment => <div style= {{
display: "flex",
gap: "10px"
      }} key={Math.random()}><p>{treatment.type}</p></div>)}

   </>)
}