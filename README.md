# Project 2 - Remote List

Written By: Joshua Corrales
Class: CS402-001

## Overview

This is a simple remote list app that loads a list of items at startup and allows the user to modify the contents of the list, then upload those changes to the remove source. Once the app is reloaded, the contents of the last edit is loaded. If the list is empty, it will throw an alert to the user letting them know that the list on the remote site is empty.

## Usage

You first need to use ```npm install``` to ensure you have all the required dependencies and ensure that you have the expo-cli by running
```npm install -g expo-cli```. Once installed, you can open the project through a terminal window by navigating to the project directory and running ```npx expo start```, from there you can use the provided QR code and the ExpoGo app to run the application on your local device.


## Reflection

This was quicker than I had initially thought as had first imagined that it would take longer to implement the required changes. However, I only had to make some changes to the overall program. One big change is I had to use a VirtualList instead of a FlatListBasics. From there, the rest was pretty simple to implement.

## Sources used
https://isotropic.co/how-to-fix-the-useeffect-must-not-return-anything-besides-a-function-warning/

