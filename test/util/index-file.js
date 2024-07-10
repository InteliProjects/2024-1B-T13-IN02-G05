const sinon = require("sinon");

const mockAsync = (model, module, result = null) => {
  return sinon.stub(model, module).resolves(result);
};

const RESPONSE = {
  json: function (data) {
    return data;
  },
};

const FILE = {
  id: "500",
  manuals_id: "20",
  names: "Alienware Alpha Service Manual",
  types: "PDF",
  url: "https://dl.dell.com/manuals/all-products/esuprt_desktop/esuprt_alienware_dsk/alienware-alpha_owner's%20manual_en-us.pdf",
};

module.exports = {
  mockAsync,
  RESPONSE,
  FILE
};