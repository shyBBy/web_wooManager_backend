export class ActivationCode {
  public static create() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let activationCode = '';
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      activationCode += characters[randomIndex];
    }
    return activationCode;
  }

  public static compare(codeFromDb: string, codeFromReq: string) {
    if (codeFromDb === codeFromReq) {
      return true;
    }

    return false;
  }
}
