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
}

export default ClienteController;