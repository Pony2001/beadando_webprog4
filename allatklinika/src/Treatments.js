import { useState, useEffect, useCallback } from "react";
import callBackend from "./callBackend";

export default function Treatments({ errorMessage, setErrorMessage }) {
  //jelenlegi választott állat
  const [currentTreatment, setCurrentTreatment] = useState(null);
  const [displayedTreatments, setDisplayedTreatments] = useState([]);

  //GET
  const getTreatments = useCallback(async () => {
    const getTreatmentsResult = await callBackend(
      "http://localhost:8000/treatments",
      "GET"
    );
    if (!getTreatmentsResult?.success) {
      setErrorMessage(getTreatmentsResult?.errorMessage || "Szerver hiba");
      return;
    }
    if (getTreatmentsResult?.treatments) {
      setDisplayedTreatments(getTreatmentsResult.treatments);
    }
  }, [setErrorMessage]);

  //DELETE
  const deleteTreatment = useCallback(
    async (id) => {
      const idToDelete = id;
      const body = JSON.stringify({
        id: idToDelete,
      });
      const deleteTreatmentResult = await callBackend(
        "http://localhost:8000/treatments",
        "DELETE",
        body
      );
      if (!deleteTreatmentResult?.success) {
        setErrorMessage(deleteTreatmentResult?.errorMessage || "Szerver hiba");
        return;
      }
      if (deleteTreatmentResult?.success) {
        const newDisplayedTreatments = displayedTreatments.filter(
          (treatment) => idToDelete !== treatment.id
        );
        setDisplayedTreatments(newDisplayedTreatments);
        setCurrentTreatment(null);
      }
    },
    [displayedTreatments, setErrorMessage]
  );

  //UPDATE
  const updateTreatment = useCallback(
    async (modifiedTreatment) => {
      const treatmentToUpdate = modifiedTreatment;
      const body = JSON.stringify({
        treatment: treatmentToUpdate,
      });
      const updateTreatmentResult = await callBackend(
        "http://localhost:8000/treatments",
        "PUT",
        body
      );
      if (!updateTreatmentResult?.success) {
        setErrorMessage(updateTreatmentResult?.errorMessage || "Szerver hiba");
        return;
      }
    },
    [setErrorMessage]
  );
  useEffect(() => {
    getTreatments();
  }, [getTreatments]);

  return (
    <>
      <h1 style={{ textAlign: "center" }} className="mt-5">
        Kezelések
      </h1>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8 mt-2 mb-2">
          <br />
          <div style={{ textAlign: "center" }}>
            <form action="http://localhost:8000/treatments" method="POST">
              <div className="row">
                <div className="col-md-10">
                  <h6>Kezelés neve: </h6>
                  <input
                    style={{ textAlign: "center" }}
                    className="form-control m-1"
                    name="type"
                    placeholder="Oltás"
                  ></input>
                </div>

                <div className="col-md-2 mt-3">
                  <button className="btn btn-success m-2" type="submit">
                    +Létrehoz
                  </button>
                </div>
              </div>
            </form>
            <div>
              {currentTreatment?.id && displayedTreatments?.length ? (
                <form>
                  <div className="mt-4">
                    <div className="row">
                      <div className="col-md-9">
                        <div style={{ textAlign: "center" }}>
                          <h6 className="mt-3 strong">Kezelés neve: </h6>
                        </div>
                        <input
                          style={{ textAlign: "center" }}
                          className="form-control m-1"
                          value={currentTreatment.type}
                          name="type"
                          onChange={(e) => {
                            //object shallow copy + property overwrite
                            const newTreatment = {
                              ...currentTreatment,
                              type: e.target.value,
                            };
                            setCurrentTreatment(newTreatment);
                          }}
                        ></input>
                      </div>

                      <div className="col-md-3 mt-4">
                        <button
                          className="btn btn-primary m-1 float-left"
                          disabled={
                            currentTreatment?.id === null ||
                            currentTreatment?.id === undefined
                          }
                          type="button"
                          onClick={() => {
                            updateTreatment(currentTreatment);
                            getTreatments();
                          }}
                        >
                          Módosít
                        </button>
                        <button
                          className="btn btn-danger m-1 float-left"
                          disabled={
                            currentTreatment?.id === null ||
                            currentTreatment?.id === undefined
                          }
                          type="button"
                          onClick={() => {
                            deleteTreatment(currentTreatment?.id);
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
          </div>

          <hr className="mb-4" />
        </div>
        <div className="col-md-1"></div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div className="col-md-12">
          {displayedTreatments && displayedTreatments.length
            ? displayedTreatments.map((treatment) => (
                <button
                  style={{ minWidth: "7%" }}
                  className="btn btn-outline-dark m-1 float-left"
                  onClick={() => {
                    setCurrentTreatment(treatment);
                  }}
                >
                  {treatment.type}
                </button>
              ))
            : null}
        </div>
      </div>
    </>
  );
}
