# sf6-input-history
sf6 styled input history browser source to use with OBS or other recording software

## Disclaimer
**follow the following instructions** or else I won't promise this'll work

this is made using the javascript [gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API) so it won't work with keyboards. I have no plans to make it work with keyboards but you're free to do that yourself

furthermore the **font used was sourced from https://x.com/ahmz1404/status/1667148859771097091** so big thanks to them

## Usage instructions
0. If you don't have the font yet, install it from [here](https://www.mediafire.com/file/zl7pa9941begw5b/SF6_FONT_100.zip/file) or from the above mentioned twitter thread
1. Go to a gamepad testing site like https://hardwaretester.com/gamepad
2. Open the config.json file and change the "code" attributes to whatever number the gamepad website tells you. For any macro you don't use **PLEASE** set it to -1 or else something might break
3. Close the config.json file and run the updateConfig.bat batch file. This will simply take the json and copy it into a hardcode javascript variable to avoid dealing with websockets etc. <sup><sub>(if you don't trust the batch file just google a tutorial and check out what it says yourself, it's only 3 lines anyways)</sub></sup>
4. Go to your recording software (ideally OBS), add a new browser source and select the index.html file. **remember to select "Local file" in the Properties tab**
5. By default the input history is setup to delete an entry after 30s, if you want to change this follow the instructions in the [change entry expiration time](#Change-entry-expiration-time)
6. Enjoy your working input history overlay

## OBS specific "optimizations"
Inside the Properties tab there are two settings avaiable named *width* and *height*, for easier drag and dropping within your scene I would recommend setting these to:
* width: 450
* height: 975

If OBS automatically writes some Custom CSS, remove it if it messes with things

## Change entry expiration time
1. Open the code.js file
2. Locate the first line (it should say something along the following: "const EXPIRE_TIME = 1800;")
3. Modify the number to be your desired interval, **in frames**. Consider that, same as the game, the overlay is running at 60fps

Quick legend:
* 60 = 1s
* 300 = 5s
* 600 = 10s
* 1800 = 30s
* 3600 = 1m
