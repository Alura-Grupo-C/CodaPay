class validate{
    static Email = (email) => {
        const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return re.test(email);
    };
     static Telefone = (telefone) => {
        const re = /^[0-9]{2}([0-9]{8}|[0-9]{9})/;
        return re.test(telefone);
    };
    static Cpf = (cpf) => {
        const re = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
        return re.test(cpf);
    };
    static MesAno = (data) => {
        const re = /^(0?[1-9]|1[0-2])\/((19|20)\d{2})$/;
        return re.test(data);
    };
    static Nome = (nome) => {
        const re = /^(?!\d)\w{3,}$/;
        return re.test(nome);
    };
    static numeroEndereco = (numero) => {
        if(numero == 's/n'){
            return true;
        }
        if(numero == 'S/N'){
            return true;
        }
        else{
            const re = /^[0-9]+$/;
            return re.test(numero)
        }
    };
    static complementoEndereco = (complemento) => {
        if(complemento == 's/n'){
            return true;
        }
        if(complemento == 'S/N'){
            return true;
        }
        else{
            const re = /^[0-9]+$/;
            return re.test(complemento)
        }
    };

    static numeroCartao = (numero) => {
        const re = /^[0-9]{14,16}$/;
        return re.test(numero);
    }

    static data = (dataCartao) => {
        const dataAtual = new Date();
        const dataProcesso = dataCartao.split('/');
        const mesCartao = dataProcesso[0]
        const anoCartao = dataProcesso[1]
        const mesAtual = dataAtual.getMonth() + 1
        const anoAtual = dataAtual.getFullYear()
    
        if(anoCartao > anoAtual){
           return true
        }
        if(anoCartao < anoAtual){
           return false
        }else{
            if(mesCartao > mesAtual){
                return true
            }
            else{
                return false
            }
        }  
    }
}

export default validate;