async function handleMessage(client, message) {
    const text = message.body.toLowerCase();

    if (text.includes('olá') || text.includes('oi')) {
        await client.sendText(message.from, 'Olá! Bem-vindo à Dplay!');
        await client.sendButtons(message.from, 'Escolha uma opção:', [
            { id: '1', text: 'Sobre nós' },
            { id: '2', text: 'Serviços' },
            { id: '3', text: 'Falar com atendente' }
        ]);
    } else if (text === '1') {
        await client.sendText(message.from, 'Somos a Dplay, especialistas em ...');
    } else if (text === '2') {
        await client.sendText(message.from, 'Nossos serviços incluem ...');
    } else if (text === '3') {
        await client.sendText(message.from, 'Um atendente humano entrará em contato em breve.');
    } else {
        await client.sendText(message.from, 'Desculpe, não entendi sua mensagem. Digite "olá" para começar.');
    }
}

module.exports = { handleMessage };
