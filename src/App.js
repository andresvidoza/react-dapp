import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Store contract within just a variable
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {

  // set state - “array destructuring”. 
  const [greeting, setGreetingValue] = useState(""); // Declare a new state variable, which we'll call "greeting"

  // connect to metamask wallet of user
  async function requestAccount(){
    // prompt user to connect one of their metamask account
    await window.ethereum.request({ method: 'eth_requestAccounts'});
  }

  // attach this to button to submit
  async function fetchGreeting(){
    // if metamask extension is connected (metamask connection ejects window.ethereum into the object)
    if(typeof window.ethereum !== 'undefined'){
      // create a new provider - A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // create instance of the contract
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider); // smart contract address, info and use the layer to talk

      try{
        // use the contract data here
        const data = await contract.greet();
        console.log('data: ', data);
      }catch(err){
        console.log("Error: ", err)
      }
    }

  }

  // we will pay some gas transaction to perform this operation
  async function setGreeting(){
    if (!greeting) return // make sure they typed a greeting
    // if metamask extension is connected (metamask connection ejects window.ethereum into the object)
    if(typeof window.ethereum !== 'undefined'){
      // wait for user to enable account to be used and connect wallet
      await requestAccount();
      // create a new provider - A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // sign transaction using a signer, cause we will create an update in the blockchain
      const signer = provider.getSigner();
      // get instance but we use the signer cause we will write on it
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      // now we can create the transaction ( writing )
      const transaction = await contract.setGreeting(greeting); // what ever user types into the form
      // reset greeting
      setGreetingValue('');
      // wait for the transaction to be confirmed in the blockchain ( in production environment in takes longer )
      await transaction.wait();
      // log out the new value to make sure it worked
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}> Fetch Greeting</button>
        <button onClick={setGreeting}> Set Greeting</button>
        <input
          onChange={ e => setGreetingValue(e.target.value)}
          placeholder='Set greeting'
          value={greeting}
        />
      </header>
    </div>
  );
}

export default App;
