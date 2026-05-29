// js/ui/app.js
import { CalculadoraJudicial } from '../financeiro/calculos.js';
import { Utils } from '../core/utils.js';
import { Compensacao } from '../financeiro/compensacao.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Carregar Índices (Mock da requisição JSON)
    const response = await fetch('data/indices.json');
    const indicesData = await response.json();
    const calculadora = new CalculadoraJudicial(indicesData);

    // 2. Navegação de Abas
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => el.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(button.dataset.target).classList.add('active');
        });
    });

    // 3. Toggle Modo Escuro
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        document.body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // 4. Lógica de Geração do Relatório (Exemplo de Integração)
    document.getElementById('btn-calcular').addEventListener('click', () => {
        const tbody = document.querySelector('#tabela-evolucao tbody');
        tbody.innerHTML = ''; // Limpa tabela
        
        // Exemplo: Dados capturados dos formulários de Lançamentos
        const lancamentos = [
            { competencia: "2023-01", valor: 1000.00 },
            { competencia: "2023-02", valor: 1000.00 }
        ];
        
        // Exemplo: Depósito capturado da aba de Depósitos
        const depositos = [
            { competencia: "2023-02", valor: 500.00 }
        ];

        let totalGeral = 0;
        const dataFinal = document.getElementById('data-final').value;
        const indexador = document.getElementById('indice-correcao').value;
        const jurosMensais = parseFloat(document.getElementById('juros-mensais').value);

        lancamentos.forEach(lanc => {
            // Cálculos Core
            const fator = calculadora.calcularFatorAcumulado(indexador, lanc.competencia, dataFinal);
            let corrigido = calculadora.calcularCorrecaoMonetaria(lanc.valor, fator);
            let juros = calculadora.aplicarJurosMoratorios(corrigido, jurosMensais, lanc.competencia, dataFinal);
            
            let abatimento = 0;
            let saldo = corrigido + juros;

            // Lógica de Compensação
            const dep = depositos.find(d => d.competencia === lanc.competencia);
            let isCompensado = false;
            
            if (dep) {
                const result = Compensacao.compensarDepositos(corrigido, juros, dep.valor);
                corrigido = result.saldoPrincipalRemanescente;
                juros = result.saldoJurosRemanescente;
                abatimento = result.depositoUtilizado;
                saldo = corrigido + juros;
                isCompensado = true;
            }

            totalGeral += saldo;

            // Renderização da Memória de Cálculo
            const tr = document.createElement('tr');
            if(isCompensado) tr.classList.add('linha-compensada');
            
            tr.innerHTML = `
                <td style="text-align:center">${lanc.competencia}</td>
                <td>${Utils.formatarMoeda(lanc.valor)}</td>
                <td>${fator.toFixed(6)}</td>
                <td>${Utils.formatarMoeda(corrigido)}</td>
                <td>${Utils.formatarMoeda(juros)}</td>
                <td>${Utils.formatarMoeda(corrigido + juros + abatimento)}</td>
                <td style="color:red">- ${Utils.formatarMoeda(abatimento)}</td>
                <td><strong>${Utils.formatarMoeda(saldo)}</strong></td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById('total-final').innerText = Utils.formatarMoeda(totalGeral);
    });
});
