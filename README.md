# ARAM Chest Checker

This is an electron application that allows you to check which champion you can still get a chest for.

## Usage

Download the application from Github release tab. Run the electron application and log into League of Legends client. Once logged in, you should see your summoner name, available chests, and list of champions you can get chests for.

By default, the application filters out champions you already earned a chest for, or champions you don't own. When the toggle is turned off, you can see all the champions in League of Legends with colors to indicate:

- Red means you do not own the champion
- Green means you have already acquired the chest for the champion
- The rest means you own the champion, and you haven't acquired a chest for it yet

![desktop_app](https://user-images.githubusercontent.com/10778821/72034113-22305c80-3262-11ea-893a-2aed1dcbec29.JPG)

## Install and run dev server

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Please download and install that first.

To install and run dev server
```sh
git clone https://github.com/SaltedCaramelCoffee/desktop-aram-chest-checker
cd desktop-aram-chest-checker
npm install
```


in `src/electron-starter.js` modify the file so the electron window will load from webpack server
```
// uncomment this line when building the electron app
// mainWindow.loadURL(`file://${__dirname}/../build/index.html`);
// uncomment this line when running local dev server
mainWindow.loadURL("http://localhost:3001");
```

Then run webpack dev server and start the electron app

```sh
npm run dev
```

## Building electron app for MacOS and Windows
#### MacOS
```sh
npm run build-mac
```

#### Windows
```sh
npm run build-win
```
Note: Building Windows app from non-Windows platform will require Wine. For more information, please read [electron packager documentation](https://github.com/electron/electron-packager#building-windows-apps-from-non-windows-platforms)


## Contributing

[Open an issue](https://github.com/SaltedCaramelCoffee/desktop-aram-chest-checker/issues/new) or submit PRs.


## License

MIT
