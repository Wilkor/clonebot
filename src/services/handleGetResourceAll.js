import api from '../baseUrl';

export default (guid, key) => {

  return api.post('/commands',{

    "id":guid,
    "method": "get",
    "uri": "/resources?$take=100000"
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
      }});
}