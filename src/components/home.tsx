
import { h } from "preact"
import { Demo } from "./demo"

export const Home = ({path,wallet,chain}:{path:string,wallet?:string,chain?:number})=>{

    return(
        <div className="HomeWrapper">
        <div className="container">
            <div>
            <a id='github' href='https://github.com/Benjythebee/OwnershipChecker'><img src='/GitHub_Logo.png'/></a>
            <h1>OwnerOf.xyz: <small>OwnerOf made easy</small></h1>
            <p>A Free modular protocol to bring cross-standard and cross-chain knowledge of NFT ownership</p>
            <section>
                <Demo wallet={wallet} chain={chain}/>
            </section>
            <section className="Center">
                <a id='ViewAPILink' href='https://api.ownerof.xyz'>View API</a>
            </section>
            <section>
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
                <hr/>
                Chain supported: <a href='https://polygonscan.com/address/0x70d9176320B2589AF92aFE91797801F3efC6CEc3#code'>Polygon</a>, <a href='https://etherscan.io/address/0x84F3E0CdC068023639104d48D87097b0dE142148#readContract'>Ethereum</a>
            </section>
        </div>
        <footer>
        &#169; <a href="https://twitter.com/Benjythebee">Benjythebee</a> - 2022
      </footer>
      </div>

        </div>

    )
}
