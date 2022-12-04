import { useState, useEffect, useCallback } from "react";
import callBackend from "./callBackend";

export default function Customers({ errorMessage, setErrorMessage }) {
  //jelenlegi választott állat
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [displayedCustomers, setDisplayedCustomers] = useState([]);

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
  const deleteCustomer = useCallback(
    async (id) => {
      const idToDelete = id;
      const body = JSON.stringify({
        id: idToDelete,
      });
      const deleteCustomerResult = await callBackend(
        "http://localhost:8000/customers",
        "DELETE",
        body
      );
      if (!deleteCustomerResult?.success) {
        setErrorMessage(deleteCustomerResult?.errorMessage || "Szerver hiba");
        return;
      }
      if (deleteCustomerResult?.success) {
        const newDisplayedCustomers = displayedCustomers.filter(
          (customer) => idToDelete !== customer.id
        );
        setDisplayedCustomers(newDisplayedCustomers);
        setCurrentCustomer(null);
      }
    },
    [displayedCustomers, setErrorMessage]
  );

  //UPDATE
  const updateCustomer = useCallback(
    async (modifiedCustomer) => {
      const customerToUpdate = modifiedCustomer;
      const body = JSON.stringify({
        customer: customerToUpdate,
      });
      const updateCustomerResult = await callBackend(
        "http://localhost:8000/customers",
        "PUT",
        body
      );
      if (!updateCustomerResult?.success) {
        setErrorMessage(updateCustomerResult?.errorMessage || "Szerver hiba");
        return;
      }
    },
    [setErrorMessage]
  );
  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <>
      <h1 style={{ textAlign: "center" }} className="mt-5">
        Vendégek
      </h1>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8 mt-2 mb-2">
          <br />
          <div style={{ textAlign: "center" }}>
            <form action="http://localhost:8000/customers" method="POST">
              <div className="row">
                <div className="col-md-5">
                  <h6>Név: </h6>
                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    name="name"
                    placeholder="Vezetéknév Kersztnév"
                  ></input>
                </div>

                <div className="col-md-5">
                  <h6>E-mail: </h6>
                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    name="email"
                    placeholder="example@example.org"
                  ></input>
                </div>

                <div className="col-md-2 mt-3">
                  <button className="btn btn-success m-2" type="submit">
                    +Létrehoz
                  </button>
                </div>
              </div>
            </form>
          </div>

          <hr className="mb-4" />
        </div>
        <div className="col-md-1"></div>
      </div>

      <div className="row">
        <div className="col-md-7">
          {displayedCustomers && displayedCustomers.length
            ? displayedCustomers.map((customer) => (
                <div key={Math.random()}>
                  <button
                    className="btn btn-sm btn-outline-dark m-1 me-3 "
                    onClick={() => {
                      setCurrentCustomer(customer);
                    }}
                  >
                    Megtekint
                  </button>
                  <span>{customer.name}</span> - <span>{customer.email}</span>
                </div>
              ))
            : null}
        </div>

        {currentCustomer?.id && displayedCustomers?.length ? (
          <form className="col-md-4">
            <div>
              <div className="mt-4">
                <div className="row">
                  <div className="col-md-2">
                    <h6 className="mt-3 strong">Név: </h6>
                  </div>
                  <div className="col-md-10">
                    <input
                      style={{ textAlign: "center" }}
                      className="form-control m-1"
                      value={currentCustomer.name}
                      name="name"
                      onChange={(e) => {
                        //object shallow copy + property overwrite
                        const newCustomer = {
                          ...currentCustomer,
                          name: e.target.value,
                        };
                        setCurrentCustomer(newCustomer);
                      }}
                    ></input>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-md-2">
                    <h6 className="mt-3 strong">Email: </h6>
                  </div>
                  <div className="col-md-10">
                    <input
                      style={{ textAlign: "center" }}
                      className="form-control m-1"
                      value={currentCustomer.email}
                      name="email"
                      onChange={(e) => {
                        //object shallow copy + property overwrite
                        const newCustomer = {
                          ...currentCustomer,
                          email: e.target.value,
                        };
                        setCurrentCustomer(newCustomer);
                      }}
                    ></input>
                  </div>
                </div>

                <br />

                <div style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-primary m-1"
                    disabled={
                      currentCustomer?.id === null ||
                      currentCustomer?.id === undefined
                    }
                    type="button"
                    onClick={() => {
                      updateCustomer(currentCustomer);
                      getCustomers();
                    }}
                  >
                    Módosít
                  </button>
                  <button
                    className="btn btn-danger m-1"
                    disabled={
                      currentCustomer?.id === null ||
                      currentCustomer?.id === undefined
                    }
                    type="button"
                    onClick={() => {
                      deleteCustomer(currentCustomer?.id);
                    }}
                  >
                    Töröl
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <p>{""}</p>
        )}
      </div>
    </>
  );
}
