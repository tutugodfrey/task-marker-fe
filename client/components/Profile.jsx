import React, { Fragment, useState, useEffect } from 'react';
import { observer, } from 'mobx-react';
import { Link } from 'react-router-dom';
import { request, baseUrl } from '../helpers/index.js';
import Navigation from './Navigation.jsx';
import store from '../store/index.js';

const Profile = () => {
  const [ state, setState ] = useState({
    user: store.userStore.getUser,
    editMode: false,
    editUser: store.userStore.getUser,
    changeProfileImage: false,
    photoLoaded: false,
    photoUploadCompleted: false,
    oldProfileImage: '/profilePhotos/default-profile.png',
    profileImage: '/profilePhotos/default-profile.png',
    imageObj: {},
  });

  const {
    user, editUser, editMode, changeProfileImage, photoLoaded, 
    photoUploadCompleted, profileImage, oldProfileImage, imageObj,
   } = state;
   const { name, email, username, imgUrl } = user;
   const { name: _name, email: _email, } = editUser;
  const changeProfileBtnColor = changeProfileImage ? 'red': 'dark';
  const showUploadBtn = photoLoaded ? 'show' : 'hide';

  useEffect(() => {
    async function fetchData() {
      if (!Object.keys(user).length) {
        const getUser = await request('/user', 'GET');
        store.userStore.setUser(getUser);
      }

      setState({
        ...state,
        editUser: store.userStore.getUser,
      });
      renderProfilePhoto(imgUrl);
    }
    fetchData();
  }, [user]);
  
  const onEditText = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      editUser: {
        ...editUser,
      [name]: value,
      }
    });
  };

  const toggleEditMode = (event) =>{
    setState({
      ...state,
      editMode: !editMode,
    });
  };

  const toggleChangeImageMode = (event) => {
    if (photoLoaded) {
      URL.revokeObjectURL(profileImage);
      setState({
        ...state,
        photoLoaded: false,
        imageObj: {},
        profileImage: oldProfileImage,
        changeProfileImage: !changeProfileImage,
      });
    } else {
      setState({
        ...state,
        changeProfileImage: !changeProfileImage,
      });
    };
  };

  const handlePhotoPreview = async (event) => {
    const image =  event.target.files[0];
    const _profileImage = profileImage;
    const url = URL.createObjectURL(image);
    setState({
      ...state,
      oldProfileImage: _profileImage,
      profileImage: url,
      photoLoaded: true,
      imageObj: image,
    });
  };

  const uploadPhoto = async (event) => {
    const formData = new FormData();
    formData.append('profilePhoto', imageObj);
    const res = await request('/users/photo', 'POST', formData);
    if (res.name) {
      setState({
        ...state,
        photoUploadCompleted: true,
      });
      store.userStore.setUser(res);
      completePhotoUpload();
    };
  };

  const completePhotoUpload = () => {
    setTimeout(() => {
      setState({
        ...state,
        photoUploadCompleted: false,
        photoLoaded: false,
        changeProfileImage: false,
      });

    }, 3000);
  };

  const onSaveUpdate = async (event) => {
    const user_ = { ...editUser };
    delete user_.token;
    const updatedUser = await request('/users', 'PUT', user_);
    if (!updatedUser.message) {
      store.userStore.setUser(updatedUser);
      setState({
        ...state,
        user: store.userStore.getUser,
        editMode: false,
      });
    };
  };

  const renderProfilePhoto = (imgUrl_) => {
    console.log('Image Url', imgUrl_);
    console.log('Base Url', baseUrl)
    if (imgUrl_) {
      const splitedBaseUrl = baseUrl.split('/');
      const newBaseUrl = `${splitedBaseUrl[0]}//${splitedBaseUrl[2]}`;
      const newImgUrl = imgUrl_.replace('public', newBaseUrl);
      setState({
        ...state,
        profileImage: newImgUrl,
      });
    };
  };

  return (
    <div>
      <Navigation />
      <div className="back-link_div">
        <Link to="/dashboard">&laquo; Back</Link>
      </div>
      <div id="profile-page">
        {editMode && (
          <div id="edit-profile">
            <div className="profile-image_div">
              <img src={ profileImage }/>
            </div>
            <div className="input-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={_name}
                onChange={onEditText}
              />
            </div>
            <div className="input-group">
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={_email}
                onChange={onEditText}
              />
            </div>
            <div id="btn-group">
              <div>
                <button type="button" id="save-edit" onClick={onSaveUpdate}
                >Save</button>
              </div>
              <div>
                <button type="button" id="cancel-edit" onClick={toggleEditMode}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
        {!editMode && (
          <div id="profile-info">
            <div id="profile-header_div">
              <h3>{name}</h3>
            </div>
            <div className="profile-image_div" id="profile-image_div">
              {photoUploadCompleted && 
              <span
                id="profile-photo-save-success"
                className="pop-up">Profile picture have been saved!
              </span>}
              <Fragment>
                <img
                  src={ profileImage }
                />
                <br />
              </Fragment>
              { photoLoaded &&
                <button
                  className={showUploadBtn}
                  onClick={uploadPhoto}>Upload
                </button>}
              <br />
              { changeProfileImage && 
                <Fragment>
                  <input
                    type='file'
                    name='profile-photo'
                    onChange={handlePhotoPreview}
                  />
                  <br />
                </Fragment>}
              <button
                id="change-profile-photo"
                className={changeProfileBtnColor}
                onClick={toggleChangeImageMode}
              >
                { changeProfileImage ? "Cancel" : "Change" }
              </button>
            </div>
            <div className="profile-details">
              <div><strong>Email:</strong></div>
              <div><span>{email}</span></div>
            </div>
            <div className="profile-details">
              <div><strong>Username:</strong></div>
              <div><span>{username}</span></div>
            </div>
            <div id="edit-profile-btn_div">
              <button
                type="button"
                onClick={toggleEditMode}
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default observer(Profile);
