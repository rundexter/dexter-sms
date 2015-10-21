module.exports = {
    workflow: {
        //You have to make this a real workflow slug
        name: '!!!'
    },
    "user": {
        "profile": {
            "email": "YOUR_EMAIL"
            , "username": "YOUR_DEXTER_USERNAME"
            , "api_key": "YOUR_DEXTER_API_KEY"
         }
    }
    , "data": {
        "local_test_step": {
            "input": {
                "phone_number": "YOUR_PHONE_NUMBER" //Digits only: 5555555555, not 555-555-5555
            }
        }
    }
};
