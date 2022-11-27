import {useState} from 'react'

export default function Customers({displayedCustomers, setDisplayedCustomers}){

   //jelenlegi választott állat
   const [currentCustomer, setCurrentCustomer]=useState(null)


   return(
   <>
      <h1>Customers!</h1>
      {displayedCustomers.map(customer => <div style= {{
display: "flex",
gap: "10px"
      }} key={Math.random()}><p>{customer.name}</p> <p>{customer.email}</p></div>)}

   </>)
}