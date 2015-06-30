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
      ;

      if(!url)     return this.fail('home url required');
      if(!api_key) return this.fail('api_key required');
      if(!to)      return this.fail('phone_number required');
      if(!msg)     return this.fail('message required');

      console.log(url);

      restler.post(url, {
        data: {
            to      : to
          , message : msg
        }
        , headers: {
            'X-Authorization': api_key
        }
      }).on('complete', function(result, response) {
          return response.statusCode == 200 
            ? this.complete({noop: true})
            : this.fail({ message: 'Unexpected Response From Server '+response.statusCode + result });
      }.bind(this));
  }
};
