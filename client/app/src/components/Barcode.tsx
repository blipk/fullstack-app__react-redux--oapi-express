/**
 * A component for showing a barcode design, used on forms
 *
 * @module
 */
import React, { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

// Define the props interface
interface BarcodeProps {
  value: string;
  style?: React.CSSProperties
}

const Barcode: React.FC<BarcodeProps> = ( { value, style } ) => {

    const barcodeRef = useRef<SVGSVGElement | null>( null )

    useEffect( () => {
        if ( value && barcodeRef.current ) {
            const letterToNumberMap: Record<string, string> = {
                "B" : "3",
                "O" : "0",
                "I" : "1",
                "A" : "4",
                "S" : "5",
            }

            const displayValue = value.replace( /[BOIAS]/gi, ( match ) => {
                const upperMatch = match.toUpperCase()
                return letterToNumberMap[ upperMatch ] || match
            } ) + "8B03F"


            JsBarcode(
                barcodeRef.current,
                value,
                {
                    format       : "CODE128",
                    lineColor    : "#000",
                    background   : "transparent",
                    width        : 0.9,
                    height       : 22,
                    displayValue : true,
                    flat         : true,
                    margin       : 8,
                    fontSize     : 16,
                    text         : displayValue,
                }
            )
        }
    }, [ value ] )

    return (

        <svg ref={barcodeRef} style={style}></svg>

    )
}

export default Barcode