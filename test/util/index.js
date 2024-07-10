const sinon = require("sinon");

const mockAsync = (model, module, result = null, error = null) => {
  if (error) {
    return sinon.stub(model, module).rejects(error);
  }
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  status: sinon.stub().returnsThis(),
  json: sinon.stub().returnsThis(),
  send: sinon.stub().returnsThis(),
};

const ENGINEER = {
  id: "1",
  name: "John Doe",
  expertise: "Software Engineering",
  email: "john.doe@example.com",
};

module.exports = {
  mockAsync,
  RESPONSE,
  ENGINEER
};
