document.addEventListener('DOMContentLoaded', function() {
    const dadosSalvos = localStorage.getItem('dadosBeberAgua');
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        mostrarResultado(dados);
    }

    const radios = document.querySelectorAll('input[name="atividade"]');
    radios.forEach(radio => {
        radio.addEventListener('change', function() {
            const horasGroup = document.getElementById('horasGroup');
            horasGroup.style.display = this.value === 'sim' ? 'block' : 'none';
        });
    });

    document.getElementById('confirmar').addEventListener('click', function() {
        const nome = document.getElementById('nome').value;
        const peso = parseFloat(document.getElementById('peso').value);
        const praticaAtividade = document.querySelector('input[name="atividade"]:checked')?.value;
        const horas = document.getElementById('horas').value;

        if (!nome || !peso || !praticaAtividade) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        let quantidadeAgua = peso * 35;
        if (praticaAtividade === 'sim') {
            quantidadeAgua += horas * 500;
        }

        let copos = Math.ceil(quantidadeAgua / 250);

        const dados = {
            nome: nome,
            peso: peso,
            praticaAtividade: praticaAtividade,
            horas: horas,
            copos: copos
        };

        localStorage.setItem('dadosBeberAgua', JSON.stringify(dados));

        mostrarResultado(dados);
    });

    document.getElementById('cancelar').addEventListener('click', function() {
        document.getElementById('formulario').reset();
        document.getElementById('horasGroup').style.display = 'none';
        document.getElementById('resultado').style.display = 'none';
    });
});

function mostrarResultado(dados) {
    const formulario = document.getElementById('formulario');
    const resultado = document.getElementById('resultado');
    
    let timelineHtml = '<div class="timeline"><div class="timeline-container"><div class="timeline-line"></div>';
    
    const distribuicao = distribuirCopos(dados.copos);
    for (let hora = 6; hora <= 20; hora += 2) {
        const quantidade = distribuicao[hora] || 0;
        timelineHtml += `
            <div class="timeline-point">
                <div class="timeline-glass">
                    ${quantidade > 0 ? '<i class="fas fa-glass-water"></i>' : ''}
                    ${quantidade > 0 ? `<span class="timeline-quantity">${quantidade}x</span>` : ''}
                </div>
                <span class="timeline-hour">${hora}:00</span>
            </div>
        `;
    }
    timelineHtml += '</div></div>';

    resultado.innerHTML = `
        <h2><i class="fas fa-check-circle icon"></i>Resultado</h2>
        <p>Olá ${dados.nome}, você deve beber ${dados.copos} copos de água todos os dias.</p>
        ${timelineHtml}
        <button id="modificar" onclick="modificarDados()">Modificar</button>
    `;
    
    formulario.style.display = 'none';
    resultado.style.display = 'block';
}

function distribuirCopos(totalCopos) {
    const horarios = {};
    const horasDisponiveis = [6, 8, 10, 12, 14, 16, 18, 20];
    const numHorarios = horasDisponiveis.length;
    
    let coposPorHorario = Math.floor(totalCopos / numHorarios);
    let coposExtras = totalCopos % numHorarios;
    
    horasDisponiveis.forEach((hora, index) => {
        horarios[hora] = coposPorHorario + (index < coposExtras ? 1 : 0);
    });
    
    return horarios;
}

function modificarDados() {
    const formulario = document.getElementById('formulario');
    const resultado = document.getElementById('resultado');
    
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosBeberAgua'));
    
    document.getElementById('nome').value = dadosSalvos.nome;
    document.getElementById('peso').value = dadosSalvos.peso;
    
    if (dadosSalvos.praticaAtividade === 'sim') {
        document.getElementById('sim').checked = true;
        document.getElementById('horasGroup').style.display = 'block';
        document.getElementById('horas').value = dadosSalvos.horas;
    } else {
        document.getElementById('nao').checked = true;
    }
    
    formulario.style.display = 'block';
    resultado.style.display = 'none';
}