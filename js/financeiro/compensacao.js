// js/financeiro/compensacao.js
import { Utils } from '../core/utils.js';

export const Compensacao = {
    // Realiza o abatimento na data do depósito
    compensarDepositos: (saldoPrincipalCorrigido, saldoJuros, valorDeposito) => {
        let restanteDeposito = valorDeposito;
        let novoPrincipal = saldoPrincipalCorrigido;
        let novoJuros = saldoJuros;

        // Regra padrão: abater primeiro do principal, depois dos juros (ou conforme diretriz específica do título)
        if (restanteDeposito <= novoPrincipal) {
            novoPrincipal = Utils.arredondar(novoPrincipal - restanteDeposito);
            restanteDeposito = 0;
        } else {
            restanteDeposito = Utils.arredondar(restanteDeposito - novoPrincipal);
            novoPrincipal = 0;
            
            if (restanteDeposito <= novoJuros) {
                novoJuros = Utils.arredondar(novoJuros - restanteDeposito);
            } else {
                novoJuros = 0;
                // Se sobrar depósito, o saldo processual fica credor (zerado aqui para simplificação)
            }
        }

        return {
            saldoPrincipalRemanescente: novoPrincipal,
            saldoJurosRemanescente: novoJuros,
            depositoUtilizado: valorDeposito
        };
    }
};
