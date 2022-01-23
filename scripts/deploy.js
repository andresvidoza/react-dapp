const hre = require("hardhat");

async function main() {
  // // reference to the contract we want to deploy
  // const Greeter = await hre.ethers.getContractFactory("Greeter");
  // // pass the constructor text we want to pass in
  // const greeter = await Greeter.deploy("Hello, Hardhat!");

  // // wait for this to actually be deployed
  // await greeter.deployed();

  // // console log it, and the actual address we will be deploying too. 
  // console.log("Greeter deployed to:", greeter.address);

  //Contract Deployment for erc721
  const POTI = await hre.ethers.getContractFactory("PeopleOfTheInternet");
  const poti = await POTI.deploy();
  await poti.deployed();
  console.log("People of the Internet deployed to:", poti.address);
}

// treat your promise
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
