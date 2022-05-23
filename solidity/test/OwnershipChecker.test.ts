// import {expect,use,assert} from 'chai';
import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { OwnershipInstructorRegisterV1Instance,
  ERC721OwnershipInstructorInstance,
  ERC1155OwnershipInstructorInstance,
  ClassicERC721Instance,ClassicERC1155Instance,OwnershipCheckerV1Instance } from '../types/truffle-contracts';

const OwnershipInstructorRegisterV1 = artifacts.require("OwnershipInstructorRegisterV1")
const ERC721OwnershipInstructor = artifacts.require("ERC721OwnershipInstructor")
const ERC1155OwnershipInstructor = artifacts.require("ERC1155OwnershipInstructor")
const ClassicERC721 = artifacts.require("ClassicERC721")
const ClassicERC1155 = artifacts.require("ClassicERC1155")
const OwnershipCheckerV1 = artifacts.require("OwnershipCheckerV1")
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
  let ERC721instructor:ERC721OwnershipInstructorInstance
  let ERC1155instructor:ERC1155OwnershipInstructorInstance
  let classicERC721: ClassicERC721Instance
  let classicERC1155: ClassicERC1155Instance
  let ownershipChecker:OwnershipCheckerV1Instance

  before(async ()=>{
    ERC721instructor = await ERC721OwnershipInstructor.new()
    classicERC721 = await ClassicERC721.new()
    await classicERC721.mint(1);

    ERC1155instructor = await ERC1155OwnershipInstructor.new()
    classicERC1155 = await ClassicERC1155.new()
    await classicERC1155.mint(1);

    register = await OwnershipInstructorRegisterV1.new()
    ownershipChecker= await OwnershipCheckerV1.new(register.address)
  })

  it('set Instructor ERC721', async () => {
    await register.addInstructor(ERC721instructor.address,'ERC721');
    const p = await register.getInstructorByName('ERC721')
    expect(p._impl).to.be.equal(ERC721instructor.address)
    expect(p._name).to.be.equal('ERC721')
  });

  it('Check ownership: via ERC721', async () => {
    expect(await classicERC721.ownerOf(1)).to.be.equal(wallet);
  });

  it('Check ownership: via OwnershipInstructor', async () => {
    expect(await ERC721instructor.ownerOfTokenOnImplementation(classicERC721.address,1,wallet)).to.be.equal(wallet);
  });

  it('Check ownership: via OwnershipChecker', async () => {
    // should be slow
    expect(await ownershipChecker.ownerOfTokenAt(classicERC721.address,1,wallet)).to.be.equal(wallet);
  });

  it('register set implementation for erc721', async () => {
    await register.linkImplementationToInstructor(classicERC721.address,'ERC721');
    const list = await register.getImplementationsOf('ERC721',0)
    expect(list[0].length).to.be.equal(1);
    expect(list[0][0]).to.be.equal(classicERC721.address);
  });

  it('Check ownership: via OwnershipChecker', async () => {
    // Should be faster
    expect(await ownershipChecker.ownerOfTokenAt(classicERC721.address,1,wallet)).to.be.equal(wallet);
  });

  it('Get ERC1155 Instructor', async () => {
    await expectRevert(register.getInstructorByName('ERC1155'),"Name does not exist")
  });

  it('Check ownership of ERC1155: via OwnershipChecker', async () => {
    expect(await ownershipChecker.ownerOfTokenAt(classicERC1155.address,1,wallet)).to.be.equal(ethers.constants.AddressZero);
  });

  it('set Instructor ERC1155', async () => {
    await register.addInstructor(ERC1155instructor.address,'ERC1155');
    const p = await register.getInstructorByName('ERC1155')
    expect(p._impl).to.be.equal(ERC1155instructor.address)
    expect(p._name).to.be.equal('ERC1155')
  });

  it('register set implementation for erc1155', async () => {
    await register.linkImplementationToInstructor(classicERC1155.address,'ERC1155');
    const list = await register.getImplementationsOf('ERC1155',0)
    expect(list[0].length).to.be.equal(1);
    expect(list[0][0]).to.be.equal(classicERC1155.address);
  });

  it('Check ownership of ERC1155: via OwnershipChecker', async () => {
    expect(await ownershipChecker.ownerOfTokenAt(classicERC1155.address,1,wallet)).to.be.equal(wallet);
  });
})

