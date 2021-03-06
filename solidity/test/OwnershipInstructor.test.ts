// import {expect,use,assert} from 'chai';
import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { ERC721OwnershipInstructorInstance,ClassicERC721Instance,ERC1155OwnershipInstructorInstance,ClassicERC1155Instance } from '../types/truffle-contracts';


const ERC721OwnershipInstructor = artifacts.require("ERC721OwnershipInstructor")
const ERC1155OwnershipInstructor = artifacts.require("ERC1155OwnershipInstructor")
const ClassicERC721 = artifacts.require("ClassicERC721")
const ClassicERC1155 = artifacts.require("ClassicERC1155")
const {
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,         // Time manipulation
} = require('@openzeppelin/test-helpers');

//@ts-ignore
const web3Provider = new providers.Web3Provider(web3.currentProvider);

contract("ERC721OwnershipInstructor - Unit test",async function (accounts) {
  
  const signer = web3Provider.getSigner(accounts[1]);
  const [wallet,walletTo,walletThree] = accounts
  let instructor:ERC721OwnershipInstructorInstance
  let classicERC721: ClassicERC721Instance

  before(async ()=>{
    instructor = await ERC721OwnershipInstructor.new()
    classicERC721 = await ClassicERC721.new()
    await classicERC721.mint(1);
  })
  
  it('wallet has one mint of ERC721', async () => {
    expect((await classicERC721.balanceOf(wallet)).toNumber()).to.be.equal(1);
  });

  it('check ownerof token id 1 - via ERC721', async () => {
    expect(await classicERC721.ownerOf(1)).to.be.equal(wallet);
  });

  it('OwnershipInstructor: Check validInterface', async () => {
    expect(await instructor.isValidInterface(classicERC721.address)).to.be.true;
  });

  it('check ownerof token id 1 - via OwnershipInstructor', async () => {
    expect(await instructor.ownerOfTokenOnImplementation(classicERC721.address,1,wallet)).to.be.equal(wallet);
  });

})


contract("ERC1155OwnershipInstructor - Unit test",async function (accounts) {
  
  const signer = web3Provider.getSigner(accounts[1]);
  const [wallet,walletTo,walletThree] = accounts
  let instructor:ERC1155OwnershipInstructorInstance
  let classicERC1155: ClassicERC1155Instance

  before(async ()=>{
    instructor = await ERC1155OwnershipInstructor.new()
    classicERC1155 = await ClassicERC1155.new()
    await classicERC1155.mint(1);
  })
  
  it('wallet has one mint of ERC1155', async () => {
    expect((await classicERC1155.balanceOf(wallet,1)).toNumber()).to.be.equal(1);
  });

  it('OwnershipInstructor: Check validInterface', async () => {
    expect(await instructor.isValidInterface(classicERC1155.address)).to.be.true;
  });

  it('check ownerof token id 1 - via OwnershipInstructor', async () => {
    expect(await instructor.ownerOfTokenOnImplementation(classicERC1155.address,1,wallet)).to.be.equal(wallet);
  });

})
