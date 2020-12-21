import React, { useRef, useEffect, useState } from "react"

type ColorPickerPropType = {onChange?: (color: string) => void }

const ColorPicker: React.FC<ColorPickerPropType> = (props) => {

    // color list
    const colors = [
      "transparent",
      "#05050D",
      "#666666",
      "#DCDCDC",
      "#FFFFFF",
      "#EB070E",
      "#F69508",
      "#FFDE49",
      "#388326",
      "#0246E3",
      "#563495",
      "#58C4F5",
      "#F82481",
      "#E5AC99",
      "#5B4635",
      "#FFFEE9",
    ];
    
    const [primary, setPrimary] = useState(colors[0]);

    const onChange = function (color: string) { 
        if (props.onChange !== undefined && props.onChange !== null) {
            props.onChange(color);
        }
    }

    const getClickEvent = (color: string) => {
        return () => {
            // primary color 를 바꾼다
            setPrimary(color);
            onChange(color);
        }
    }

    return (
    <div className="palette">
        <div className="primary color">
            <input style={{ backgroundColor: primary, color: primary }}></input>
        </div> 
        <div className="color-container">
            {colors.map((color, i) => (<div className="color" key={"color-palette-" + i}>
                <input style={{ backgroundColor: color, color: color }} onClick={getClickEvent(color)}></input>
            </div>))}
        </div>
    </div>
    );
}

export default ColorPicker