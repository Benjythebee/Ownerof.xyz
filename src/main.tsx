import { Home } from "./components/home"
import { Component } from "preact"
import Router from "preact-router"

interface State {chain?:number,wallet?:string}

export default class MainApp extends Component<any,State> {
    ethereum:{isMetaMask:boolean,chainId:string,isConnected:boolean,request:(e:any)=>any,on:(str:string,e:any)=>any,removeListener:(str:string,e:any)=>any}
    constructor(){
        super()

        this.ethereum= (window as any).ethereum
    }
    onConnect = async(connectInfo:{chainId:string})=>{
        this.setState({chain:parseInt(connectInfo.chainId)})
      }
    onDisconnect = async()=>{
    this.setState({wallet:null!})
    }
    onChainChanged = async(chainId:number)=>{
      this.setState({chain:chainId})
    }
    onAccountChanged = async(accounts:string[])=>{
        this.setState({wallet:accounts[0]})
      }
    componentWillUnmount()  {
    this.ethereum.removeListener('connect',this.onConnect)
    this.ethereum.removeListener('disconnect',this.onDisconnect)
    this.ethereum.removeListener('chainChanged',this.onChainChanged)
    this.ethereum.removeListener('accountsChanged',this.onAccountChanged)
    }

    getAccountInfo = async ()=>{
        let accounts = await this.ethereum.request({ method: 'eth_requestAccounts' })
        let chain = parseInt(this.ethereum.chainId,16)

        if(accounts && accounts.length){
            this.setState({wallet: accounts[0],chain})
        }else{
            this.setState({chain})
        }

    }

    componentDidMount() {
        if(!this.ethereum){
            return
        }
        if(this.ethereum.isConnected){
            this.getAccountInfo()
        }
      this.ethereum.on('connect',this.onConnect)
      this.ethereum.on('disconnect',this.onDisconnect)
      this.ethereum.on('chainChanged',this.onChainChanged)
      this.ethereum.on('accountsChanged',this.onAccountChanged)
    }

    render({}:any,{wallet,chain}:State) {
      return (
      <div class='Main'>    
        <Router >
          <Home path="/" chain={chain} wallet={wallet}/>
      </Router>
    </div>)
    }
  }
