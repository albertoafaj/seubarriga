module.exports = (app) => {
  const create = async (req, res, next) => {
    try {
      const result = await app.services.account.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };
  const getAll = async (req, res, next) => {
    try {
      const result = await app.services.account.findAll();
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  };
  const get = async (req, res, next) => {
    try {
      const result = await app.services.account.find({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  };
  const update = async (req, res, next) => {
    try {
      const result = await app.services.account.update(req.params.id, req.body);
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };
  const remove = async (req, res, next) => {
    try {
      await app.services.account.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };
  return {
    create, getAll, get, update, remove,
  };
};
