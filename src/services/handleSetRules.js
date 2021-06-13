import api from '../baseUrl';

export default (guid, resource, key) => {

  return api.post('/commands',{

    "id": guid,
    "to": "postmaster@desk.msging.net",
    "method": "set",
    "uri": "/rules",
    "type": "application/vnd.iris.desk.rule+json",
     resource,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
      }});

}