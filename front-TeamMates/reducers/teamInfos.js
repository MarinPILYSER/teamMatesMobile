export default function(teamInfos = {
    teamID: '',
    teamName: '',
    teamCode: 0
}, action) {
    if(action.type === 'majTeam'){
        return action.teamInfos
    } 
     else {
        return teamInfos;
    }
  }