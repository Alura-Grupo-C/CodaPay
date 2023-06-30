/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/extensions */
import request from 'supertest';
import {
  describe, it, afterEach, beforeEach, expect,
} from '@jest/globals';
import app from '../../src/app.js';

const URN = '/api/admin/antifraude';

let server;
beforeEach(() => {
  const port = 4000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

const analiseAntiFraude = {
  idCliente: '649d984b9d4bd5421a2c97e9',
  idTransacao: '649b4876e833c825b00d4b0c',
  valorTranferencia: 100.00,
};

let idResposta;
let categoriaResposta;
describe(`POST em  ${URN}`, () => {
  it('Deve adicionar uma nova antifraude em analise', async () => {
    const resposta = await request(app)
      .post(URN)
      .send(analiseAntiFraude)
      .expect(201);

    categoriaResposta = resposta.body;
    idResposta = resposta.body._id;
  });

  const analiseIncompleta = {
    idCliente: '649d984b9d4bd5421a2c97e9',
  };

  it('Deve retornar um erro 400 em uma nova antifraude em analise', async () => {
    await request(app)
      .post(URN)
      .send(analiseIncompleta)
      .expect(400);
  });
  it('Deve retornar 404 caso o ID nao seja encontrado', async () => {
    await request(app)
      .post(`${URN}/600000000000000000000000`)
      .expect(404);
  });
});

describe(`GET em ${URN}`, () => {
  it('Deve retornar uma lista uma de antifraude em analise', async () => {
    await request(app)
      .get(URN)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);
  });
});

describe(`GET em  ${URN}/:id`, () => {
  it('Deve retornar uma antifraude', async () => {
    const resposta = await request(app)
      .get(`${URN}/${idResposta}`)
      .set('Accept', 'application/json')
      .expect('content-type', /json/)
      .expect(200);

    expect(resposta.body).toEqual(categoriaResposta);
  });

  it('Deve retornar 400 uma antifraude caso o ID seja invalido', async () => {
    await request(app)
      .get(`${URN}/ABC123`)
      .expect(400);
  });

  it('Deve retornar 404 uma antifraude caso o ID nao seja encontrado', async () => {
    await request(app)
      .get(`${URN}/600000000000000000000000`)
      .expect(404);
  });
});

describe(`PUT em  ${URN}/:id`, () => {
  it('Deve retornar 404 caso o ID nao seja encontrado', async () => {
    await request(app)
      .get(`${URN}/600000000000000000000000`)
      .expect(404);
  });
  it('Deve retornar 400 caso o ID seja invalido', async () => {
    await request(app)
      .get(`${URN}/ABC123`)
      .expect(400);
  });

  it('Deve retornar 400 status da analise seja invalido', async () => {
    await request(app)
      .put(`${URN}/${idResposta}`)
      .send({
        statusAnalise: 'reject',
      })
      .expect(400);
  });
  it('Deve retornar atualizar o tipo de analise para aprovada', async () => {
    await request(app)
      .put(`${URN}/${idResposta}`)
      .send({
        statusAnalise: 'aprovada',
      })
      .expect(200);

    const resposta = await request(app).get(`${URN}/${idResposta}`);

    expect(resposta.body.statusAnalise).toEqual('aprovada');
  });
  it('Deve retornar 403 uma antifraude caso o ja tenha sido aprovada', async () => {
    await request(app)
      .put(`${URN}/${idResposta}`)
      .send({
        statusAnalise: 'rejeitada',
      })
      .expect(403);
  });
});
