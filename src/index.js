import React from "react";
import ReactDOM from "react-dom";

import Default from "./containers/Default/Default";
import FilterChampion from "./containers/FilterChampion/FilterChampion"

const electron = window.require("electron")
const {ipcRenderer} = electron

ReactDOM.render(<Default />, document.querySelector("#root"));

ipcRenderer.on("connection:established", async (event, data) => {
    // This means league client is at least open. Doesn't mean user logged in yet
    console.log("connection established!")
    ReactDOM.render(<FilterChampion credential={data}/>, document.querySelector("#root"));

})

ipcRenderer.on("connection:lost", (event, data) => {
    console.log("connection lost!")
    ReactDOM.render(<Default message="Please open League of Legends Client"/>, document.querySelector("#root"));

})