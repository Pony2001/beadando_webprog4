import './App.css';
import {useState, useEffect, useCallback} from 'react';
import Customers from './Customers';
import Pets from './Pets';
import Treatments from './Treatments';
import callBackend from './callBackend';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

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
    <>
    
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
      integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
      crossOrigin="*"
    />
    <div className="container">
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>

        <button 
          className='btn btn-default'
          onClick={()=>{
            setRenderedWindow("home")
        }}>🏘️ Főoldal</button>

        <button 
          className='btn btn-default'
          disabled 
          onClick={async ()=>{
            setRenderedWindow("customers")
            const getCustomersResult = await callBackend("http://localhost:8000/customers", "GET")
            if(!getCustomersResult?.success){
              setErrorMessage(getCustomersResult?.errorMessage || "Szerver hiba")
              return
            }
            
            setDisplayedCustomers(getCustomersResult.customers)
          
        }}>Vendégek</button>

        
        <button 
        className='btn btn-default'
        onClick={()=>{
          setRenderedWindow("pets")
        }}>Állatok</button>



        <button 
        className='btn btn-default'
        disabled 
        onClick={async ()=>{
          setRenderedWindow("treatments")
          const getTreatmentsResult = await callBackend("http://localhost:8000/treatments", "GET")
          if(!getTreatmentsResult?.success){
            setErrorMessage(getTreatmentsResult?.errorMessage || "Szerver hiba")
            return
          }
          setDisplayedTreatments(getTreatmentsResult.treatments)
        }}>Kezelések</button>

      </nav>
      <section>
        <div className='row'>
          {
            renderedWindow === "customers" ? <Customers displayedCustomers={displayedCustomers} setDisplayedCustomers={setDisplayedCustomers}/> :
            renderedWindow === "pets" ? <Pets errorMessage={errorMessage} setErrorMessage={setErrorMessage}/> :
            renderedWindow === "treatments" ? <Treatments displayedTreatments={displayedTreatments} setDisplayedTreatments={setDisplayedTreatments}/> :
            renderedWindow === "home" ? <h1>Üdvözöljük klinikánk honlapján!</h1> : null
          }
        </div>
      </section>
      <ToastContainer />
    </div>
    </>
  );
}

export default App;
