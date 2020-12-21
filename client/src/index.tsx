import React from "react";
import ReactDOM from "react-dom";
import PixelEditor from "./PixelEditor";

import "./base.css";
import "./editor.css";

import axios from "axios";
import BitmapInfo from "./BitmapInfo";

axios.get("/api/paint")
.then(res => res.data)
.then((data: BitmapInfo) => {
    ReactDOM.render(
        <PixelEditor columns={data.columns} rows={data.rows} bitmap={data.bitmap}/>,
        document.getElementById("app")
    );
});