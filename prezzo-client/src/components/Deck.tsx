import React from "react";
import Slide from "./Slide";

function Deck() {
    return (
        <div className="relative w-7/12 h-full overflow-y-scroll slide_deck">
            <Slide header="Header 1" body="Body 1" />
            <Slide header="Header 2" body="Body 2" />
            <Slide header="Header 3" body="Body 3" />
            <Slide header="Header 4" body="Body 4" />
        </div>
    );
}

export default Deck;