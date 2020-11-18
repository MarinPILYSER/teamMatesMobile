// CONNECTION TO DATABASE

var mongoose = require('mongoose');





var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
   
        useUnifiedTopology : true
   }
   mongoose.connect('mongodb+srv://mates:KBXlMxjbfNLTVQ9M@cluster0.huwlg.mongodb.net/TeamMates?retryWrites=true&w=majority',                       
    options,    
    function(err) {
     console.log(err);
    }
   );



   module.exports = mongoose;