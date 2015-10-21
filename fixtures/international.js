var _ = require('lodash')
    , base = require('./default')
;
module.exports = _.merge(base, {
    environment: {
        dexter_sms_simulate: true
    }
    , data: {
        local_test_step: {
            input: {
                //Overwrite the phone number
                phone_number: [
                    '+93 30 539-0605' //Afghanistan
                    , '+862012553456' //China (no spaces)
                    , '+7 84012-345 67' //Russia (wrong spaces)
                    , '+123'
                    , '(954) 555-1234'
                    , '954-555-1234'
                    , '954 555 1234'
                    , '9545551234'
                    , '123'
                ]
            }
        }
    }
});
