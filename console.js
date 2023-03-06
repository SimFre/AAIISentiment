
import express from "express";
import aaiilib from "./aaiilib.js";

const listenport = process.env.PORT ?? 3001;
const chromePath = process.env.CHROME_PATH;
// const baseurl = process.env.APTUS_BASEURL ?? "";
const baseurl = "https://www.aaii.com/";

const aaii = new aaiilib(baseurl);
aaii.chromePath = chromePath;
aaii.headless = false;

aaii.getData();
aaii.close();

