import { Utils } from '../core/utils.js';

export class CalculadoraJudicial {
    constructor(tabelaIndices) {
        this.indices = tabelaIndices;
    }

    // Retorna o fator acumulado multiplicando os índices do período
    calcularFatorAcumulado(indexador, dataInicio, dataFim) {
        const serie = this.indices[indexador];
        let fatorAcumulado = 1;
        
        serie.forEach(item => {
            if (item.competencia >= dataInicio && item.competencia <= dataFim) {
                fatorAcumulado *= item.fator;
            }
        });
        
        // Arredondamento com 8 casas decimais, padrão comum em contadorias
        return Number(fatorAcumulado.toFixed(8)); 
    }

    calcularCorrecaoMonetaria(valorHistorico, fatorAcumulado) {
        const valorCorrigido = valorHistorico * fatorAcumulado;
        return Utils.arredondar(valorCorrigido);
    }

    aplicarJurosMoratorios(valorCorrigido, percentualMensal, dataInicio, dataFim) {
        const meses = Utils.calcularMeses(dataInicio, dataFim);
        const percentualTotal = (percentualMensal / 100) * meses;
        const juros = valorCorrigido * percentualTotal;
        return Utils.arredondar(juros);
    }
}
