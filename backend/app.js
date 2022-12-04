const { response } = require("express");
const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const fs = require("fs");
const { get } = require("http");
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({ extend: false });

app.use(cors());
app.use(express.json()); //automatikus json beolvasás

// GET-------------------------------------------------------------------------------
app.get("/pets", (req, res) => {
  //res.header({'Content-Type': 'application/json'})
  try {
    const petsRead = fs.readFileSync(
      `${__dirname}/db/pets.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          console.log(err);
          res.status(404).send(
            JSON.stringify({
              success: false,
              errorMessage: "Nem találtunk megfelelő adatot",
            })
          );
          return;
        }
      }
    );

    const petsResult = JSON.parse(petsRead);
    //console.log({petsResult})

    //registryResult
    const registryRead = fs.readFileSync(
      `${__dirname}/db/registry.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          console.log(err);
          res.status(404).send(
            JSON.stringify({
              success: false,
              errorMessage: "Nem találtunk megfelelő adatot",
            })
          );
          return;
        }
      }
    );

    const registryResult = JSON.parse(registryRead);
    //console.log({registryResult})

    //customersResult
    const customersRead = fs.readFileSync(
      `${__dirname}/db/customers.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          console.log(err);
          res.status(404).send(
            JSON.stringify({
              success: false,
              errorMessage: "Nem találtunk megfelelő adatot",
            })
          );
          return;
        }
      }
    );

    const customersResult = JSON.parse(customersRead);
    //console.log({customersResult})

    const treatmentForPetsRead = fs.readFileSync(
      `${__dirname}/db/treatmentForPets.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          console.log(err);
          res.status(404).send(
            JSON.stringify({
              success: false,
              errorMessage: "Nem találtunk megfelelő adatot",
            })
          );
          return;
        }
      }
    );

    const treatmentForPetsResult = JSON.parse(treatmentForPetsRead);

    //treatmentsResult
    const treatmentsRead = fs.readFileSync(
      `${__dirname}/db/treatments.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          console.log(err);
          res.status(404).send(
            JSON.stringify({
              success: false,
              errorMessage: "Nem találtunk megfelelő adatot",
            })
          );
          return;
        }
      }
    );

    const treatmentsResult = JSON.parse(treatmentsRead);
    //console.log({treatmentsResult})

    const returningResults = petsResult.map((pet) => {
      //gazda id-k adott állatkára:

      const customerIds = registryResult
        .filter((registry) => pet.id === registry.pet_id)
        .map((registryEntry) => registryEntry.customer_id);
      const customers = customersResult.filter((customer) =>
        customerIds.includes(customer.id)
      );

      const filteredTreatmentForPets = treatmentForPetsResult
        .filter((treatment) => pet.id === treatment.pet_id)
        .map((filteredTreatment) => {
          const treatmentName = treatmentsResult.find(
            (procedure) => procedure.id === filteredTreatment.treatment_id
          ).type;

          return {
            ...filteredTreatment,
            treatmentName: treatmentName,
          };
        });

      const petData = {
        id: pet.id,
        name: pet.name,
        owners: customers,
        species: pet.species,
        treatments: filteredTreatmentForPets,
      };

      //console.log({petData})

      return petData;
    });

    res.status(200).send(
      JSON.stringify({
        success: true,
        pets: returningResults,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(404).send(
      JSON.stringify({
        success: false,
        errorMessage: "Nem találtunk megfelelő adatot",
      })
    );
    return;
  }
});

// DELETE-------------------------------------------------------------------------------
app.delete("/pets", async (req, res) => {
  try {
    const body = await req.body;
    const idToDelete = body.id;
    const petsRead = fs.readFileSync(
      `${__dirname}/db/pets.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Sikertelen törlés");
          return;
        }
      }
    );

    const petsResult = JSON.parse(petsRead);
    const newPets = petsResult.filter((pet) => pet.id !== idToDelete);
    //console.log({idToDelete, newPets, petsResult})
    const formatedPets = JSON.stringify(newPets);
    //console.log(formatedPets)

    const petsWrite = fs.writeFileSync(
      `${__dirname}/db/pets.json`,
      formatedPets,
      "utf-8"
    );

    console.log("Sikeres írás");

    res.status(200).send(
      JSON.stringify({
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      JSON.stringify({
        success: false,
        errorMessage: "Sikertelen művelet",
      })
    );
    return;
  }
});
// UPDATE-------------------------------------------------------------------------------
// PUT
// beolvassuk az összes állatos dolgot
// x PUT
// x beolvassuk az összes állatos dolgot x
// kiveszük a jelenleg bent lévő adatokat az adott állatra
// bejövő adatok után módosítjuk a kivett adatot
// és vissza írjuk ( .splice() )
// kézzel: név, faj
// listából: treatment

app.put("/pets", async (req, res) => {
  try {
    const petsRead = fs.readFileSync(
      `${__dirname}/db/pets.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );
    const customersRead = fs.readFileSync(
      `${__dirname}/db/customers.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );

    const registriesRead = fs.readFileSync(
      `${__dirname}/db/registry.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );

    const customersResult = JSON.parse(customersRead);
    const registriesResult = JSON.parse(registriesRead);
    const petsResult = JSON.parse(petsRead);

    const body = await req.body;
    const { id, name, species, owners, treatments } = body.pet;
    /*
    const id = body.pet.id
    const name = ...
    */

    console.log({ id, name, species, owners, treatments });
    const newPet = {
      id: id,
      name: name,
      species: species,
    };
    const petDbIndex = petsResult.findIndex((dbPet) => dbPet.id === newPet.id);
    const petsToWrite = petsResult.map((dbPet) => {
      if (dbPet.id === newPet.id) {
        return newPet;
      } else {
        return dbPet;
      }
    });

    fs.writeFileSync(
      `${__dirname}/db/pets.json`,
      JSON.stringify(petsToWrite),
      "utf-8"
    );

    const newRegistry = {
      customer_id: owners[0].id,
      pet_id: id,
    };
    console.log(newRegistry);
    const customerDbIndex = registriesResult.findIndex(
      (dbRegistry) => dbRegistry.pet_id === newRegistry.pet_id
    );
    const registriesToWrite = registriesResult.map((dbRegistry) => {
      if (dbRegistry.pet_id === newRegistry.pet_id) {
        return newRegistry;
      } else {
        return dbRegistry;
      }
    });
    const registriesWrite = fs.writeFileSync(
      `${__dirname}/db/registry.json`,
      JSON.stringify(registriesToWrite),
      "utf-8"
    );

    // for (let i = 0; i < petToUpdate.owners.length; i++) {
    //   const customer = customersResult.filter(
    //     (customer) => customer.id == petToUpdate.owners[i].id
    //   );
    //   const newCustomer = {
    //     id: petToUpdate.owners[i].id,
    //     name: petToUpdate.owners[i].name,
    //     email: petToUpdate.owners[i].email,
    //   };
    //   customer.splice(0, 1, newCustomer);
    //   console.log(customer);
    // }
    // console.log(pet);

    // console.log(petToUpdate);

    res.status(200).send(
      JSON.stringify({
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      JSON.stringify({
        success: false,
        errorMessage: "Sikertelen művelet",
      })
    );
    return;
  }
});

// CREATE----------------------------------------------------------------------------------------
app.post("/pets", urlEncodedParser, (req, res) => {
  // kiolvassuk a name és species paraméreket a kérésből, ha nem létezik
  // 400 hibát küldünk vissza
  console.log({ pets: req.body });
  if (req.body.name === undefined || req.body.species === undefined) {
    res.sendStatus(400); // mivel valamely vagy mindkét paraméter hiányzik
    return;
  }

  const newPets = {
    id: "",
    name: req.body.name,
    species: req.body.species,
  };

  const newTreatments = {
    id: "",
    name: req.body.type,
  };

  //forPets
  fs.readFile(`${__dirname}/db/pets.json`, "utf-8", (err, content) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const array = JSON.parse(content);
    if (array.length === 0) {
      newPets.id = 1;
    } else {
      let max = array[0].id;
      for (let i = 1; i < array.length; i++) {
        if (array[i].id > max) {
          max = array[i].id;
        }
      }
      newPets.id = max + 1;
    }

    array.push(newPets);
    fs.writeFile(
      `${__dirname}/db/pets.json`,
      JSON.stringify(array),
      "utf-8",
      (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }

        res.redirect("http://localhost:3000");
      }
    );
  });
});

/////////////////////////////////////////////////
/////////////////// CUSTOMERS ///////////////////
///////////////// GET CUSTOMERS /////////////////
app.get("/customers", (req, res) => {
  //res.header({'Content-Type': 'application/json'})
  try {
    const customersRead = fs.readFileSync(
      `${__dirname}/db/customers.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );
    const customersResult = JSON.parse(customersRead);

    res.status(200).send(
      JSON.stringify({
        success: true,
        customers: customersResult,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      JSON.stringify({
        success: false,
        errorMessage: "Sikertelen művelet",
      })
    );
    return;
  }
});

////////////////// GET CUSTOMERS /////////////////
//////////////////////////////////////////////////
//////////////// DELETE CUSTOMERS ////////////////

app.delete("/customers", async (req, res) => {
  try {
    const body = await req.body;
    const idToDelete = body.id;
    const customersRead = fs.readFileSync(
      `${__dirname}/db/customers.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Sikertelen törlés");
          return;
        }
      }
    );

    const customersResult = JSON.parse(customersRead);
    const newPets = customersResult.filter((pet) => pet.id !== idToDelete);
    //console.log({idToDelete, newPets, customersResult})
    const formatedPets = JSON.stringify(newPets);
    //console.log(formatedPets)

    const customersWrite = fs.writeFileSync(
      `${__dirname}/db/customers.json`,
      formatedPets,
      "utf-8"
    );

    console.log("Sikeres írás");

    res.status(200).send(
      JSON.stringify({
        success: true,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      JSON.stringify({
        success: false,
        errorMessage: "Sikertelen művelet",
      })
    );
    return;
  }
});
//////////////// DELETE CUSTOMERS ////////////////
//////////////////////////////////////////////////
///////////////// PUT CUSTOMERS //////////////////
app.put("/customers", async (req, res) => {
  try {
    const customersRead = fs.readFileSync(
      `${__dirname}/db/customers.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );

    const registriesRead = fs.readFileSync(
      `${__dirname}/db/registry.json`,
      "utf-8",
      (err, content) => {
        if (err) {
          throw new Error("Nagy a baj");
          return;
        }
      }
    );

    const customersResult = JSON.parse(customersRead);
    const registriesResult = JSON.parse(registriesRead);

    const body = await req.body;
    //console.log(body);
    const { id, name, email } = body.customer;
    //console.log(id, name, email);
    const newCustomer = {
      id: id,
      name: name,
      email: email,
    };

    const customerDbIndex = customersResult.findIndex(
      (dbCustomer) => dbCustomer.id === newCustomer.id
    );
    const customersToWrite = customersResult.map((dbCustomer) => {
      if (dbCustomer.id === newCustomer.id) {
        return newCustomer;
      } else {
        return dbCustomer;
      }
    });

    fs.writeFileSync(
      `${__dirname}/db/customers.json`,
      JSON.stringify(customersToWrite),
      "utf-8"
    );
  } catch (error) {
    console.log(error);
    res.status(500).send(
      JSON.stringify({
        success: false,
        errorMessage: "Sikertelen művelet",
      })
    );
    return;
  }
});

///////////////// PUT CUSTOMERS //////////////////
//////////////////////////////////////////////////
///////////////// POST CUSTOMERS /////////////////

app.post("/customers", urlEncodedParser, (req, res) => {
  console.log({ customers: req.body });
  const newCustomer = {
    id: "",
    name: req.body.name,
    email: req.body.email,
  };
  //forCustomers
  fs.readFile(`${__dirname}/db/customers.json`, "utf-8", (err, content) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const array = JSON.parse(content);
    if (array.length === 0) {
      newCustomer.id = 1;
    } else {
      let max = array[0].id;
      for (let i = 1; i < array.length; i++) {
        if (array[i].id > max) {
          max = array[i].id;
        }
      }
      newCustomer.id = max + 1;
    }

    array.push(newCustomer);
    fs.writeFile(
      `${__dirname}/db/customers.json`,
      JSON.stringify(array),
      "utf-8",
      (err) => {
        if (err) {
          res.sendStatus(500);
          return;
        }
        //res.sendStatus(201);
        res.redirect("http://localhost:3000");
      }
    );
  });
});
///////////////// POST CUSTOMERS /////////////////
/////////////////// CUSTOMERS ////////////////////
//////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
