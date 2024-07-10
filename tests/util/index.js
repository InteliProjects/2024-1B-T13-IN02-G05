const sinon = require("sinon");

const mockAsync = (model, module, result = null) => {
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
};

const WORKER = {
	"registrations": "D2022.1324.001",
	"names": "Gabriela Silva",
	"emails": "gabriela.silva@montador.dell.com",
	"passwords": "gabriela1234",
	"birthdays": "1981-03-02",
  "lines": "Alienware-0453"
};

module.exports = {
  mockAsync,
  RESPONSE,
  WORKER,
};