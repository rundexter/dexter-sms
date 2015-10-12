var restler = require('restler')
;

module.exports = {
  init: function() {
  }
  , run: function(step, dexter) {
      var api_key  = dexter.user('profile').api_key
        , to       = step.input('phone_number')
        , msg      = step.input('message')
        , app_name = dexter.app('name')
        , url      = dexter.url('home')+'api/app/'+app_name+'/sms/?api_key='+api_key
        , self     = this
        , truncMsg = ''
      ;

      if(!url)     return this.fail('home url required');
      if(!api_key) return this.fail('api_key required');
      if(!app_name) return this.fail('app_name required');
      if(!to.length)      return this.fail('phone_number required');
      if(!msg.length)     return this.fail('message required');
      msg = msg.toArray().join('|');
      //There's an edge case where the data has nothing but false-y things in it ('', undefined, null, etc.)...make sure we handle that.
      if(msg.replace(/[| ]/g, '') == '') {
          return this.fail('Message cannot be empty');
      }
      //As we all know, texts are tiny...
      if(msg.length > 160) {
          msg = msg.substring(0, 157) + '...';
          truncMsg = ' (truncated) ';
      }

      console.log('Sending',  msg + truncMsg, 'to', to.toArray().join(','));

      to.each(function(phone) {
          restler.post(url, {
            data: {
                to      : phone.replace(/[^+\d]/g, '')
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
      });
  }
};
