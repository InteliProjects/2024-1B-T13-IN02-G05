const assert = require("assert");
const sinon = require("sinon");
const controller = require("../../api/controllers/EngineerController");

// Arrange
const { mockAsync, RESPONSE, ENGINEER } = require("../util/");

describe("EngineerController", () => {
  let createStub, findStub, findOneStub, updateStub, deleteStub;

  // Restaurar stubs após cada teste
  afterEach(() => {
    if (createStub) createStub.restore();
    if (findStub) findStub.restore();
    if (findOneStub) findOneStub.restore();
    if (updateStub) updateStub.restore();
    if (deleteStub) deleteStub.restore();
  });



    it("Deve criar engenheiro com sucesso", async () => {
        // Arrange
        const createdEngineer = { ...ENGINEER, id: 1 };
        createStub = mockAsync(Engineer, "create", createdEngineer);
        const req = {
          body: ENGINEER,
        };
        const res = {
          status: sinon.stub().returnsThis(),
          json: sinon.stub().returnsThis(),
        };
        
        // Act
        await controller.create(req, res);
    
        // Assert
        assert.strictEqual(createStub.calledOnce, true);
        assert.strictEqual(res.json.calledOnce, true);
        const jsonResponse = res.json.firstCall.args[0];
        assert.deepStrictEqual(jsonResponse, {
        message: "Engineer created successfully!",
        engineer: createdEngineer
        });
      });
    

    it("Deve falhar ao criar engenheiro com erro interno", async () => {
    // Arrange
    createStub = mockAsync(Engineer, "create", null, new Error("Internal server error"));
    const req = { body: ENGINEER };

    // Act
    await controller.create(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.status.calledWith(500), true);
    assert.strictEqual(RESPONSE.json.calledWith({ error: "Internal server error" }), true);
  });

  it("Deve retornar todos os engenheiros com sucesso", async () => {
    // Arrange
    const engineersMock = [ENGINEER, ENGINEER];
    findStub = mockAsync(Engineer, "find", engineersMock);

    // Act
    await controller.getAll(null, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.json.calledWith(engineersMock), true);
  });

  it("Deve retornar engenheiro por ID com sucesso", async () => {
    // Arrange
    findOneStub = mockAsync(Engineer, "findOne", ENGINEER);
    const req = { params: { id: ENGINEER.id } };

    // Act
    await controller.getById(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.json.calledWith(ENGINEER), true);
  });

  it("Deve atualizar engenheiro com sucesso", async () => {
    // Arrange
    updateStub = mockAsync(Engineer, "update", [ENGINEER]);
    findOneStub = mockAsync(Engineer, "findOne", ENGINEER);
    const req = { params: { id: ENGINEER.id }, body: ENGINEER };

    // Act
    await controller.update(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.json.calledWith({ message: "Engineer updated successfully!", engineer: [ENGINEER] }), true);
  });

  it("Deve falhar ao atualizar engenheiro que não existe", async () => {
    // Arrange
    findOneStub = mockAsync(Engineer, "findOne", null);
    const req = { params: { id: 9999 }, body: ENGINEER };

    // Act
    await controller.update(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.status.calledWith(404), true);
    assert.strictEqual(RESPONSE.json.calledWith({ error: "Engineer not found" }), true);
  });

  it("Deve deletar engenheiro com sucesso", async () => {
    // Arrange
    deleteStub = mockAsync(Engineer, "destroyOne", ENGINEER);
    const req = { params: { id: ENGINEER.id } };

    // Act
    await controller.delete(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.json.calledWith({ message: "Engineer deleted successfully!" }), true);
  });

  it("Deve retornar erro ao deletar engenheiro que não existe", async () => {
    // Arrange
    deleteStub = mockAsync(Engineer, "destroyOne", null);
    const req = { params: { id: 9999 } };

    // Act
    await controller.delete(req, RESPONSE);

    // Assert
    assert.strictEqual(RESPONSE.status.calledWith(404), true);
    assert.strictEqual(RESPONSE.json.calledWith({ error: "Engineer not found" }), true);
  });
});
