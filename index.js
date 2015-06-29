var restler = require('restler')
;

module.exports = {
  init: function() {
  }
  , run: function(step, dexter) {
      var url     = dexter.url('home')
        , api_key = dexter.user('api_key')
        , to      = step.input('to')
        , msg     = step.input('message')
      ;

      if(!url)     return this.fail('home url required');
      if(!api_key) return this.fail('api_key required');
      if(!to)      return this.fail('to number required');
      if(!msg)     return this.fail('message required');

      restler.post(url+'api/sms', {
        data: {
            to      : to
          , message : msg
        }
        , headers: {
            'X-Authorization': api_key
        }
      }).on('complete', function(result, response) {
          return response.statusCode == 200 
            ? this.complete({})
            : this.fail({ message: 'Unexpected Response From Server' });
      }.bind(this));
  }
};
