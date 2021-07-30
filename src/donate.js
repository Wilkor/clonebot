import React from 'react';
import { Link } from "react-router-dom";


function Clone(){

  
    const page = (
     
      <div className="fadeIn animated" style={{padding:'30px'}}>
        <div className="home">
          <div className="">
            <form className="">
              <div className="form-group">
                <h2 style={{marginTop:'0px', marginBottom:'30px', textAlign:'center'}}><img className="avatar"   src="https://avatars.githubusercontent.com/u/34819624?v=4" 
                style={{fontSize:'60px', marginBottom:'10px', width:'20%'}} alt="logo"/><br />Wilkor Almeida</h2>

                  Sou apaixonado por Javascript, ReactJS, React Native, NodeJS e todo ecossistema em torno dessas tecnologias e por isso o CloneBots é free, mas você pode contribuir para que ele continue sempre em evolução. Se desejar, faça uma doação com o QrCode abaixo.                  
              </div>
         
              <img className=""   src="./../assets/qrcode-pix.png" 
                style={{fontSize:'60px',marginLeft:'25%',marginBottom:'10px', width:'50%'}} alt="logo"/>
             

       
             <div className="text-center">
         
              <Link to="/" className="clear"><button  style={{marginRight:"10px"}} className="clear">Clone Bots</button></Link>
              <Link to="/marketplace" className="clear"><button  style={{marginRight:"10px"}} className="">MarketPlace</button></Link>
              
              
             </div>
            </form>
          </div>
        </div>
        
      </div>
       
     
    )
    return (
      <div className="">
        {page}
      </div>
    );
  }


export default Clone;
