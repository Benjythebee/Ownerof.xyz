// import {expect,use,assert} from 'chai';
import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { OwnershipInstructorRegisterV1Instance,ERC721OwnershipInstructorInstance,ClassicERC721Instance } from '../types/truffle-contracts';

const OwnershipInstructorRegisterV1 = artifacts.require("OwnershipInstructorRegisterV1")
const ERC721OwnershipInstructor = artifacts.require("ERC721OwnershipInstructor")
const ClassicERC721 = artifacts.require("ClassicERC721")
const {
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,         // Time manipulation
} = require('@openzeppelin/test-helpers');

//@ts-ignore
const web3Provider = new providers.Web3Provider(web3.currentProvider);

contract("OwnershipInstructorRegisterV1 - Unit test",async function (accounts) {
  
  const signer = web3Provider.getSigner(accounts[1]);
  const [wallet,walletTo,walletThree] = accounts
  let register:OwnershipInstructorRegisterV1Instance
  let instructor:ERC721OwnershipInstructorInstance
  let classicERC721: ClassicERC721Instance

  before(async ()=>{
    instructor = await ERC721OwnershipInstructor.new()
    classicERC721 = await ClassicERC721.new()
    await classicERC721.mint(1);
  })

  beforeEach(async ()=>{
    register = await OwnershipInstructorRegisterV1.new()
  })
  
  it('owner of contract is wallet', async () => {
    assert.equal(await register.owner(),wallet);
  });

  it('Instructor for ERC721 not set', async () => {
    await expectRevert(register.getInstructorByName('ERC721'),"Name does not exist")
  });

  it('set Instructor ERC721', async () => {
    await register.addInstructor(instructor.address,'ERC721');
    const p = await register.getInstructorByName('ERC721')
    expect(p._impl).to.be.equal(instructor.address)
    expect(p._name).to.be.equal('ERC721')
  });

})

