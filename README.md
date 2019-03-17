# Giva-app-2nd-3
<h2>
Introduction:</h2>
<p>One day, you do not want to use some items anymore, but the items still work well. you think of giving them away for someone who needs it. for the giver, you help people, receive their thanks and it's not wastefull by throwing them away as trash. for the taker, you could save your money. 
</p>
<h2>Features:</h2>
<ul>
  <li>Authentication</li>
  <li>Register</li>
  <li>Login</li>
  <li>Make a post</li>
  <li>Chat</li>
  <li>Show map and route with vehicles and starting time</li>
  <li>Search by name of items or Nearby or Category</li>
  <li>Choose who will have the item and block others</li>
  <li>Update/Delete a post</li>
  <li>Update the user info</li>
  <li>Be able to use on PC and Mobile</li>
</ul>
<h3>Run on Browser:</h3>
<p>ionic serve</p>
<h3>Run on Android emulater:</h3>
<p>ionic cordova emulate android -lc</p>
<h3>Run on Android devices:</h3>
<p>ionic cordova run android --device</p>
<h3>Run on iphone emulator:</h3>
<p>1. open file package.json</p>
<p>2. insert the following code:</p>
<p>"scripts": {
     "start": "ionic-app-scripts serve",
     "clean": "ionic-app-scripts clean",
     "build": "ionic-app-scripts build",
     "lint": "ionic-app-scripts lint",
     "emulate-live": "ionic cordova emulate ios -lc --debug --target=\"iPhone-X\" -- --buildFlag=\"-UseModernBuildSystem=0\"",
     "emulate-live-iPhone-8-Plus": "ionic cordova emulate ios -lc --target=\"iPhone-8-Plus\" -- --buildFlag=\"-UseModernBuildSystem=0\"",
     "emulate": "ionic cordova emulate ios --target=\"iPhone-X\" -- --buildFlag=\"-UseModernBuildSystem=0\"",
     "build-prod": "ionic cordova build ios --prod --release -- --buildFlag=\"-UseModernBuildSystem=0\"",
     "device": "ionic cordova run ios -- --buildFlag=\"-UseModernBuildSystem=0\""
   }    </p>
   <p>ionic cordova emulate ios -lc</p>
