# Ownership Checker of NFTs
## Standardizing ownerOf? Why?

<p>Noawadays, we thankfully have ethereum standards. For example <a href="https://eips.ethereum.org/EIPS/eip-721">EIP721</a>, <a href="https://eips.ethereum.org/EIPS/eip-1155">EIP1155</a> and more.</p>
<p>These, on top of <a href="https://eips.ethereum.org/EIPS/eip-165">EIP165</a> make checking the standard of a given smart contract easier.
<br /> However, this completely ignores previous NFT projects that were born prior to 2018 (for example Cryptokitties).<br/>
    This means that now, to know who owns a given NFT, one has to check for the standard of a smart contract, and then has to call different functions depending on those standards <b>IF</b> that contract supports the ERC721 interface or the ERC1155 interface.<br />
    If the contract doesn't support those, a manual process begins where the front-end has to iterate through some specific interfaces and call non-standard methods.<br/>
    All of that to know who owns a given NFT.
</p>

<strong>Goal:</strong> Know the owner of an NFT in one single call.

<b>Behind the box:</b>
![diagram (3)](https://user-images.githubusercontent.com/38708022/169896291-fc63b6bf-a7e4-4850-bfd4-6db101f552c3.png)

# Supported Conctracts:
https://github.com/Benjythebee/OwnershipChecker/blob/master/solidity/readme.md

To add a supported contract, create an issue or a pull request!


List of currently supported chains:
<ul>
    <li>Polygon</li>
    <li>Ethereum</li>
</ul>
List of currently supported Contracts:
<ul>
    <li>any ERC1155</li>
    <li>any ERC721</li>
    <li>Cryptopunk on Ethereum</li>
</ul>

<b>Todo:</b>
<ul>
    <li>More contracts to be supported</li>
    <li>create ownerOf for ERC20;</li>
</ul>


# Contributing;

1. Clone the repo

2. Make a branch and make changes;

3. Make a pull request.
