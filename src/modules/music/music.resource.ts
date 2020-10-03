export class MusicResource {
  static get PageIsRequired() {
    return 'Parâmetro \'page\' é obrigatório';
  }

  static get PageMustBeAnInteger() {
    return 'Parâmetro \'page\' deve ser um número inteiro';
  }

  static get ElapsedTime() {
    return 'Ellapsed time: ';
  }
}
