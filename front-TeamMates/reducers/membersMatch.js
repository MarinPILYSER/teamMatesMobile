export default function(membersMatch = [], action) {
    if(action.type === 'majMembers'){
        return action.membersMatch
    } 
     else {
        return membersMatch;
    }
  }