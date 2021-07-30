import React, { useState, useEffect  } from 'react';
import 'react-notifications/lib/notifications.css';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {NotificationContainer,NotificationManager} from 'react-notifications';
import { Link } from "react-router-dom";

// builder
import handleGetWorkFlow from './services/handleGetWorkFlow';
import handleSetPublishedFlow from './services/handleSetPublishedFlow';

import guid from './utils/guid';
import 'react-notifications/lib/notifications.css';
import constante from './constante';



const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    marginTop: '-35px',
    marginButton:'10px', 
    marginLeft: '-9px'


  },
  cardHeader: {
    padding: theme.spacing(1, 2),
 
  },
  list: {
  
    width: 200,
    height: 180,
    backgroundColor: theme.palette.background.paper,
    maxHeight: 200,
    overflow: 'auto',
   
    
  },
  button: {
    margin: theme.spacing(0.5, 0),
  }
}));



function not(a, b) {

  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

function  TransferList() {

  
useEffect(() => {
  handleAddBoxInBuilder();
},[cloneBoxId]);

  const classes = useStyles();

  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  const [keyOrigin, setKeyOrigin] = useState(localStorage.getItem('keyOne') || constante.botMarketPlace);
  const [keyTarget, setKeyTarget] = useState(localStorage.getItem('keyTwo'));
  const [builderOrigin, setBuilderOrigin] = useState();
  const [builderTarget, setBuilderTarget] = useState();

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };



  const handleAddBoxInBuilder = async () => {

      const comeBackHandleGetWorkFlowOrigin =  await  handleGetWorkFlow(guid(), keyOrigin);

      setBuilderOrigin(comeBackHandleGetWorkFlowOrigin);
     
  
      const arrayOfBoxId = Object.keys(comeBackHandleGetWorkFlowOrigin.data.resource).filter((e) => e !== 'onboarding' && e !== 'fallback' );
     
      const listBox = []
      
       arrayOfBoxId.forEach((e) => {

        listBox.push({
                 boxId: comeBackHandleGetWorkFlowOrigin.data.resource[e].id,
                 boxText: comeBackHandleGetWorkFlowOrigin.data.resource[e].$title
         })
       });

       setLeft(listBox)
      
  
  }


const cloneBoxId = async () => {

  if(localStorage.getItem('keyTarget') == ''){
    showMessage('Please check the destination key field!','warning', 'Notice!');
    return false;
  
  }


  const key = await localStorage.getItem('keyTarget');

  const comeBackHandleGetWorkFlowTarget =  await  handleGetWorkFlow(guid(), key);
  const comeBackHandleGetWorkFlowOrigin =  await  handleGetWorkFlow(guid(), keyOrigin);


 const flowTarget = comeBackHandleGetWorkFlowTarget
 const flowOrigin = comeBackHandleGetWorkFlowOrigin
 const boxSelected = right;

 console.log(flowTarget)


boxSelected.forEach((flow) => {

  flowTarget.data.resource[flow.boxId] = flowOrigin.data.resource[flow.boxId]

})


  
const publish  = await handleSetPublishedFlow(flowTarget.data.resource, key);


   if (publish.status === 200) {
     
     showMessage('Your box has been cloned successfully','success','Done!');
     handleAddBoxInBuilder();
     setRight([]);
  
   } else {
     showMessage('Error cloning your box','error','Error!');
     
   }

}



const showMessage = (msg, type, status) => {

  setTimeout(() => {
     setBuilderOrigin([]);
     setBuilderTarget([]);
      NotificationManager[type](msg, status);
   }, 900);

}



  const customList = (title, items) => (

  
     

    <Card>

      <CardHeader
        className={classes.cardHeader}
        titleTypographyProps={{variant:'h5' }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{ 'aria-label': 'all items selected' }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List className={classes.list}  dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value.boxId}-label`;

          return (
            <ListItem key={value.boxId}  role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon >
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText   primaryTypographyProps={{style: {fontSize: 14}}} id={labelId} primary={`${value.boxText}`} />
            </ListItem>
          );
        })}
        <ListItem />
      </List>
    </Card>
  );

  const Buttons = () => (

    
    <div className="text-center">


    <button type="submit" onClick={cloneBoxId} style={{marginRight:"10px"}} className="">Clone</button>
   
    <Link to="/" className="clear"><button  style={{marginRight:"10px"}} className="clear">back</button></Link>
    <Link to="/donate" className="clear">
      <button  style={{marginRight:"10px"}} className="">Donate</button></Link>  
   </div>
  )

  return (
  
    <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
      <Grid item>{customList('Choices', left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Chosen', right)}</Grid>
      <Buttons/>
    </Grid>
  );


}

const  MarketPlace = () => {

    const page = (
     
      <div className="fadeIn animated" style={{padding:'30px'}}>
        <div className="home">
          <div className="">
          <h2 style={{marginTop:'0px', marginBottom:'5px', textAlign:'center'}}><img src="../../assets/logo.png" 
                style={{fontSize:'60px', marginBottom:'5px', width:'20%'}} alt="logo"/><br />MarketPlace</h2>
                
          </div>
        </div>
  
      </div>
       
     
    )

    return (
      <div className="">
        {page}
        <TransferList/>
        <NotificationContainer/>
      </div>
    );

  }


export default MarketPlace;
