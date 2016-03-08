/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var TimeFormat = (function(){ 
  function TimeFormat() {
    var settings = {
      "$24h": "24h",
      "$12h": "12h"
    };
    var format = settings.$24h;
    this.options = settings;
    this.setFormat = function(f) { format = f; return f; }; 
    this.getFormat = function() { return format; };
    this.is24Enabled = function() {
      if (format == settings.$24h) { return true; } return false; 
    };
    this.enable24 = function() { format = settings.$24h; };
    this.disable24 = function() { format = settings.$12h; };
  }
  return new TimeFormat(); 
})();

var settingsUrl = 'http://dev.unneuron.ro/now-watchface/settings.html';
var UI = require('ui');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var Settings = require('settings');
var NowText = "NOW";
var TimeOut = 4000;



var now = new UI.Text({
  position: new Vector2(0, 60),
  size: new Vector2(144, 168),
  text: NowText,
  font:'GOTHIC_28_BOLD',
  color:'white',
  textOverflow:'wrap',
  textAlign:'center',
  backgroundColor:'black'
});

var emptyTopSpace = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text: '',
  font: 'GOTHIC_28_BOLD',
  color: 'white',
  textAlign: 'center',
  backgroundColor:'black'
});

var emptyBotSpace = new UI.Text({
  position: new Vector2(0, 138),
  size: new Vector2(144, 168),
  text: '',
  font: 'GOTHIC_28_BOLD',
  color: 'white',
  textAlign: 'center',
  backgroundColor:'black'
});

var main = new UI.Window({
  title: '',
  subtitle: '',
  body: '',
  fullscreen: true,
  scrollable: false,
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

// Set a configurable with the open callback
Settings.config(
  { url: settingsUrl },
  function(e) {
    console.log('opening configurable');
    Settings.option({
      'now': NowText,
      'timeformat': TimeFormat.getFormat(),
      'timeout': TimeOut
    });
  },
  function(e) {
    NowText = e.options.now;
    TimeFormat.setFormat(e.options.timeformat);
    TimeOut = e.options.timeout;
    Settings.option({
      'now': NowText,
      'timeformat': TimeFormat.getFormat(),
      'timeout': TimeOut
    });
    now.text(NowText);
    console.log('closed configurable');
  }
);

var getCurrentTime = function(settings) {
  var curDate = new Date();
  
  var hour = curDate.getHours();  
  var minute = curDate.getMinutes();
  if (hour.toString().length == 1) {
    hour = "0" + hour.toString();
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute.toString();
  }
  var displayText = "";
  
  if (settings.is24Enabled !== true) {
    hour = hour > 12 ? ( hour - 12 ) : hour;
    var ampm = curDate.getHours() > 12 ? "pm" : "am";
    displayText = hour + " : " + minute + " " + ampm;
  } else {
    displayText = hour + " : " + minute;
  }
  return displayText;
};

var isDisplayTime = null;

Accel.on('tap', function(e) {
  try { clearTimeout(isDisplayTime); } catch (ex) { }
  var settings = {
    "now": NowText,
    "is24Enabled": TimeFormat.is24Enabled(),
    "timeout": TimeOut
  };
  var timeout = 1 * settings.timeout;
  var displayText = getCurrentTime(settings); 
  isDisplayTime = true;
  now.text(displayText);
  isDisplayTime = setTimeout(function(){
    isDisplayTime = false;
    now.text(NowText);
  }, timeout);
});

var prefs = Settings.option();
if (prefs && prefs.now && prefs.timeformat) {
  NowText = prefs.now;
  TimeFormat.setFormat(prefs.timeformat);
  now.text(NowText);
} else {
  Settings.option({
      'now': NowText,
      'timeformat': TimeFormat.getFormat()
  });
  now.text(NowText);
}


main.add(emptyTopSpace);
main.add(now);
main.add(emptyBotSpace);
main.show();