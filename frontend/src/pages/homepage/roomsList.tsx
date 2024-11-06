import React from "react";
import Helmet from "../../assets/icons/Helmet";

interface Room {
    id: string;
    status: string;
    playersOn: number;
    totalPlayers: number;
    laps: number; 
}
interface RoomProps{
    room: Room;
    index: number;
}

const RoomsList: React.FC<RoomProps> = ({
    room,
    index,
}) => {
    return(
        <>
        <div id="room-item-body" key={index}>
            <p>{room.id}</p>
            {room.status === "waiting" ? (
                <p className="waiting">{room.status}</p>
            ) : (
                <p>{room.status}</p>
            )}
            <p>{room.playersOn}/{room.totalPlayers}</p>
            <p>{room.laps}</p>
            {room.status === "waiting" ? (
                <button>Join</button>
            ) : ( <Helmet/>)}
        </div>
        </>
    )
}

export default RoomsList;
