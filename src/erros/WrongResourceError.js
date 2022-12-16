module.exports = function WrongResourceError(message = 'Este recurso não pertence ao usuário') {
  this.name = 'WrongResourceError';
  this.message = message;
};
