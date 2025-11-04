import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FlowEditor from '../components/FlowEditor';

export default function App(){
  const [token,setToken]=useState(localStorage.getItem('token')||'');
  const [logged,setLogged]=useState(false);
  const [flows,setFlows]=useState([]);
  const [selectedFlow,setSelectedFlow]=useState(null);

  const BASE_URL=process.env.REACT_APP_BASE_URL||'http://localhost:3000';

  useEffect(()=>{ if(token) fetchFlows(); },[token]);

  const fetchFlows=async()=>{
    try{
      const res=await axios.get(`${BASE_URL}/admin/flows`,{headers:{'x-admin-token':token}});
      setFlows(res.data.flows);
      setLogged(true);
    }catch(e){console.error(e); setLogged(false);}
  }

  const handleLogin=()=>{ localStorage.setItem('token',token); fetchFlows(); };

  return <div style={{padding:20,fontFamily:'Arial'}}>
    {!logged ? <div>
      <h2>Admin Login</h2>
      <input type="password" placeholder="Token" value={token} onChange={e=>setToken(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div> :
    <div>
      <h2>Fluxos Disponíveis</h2>
      <ul>{flows.map(f=><li key={f}><button onClick={()=>setSelectedFlow(f)}>{f}</button></li>)}</ul>
      {selectedFlow && <FlowEditor flowName={selectedFlow} token={token} baseUrl={BASE_URL} />}
    </div>}
  </div>;
}
