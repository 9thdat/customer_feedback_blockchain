// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "hardhat/console.sol";

contract Floopy is
ERC20("Floopy", "FLP"),
ERC20Burnable,
Ownable
{
    struct Feedback {
        string name;
        string email;
        string message;
    }

    Feedback[] public feedbacks;

    uint256 public cap = 50_000_000_000 * 10 ** uint256(18);

    constructor(){
        console.log("owner: %s maxcap: %s", msg.sender, cap);
        _mint(msg.sender, cap);
        transferOwnership(msg.sender);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(
            ERC20.totalSupply() + amount <= cap,
            "Floppy: cap exceeded"
        );
        _mint(to, amount);
    }

    // Function to submit feedback
    function submitFeedback(string memory _name, string memory _email, string memory _message) public {
        Feedback memory newFeedback = Feedback({
            name: _name,
            email: _email,
            message: _message
        });

        feedbacks.push(newFeedback);
    }

    // Function to get feedback at a specific index
    function getFeedback(uint256 index) public view returns (string memory name, string memory email, string memory message) {
        require(index < feedbacks.length, "Index out of bounds");
        Feedback storage feedback = feedbacks[index];
        return (feedback.name, feedback.email, feedback.message);
    }

    function getAllFeedback() public view returns (Feedback[] memory) {
        return feedbacks;
    }
}
