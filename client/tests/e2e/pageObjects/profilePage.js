import { selectors, Base } from './index.js'
import { testUsers } from '../../../../helpers/index.js';

const image_to_upload =  process.env.IMAGE_UPLOAD || '/Users/godfreytutu/Desktop/projects/task-marker-fe/public/uploads/profilePhoto-1.jpg'
const base = Base();
const { tasks, profile } = selectors;
const { editUser1 } = testUsers;

export default {
  navToProfile: async () => {
    await base.find(tasks.profileLink).click();
    await base.waitUntilPageLoad('/profile');
    await base.driver.sleep(300)
    const name = await base.find(profile.profileHeader).getText();
    await base.driver.sleep(200)
    const emailKey = await base.find(profile.emailKey).getText();
    const emailValue = await base.find(profile.emailValue).getText();
    const usernameKey = await base.find(profile.usernameKey).getText();
    const usernameValue = await base.find(profile.usernameValue).getText();
    await base.driver.sleep(2000)
    const details = {
      name,
      [emailKey.substring(0, emailKey.length - 1).toLowerCase()]: emailValue,
      [usernameKey.substring(0, usernameKey.length - 1).toLowerCase()]: usernameValue,
    }
    return details;
  },
  editProfileAndCancel: async () => {
    const editProfileBtn = await base.find(profile.editProfileBtn);
    const editBtnName = await editProfileBtn.getText();
    await base.driver.sleep(100);
    await editProfileBtn.click();
    await base.find(profile.editProfileInputName).clear();
    await base.write(profile.editProfileInputName, editUser1.name);
    await base.find(profile.editProfileInputEmail).clear();
    await base.write(profile.editProfileInputEmail, editUser1.email);
    await base.driver.sleep(200);
    const cancelBtn = await base.find(profile.cancelEditBtn);
    await base.driver.sleep(300);
    const cancelBtnName = await cancelBtn.getText();
    await base.driver.sleep(500);
    await cancelBtn.click();
    return {
      editBtnName,
      cancelBtnName,
    }
  },
  editProfileAndSave: async () => {
    const editProfileBtn = await base.find(profile.editProfileBtn);
    await base.driver.sleep(200)
    await editProfileBtn.click();
    await base.find(profile.editProfileInputName).clear();
    await base.write(profile.editProfileInputName, editUser1.name);
    await base.find(profile.editProfileInputEmail).clear();
    await base.write(profile.editProfileInputEmail, editUser1.email);
    await base.driver.sleep(400)
    const saveBtn = await base.find(profile.saveEditBtn);
    await base.driver.sleep(1000)
    const saveBtnName = await saveBtn.getText();
    await saveBtn.click()
    await base.driver.sleep(500)
    return {
      saveBtnName
    }
  },
  changeProfilePhoto: async () => {
    const changeProfilePhotoBtn = await base.find(profile.changeProfilePhotoBtn);
    await changeProfilePhotoBtn.click();
    await base.find(profile.fileInputField).sendKeys(image_to_upload);
    await base.find(profile.uploadBtn).click();
    return null;
  },
}
