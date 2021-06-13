import React, { useState } from 'react';
import {NotificationContainer,NotificationManager} from 'react-notifications';
import handleGetOrigin from './services/handleGetOrigin';
import handleSetPublished from './services/handleSetPublished';
import handleSetWorkingConfiguration from './services/handleSetWorkingConfiguration';
import handleGetWorkFlow from './services/handleGetWorkFlow';
import handleGetGlobais from './services/handleGetGlobais';
import handleGetGlobaisPublished from './services/handleGetGlobaisPublished';
import handleSetPublishedFlow from './services/handleSetPublishedFlow';
import handleGetWorkFlowPublished from './services/handleGetWorkFlowPublished';
import setGlobal from './services/handleSetGlobal';

import handleGetResourceAll from './services/handleGetResourceAll';
import handleGetResourceItems from './services/handleGetResourceItems';
import handleSetResource from './services/handleSetResource';

import handleGetRules from './services/handleGetRules';
import handleSetRules from './services/handleSetRules';

import Switch from "react-switch";
import guid from './utils/guid';
import 'react-notifications/lib/notifications.css';


function Clone(){
  
   const [keyOrigin, setKeyOrigin] = useState(localStorage.getItem('keyOne'));
   const [keyTarget, setKeyTarget] = useState(localStorage.getItem('keyTwo'));
   const [loading, setLoading] = useState(false);

   const [checkedResource, setCheckedResource] = useState(false);
   const handleChangeResource = nextChecked => {
     setCheckedResource(nextChecked);
   };

   const [checkedRules, setCheckedRules] = useState(false);
   const handleChangeRules = nextChecked => {
     setCheckedRules(nextChecked);
   };
  
   
   const [checkedBuilder, setCheckedBuilder] = useState(false);
   const handleChangeBuilder = nextChecked => {
     setCheckedBuilder(nextChecked);
   };
  


  
  async function start(event) {


    event.preventDefault();


    if(!keyOrigin && !keyTarget){
      showMessage('Faltam dados. Por favor, verifique as Keys origem e destino!','warning', 'aviso!');
      return false;
    
    }
      
    if (!keyOrigin.includes('Key') || !keyTarget.includes('Key') ) {
      showMessage('key digitada, não é um key válida', 'warning', 'aviso!');
      return false;
    } 

    if (!checkedBuilder && !checkedRules && !checkedResource ) {
 
      showMessage('Escolha um item para ser clonado!','warning', 'Atenção!')
      return false;
    }
  
  setLoading(true);

 

 if (checkedBuilder) {

   const comeBackHandleGerOrigin = await handleGetOrigin(guid(), keyOrigin);
   const { data } = comeBackHandleGerOrigin;
  
  
    await handleSetPublished(guid(), data.resource, keyTarget);
    await handleSetWorkingConfiguration(guid(), data.resource, keyTarget);

    const comeBackHandleGetWorkFlow = await handleGetWorkFlow(guid(), keyOrigin);
  
    await handleSetPublishedFlow(comeBackHandleGetWorkFlow.data.resource, keyTarget);
    await handleGetWorkFlowPublished(guid(), comeBackHandleGetWorkFlow.data.resource, keyOrigin );

    const getGlobal = await handleGetGlobais(guid(), keyOrigin);
    const teste  =  await setGlobal(guid(), getGlobal.data.resource , keyTarget);

    const comeBckHandleGetGlobaisPublished = await
    handleGetGlobaisPublished(guid(), comeBackHandleGetWorkFlow.data.resource , keyTarget);
  
  
       
    if (comeBckHandleGetGlobaisPublished.status === 200) {
      
      showMessage('Bot clonado com sucesso','success','Concluido!')
      setKeyOrigin('');
      setKeyTarget('');
      setCheckedBuilder(false)
   
    } else {
      showMessage('Erro ao clonar o bot','error','Error!')
    }
 }


  if (checkedResource) {

    const getResourceAll = await handleGetResourceAll(guid(), keyOrigin);
    
      if (getResourceAll.data.status !== 'failure') {

          getResourceAll.data.resource.items.forEach( async (items) => {
   
          const resultGetItems = await handleGetResourceItems(guid(), keyOrigin, items );
          await handleSetResource(guid(), keyTarget, resultGetItems.data.type, items, resultGetItems.data.resource);
         
      });

        showMessage('Recursos Clonados com Sucesso','success', 'Concluido!');
        setCheckedResource(false)
  

    } else {
    
        showMessage('Não existem recursos para clonar','warning', 'Atenção!');
  
    }
  }


  if (checkedRules) {

    const allRules = await handleGetRules(guid(), keyOrigin);

    if (allRules.data.status !== 'failure') {
            
         allRules.data.resource.items.forEach( async (rulesItems) => {
         await handleSetRules(guid(), rulesItems, keyTarget)

     })
        showMessage('Regras clonadas com sucesso','success', 'Concluido!');
    
        setCheckedRules(false)

    } else {
        showMessage('Não existem regras para clonar','warning', 'Atenção!');
    }
    
  }




}

function showMessage(msg, type, status) {

  setTimeout(() => {
      setLoading(false);
      NotificationManager[type](msg, status);
   }, 900);

}


 function setLocaStorageKey1(e) {

     setKeyOrigin(e)
     localStorage.setItem('keyOne', e )

  }
  function setLocaStorageKey2(e) {

    setKeyTarget(e);
    localStorage.setItem('keyTwo',e)
  }

  function clear() {

    localStorage.removeItem('keyOne');
    localStorage.removeItem('keyTwo');

     setKeyOrigin('');
     setKeyTarget('');
  }


    const loader = (
      <div className="clone">
       <div className="element element-1"></div>
       <div className="element element-2"></div><br />
        <p style={{fontSize:'14px', color:'white'}}>
          Aguarde enquanto estamos clonando seu bot ...</p>
      </div>
    )
    const page = (
     
      <div className="fadeIn animated" style={{padding:'30px'}}>
        <div className="home">
          <div className="">
            <form className="">
              <div className="form-group">
                <h2 style={{marginTop:'0px', marginBottom:'30px', textAlign:'center'}}><img src="../../assets/logo.png" 
                style={{fontSize:'60px', marginBottom:'10px', width:'20%'}} alt="logo"/><br />CloneBots</h2>

                <input  value={keyOrigin} 
                onChange={(event) => setLocaStorageKey1(event.target.value)} 
                type="text" name="origem" className=""   
                placeholder="Digite a key do bot origem." required />
              </div>
              <div className="form-group">
                <input  value={keyTarget} 
                onChange={(event) => setLocaStorageKey2(event.target.value)} 
                type="text" name="destion" className="" 
                placeholder="Digite a key do bot destino." required />
                
              </div>


       <div className="container-switch">

       <label>
        <span>Builder: </span>
        <Switch onChange={handleChangeBuilder}
          checked={checkedBuilder}  />
       </label>
       <label>
        <span>Recursos: </span>
        <Switch onChange={handleChangeResource}
          checked={checkedResource}  />
       </label>
       <label>
        <span>Regras: </span>
        <Switch onChange={handleChangeRules}
          checked={checkedRules}  />
       </label>
       </div>
             <div className="text-center">
              <button type="submit" onClick={start} style={{marginRight:"10px"}} className="">Clonar Bot</button>
              <button type="button" onClick={clear} style={{marginRight:"10px"}} className="clear">limpar</button>
             </div>
            </form>
          </div>
        </div>
        <NotificationContainer/>
      </div>
       
     
    )
    return (
      <div className="">
        {loading ? loader : page}
      </div>
    );
  }


export default Clone;
