// import {expect,use,assert} from 'chai';
import { ethers, providers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { OwnershipInstructorRegisterV1Instance,ERC721OwnershipInstructorInstance,ClassicERC721Instance, ERC1155OwnershipInstructorInstance, ClassicERC1155Instance } from '../types/truffle-contracts';

const OwnershipInstructorRegisterV1 = artifacts.require("OwnershipInstructorRegisterV1")
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

contract("OwnershipInstructorRegisterV1 - Unit test",async function (accounts) {
  
  const signer = web3Provider.getSigner(accounts[1]);
  const [wallet,walletTo,walletThree] = accounts
  let register:OwnershipInstructorRegisterV1Instance
  let ERC721instructor:ERC721OwnershipInstructorInstance
  let ERC1155instructor:ERC1155OwnershipInstructorInstance
  let classicERC721: ClassicERC721Instance
  let classicERC1155: ClassicERC1155Instance


  before(async ()=>{
    ERC721instructor = await ERC721OwnershipInstructor.new()
    classicERC721 = await ClassicERC721.new()
    await classicERC721.mint(1);

    ERC1155instructor = await ERC1155OwnershipInstructor.new()
    classicERC1155 = await ClassicERC1155.new()
    await classicERC1155.mint(1);

    register = await OwnershipInstructorRegisterV1.new()
  })

  
  it('owner of contract is wallet', async () => {
    assert.equal(await register.owner(),wallet);
  });

  it('Instructor for ERC721 not set', async () => {
    await expectRevert(register.getInstructorByName('ERC721'),"Name does not exist")
  });

  it('set Instructor ERC721', async () => {
    await register.addInstructor(ERC721instructor.address,'ERC721');
    const p = await register.getInstructorByName('ERC721')
    expect(p._impl).to.be.equal(ERC721instructor.address)
    expect(p._name).to.be.equal('ERC721')
  });

  it('set Instructor ERC721 again', async () => {
    await expectRevert(register.addInstructor(ERC721instructor.address,'ERC721'),"Instructor has already been registered");
  });
  it('set Instructor ERC1155', async () => {
    await register.addInstructor(ERC1155instructor.address,'ERC1155');
    const p = await register.getInstructorByName('ERC1155')
    expect(p._impl).to.be.equal(ERC1155instructor.address)
    expect(p._name).to.be.equal('ERC1155')
  });

  it('register set implementation for erc721', async () => {
    await register.linkImplementationToInstructor(classicERC721.address,'ERC721');
    const list = await register.getImplementationsOf('ERC721',0)
    expect(list[0].length).to.be.equal(1);
    expect(list[0][0]).to.be.equal(classicERC721.address);
  });

  it('Remove instructor ERC721', async () => {
    await register.removeInstructor('ERC721');
    await expectRevert(register.getInstructorByName('ERC721'),"Name does not exist")
  });

  it('Remove instructor ERC721', async () => {
    await register.removeInstructor('ERC721');
    await expectRevert(register.getInstructorByName('ERC721'),"Name does not exist")
  });

})

