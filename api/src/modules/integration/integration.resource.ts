export class IntegrationResource {
  static get CantFindSpotifyCredentials(): string {
    return this._CantFindApiCredentialsTemplate + 'do Spotify.';
  }

  static get _CantFindApiCredentialsTemplate(): string {
    return 'Não foi possível encontrar as credenciais ';
  }
}
