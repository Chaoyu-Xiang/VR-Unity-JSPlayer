# JSPlayer <-> Unity VR Video Player Component
## Introduction 
This project is a video player component that can be used by VR applications built using Unity 3D engine. It supports HLS/DASH playback, DRM and accessibility features such as Closed Captions.   

This project also aims to allow two-way communication between [JSPlayer]() and Unity engine-based apps. For that, we are leveraging a Unity component called [WebView]() which encapsulates Chromium js engines under the hood. It allows us to build a bridge that exposes custom APIs methods on each side.


## Architecture

The main stack was designed around React.js using Typescript. For its objectives, this is the only stack necessary to expose and communicate the APIs. 

It imports the current stable JSPlayer version from repo, sets it up, and provides the bridge messaging APIs.

All UI states, events, data, and logic are handled on the parent root project (Unity). For example, if the user wants to change the current content, all data parsing, and UI changes would be handled on the Unity side, JSPlayer listens to media changes and handle them, and also passes on the media's current info, like, playing status, volume set, duration, metadata, etc. 

All exchanged data is of type string, and any data structure can be passed through, however, for this project we enforce the following structure for stringifying and deserializing

Object structure:

Param | Value | Type of
--- | --- | ---
type | [PlayerActions](./src/types/index.ts) | enum, string
payload | [PlayerState](./src/types/index.ts) | type, object

## Flow

When loaded, the [bridge](./src/components/Bridge.tsx) is going to search for the exposed object by the webview component inside the global variable - window, if available, it sets the listener and tells the parent app that it's ready to receive and send messages. From this moment on, communication it's established and ready. 

## Develop, build, run
Npm or Yarn CLIs are required to install, run and build this project.
### Install
To install run the following command.
```terminal
npm install
```

### Develop + hot-reload
If necessary you can start and debug the project on a local browser. A VSCode debugs setting is available, see Launch Edge (same for Chrome) option
on "RUN AND DEBUG" (ctrl+shift+d). To start it manually without attaching to debug, run:
```terminal
npm start
```

### Build
To build it as a single file, run the following
```terminal
npm run build-unity
```
the built file is available at ./unity/index.html