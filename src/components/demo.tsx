import { ethers } from "ethers"
import {h} from 'preact'
import {useEffect, useState} from 'preact/hooks'
import * as ABI from '../lib/OwnershipChecker';

const addresses = {eth:'0xdBcDEEe0E6A8E5a9aEcB27c633534164df13720f',polygon:'0x70d9176320B2589AF92aFE91797801F3efC6CEc3'}
const EthContract = new ethers.Contract(addresses.eth,ABI.abi,ethers.getDefaultProvider())
console.log(ABI.abi)
type config ={
    _impl?:string
    _tokenId?:string
    _potentialOwner?:string
}

export const Demo =({wallet,chain}:{wallet?:string,chain?:number})=>{

    const [config,setConfig] = useState<config>({})
    const [response,setResponse] = useState<string>('')
    const [error,setError] = useState<string>('')


    const connectToMetamask = async ()=>{
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
    }
  

    const queryContract = async (e:any)=>{
        e.preventDefault();
        let c = config
        if(!c._impl || !c._tokenId){
            return 
        }
        if(!c._potentialOwner){
            c._potentialOwner=ethers.constants.AddressZero
            setConfig({...config,_potentialOwner:ethers.constants.AddressZero})
        }
        console.log(c)
        const r = await EthContract.ownerOfTokenAt(c._impl,c._tokenId,c._potentialOwner)
        setResponse(r)
    }

    const setConfigValue = (key:keyof config,value:string)=>{
        setConfig({...config,[key]:value})
    }

    return(
        <div className="Demo">
            {!wallet?(
                <button onClick={connectToMetamask}><img src="/MetaMask_Fox.png" width="32"/> Connect with metamask</button>
            ):(
                <form >
                    <b>Demo of ownerOfTokenAt: </b>
                    <label htmlFor="ContractAddress">Implementation address</label>
                    <input type="text" name="ContractAddress" id="ContractAddress" maxLength={43} onInput={(e)=>setConfigValue('_impl',e.currentTarget.value)}/>
                    <label htmlFor="TokenId">Token Id</label>
                    <input type="text" name="TokenId" id="TokenId" maxLength={74} onInput={(e)=>setConfigValue('_tokenId',e.currentTarget.value)}/>
                    <label htmlFor="PotentialOwner">Potential Owner <small>(optional, but required for erc1155)</small></label>
                    <input type="text" name="PotentialOwner" id="PotentialOwner" maxLength={43} onInput={(e)=>setConfigValue('_potentialOwner',e.currentTarget.value)}/>
                    <small>You are currently connected to the {chain==1?'Ethereum':chain==137?'Polygon':('#'+chain)} chain</small>
                    <button onClick={queryContract}>Get the owner</button>
                </form>
            )}
            {!!wallet&& <div id={'ResponseInput'}>
                <hr></hr>
            <label htmlFor="ActualOwner"><b>Response from ownerOfTokenAt: </b></label>
                <input value={response} name="ActualOwner" id="ActualOwner" readOnly={true} />
                </div>}

    
        </div>
    )
}


