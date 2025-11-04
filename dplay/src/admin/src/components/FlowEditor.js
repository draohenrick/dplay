import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YAML from 'yaml';

export default function FlowEditor({flowName, token, baseUrl}){
  const [content,setContent]=useState('');
  useEffect(()=>{
    axios.get(`${baseUrl}/admin/flows/${flowName}`,{headers:{'x-admin-token':token}})
      .then(res=>setContent(typeof res.data==='string'?res.data:JSON.stringify(res.data,null,2)))
      .catch(console.error);
  },[flowName]);

  const handleSave=async()=>{
    try{
      await axios.post(`${baseUrl}/admin/flows/${flowName}`,content,{headers:{'x-admin-token':token,'Content-Type':'application/json'}});
      alert('Salvo com sucesso!');
    }catch(e){console.error(e); alert('Erro ao salvar');}
  };

  return <div style={{marginTop:20}}>
    <h3>Editando: {flowName}</h3>
    <textarea style={{width:'100%',height:300}} value={content} onChange={e=>setContent(e.target.value)} />
    <br />
    <button onClick={handleSave}>Salvar</button>
  </div>;
}
