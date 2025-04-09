document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial
    const hoje = new Date();
    const dataInput = document.getElementById('data');
    const horaSelect = document.getElementById('hora');
    const form = document.getElementById('formAgendamento');
    const whatsappBtn = document.getElementById('whatsappDirect');
    
    // 1. Define a data mínima como hoje
    dataInput.min = hoje.toISOString().split('T')[0];
    
    // 2. Cria os horários disponíveis (09:00 às 19:30)
    function gerarHorarios() {
        horaSelect.innerHTML = '<option value="">Selecione o horário</option>';
        
        for (let hora = 9; hora <= 19; hora++) {
            // Horários cheios (09:00, 10:00, etc.)
            const horaCheia = `${hora.toString().padStart(2, '0')}:00`;
            horaSelect.add(new Option(horaCheia, horaCheia));
            
            // Horários e meia (exceto 19:30)
            if (hora < 19) {
                const horaMeia = `${hora.toString().padStart(2, '0')}:30`;
                horaSelect.add(new Option(horaMeia, horaMeia));
            }
        }
    }
    
    // Gera os horários iniciais
    gerarHorarios();
    
    // 3. Atualiza ao mudar a data
    dataInput.addEventListener('change', gerarHorarios);
    
    // AJUSTE 1: Link direto do WhatsApp atualizado
    whatsappBtn.href = "https://wa.me/5541999589684?text=Olá! Vi o site e gostaria de agendar um horário. Podem me ajudar?";
    
    // Envio do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Coleta dados
        const dados = {
            nome: this.querySelector('input[type="text"]').value,
            telefone: this.querySelector('input[type="tel"]').value,
            barbeiro: this.querySelector('#barbeiro').value,
            data: this.querySelector('#data').value,
            hora: this.querySelector('#hora').value,
            servico: this.querySelector('#servico').value
        };
        
        // AJUSTE 2: Mensagem formatada para WhatsApp
        const mensagem = `✂️ *AGENDAMENTO BARBEARIA OLIVER'S* ✂️\n\n` +
                         `👤 *Nome:* ${dados.nome}\n` +
                         `📱 *WhatsApp:* ${dados.telefone}\n` +
                         `🗓️ *Data:* ${new Date(dados.data).toLocaleDateString('pt-BR')} - ${dados.hora}\n` +
                         `✂️ *Serviço:* ${dados.servico}\n` +
                         `🧔 *Barbeiro Preferido:* ${dados.barbeiro}\n\n` +
                         `✅ _Por favor, confirme meu agendamento_`;
        
        // Abre WhatsApp
        window.open(`https://wa.me/5541999589684?text=${encodeURIComponent(mensagem)}`, '_blank');
        
        // AJUSTE 3: Feedback ao usuário
        alert('Agendamento enviado! Aguarde a confirmação pelo WhatsApp.');
        form.reset();
        gerarHorarios();
    });
});