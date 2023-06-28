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
            return true;
        }
    };
}

export default validate;