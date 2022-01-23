import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import POTI from './artifacts/contracts/POTI.sol/PeopleOfTheInternet.json'
import { getAccountPath } from 'ethers/lib/utils';
import { Web3Provider } from '@ethersproject/providers';

// Store contract within just a variable
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// contract address
const potiAddress = "0x18229eBb33981b2659a9ee679013B89469563FB7";

function App() {

  // set state - “array destructuring”. 
  const [greeting, setGreetingValue] = useState(""); // Declare a new state variable, which we'll call "greeting"
  const [index, setOwnerIndex] = useState(""); // Declare a new state variable, which we'll call "greeting"

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

  // Minting my NFT
  async function mintNFT(){
    if(typeof window.ethereum !== 'undefined'){
      // wait for user to enable account to be used and connect wallet
      await requestAccount(); // giving access to wallet
      // create a new provider - A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const gasPrice = await provider.getGasPrice();
      // sign transaction using a signer, cause we will create an update in the blockchain
      const signer = provider.getSigner();
      // await signer.sendTransaction({
      //   to: potiAddress,
      //   value: ethers.utils.parseEther("0.01"),
      // });
      const contract = new ethers.Contract(potiAddress, POTI.abi, signer);
      //now we can create the transaction ( writing )
      const transaction = await contract.safeMint(window.ethereum.selectedAddress, "https://ipfs.io/ipfs/QmVfcWV7fPVs5WaY2PpuXDnFcD9ZrmyFk7k5izAzusH5jH", {value: ethers.utils.parseEther("0.01"), gasPrice: ethers.utils.parseUnits('100', 'gwei'), gasLimit: 1000000}); // safe mint to this address
      // wait for the transaction to be confirmed in the blockchain ( in production environment in takes longer )
      await transaction.wait();

    }
  }

  async function ownerOf(){
    // if metamask extension is connected (metamask connection ejects window.ethereum into the object)
    if(typeof window.ethereum !== 'undefined'){
      // create a new provider - A Provider is an abstraction of a connection to the Ethereum network, providing a concise, consistent interface to standard Ethereum node functionality.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // create instance of the contract
      const contract = new ethers.Contract(potiAddress, POTI.abi, provider); // smart contract address, info and use the layer to talk

      console.log(contract)

      try{
        // use the contract data here
        const data = await contract.ownerOf(index);
        console.log('data: ', data);
      }catch(err){
        console.log("Error: ", err)
      }
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}> Fetch Greeting</button>
        <button onClick={setGreeting}> Set Greeting</button>
        <button onClick={mintNFT}> Mint</button>
        <button onClick={ownerOf}> Owner off</button>

        <input
          onChange={ e => setGreetingValue(e.target.value)}
          placeholder='Set greeting'
          value={greeting}
        />

      <input
          onChange={ e => setOwnerIndex(e.target.value)}
          placeholder='Set owner index'
          value={index}
        />
      </header>
    </div>
  );
}

export default App;
