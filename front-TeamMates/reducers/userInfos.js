export default function(userInfos = {
    admin: true,
    name: 'Doe',
    firstname: 'John',
    email: 'UserEmail',
    date_of_birth: '21/12/1994',
    token: 'UserToken',
    picture_Url: 'https://res.cloudinary.com/teammates/image/upload/v1603712223/Assets%20TeamMates/avatar-inconnu_d0i5cx.jpg',
    team: '5f99714d7fb9422b4e18c867'
  }, action) {
    if(action.type === 'majUser'){
      return action.userInfos
    } 
     else {
        return userInfos;
    }
  }
