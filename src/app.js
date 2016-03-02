/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
var defaultText = "NOW";
var UI = require('ui');
var Vector2 = require('vector2');
var Accel = require('ui/accel');
var Settings = require('settings');
var NowText = defaultText;

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
  { url: 'http://dev.unneuron.ro/now-watch.html', autoSave: true },
  function(e) {
    console.log('opening configurable');
    Settings.data('now', NowText);
  },
  function(e) {
    NowText = e.options.now;
    Settings.data('now', NowText);
    now.text(NowText);
    console.log('closed configurable');
  }
);

Accel.config({
  rate: 10,
  samples: 25,
  subscribe: true
});

Accel.on('tap', function(e) {
  var curDate = new Date();
  var hour = curDate.getHours() > 12 ? ( curDate.getHours()-12 ) : curDate.getHours();
  var minute = curDate.getMinutes();
  var ampm = curDate.getHours() > 12 ? "pm" : "am";
  if (hour.toString().length == 1) {
    hour = "0" + hour.toString();
  }
  if (minute.toString().length == 1) {
    minute = "0" + minute.toString();
  }
  var displayText = hour + " : " + minute + " " + ampm;
 
  now.text(displayText);
  setTimeout(function(){
    now.text(NowText);
  }, 4000);
});

var prefs = Settings.data('now');
if (prefs) {
  NowText = prefs;
  now.text(NowText);
} else {
  Settings.data('now', NowText);
}


main.add(emptyTopSpace);
main.add(now);
main.add(emptyBotSpace);
main.show();