import React, { useEffect } from "react";
import "./loading.css"
import Animation from "../../components/svg/animation";
import { useNavigate } from "react-router-dom";

const Loading = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/game");
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigate])
    return(
        <div id="loadpage">
            <h3>ALL</h3>
            <h1>ABOUT RACING</h1>
            <div id="animation">
            <Animation/>
            </div>
            <div id="load-content">
                <h4>Wait for a bit while we prepare your car...</h4>
            </div>
        </div>
    )
}

export default Loading;