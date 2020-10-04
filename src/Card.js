import React from "react";
import './Card.css'

const Card = ({image, name}) => {

    return (
        <img className="Card" src={image} alt={name} />
    )
}

export default Card;