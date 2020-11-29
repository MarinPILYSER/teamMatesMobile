export default function(membersToUpdate = [], action) {
    if(action.type === 'majMembersToUpdate'){
        return action.membersToUpdate
    } 
     else {
        return membersToUpdate;
    }
  }