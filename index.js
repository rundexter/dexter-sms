var restler = require('restler')
    , util = require('util')
    , PNF = require('google-libphonenumber').PhoneNumberFormat
    , phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance()
    , Q = require('q')
;

module.exports = {
  run: function(step, dexter) {
      var api_key  = dexter.user('profile').api_key
        , to       = step.input('phone_number')
        , msg      = step.input('message')
        , app_name = dexter.app('name')
        , url      = dexter.url('home')+'api/app/'+app_name+'/sms/?api_key='+api_key
        , simulate = Boolean(dexter.environment('dexter_sms_simulate', false))
        , self     = this
        , truncMsg = ''
        , sendQueue = [] 
      ;

      if(!url)            return this.fail('home url required');
      if(!api_key)        return this.fail('api_key required');
      if(!app_name)       return this.fail('app_name required');
      if(!to.length)      return this.fail('phone_number required');
      if(!msg.length)     return this.fail('message required');
      msg = msg.toArray().join('|');

      //There's an edge case where the data has nothing but false-y things in it ('', undefined, null, etc.)...make sure we handle that.
      if(msg.replace(/[| ]/g, '') === '') {
          return this.fail('Message cannot be empty');
      }
      //As we all know, texts are tiny...
      if(msg.length > 160) {
          msg = msg.substring(0, 157) + '...';
          truncMsg = ' (truncated) ';
      }

      //Let the user know what's happening
      self.log(util.format('Sending "%s" to "%s"'
          , msg + truncMsg
          , to.toArray().join(',')
      ));
      if(simulate) {
          self.log('SIMULATION ONLY - no texts will be sent.  Remove the dexter_sms_debug private variable to send for real.');
      }

      to.each(function(phone) {
          sendQueue.push(self.send(phone, msg, api_key, url, simulate));
      });
      Q.allSettled(sendQueue).then(function(results) {
          results.forEach(function(result) {
              if(result.state === 'rejected') {
                  self.log(util.format('Failed sending to %s - %s', 
                      result.reason.phone
                      , result.reason.error.message
                  ), result.reason);
              }
          });
          this.complete({});
      });
  }
  , getPhoneNumber: function(phone) {
      var phoneFinal;
      //Do some basic validation on phone numbers.
      if(phone.indexOf('+') === 0) {
          //First, if the number starts with a +, validate it as an international number
          phoneFinal = phoneUtil.parse(phone, '');
          if(phoneFinal && phoneUtil.isValidNumber(phoneFinal)) {
              phoneFinal = phoneUtil.format(phoneFinal, PNF.E164);
          } else {
              throw new Error('Invalid international phone number');
          }
      } else {
          //We'll assume it's a US number
          phoneFinal = phoneUtil.parse(phone, 'US');
          if(phoneFinal && phoneUtil.isValidNumber(phoneFinal)) {
              phoneFinal = phoneUtil.format(phoneFinal, PNF.E164);
          } else {
              throw new Error('Invalid US phone number - international numbers should start with +[country code]');
          }
      }
      return phoneFinal;
  }
  , send: function(phone, msg, api_key, url, simulate) {
      var deferred = Q.defer()
          , self = this
          , fixedPhone
      ;
      try {
          fixedPhone = this.getPhoneNumber(phone);
      } catch(e) {
          deferred.reject({ phone: phone, error: e });
      }
      if(fixedPhone) {
          if(simulate) {
              deferred.resolve(phone);
          } else {
              restler.post(url, {
                data: {
                    to      : fixedPhone 
                  , message : msg
                }
                , headers: {
                    'X-Authorization': api_key
                }
              }).on('complete', function(result, response) {
                  if(result instanceof Error) {
                      deferred.reject({
                          phone: phone
                          , error: result
                      });
                  } else if(response.statusCode !== 200) {
                      if(result && result.message) {
                          deferred.reject({
                              phone: phone
                              , error: {
                                  message: result.message
                                  , data: result
                              }
                          });
                      } else {
                          deferred.reject({
                              phone: phone
                              , error: {
                                  message: 'Unexpected Response From Server ' + response.statusCode
                                  , data: result
                              }
                          });
                          console.log(result.error);
                      }
                  } else {
                      if(result.success) {
                          deferred.resolve(phone);
                      } else {
                          deferred.reject({
                              phone: phone
                              , error: {
                                  message: result.message || '(unknown error)'
                                  , data: result
                              }
                          });
                      }
                  }
              }.bind(self));
          }
      }
      return deferred.promise;
  }
};
