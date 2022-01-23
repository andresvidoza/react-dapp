//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract Greeter {
    string private greeting;

    // init function of smart contract
    constructor(string memory _greeting) {
        console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    // return the greeting string | public - read from outside | view - only reading from blockchain (not modifying states)
    function greet() public view returns (string memory) {
        return greeting;
    }

    // this sets the greeting | for you to write to the blockchain you need to pay gas for this transaction to be written
    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
