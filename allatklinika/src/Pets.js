import { useState, useEffect, useCallback } from "react";
import callBackend from "./callBackend";

export default function Pets({ errorMessage, setErrorMessage }) {
  //backendről meghívott állat adatok
  const [displayedPets, setDisplayedPets] = useState([]);

  const [displayedCustomers, setDisplayedCustomers] = useState([]);

  //jelenlegi választott állat
  const [currentPet, setCurrentPet] = useState(null);
  const [currentCustomer, setCurrentCustomer] = useState(null);

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

  const getCustomers = useCallback(async () => {
    const getCustomersResult = await callBackend(
      "http://localhost:8000/customers",
      "GET"
    );
    if (!getCustomersResult?.success) {
      setErrorMessage(getCustomersResult?.errorMessage || "Szerver hiba");
      return;
    }
    if (getCustomersResult?.customers) {
      setDisplayedCustomers(getCustomersResult.customers);
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
      if (updatePetResult?.success) {
        const newDisplayedPets = displayedPets.filter(
          (pet) => petToUpdate !== pet.id
        );
        setDisplayedPets(newDisplayedPets);
        setCurrentPet(null);
      }
    },
    [displayedPets, setErrorMessage]
  );

  //CREATE
  const postPets = useCallback(async () => {
    const postPetsResult = await callBackend(
      "http://localhost:8000/pets",
      "POST"
    );
    if (!postPetsResult?.success) {
      setErrorMessage(postPetsResult?.errorMessage || "Szerver hiba");
      return;
    }
  }, [setErrorMessage]);

  //akkor hívja meg a fuggvényt 1x amikor betült az oldal
  useEffect(() => {
    getPets();
  }, [getPets]);

  useEffect(() => {
    //console.log({ currentPet });
  }, [currentPet]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  useEffect(() => {
    //console.log({ displayedCustomers });
  }, [displayedCustomers]);

  return (
    <>
      <h1 style={{ textAlign: "center" }} className="mt-5">
        Állatok
      </h1>
      <div className="row mt-2">
        <div style={{ textAlign: "center" }} className="col-md-6">
          {displayedPets && displayedPets.length
            ? displayedPets.map((pet) => (
                <div key={Math.random()}>
                  <button
                    className="btn btn-outline-dark m-1"
                    onClick={() => {
                      setCurrentPet(pet);
                    }}
                  >
                    <span>{pet.name}</span> - <span>{pet.species}</span>
                  </button>
                </div>
              ))
            : null}
        </div>

        {currentPet?.id ? (
          <form className="pet-details col-md-6 form-validation">
            <div className="row">
              <div className="col-md-5">
                <div>
                  <label className="form-validation">Név: </label>

                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    value={currentPet.name}
                    onChange={(e) => {
                      //object shallow copy + property overwrite
                      const newPet = { ...currentPet, name: e.target.value };
                      setCurrentPet(newPet);
                    }}
                  ></input>
                </div>
                {/* undefined és null esetén a ?? a jobb oldalon levő értéket adja*/}
                <br />
                <div>
                  <label className="form-validation">Gazda: </label>

                  {currentPet?.owners?.length ? (
                    //owners array minen elemére egy inputot genreálunk
                    currentPet?.owners.map((owner, index) => (
                      <select
                        style={{ textAlign: "center" }}
                        className="form-control m-1"
                        key={index}
                        onChange={(event) => {
                          //Új owners array létrehozása mappeléssel
                          const newOwners = currentPet.owners.map((person) => {
                            const newPerson = {
                              ...person,
                              id:
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
                      >
                        <option key={index} value={currentPet.owners[index].id}>
                          {currentPet.owners[index].name}
                        </option>
                        {displayedCustomers.map((customers) => (
                          <option key={customers.id} value={customers.id}>
                            {customers.name}
                          </option>
                        ))}
                      </select>
                    ))
                  ) : (
                    <p>{""}</p>
                  )}

                  <div style={{ textAlign: "center" }}>
                    <button
                      className="btn btn-primary m-2"
                      disabled={
                        currentPet?.id === null || currentPet?.id === undefined
                      }
                      type="button"
                      onClick={() => {
                        updatePet(currentPet);
                        getPets();
                        getCustomers();
                        console.log(currentPet);
                      }}
                    >
                      Módosít
                    </button>
                    <button
                      className="btn btn-danger m-2"
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
              </div>
            </div>
          </form>
        ) : null}
        <div>
          <div className="col-md-7">
            <form action="http://localhost:8000/pets" method="POST">
              <div>
                <label>Állat neve: </label>
                <div className="col-md-4">
                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    name="name"
                    placeholder="Pityuka"
                  ></input>
                </div>

                <label>Állat fajtája: </label>
                <div className="col-md-4">
                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    name="species"
                    placeholder="Papagáj"
                  ></input>
                </div>
              </div>
              <div>
                <button className="btn btn-primary m-2" type="submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
