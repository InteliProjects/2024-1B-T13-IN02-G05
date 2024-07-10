const assert = require("assert");
const sinon = require("sinon");
const controller = require("../../api/controllers/FileController");
//Arrange
const { mockAsync, RESPONSE, FILE } = require("../util/index-file");

describe("FileController", () => {
  //permitindo mockar várias vezes o create
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
  
  it("Deve criar arquivo com sucesso", async () => {
    
    //Arrange
    createStub = mockAsync(File, "create", true);
    const req = {
      body: FILE,
    };
    
    //Act
    const result = await controller.create(req, RESPONSE);

    //Assert
    assert.strictEqual(createStub.calledOnce, true);
    assert.deepStrictEqual(result.message, "File created successfully!");
  });

  it("Deve falhar ao criar arquivo com parâmetros incorretos", async () => {
    //Arrange
    createStub = mockAsync(File, "create", true);
    const req = {
      body: {
        manuals_id: "2",
        bobao: "Alienware Manual Service",
        url: "alienware-manual-service.pdf"
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    //Act
    await controller.create(req, res);

    //Assert
    assert.strictEqual(res.status.calledWith(400), true, "Deve retornar status 400");
    assert.strictEqual(res.json.calledWith({ error: "Missing required fields" }), true, "Deve retornar mensagem de erro de campos ausentes");

  })

  it("Deve falhar ao criar arquivo com parâmetros faltando", async () => {
    //Arrange
    createStub = mockAsync(File, "create", true);
    const req = {
      body: {
        names: "Alienware Manual Service",
      }
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    //Act
    await controller.create(req, res);

    //Assert
    assert.strictEqual(res.status.calledWith(400), true, "Deve retornar status 400");
    assert.strictEqual(res.json.calledWith({ error: "Missing required fields" }), true, "Deve retornar mensagem de erro de campos ausentes");

  })

  it("Deve retornar todos os arquivos com sucesso", async () => {
    //Arrange
    const filesMock = [
      {  "createdAt": 1717896675996,
        "updatedAt": 1717896675996,
        "id": 1,
        "names": "lalala",
        "types": "Video",
        "url": "lala.mp4",
        "manuals_id": 2 },
      { "createdAt": 1717898892641,
        "updatedAt": 1717898892641,
        "id": 2,
        "names": "Manual do usuário",
        "types": "PDF",
        "url": "https://dl.dell.com/manuals/all-products/esuprt_ser_stor_net/esuprt_pedge_srvr_ethnt_nic/broadcom-netxtreme-adapters_users-guide3_pt-br.pdf",
        "manuals_id": 3 }
    ]; 

    const getAllStub = mockAsync(File, "find", filesMock);

    let req;
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    //Act
    await controller.getAll(req, res);

    //Assert
    assert.strictEqual(res.json.calledWith(filesMock), true, "Deve retornar os arquivos com sucesso");

  });

  it("Deve deletar um arquivo com sucesso", async () => {
    //Arrange

    deleteStub = mockAsync(File, "destroyOne", true);

    let req = { params: { id: 1 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    //Act
    await controller.delete(req, res);

    //Assert
    assert.strictEqual(res.json.calledWith({ message: "File deleted successfully!" }), true, "Deve deletar um arquivo com sucesso");

  });

  it("Deve retornar um erro se o arquivo não for encontrado", async () => {
    //Arrange

    deleteStub = mockAsync(File, "destroyOne", null);

    let req = { params: { id: 100000 } };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
    };

    //Act
    await controller.delete(req, res);

    //Assert
    assert.strictEqual(res.status.calledWith(404), true, "Deve retornar status 404 se o arquivo não for encontrado");
    assert.strictEqual(res.json.calledWith({ error: "File not found" }), true, "Deve retornar o erro file not found");

  });


});

