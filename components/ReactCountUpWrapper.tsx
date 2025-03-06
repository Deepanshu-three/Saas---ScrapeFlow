"use client"

import CountUp from "react-countup"
import React, { useEffect, useState } from 'react'

const ReactCountUpWrapper = ({value} : {value: number}) => {

    const [mount, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [])

    if(!mount) return "-"

  return (
    <CountUp duration={0.5} preserveValue end={value} decimals={0} />
)
}

export default ReactCountUpWrapper