import mongoose from 'mongoose';
import validate from '../validacao/validacaoCliente.js'

const ClienteSchema = new mongoose.Schema(
    {
      dadosPessoais:{
        nome: { 
            type: String, 
            required: [ true, 'Nome necessário' ],
        },
        cpf: {
            type: String, 
            required  : [ true, 'CPF necessário' ],
            validate: [validate.Cpf, "CPF inválido"],
            match: [
                /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
                "CPF inválido",
            ]
        },
        email: { 
            type: String, 
            required  : [ true, 'Email necessário' ],
            validate: [validate.Email, "Email inválido"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Email inválido",
            ],
        },
        telefone: {
            type: String, 
            required  : [ true, 'Número de telefone necessário' ],
            validate: [validate.Telefone, "Telefone inválido"],
            match: [
                /^[0-9]{2}([0-9]{8}|[0-9]{9})/,
                "Telefone inválido",
            ],
        },
        rendaMensal: {
            type: Number, 
            required: true
        }
      },
      endereco:{
        ruaDoEndereco: {
            type: String, 
            required: true
        },
        numeroDoEndereco: { 
            type: String, 
            validate: [validate.numeroEndereco, "Número de endereço inválido"],
            required: true },
        complementoDoEndereco: { 
            type: String, 
            validate: [validate.complementoEndereco, "Complemento do endereço inválido"],
            required: true 
        },
        cepEndereco: {
            type: String, 
            required: true
        },
        cidadeEndereco: {
            type: String, 
            required: true
        },
        estadoEndereco: {
            type: String, 
            required: true
        }
      },
      dadosCartao:{
        numeroCartao:{
            type: String, 
            required: true,
            validate: [validate.numeroCartao, "Data inválida"]
        },
        nomeCartao:{
            type: String, 
            required: true
        },
        //validade é em mes/ano
        validadeCartao:{
            type: String, 
            required: true,
            validate: [validate.MesAno, "Data inválida"],
        },
        cvcCartao:{
            type: String, 
            required: true
        },
        diaVencimentoFatura:{
            type: String, 
            required: true
        }
      }
    },
  );
  
  const Cliente = mongoose.model('clientes', ClienteSchema);
  
  export default Cliente;
