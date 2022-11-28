import './App.css';
import {useState, useEffect, useCallback} from 'react';
import Customers from './Customers';
import Pets from './Pets';
import Treatments from './Treatments';
import callBackend from './callBackend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
const [renderedWindow, setRenderedWindow] = useState("home");
const [errorMessage, setErrorMessage] = useState("");
const [displayedCustomers, setDisplayedCustomers] = useState([]);
const [displayedTreatments, setDisplayedTreatments] = useState([]);


const notify = useCallback(() => toast(errorMessage), [errorMessage]);

useEffect(()=>{
  if(errorMessage){
    notify()
  }
},[errorMessage, notify])

  return (
    <div className="App">
      <nav>


        <button disabled onClick={async ()=>{
          setRenderedWindow("customers")
          const getCustomersResult = await callBackend("http://localhost:8000/customers", "GET")
          if(!getCustomersResult?.success){
            setErrorMessage(getCustomersResult?.errorMessage || "Szerver hiba")
            return
          }
          
          setDisplayedCustomers(getCustomersResult.customers)
          
        }}>Vendégek</button>

        
        <button onClick={async ()=>{
          setRenderedWindow("pets")
        }}>Állatok</button>



        <button disabled onClick={async ()=>{
          setRenderedWindow("treatments")
          const getTreatmentsResult = await callBackend("http://localhost:8000/treatments", "GET")
          if(!getTreatmentsResult?.success){
            setErrorMessage(getTreatmentsResult?.errorMessage || "Szerver hiba")
            return
          }
          setDisplayedTreatments(getTreatmentsResult.treatments)
        }}>Kezelések</button>

        <button onClick={()=>{
          setRenderedWindow("home")
        }}>🏘️</button>

      </nav>
      <section>
        {
          renderedWindow === "customers" ? <Customers displayedCustomers={displayedCustomers} setDisplayedCustomers={setDisplayedCustomers}/> :
          renderedWindow === "pets" ? <Pets errorMessage={errorMessage} setErrorMessage={setErrorMessage}/> :
          renderedWindow === "treatments" ? <Treatments displayedTreatments={displayedTreatments} setDisplayedTreatments={setDisplayedTreatments}/> :
          renderedWindow === "home" ? <h1>Üdvözöljük klinikánk honlapján!</h1> : null
        }
      </section>
      <ToastContainer />
    </div>
  );
}

export default App;
