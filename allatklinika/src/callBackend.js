export default async function callBackend (url, method, body){
  const result = await fetch(url,{method,body,     headers: {
    'Content-Type': 'application/json'
  },})
  
  return result.json()
}