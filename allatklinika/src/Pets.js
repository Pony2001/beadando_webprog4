import { useState, useEffect, useCallback } from "react";
import callBackend from "./callBackend";

export default function Pets({ errorMessage, setErrorMessage }) {
  //backendről meghívott állat adatok
  const [displayedPets, setDisplayedPets] = useState([]);

  //jelenlegi választott állat
  const [currentPet, setCurrentPet] = useState(null);

  //GET
  const getPets = useCallback(async () => {
    const getPetsResult = await callBackend(
      "http://localhost:8000/pets",
      "GET"
    );
    if (!getPetsResult?.success) {
      setErrorMessage(getPetsResult?.errorMessage || "Szerver hiba");
      return;
    }
    if (getPetsResult?.pets) {
      setDisplayedPets(getPetsResult.pets);
    }
  }, [setErrorMessage]);

  //DELETE
  const deletePet = useCallback(
    async (id) => {
      const idToDelete = id;
      const body = JSON.stringify({
        id: idToDelete,
      });
      const deletePetResult = await callBackend(
        "http://localhost:8000/pets",
        "DELETE",
        body
      );
      if (!deletePetResult?.success) {
        setErrorMessage(deletePetResult?.errorMessage || "Szerver hiba");
        return;
      }
      if (deletePetResult?.success) {
        const newDisplayedPets = displayedPets.filter(
          (pet) => idToDelete !== pet.id
        );
        setDisplayedPets(newDisplayedPets);
        setCurrentPet(null);
      }
    },
    [displayedPets, setErrorMessage]
  );

  //UPDATE
  const updatePet = useCallback(
   async (modifiedPet) => {
     const petToUpdate = modifiedPet;
     const body = JSON.stringify({
       pet: petToUpdate,
     });
     const updatePetResult = await callBackend(
       "http://localhost:8000/pets",
       "PUT",
       body
     );
     if (!updatePetResult?.success) {
       setErrorMessage(updatePetResult?.errorMessage || "Szerver hiba");
       return;
     }
   },
   [setErrorMessage]
  );


  //akkor hívja meg a fuggvényt 1x amikor betült az oldal
  useEffect(() => {
    
    getPets();
  }, [getPets]);
  console.log(currentPet)
  return (
    <>
      <h1>Pets!</h1>
      <div className="row">
        <div className="col-md-6">
          {displayedPets && displayedPets.length
            ? displayedPets.map((pet) => (
                <div key={Math.random()}>
                  <span>{pet.name}</span> <span>{pet.species}</span>
                  <button
                    className="btn btn-outline-dark m-1 "
                    onClick={() => {
                      setCurrentPet(pet);
                    }}
                  >
                    Megtekint
                  </button>
                </div>
              ))
            : null}
        </div>

        {currentPet?.id ? (
          <form className="pet-details col-md-6">
            <div>
              <div>
                <p>Név</p>

                <input
                  value={currentPet.name}
                  minLength={3}
                        required
                  name="name"
                  onChange={(e) => {
                    //object shallow copy + property overwrite
                    const newPet = { ...currentPet, name: e.target.value };
                    setCurrentPet(newPet);
                  }}
                ></input>
              </div>
              {/* undefined és null esetén a ?? a jobb oldalon levő értéket adja*/}
              <div>
                <p>Gazda</p>
                <div>
                  {currentPet?.owners?.length ? (
                    //owners array minen elemére egy inputot genreálunk
                    currentPet?.owners.map((owner, index) => (
                      <input
                        key={index}
                        minLength={3}
                        required
                        name={`owners.${index}`}
                        value={currentPet.owners[index].name}
                        
                        onChange={(event) => {
                          //Új owners array létrehozása mappeléssel
                          const newOwners = currentPet.owners.map((person) => {
                            const newPerson = {
                              ...person,
                              name:
                                owner.id === person.id
                                  ? event.target.value
                                  : person.name,
                            };
                            return newPerson;
                          });
                          //új owners array-jel felülírjuk a meglévő adatokat
                          const newPet = {
                            ...currentPet,
                            owners: newOwners,
                          };
                          //beállítjuk a megváltozott állat adatot
                          setCurrentPet(newPet);
                          
                        }}
                      ></input>
                    ))
                  ) : (
                    <p>{""}</p>
                  )}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-primary m-1"
                  disabled={
                    currentPet?.id === null || currentPet?.id === undefined
                  }
                  type="button"
                  onClick={() => {
                     updatePet(currentPet);
                   }}
                >
                  Módosít
                </button>
                <button
                  className="btn btn-danger m-1"
                  disabled={
                    currentPet?.id === null || currentPet?.id === undefined
                  }
                  type="button"
                  onClick={() => {
                    deletePet(currentPet?.id);
                  }}
                >
                  Töröl
                </button>
              </div>
            </div>
          </form>
        ) : null}
      </div>
    </>
  );
}
