//Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe
var Registry = require("winreg"),
  regKey = new Registry({
    // new operator is optional
    hive: Registry.HKLM, // open registry hive HKEY_CURRENT_USER
    key: "\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" // key containing autostart programs
  });

// list autostart programs
regKey.values(function(err, items /* array of RegistryItem */) {
  if (err) console.log("ERROR: " + err);
  else
    for (var i = 0; i < items.length; i++)
      console.log(
        "ITEM: " + items[i].name + "\t" + items[i].type + "\t" + items[i].value
      );
});
