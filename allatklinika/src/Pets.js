import {useState, useEffect, useCallback} from 'react';
import callBackend from './callBackend';

export default function Pets({ errorMessage, setErrorMessage}){
//backendről meghívott állat adatok
   const [displayedPets, setDisplayedPets] = useState([]);

   //jelenlegi választott állat
   const [currentPet, setCurrentPet]=useState(null)

const getPets = useCallback(async()=>{
   const getPetsResult = await callBackend("http://localhost:8000/pets", "GET")
   if(!getPetsResult?.success){
     setErrorMessage(getPetsResult?.errorMessage || "Szerver hiba")
     return
   }
   if(getPetsResult?.pets){
     setDisplayedPets(getPetsResult.pets)
   }
},[setErrorMessage])

useEffect(()=>{
   getPets()
},[getPets])
    
   return(
   <>
      <h1>Pets!</h1>
      <div>
         <div>
         {
            displayedPets && displayedPets.length ? displayedPets.map(pet => 
               <div style= {{display: "flex",gap: "10px"}} key={Math.random()}>
                  <p>{pet.name}</p> <p>{pet.species}</p> 
                  <button onClick={()=>{setCurrentPet(pet)}}> Módosít</button>
               </div>
            ) : null
         }
         </div>

         <div className='pet-details'>
            <form>
               <div><p>Név</p><p>{currentPet?.name ?? ""}</p></div> {/* undefined és null esetén a ?? a jobb oldalon levő értéket adja*/}
               <div><p>Gazda</p><p>{}</p></div>
            </form>
         </div>
      </div>
   </>)
}