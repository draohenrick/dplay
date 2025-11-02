const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.use((req,res,next)=>{
  const token = req.query.token || req.headers['x-admin-token'];
  if(!process.env.ADMIN_TOKEN) return res.status(403).json({error:'admin_disabled'});
  if(token!==process.env.ADMIN_TOKEN) return res.status(401).json({error:'unauthorized'});
  next();
});

const FLOWS_DIR = path.join(process.cwd(),'flows');

router.get('/flows', (req,res)=>{
  const files = fs.existsSync(FLOWS_DIR)?fs.readdirSync(FLOWS_DIR):[];
  res.json({flows:files});
});

router.get('/flows/:name', (req,res)=>{
  const file = path.join(FLOWS_DIR,req.params.name);
  if(!fs.existsSync(file)) return res.status(404).json({error:'not_found'});
  res.send(fs.readFileSync(file,'utf8'));
});

router.post('/flows/:name', (req,res)=>{
  const file = path.join(FLOWS_DIR,req.params.name);
  fs.writeFileSync(file, typeof req.body==='string'?req.body:JSON.stringify(req.body,null,2),'utf8');
  res.json({ok:true});
});

module.exports = router;
