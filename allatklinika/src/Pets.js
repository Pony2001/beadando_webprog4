import {useState, useEffect, useCallback} from 'react';
import callBackend from './callBackend';

export default function Pets({ errorMessage, setErrorMessage}){
//backendről meghívott állat adatok
   const [displayedPets, setDisplayedPets] = useState([]);

   //jelenlegi választott állat
   const [currentPet, setCurrentPet]=useState(null)

   const [name, setName]=useState('ahan')

   console.log(currentPet.name)

   
   

//GET
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

//DELETE
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
      <div className='row'>
         <div className='col-md-6'>
            {
               displayedPets && displayedPets.length ? displayedPets.map(pet => 
                  <div key={Math.random()}>

                     <span>{pet.name}</span> <span>{pet.species}</span> 
                     
                     <button 
                        className='btn btn-outline-dark m-1 ' 
                        onClick={()=>{setCurrentPet(pet)}}>Megtekint</button>
                     
                  </div>
               ) : null
            }
         </div>

         <div className='pet-details col-md-6'>
            <div>
               <div>
                  <p>Név</p>
                  
                  <input value={name} name="name" onChange={e => setName(e.target.value)}></input>
               </div> {/* undefined és null esetén a ?? a jobb oldalon levő értéket adja*/}
               <div>
                  <p>Gazda</p>
                  <div>{currentPet?.owners?.length ? currentPet?.owners.map(owner =><input key={owner.id} value={owner.name}></input>) : <p>{""}</p>}</div>
                  </div>
               <div>
                  <button 
                     className='btn btn-primary m-1'
                     disabled={currentPet?.id === null || currentPet?.id === undefined} 
                     onClick={()=>{}}>Módosít</button>
                  <button 
                     className='btn btn-danger m-1'
                     disabled={currentPet?.id === null || currentPet?.id === undefined} 
                     onClick={()=>{deletePet(currentPet?.id)}}>Töröl</button>
               </div>
            </div>
         </div>
      </div>
   </>)
}