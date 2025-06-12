import { useEffect, useState } from 'react';

type ResultsProps = {
  originalUrl: string;
  shortUrl: string;
}
export default function Results({originalUrl, shortUrl}: ResultsProps) {

   // en este caso Typescript me pide usar <string[]> para especificar que tipos de datos van dentro de listUrl en cambio en los demas estados, lo infiere
    const [listUrl, setListUrl] = useState<{originalUrl: string, shortUrl: string }[]>([]);

  useEffect(()=>{
    if (originalUrl && shortUrl){
const newList = {originalUrl, shortUrl}
setListUrl(prevList => [...prevList,newList])
    } 
    
  }, [shortUrl])

  // Leer el valor desde localStorage
  // const savedOriginalUrl = localStorage.getItem("originalUrl");

  if(!shortUrl) return null; // Si no hay shortUrl, no renderizar nada
  
  return (
    <>  
      {listUrl.map((arrayElement, index) => (
        <div className="shortener__result" key={index}>
        <p>{arrayElement.originalUrl}</p>
        <p>{arrayElement.shortUrl}</p>
         <button>Copy</button>
      </div>
      ))}
    </>  
  )
  
}
