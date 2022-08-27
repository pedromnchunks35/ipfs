import { useEffect } from "react";
import { useState } from "react";
import client from "../../Ex";
import '../../../src/App.css';
import Web3 from 'web3';
import abi from '../../contracts/SimpleStorage.json';

function Welcome() {
  const [storage , setStorage] = useState(0);
  const [account,setAccount] = useState(null);
  const [web3 , setWeb3]= useState(null);
  const [contract , setContract] = useState(null);
  const [buffer,setBuffer] = useState(null);
  const [ipfs_hash,setIpfsHash] = useState('');
  

  function captureFile(e){
    console.log('capture file...');
    e.preventDefault();
    //GRAB THE FILE
    const file = e.target.files[0];
    //GET AN READER
    const reader = new window.FileReader();
    //READ AS AN BUFFER
    reader.readAsArrayBuffer(file);
    //GET THE DATA AFTER READED
    reader.onloadend = () =>{
      //SET THE BUFFER WITH THE RESULT FROM THE LOADED DATA
      setBuffer(Buffer(reader.result));
    }
  
  }


  //INIT FUNCTION
   const render = () =>{
   
    if(typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'){
      window.ethereum.request({method: "eth_requestAccounts"}).then(async r=>{
        //WEBS
        const webs = new Web3(window.ethereum);
        //SET WEB3 OBJECT
        setWeb3(webs);
        //GET ACCOUNTS
        const accounts = await webs.eth.getAccounts();
        setAccount(accounts[0]);
      });
      
    }else{
      alert('Install metamask please');
    }
    
       
  }

  const setContractProv = () =>{
  const contract = new web3.eth.Contract(
    //ABI
    abi.abi,
    //CONTRACT ADDRESS
    "THE CONTRACT ADDRESS"
  )
  //SET THE CONTRACT
  setContract(contract);
  }

  
  useEffect(()=>{
  render();
  if(account!=null){
    setContractProv();
  }
  },[account]);
  
  
  const onSubmit = (e) =>{
    console.log('submiting..');
    e.preventDefault();
    //add the buffer of the image
    client.add(buffer).then((res) => {
      contract.methods.write(res[0].hash).send({from:account}).then(async r=>{
        console.log(await contract.methods.read().call(), "This is the hash");
      })
      setIpfsHash(res[0].hash);
  }).catch(err=>{
    console.log(err);
    alert('error deploying image');
  })
  }


 



  return (
    <div className="welcome">
      <h1>👋 IPFS FILE UPLOAD DAPP!</h1>
      <h1>Your image</h1>
      <p>This image is stored on IPFS & The Ethernet Blockchain</p>
    
    <form>
    <input type={'file'} onChange={captureFile}></input>
    <br>
    </br>
    <br>
    </br>
    <button onClick={(e)=>onSubmit(e)}>Submit</button>
     <div className="lol">
      <img src={`https://ipfs.io/ipfs/${ipfs_hash}`}></img>
     </div>
     
    </form>

    

    <br>
    </br>
    <br>
    </br>
    </div>
  );
}

export default Welcome;
