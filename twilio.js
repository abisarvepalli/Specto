var twilio = require('twilio');
var cliet = twilio('AC83417804762ea12e0846e4b821066844', '74a8e8571a5a7d9857969ebf9d423084');

client.sendMessage({
	to: '14084580997',
	from: '14085604220',
	body: 'Alert on credit account ' + creditNum
});