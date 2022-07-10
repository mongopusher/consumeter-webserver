export class UserUtils {
  public static isEmailAddress(emailString: string): boolean {
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailString.match(regexEmail) !== null;
  }
}
