import { selectors, Base } from './index.js'
import { testUsers } from '../../../../helpers/index.js';

const base = Base();
const { signinPage } = selectors;
const { user1 } = testUsers
export default {
  signin: async () => {
    const signinFormHeader = await base.find(signinPage.signinFormHeader).getText();
    await base.write(signinPage.username, user1.username);
    await base.write(signinPage.password, user1.password);
    await base.find(signinPage.siginBtn).click();
    return {
      signinFormHeader,
    }
  },
  inLineSignin:  async (username = 'username', passwd = 'Aa!12345') => {
    const usernameInput = await base.find(selectors.landingPage.username);
    const passwordInput = await base.find(selectors.landingPage.password);
    const submitBtn = await base.find(selectors.landingPage.loginBtn);
    await usernameInput.sendKeys(username);
    await passwordInput.sendKeys(passwd);
    const result = await submitBtn.click();
    return result;
  },
}
