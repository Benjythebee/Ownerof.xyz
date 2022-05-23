
import { h } from "preact"
import { Demo } from "./demo"

export const Home = ({path,wallet,chain}:{path:string,wallet?:string,chain?:number})=>{

    return(
        <div class="SubMain">
            <section>
                <h2>OwnerOf made easy</h2>
                <h3>Standardizing ownerOf? Why?</h3>
                <p>Noawadays, we thankfully have ethereum standards. For example <a href="https://eips.ethereum.org/EIPS/eip-721">EIP721</a>, <a href="https://eips.ethereum.org/EIPS/eip-1155">EIP1155</a> and more.</p>
                <p>These, on top of <a href="https://eips.ethereum.org/EIPS/eip-165">EIP165</a> make checking the standard of a given smart contract easier.
                <br /> However, this completely ignores previous NFT projects that were born prior to 2018 (for example Cryptokitties).<br/>
                    This means that now, to know who owns a given NFT, one has to check for the standard of a smart contract, and then has to call different functions depending on those standards <b>IF</b> that contract supports the ERC721 interface or the ERC1155 interface.<br />
                    If the contract doesn't support those, a manual process begins where the front-end has to iterate through some specific interfaces and call non-standard methods.<br/>
                    All of that to know who owns a given NFT.
                </p>
                <br/>
                
                <p><strong>Goal:</strong> Create a modular system to know the owner of an NFT in one single call, regardless of its standard.</p>
            </section>
            <section>
                <Demo wallet={wallet} chain={chain}/>
            </section>
        </div>
    )
}