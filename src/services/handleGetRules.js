import api from '../baseUrl';

export default (guid, key ) => {
  
  return api.post('/commands',{

    "id": guid,
    "to": "postmaster@desk.msging.net",
    "method": "get",
    "uri": "/rules"
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
      }});
}