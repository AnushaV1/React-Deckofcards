import React, {useState, useEffect, useRef} from "react";   
import axios from "axios";
import Card from "./Card";
import "./CardDeck.css";


const CardDeck = () => {
    const BASE_URL = 'https://deckofcardsapi.com/api/deck';
    const [deck, setDeck] = useState({})
    const [autodraw, setAutodraw] = useState(false);
    const [drawn, setDrawn] = useState([]);
    const timeRef = useRef();


    useEffect(() => {
        console.log("Get card")
        async function drawCard() {
            const res = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(res.data);  // returns a deck id which is set to deck
        }
        drawCard();
        return () => console.log("Cleaning up")
    }, [setDeck])


    useEffect(() => {
        async function getCardFromDeck() {
            let {deck_id } = deck;
            try {
                let drawOneCard = await axios.get(`${BASE_URL}/${deck_id}/draw`); 
                if(drawOneCard.data.remaining === 0){
                    setAutodraw(false);
                    throw new Error("No cards remaining!");
                }
                const card = drawOneCard.data.cards[0];

                setDrawn(drawn => [
                    ...drawn,
                    {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
                ])
            } catch(err) {
                alert(err);
            }
        }

        if(autodraw && !timeRef.current){
            timeRef.current = setInterval(async() => {
                await getCardFromDeck();
            },1000)
        }

        return() => {
            clearInterval(timeRef.current);
            timeRef.current = null;
        };
    }, [deck, autodraw, setAutodraw])

    const toggleAutodraw = () => {
        setAutodraw(auto => !auto);
    }
    
    const cards = drawn.map(c => (
        <Card key = {c.id} name={c.name} image={c.image} />
        ));

    return (
        <div className="CardDeck">
            {deck ? (<button className="CardDeck-gimme" onClick ={toggleAutodraw}>
                {autodraw ? "STOP": "KEEP"} Drawing
            </button>): null}
            <div className="Deck-cardarea">{cards}</div>
        </div>
    );  
}

export default CardDeck;