import { ethers } from "ethers"
import {h} from 'preact'
import {useEffect, useState} from 'preact/hooks'
import * as ABI from '../lib/OwnershipChecker';

const addresses = {eth:'0xdBcDEEe0E6A8E5a9aEcB27c633534164df13720f',polygon:'0x70d9176320B2589AF92aFE91797801F3efC6CEc3'}
const Contract = (chain:number=1)=>{
    if (chain==137){
        return new ethers.Contract(addresses.polygon,ABI.abi,new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.quiknode.pro',137))
    }
    return new ethers.Contract(addresses.eth,ABI.abi,ethers.getDefaultProvider())
}

type config ={
    _impl?:string
    _tokenId?:string
    _potentialOwner?:string
}

export const Demo =({wallet,chain}:{wallet?:string,chain?:number})=>{

    const [config,setConfig] = useState<config>({})
    const [response,setResponse] = useState<string>('')
    const [loading,setLoading] = useState<boolean>(false)
    const [error,setError] = useState<string>('')


    const connectToMetamask = async ()=>{
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
    }

    const queryContract = async (e:any)=>{
        setResponse('')
        e.preventDefault();
        setError(null!)
        if(!chain){
            setError('An error ocurred, is your wallet connected?')
            return
        }
        let c = config
        if(!c._impl || !ethers.utils.isAddress(c._impl)){
            setError('Implementation address is invalid')
            return
        }
        if(!c._tokenId){
            setError('A token id is needed.')
            return
        }
        if(!c._potentialOwner){
            c._potentialOwner=ethers.constants.AddressZero
            setConfig({...config,_potentialOwner:ethers.constants.AddressZero})
        }
        setLoading(true)
        const r = await Contract(chain).ownerOfTokenAt(c._impl,c._tokenId,c._potentialOwner)
        setResponse(r)
        setLoading(false)
    }

    const setConfigValue = (key:keyof config,value:string)=>{
        setConfig({...config,[key]:value})
    }

    return(
        <div className="Demo">
            {!!error&&(
                <b style={'color:red;'}>{error}</b>
            )}
            {!wallet && (window as any).ethereum?(
                <div className="Center"><a onClick={()=>connectToMetamask()}><img src="/MetaMask_Fox.png" width="32"/> Connect with metamask</a></div>
            ):(!wallet && !(window as any).ethereum)?(
                <a href="https://metamask.io/"><img src="/MetaMask_Fox.png" width="32"/> Get metamask</a>
            ):(
                <form >
                    <b>Demo of ownerOfTokenAt: </b>
                    <label htmlFor="ContractAddress">Implementation address</label>
                    <input type="text" name="ContractAddress" placeholder='0x84F3E0CdC068023639104d4...' id="ContractAddress" maxLength={43} onInput={(e)=>setConfigValue('_impl',e.currentTarget.value)}/>
                    <label htmlFor="TokenId">Token Id</label>
                    <input type="text" name="TokenId" id="TokenId" maxLength={74} onInput={(e)=>setConfigValue('_tokenId',e.currentTarget.value)}/>
                    <label htmlFor="PotentialOwner">Potential Owner <small>(optional, but required for erc1155)</small></label>
                    <input type="text" name="PotentialOwner" id="PotentialOwner" maxLength={43} onInput={(e)=>setConfigValue('_potentialOwner',e.currentTarget.value)}/>
                    <small>You are currently connected to the {chain==1?'Ethereum':chain==137?'Polygon':('#'+chain)} chain</small>
                    <button onClick={queryContract} disabled={loading}>{loading?'Loading ...':`Get the owner`}</button>
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


