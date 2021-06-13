import api from '../baseUrl';

export default (guid, key, type, items, value) => {
  return api.post('/commands', {
    "id": guid,
    "method": "set",
    "uri":  encodeURI("/resources/"+ items.trim()),
    "type": type,
    "resource": value

  },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
  }});
}

