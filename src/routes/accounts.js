module.exports = (app) => {
  const create = async (req, res) => {
    const result = await app.services.account.save(req.body);
    if (result.error) return res.status(400).json(result);
    return res.status(201).json(result[0]);
  };
  const getAll = async (req, res) => {
    const result = await app.services.account.findAll();
    return res.status(200).json(result);
  };
  const get = async (req, res) => {
    const result = await app.services.account.find({ id: req.params.id });
    return res.status(200).json(result);
  };
  const update = async (req, res) => {
    const result = await app.services.account.update(req.params.id, req.body);
    return res.status(200).json(result[0]);
  };
  const remove = async (req, res) => {
    await app.services.account.remove(req.params.id);
    return res.status(204).send();
  };
  return {
    create, getAll, get, update, remove,
  };
};
