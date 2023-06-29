import Cliente from "../models/Cliente.js";

class ClienteController{

    static createCliente = (req, res) => {
        const cliente = new Cliente({
            ...req.body,
            createdDate: Date(),
          });
          cliente.save((err, newCliente) => {
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            return res.status(201).set('Location', `/admin/accounts/${cliente.id}`).json(newCliente);
          });
    }

    static findClientes = async (req, res) => {
        try{
          const pesquisa = await Cliente.find()
          res.status(200).json({Clientes: pesquisa});
        }catch(erro){
          res.status(500).json({message: erro});
        }
    }

    static findClienteById = async (req, res) => {
      const {id} = req.params
      try{
          const cliente = await Cliente.findById(id)
          if(cliente){
              const dadosPessoais = {dadosPessoais: cliente.dadosPessoais}
              const endereco = {endereco: cliente.endereco}
              res.status(200).json({Cliente: [dadosPessoais, endereco]})
          }else{
              res.status(404).send({message: "Cliente não encontrado"})
          }
      }catch(erro){
          res.status(500).send({message: erro.message});
      }        
    }

    static validarDadosCliente = async (req, res) => {
      const { numeroCartao, nomeCartao, validadeCartao, cvcCartao } = req.body
      
      try{
        const clientes = await Cliente.find()
        const resultado = clientes.filter((cliente, indice) => {
          return (cliente.dadosCartao.numeroCartao === numeroCartao) === true
        
        })
    
        if(resultado){
          const id = resultado[0]._id
          const nome = resultado[0].dadosCartao.nomeCartao
          const dataValidade = resultado[0].dadosCartao.validadeCartao
          const cvc = resultado[0].dadosCartao.cvcCartao
            if(nomeCartao === nome && validadeCartao === dataValidade && cvcCartao === cvc){
              const renda = resultado[0].dadosPessoais.rendaMensal;
              res.status(200).json({messagem:'dados válidos', id: id, rendaMensal: renda})
            }
            else{
              res.status(400).send('Dados do cartão invalido')
            }
          }else{
            res.status(404).send('Dados do cartão não encontrado')
          }
      }catch(erro){
        if(erro.message = "Cannot read properties of undefined (reading '_id')"){
          return res.status(404).send('Dados do cartão não encontrado')
        }
        res.status(500).send({message: erro.message});
      }
    }
}

export default ClienteController;
