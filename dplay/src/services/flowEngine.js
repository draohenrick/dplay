const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getSession, setSession } = require('./sessionStore');
const logger = require('../utils/logger');

class FlowEngine {
  constructor(clientName='default'){
    this.client=clientName;
    this.flow=this.loadFlow(clientName);
  }

  loadFlow(client){
    const base=path.join(process.cwd(),'flows');
    const yamlPath=path.join(base,client+'.yaml');
    const jsonPath=path.join(base,client+'.json');
    if(fs.existsSync(yamlPath)) return yaml.load(fs.readFileSync(yamlPath,'utf8'));
    if(fs.existsSync(jsonPath)) return JSON.parse(fs.readFileSync(jsonPath,'utf8'));
    const def=path.join(base,'default.json');
    if(fs.existsSync(def)) return JSON.parse(fs.readFileSync(def,'utf8'));
    logger.warn('No flow found for',client);
    return { start:'fallback', nodes:{ fallback:{ type:'message', text:'Fluxo indisponível.' } } };
  }

  async handleMessage(from,text){
    const key=`${this.client}|${from}`;
    let session=await getSession(key)||{node:this.flow.start};
    let node=this.flow.nodes[session.node||this.flow.start];
    if(!text) return this._respond(key,node);
    // transition by input
    const input=text.trim().toLowerCase();
    let next=node.transitions&& (node.transitions[input] || node.transitions['default']);
    if(next) node=this.flow.nodes[next];
    else if(this.flow.nodes['fallback']) node=this.flow.nodes['fallback'];
    return this._respond(key,node);
  }

  async _respond(sessionKey,node){
    if(!node) return ['Erro: nó inválido.'];
    const replies=[];
    if(node.type==='message'){
      replies.push(node); // entire node, WhatsApp Cloud API interprets text/buttons
      await setSession(sessionKey,{node:node.next||this.flow.start});
    }
    return replies;
  }
}

module.exports=FlowEngine;
