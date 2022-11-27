export default async function callBackend (url, method, body){
  const result = await fetch(url,{method,body})
  
  return result.json()
}