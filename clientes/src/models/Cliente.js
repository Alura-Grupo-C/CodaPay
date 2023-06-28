import mongoose from 'mongoose';
import validate from '../validacao/validacaoCliente.js'

const ClienteSchema = new mongoose.Schema(
    {
      dadosPessoais:{
        nome: { 
            type: String, 
            required: [ true, 'Se precisa nome' ],
            validate: [validate.Nome, "nome precisar ter mas de 3 letras, não pode começar com numero"]
        },
        cpf: {
            type: String, 
            required  : [ true, 'Se precisa cpf' ],
            validate: [validate.Cpf, "cpf invalido"],
            match: [
                /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/,
                "cpf invalido",
            ]
        },
        email: { 
            type: String, 
            required  : [ true, 'Se precisa email' ],
            validate: [validate.Email, "email invalido"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "email invalido",
            ],
        },
        telefone: {
            type: String, 
            required  : [ true, 'Se precisa numero de telefone' ],
            validate: [validate.Telefone, "telefone invalido"],
            match: [
                /^[0-9]{2}([0-9]{8}|[0-9]{9})/,
                "telefone invalido",
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
            validate: [validate.numeroEndereco, "numero do endereço invalido"],
            required: true },
        complementoDoEndereco: { 
            type: String, 
            validate: [validate.complementoEndereco, "complemento do endereço invalido"],
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
            required: true
        },
        nomeComoCartao:{
            type: String, 
            required: true
        },
        //validade é em mes/ano
        validadeCartao:{
            type: String, 
            required: true,
            validate: [validate.MesAno, "data invalida"],
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