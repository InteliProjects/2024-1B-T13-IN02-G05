const assert = require("assert");
const sinon = require("sinon");
const controller = require ("../../api/controllers/WorkerController");

// Arrange 
const { mockAsync, RESPONSE, WORKER } = require("../util");

describe("WorkerController", () => {
    
    let createStub;
    let deleteStub;

  
    afterEach(() => {
        if (createStub) {
            createStub.restore();
        }

        if (deleteStub) {
            deleteStub.restore();
        }
    });


    const sinon = require('sinon');

it("Deve criar montador com sucesso", async () => {
    // Simulação da função create do Worker
    createStub = mockAsync(Worker, 'create', true);

    // Preparação do objeto req
    const req = {
        body: WORKER 
    };

    // Simulação do objeto res
    const res = {
        status: sinon.stub().returnsThis(), // Permite encadeamento
        json: sinon.stub().returnsThis()    // Permite encadeamento
    };

    // Act
    await controller.create(req, res);

    // Assert
    sinon.assert.calledWith(res.json, { message: "Worker created successfully!" });
});

it("Deve falhar ao criar montador com erro interno", async () => {
    // Arrange
    createStub = sinon.stub(Worker, 'create').rejects(new Error("Internal server error"));
    const req = { body: WORKER };

    const res = {
        status: sinon.stub().returnsThis(), // Permite encadeamento
        json: sinon.stub().returnsThis()    // Permite encadeamento
    };

    // Act
    await controller.create(req, res);

    // Assert
    assert.strictEqual(res.status.calledWith(500), true);
    assert.strictEqual(res.json.calledWith({ error: "Internal server error" }), true);
  });


it("Deve retornar um único montador por ID com sucesso", async () => {
    // Arrange
    //findOneStub = mockAsync(Worker, "findOne", WORKER);
    findOneStub = sinon.stub(Worker, 'findOne').resolves(WORKER);

    
    const req = { params: { id: WORKER.id } };

    const res = {
        status: sinon.stub().returnsThis(), // Permite encadeamento
        json: sinon.stub().returnsThis()    // Permite encadeamento
    };

    // Act
    await controller.getById(req, res);

    // Assert
    assert.strictEqual(res.json.calledWith(WORKER), true);
});
});