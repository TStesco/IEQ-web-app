# IEQ web app

A Node.js and React web app that provides a front end for viewing and querying Indoor Environment Quality (IEQ) data. Part of the Atmena Indoor Environment Quality sensing and analysis system built by Andrew Gillies, Aayush Rajasekaran, Nathan Woltman, and Tom Stesco. Read more at https://tstesco.github.io/atmena-indoor-env-quality/.

### Setup

Clone the repo and install dependencies:

```sh
git clone https://github.com/TStesco/IEQ-web-app.git
cd IEQ-web-app
npm install
```

Install the Grunt CLI if it is not already installed on your machine:

```sh
npm install -g grunt-cli
```

**Note:** Mac/Linux users may need `sudo` when using `npm install`.

### Manual Building

```sh
grunt build
```

Although if you're coding you should probably just look at the [developing](#developing) section.

### Starting the Server

You can start the web server with the following command:

```sh
npm start
```

To make sure everything is working, navigate to [http://localhost:8080](http://localhost:8080).

### Code

The best way to code is by opening the Sublime project (`www.sublime-project`) in Sublime Text 3. This way, the linters you installed when setting up Sublime will automatically lint your code as you type. If you don't want to use Sublime, you can lint your code by running the following command:

```sh
grunt lint
```

#### Developing

While developing, start the web server with:

```sh
grunt dev
```

By using this command to start the server, all website assets will be updated automatically as soon as you change them so you never need to run the `grunt build` command or restart the server manually.

### Test

```sh
grunt
```

This checks for lint errors and runs the tests.

If you want to skip linting and just run the tests, you can do:

```sh
grunt test
```
