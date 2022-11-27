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

const deletePet = useCallback(async(id)=>{
   const idToDelete = id
   const body = JSON.stringify({
      id: idToDelete
   })
   const deletePetResult = await callBackend("http://localhost:8000/pets", "DELETE", body)
   if(!deletePetResult?.success){
      setErrorMessage(deletePetResult?.errorMessage || "Szerver hiba")
      return
   }
   if(deletePetResult?.success){
      
      const newDisplayedPets = displayedPets.filter(pet => idToDelete !== pet.id)
console.log({newDisplayedPets,idToDelete})
      setDisplayedPets(newDisplayedPets)
      setCurrentPet(null) 
   }
},[displayedPets, setErrorMessage])

//akkor hívja meg a fuggvényt 1x amikor betült az oldal
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
               <div style= {{display: "flex",gap: "10px", backgroundColor: pet.name === "Python" ? "magenta" : "whitesmoke"}} key={Math.random()}>
                  <p>{pet.name}</p> <p>{pet.species}</p> 
                  <button onClick={()=>{setCurrentPet(pet)}}> Módosít</button>
               </div>
            ) : null
         }
         </div>

         <div className='pet-details'>
            <div>
               <div><p>Név</p><p>{currentPet?.name ?? ""}</p></div> {/* undefined és null esetén a ?? a jobb oldalon levő értéket adja*/}
               <div><p>Gazda</p><div>{currentPet?.owners?.length ? currentPet?.owners.map(owner =><p key={owner.id}>{owner.name}</p>) : <p>{""}</p>}</div></div>
               <div>
                  <button onClick={()=>{}}>Módosít</button>
                  <button 
                     disabled={currentPet?.id === null || currentPet?.id === undefined} 
                     onClick={()=>{deletePet(currentPet?.id)}}>Töröl</button>
               </div>
            </div>
         </div>
      </div>
   </>)
}