import api from '../baseUrl';

export default (guid, key, items) => {

  return api.post('/commands',{

    "id":guid,
    "method": "get",
    "uri": `/resources/${items}`
    },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
      }});
}