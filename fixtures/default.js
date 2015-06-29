var _   = require('lodash')
  , env = require('./env')
;

module.exports = _.merge({
    "internals": {
        /*
         * SAMPLE DATA 
         *
         * These properties will be set by the engine when your step is called.
         */
        "instance": {
            "id": "i962a3ce-883b-4976-a583-29440a7f638d",
            "isTest": true // will be false when run by the workflow engine
        }
        ,"workflow": {
            "id": "w962a3ce-883b-4976-a583-29440a7f638d"
        }
        ,"step": {
            "id": "s962a3ce-883b-4976-a583-29440a7f638d"
        }
    },
    "input": {
       /*
        * input to this step (specified in meta.json)
        * "url" : "https://rundexter.com"
        */
    },
   /*
    * These come from env.js
    *
    "privates": {
        * e.g. oauth keys, slack tokens
        * "instapaper_consumer_key": "somerandomcharacters",
        * "instapaper_consumer_secret": "somemorerandomcharacters"
    },
    *
    */
    "providers": {
       "instapaper": {
          "access_token": "{\"oauth_token_secret\":\"providerdatacapturedydexter\",\"oauth_token\":\"moreproviderdatacapturedbydexter\"}"
       }
    }, 
    "settings": {
       /*
        * settings data passed to the step
        * "mustache": "A sample {mustache} template"
        */
    }
}, env);
