# Dexter SMS

This [Dexter](http://rundexter.com) module will send an text message to one or more recipients.

# Configuring the Step

## Input parameters

|Parameter|Required|Multiple|Details|
|---------|--------|--------|-------|
|to | Yes | Yes | A list of numbers to send to.  US numbers are assumed unless the number begins with +(country code) |
|msg | Yes | Yes | Text to send.  Multiple values will be joined together, but the entire final message will truncate with an ellipse after 160chr |

## Private variables

You can set dexter_sms_simulate = true in your private variables to simulate the sending of a text without actually sending one.
