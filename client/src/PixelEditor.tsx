import React, { useRef, useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import axios from "axios";
import { useInterval } from "./utility";
import BitmapInfo from "./BitmapInfo";

type PixelEditorPropType = {columns: number, rows:number, bitmap: number[]}

function refresh(callback: (buffer: number[]) => void) {
    axios.get("/api/paint")
    .then(res => res.data)
    .then(data => data.bitmap)
    .then(callback);
}

async function requestPaint(x: number, y: number, color: string): Promise<BitmapInfo> {
    const res = await axios.post("/api/paint", { x, y, color: parseInt(color.substr(1), 16)});
    return res.data;
}

const PixelEditor: React.FC<PixelEditorPropType> = (props) => {
    const { columns, rows }  = props;

    const [isWaiting, setWaiting] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState("#000000");
    const [bitmap, setBitmap] = useState(props.bitmap.slice());

    const restore = (input: number[]) => {
        // restore buffer
        input.forEach((v, i) => {
            const x = i % columns;
            const y = Math.floor(i / columns);
            paintCell(x, y, "#" + v.toString(16).padStart(6, "0"));
        })
    }

    const paintCell = (x: number, y: number, color: string) => {
        const canvas = canvasRef.current;
        const context = canvas !== null ? canvas.getContext("2d") : null;
        if (canvas === null || context === null) { return; }
        
        const width = canvas.width;
        const height = canvas.height;

        const cellWidth = width / columns;
        const cellHeight = height / rows;

        const x0 = Math.floor(cellWidth*x);
        const y0 = Math.floor(cellHeight*y);
        const x1 = Math.floor(cellWidth*(x+1));
        const y1 = Math.floor(cellHeight*(y+1));

        context.fillStyle = color;
        context.fillRect(x0, y0, x1-x0, y1-y0);
    }

    const onClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        if (isWaiting) { return; }

        const canvas = canvasRef.current;
        const context = canvas !== null ? canvas.getContext("2d") : null;
        if (canvas === null || context === null) { return; }

        const width = canvas.width;
        const height = canvas.height;

        const cellWidth = width / columns;
        const cellHeight = height / rows;
        
        const cellXIndex = Math.floor((event.pageX - canvas.offsetLeft) / cellWidth);
        const cellYIndex = Math.floor((event.pageY - canvas.offsetTop) / cellHeight);

        // request to server
        setWaiting(true);
        requestPaint(cellXIndex, cellYIndex, color).then((info) => {
            if (columns !== info.columns || rows !== info.rows) {
                throw new Error("image size changed");
            }
            setBitmap(info.bitmap);
            setWaiting(false);
        })
        
        // wait until response
        //buffer[cellXIndex + cellYIndex*columns] = parseInt(color.substr(1), 16);
        //paintCell(cellXIndex, cellYIndex, color);
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas !== null ? canvas.getContext("2d") : null;
        if (canvas !== null && context !== null) {
            canvas.height = canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 0;

            restore(bitmap);
        }
    });

    // refresh per 5 sec
    useInterval(() => refresh(restore), 5000);

    const onColorChange = (color: string) => {
        setColor(color);
    }

    return (
    <div className="editor" style={{cursor: isWaiting ? "wait" : "default"}}>
        <canvas className="canvas" ref={canvasRef} onClick={onClick} width={512} height={512}></canvas>
        <ColorPicker onChange={onColorChange}/>
    </div>
    )
}

export default PixelEditor
