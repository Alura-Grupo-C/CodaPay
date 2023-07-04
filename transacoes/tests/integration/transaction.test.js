import app from '../../src/app.js'
import Transaction from '../../src/models/Transaction.js';
import request from 'supertest'
import { createClient, createTransaction, login } from '../factories/transactionFactories.js';
import mongoose from 'mongoose';
import Account from '../../src/models/Account.js';

let server;
let idToGet;

beforeAll(() => {
  server = app.listen(4000);
});

beforeEach(async () => {
  await Transaction.deleteMany();
  await Account.deleteMany();
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

const cases = [
    {
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        nomeCartao: 'John',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        validadeCartao: '02/2024'
    }
]

describe('POST /api/admin/transactions', () => {
  it('it shouldnt create a transaction if the user is not logged in', async () => {
    const transaction = await request(app).post('/api/admin/transactions').send({});

    expect(transaction.status).toBe(401);
  })

  it('it shouldnt create a transaction if theres no body', async () => {
    const token = await login();

    const transaction = await request(app).post('/api/admin/transactions').set('Authorization', token).send({});

    expect(transaction.status).toBe(422);
  });

  test.each(cases)('it shouldnt create a transaction if the card data isnt valid', async () => {
    const token = await login();

    const transaction = await request(app).post('/api/admin/transactions').set('Authorization', token).send(cases);

    expect(transaction.status).toBe(422);
  })

  it('it should create a reproved transaction if the card data doesnt match a real data on clients database', async () => {
    const token = await login();

    const transactionData = {
      valor: 200,
      numeroCartao: '12345678901234',
      nomeCartao: 'John',
      validadeCartao: '02/2024',
      cvcCartao: '012'
    }

    const transaction = await request(app).post('/api/admin/transactions').set('Authorization', token).send(transactionData);

    expect(transaction.status).toBe(400);
  })

  it('it should create an approved transaction if the card data matches a real data on clients database and its value is less than 50% of the clients income', async () => {
    const client = await createClient();

    const token = await login();

    const transactionData = {
      valor: client.dadosPessoais.rendaMensal * 0.2,
      numeroCartao: '12345678901234',
      nomeCartao: 'John',
      validadeCartao: client.dadosCartao.validadeCartao,
      cvcCartao: '012'
    }

    const transaction = await request(app).post('/api/admin/transactions').set('Authorization', token).send(transactionData);

    idToGet = transaction.body.transactionId

    expect(transaction.status).toBe(201);
    expect(transaction.body).toEqual(
      expect.objectContaining({
        status: 'Aprovada',
        transactionId: expect.any(String)
    })
    );
})

  it('it should create an \'under analysis\' transaction if the card data matches a real data on clients database and its value is more than or equal to 50% of the clients income', async () => {
    const client = await createClient();

    const token = await login();
    
    const transactionData = {
        valor: client.dadosPessoais.rendaMensal,
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        validadeCartao: client.dadosCartao.validadeCartao,
        cvcCartao: '012'
    }
    
    const transaction = await request(app).post('/api/admin/transactions').set('Authorization', token).send(transactionData)

    expect(transaction.status).toBe(303);
    expect(transaction.body).toEqual(
      expect.objectContaining({
        status: 'Em análise',
        transactionId: expect.any(String)
      })
    );
  })
})

describe('GET by id /api/admin/transactions/:id', () => {
  it('it should return the transaction details requested by id', async () => {
    await request(app).get(`/api/admin/transactions/${idToGet}`).expect(200);
  });
})

describe('PUT by id /api/admin/transactions/:id',  () => {
  it('it should update transaction\'s status if the former status is \'Em Analise\'', async () => {
    const trans = await createTransaction()
    await request(app).put(`/api/admin/transactions/${trans._id}`)
                      .send({status:'Reprovada'})
                      .expect(204);
  });

  it('it shouldn\'t update transaction\'s status the param', async () => {
    const trans = await createTransaction()
    await request(app).put(`/api/admin/transactions/${trans._id}`)
                      .send({status:'Reprovada'})
                      .expect(204);
  });
})