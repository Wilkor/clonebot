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
import { Link } from "react-router-dom";


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
      showMessage('Data is missing. Please check the Source and Destination Keys!!','warning', 'Notice!');
      return false;
    
    }
      
    if (!keyOrigin.includes('Key') || !keyTarget.includes('Key') ) {
      showMessage('key typed, is not a valid key!', 'warning', 'Notice!');
      return false;
    } 

    if (!checkedBuilder && !checkedRules && !checkedResource ) {
 
      showMessage('Choose an option to clone!','warning', 'Notice!')
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
      
      showMessage('Bot cloned successfully','success','Done!')
      setKeyOrigin('');
      setKeyTarget('');
      setCheckedBuilder(false)
   
    } else {
      showMessage('Error cloning bot','error','Error!')
    }
 }


  if (checkedResource) {

    const getResourceAll = await handleGetResourceAll(guid(), keyOrigin);
    
      if (getResourceAll.data.status !== 'failure') {

          getResourceAll.data.resource.items.forEach( async (items) => {
   
          const resultGetItems = await handleGetResourceItems(guid(), keyOrigin, items );
          await handleSetResource(guid(), keyTarget, resultGetItems.data.type, items, resultGetItems.data.resource);
         
      });

        showMessage('Successfully Cloned Resources','success', 'Done!');
        setCheckedResource(false)
  

    } else {
    
        showMessage('There are no resources to clone','warning', 'Notice!');
  
    }
  }


  if (checkedRules) {

    const allRules = await handleGetRules(guid(), keyOrigin);

    if (allRules.data.status !== 'failure') {
            
         allRules.data.resource.items.forEach( async (rulesItems) => {
         await handleSetRules(guid(), rulesItems, keyTarget)

     })
        showMessage('Successfully cloned rules','success', 'Done!');
    
        setCheckedRules(false)

    } else {
        showMessage('There are no rules for cloning','warning', 'Notice!');
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


    // const loader = (
    //   <div className="clone">
    //    <div className="element element-1"></div>
    //    <div className="element element-2"></div><br />
    //     <p style={{fontSize:'14px', color:'white'}}>
    //       Aguarde enquanto estamos clonando seu bot ...</p>
    //   </div>
    // )
    const loader = (
      <div className="load">
        <div id="space-loader"></div>
        <div id="loader"></div><br />
        <p style={{fontSize:'14px', color:'white'}}>Aguarde enquanto estamos clonando seu bot...</p>
      </div>
    )
    const page = (
     
      <div className="fadeIn animated" style={{padding:'30px'}}>
        <div className="home">
          <div className="">
            <form className="">
              <div className="form-group">
                <h2 style={{marginTop:'0px', marginBottom:'5px', textAlign:'center'}}><img src="../../assets/logo.png" 
                style={{fontSize:'60px', marginBottom:'5px', width:'20%'}} alt="logo"/><br />CloneBots</h2>

                <input  value={keyOrigin} 
                onChange={(event) => setLocaStorageKey1(event.target.value)} 
                type="text" name="origem" className=""   
                placeholder="Enter the source bot key." required />
              </div>
              <div className="form-group">
                <input  value={keyTarget} 
                onChange={(event) => setLocaStorageKey2(event.target.value)} 
                type="text" name="destion" className="" 
                placeholder="Enter the key of the target bot." required />
                
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
              <button type="submit" onClick={start} style={{marginRight:"10px"}} className="">Clone Bot</button>
              <button type="button" onClick={clear} style={{marginRight:"10px"}} className="clear">Clear</button>
              
              <Link to="/marketplace" className="clear"><button  style={{marginRight:"10px"}} className="">Marketplace</button></Link>
              
              
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
