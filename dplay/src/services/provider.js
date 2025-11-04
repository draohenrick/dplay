const axios = require('axios');
const token=process.env.WHATSAPP_CLOUD_TOKEN;
const phoneId=process.env.WHATSAPP_PHONE_NUMBER_ID;
const apiUrl=process.env.WHATSAPP_API_URL;

async function send(to,node){
  if(node.buttons){
    // interactive message
    const data={
      messaging_product:"whatsapp",
      recipient_type:"individual",
      to:to,
      type:"interactive",
      interactive:{
        type:"button",
        body:{text:node.text},
        action:{buttons: node.buttons.map((b,i)=>({type:"reply",reply:{id:"btn_"+i,title:b}}))}
      }
    };
    await axios.post(`${apiUrl}/${phoneId}/messages`,data,{headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}});
  } else {
    // text message
    await axios.post(`${apiUrl}/${phoneId}/messages`,{
      messaging_product:"whatsapp",
      to,
      text:{body:node.text}
    },{headers:{Authorization:`Bearer ${token}`, 'Content-Type':'application/json'}});
  }
}

module.exports={send};
