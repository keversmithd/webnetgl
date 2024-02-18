"use client"; // This is a client component 👈🏽

import styles from "./page.module.css";
import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from "@react-three/fiber";

//Parametric Equation Parser
import { ParameterizedEquation } from "./components/ParametricEquation";

export default function Page()
{

    
    return (
        <div className={styles.background}>
        <div className={styles.row}>

            <div className={styles.column}>
                <div className={styles.scene}>
                <Canvas style={{ width: "100%", height: "100%" }}>
                    <Cube></Cube>
                </Canvas>
                </div>

            </div>

            <div className={styles.column}>
                <div className={styles.eqdetails}>
                {paramterizedEquation()}
                </div>
            </div>

        </div>

        </div>
    );

}


function paramterizedEquation()
{
    let equation = new ParameterizedEquation("<u, v , z>");

    let equationDetails = equation.exportElements();

    return (
        <div className={styles.row}>
            <div className={styles.column}>
            Equations:
            <p>{equationDetails.equations}</p>
            </div>
            
            <div className={styles.column}>
            Variables:
            <p>{equationDetails.variables}</p>
            </div>
        </div>
    );
    

}


function Cube()
{
    const mesh = useRef(null);
    useFrame((state,delta) => {
        mesh.current.rotation.x += delta;
    })

    return (
        <mesh ref={mesh}>
            <boxGeometry args={([1,2,3])}></boxGeometry>
            
        </mesh>
    )
}