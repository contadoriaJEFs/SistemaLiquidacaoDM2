// js/core/utils.js
export const Utils = {
    // Evita erros de ponto flutuante arredondando na 2ª casa decimal
    arredondar: (valor) => {
        return Math.round((valor + Number.EPSILON) * 100) / 100;
    },
    
    // Formatação monetária BRL
    formatarMoeda: (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },

    // Diferença em meses entre duas datas (para juros simples)
    calcularMeses: (dataInicio, dataFim) => {
        const d1 = new Date(dataInicio);
        const d2 = new Date(dataFim);
        let meses = (d2.getFullYear() - d1.getFullYear()) * 12;
        meses -= d1.getMonth();
        meses += d2.getMonth();
        return meses <= 0 ? 0 : meses;
    }
};
