var restler = require('restler')
;

module.exports = {
  init: function() {
  }
  , run: function(step, dexter) {
      var api_key = dexter.user('profile').api_key
        , to      = step.input('phone_number')
        , msg     = step.input('message')
        , url     = dexter.url('home')+'api/sms/?api_key='+api_key
        , self    = this
      ;

      if(!url)     return this.fail('home url required');
      if(!api_key) return this.fail('api_key required');
      if(!to.length)      return this.fail('phone_number required');
      if(!msg.length)     return this.fail('message required');
      msg = msg.toArray().join('|');

      console.log('Sending',  msg, 'to', to.toArray().join(','));

      to.each(function(phone) {
          try {
              restler.post(url, {
                data: {
                    to      : phone.replace(/[^\d]/g, '')
                  , message : msg
                }
                , headers: {
                    'X-Authorization': api_key
                }
              }).on('complete', function(result, response) {
                  if(result instanceof Error) return self.fail(result);
                  return response.statusCode == 200 
                    ? self.complete({})
                    : self.fail({ message: 'Unexpected Response From Server '+response.statusCode, data: result });
              }.bind(self));
          } catch(e) {
              self.fail(e);
          }
      });
  }
};
