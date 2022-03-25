import React from "react"
import { nanoid } from 'nanoid'
import Dice from "./Dice"

export default function App(){
//Set state for allNewDice

const [dice , setDice] = React.useState(allNewDice())


//Generate array with 10 random numbers between 1-6 each number is an oobject 
function allNewDice(){
 let newDice = []
 for( let i=0 ; i<10 ; i++){
   newDice.push({ 
     value: Math.floor(Math.random() *6 +1), 
     isHeld: false ,
     id:nanoid()
    })
 }
 return newDice
}


// Map over dice array and for each item create new Dice component with item value .
const dices = dice.map(item =>
   <Dice
   key={item.id}
   value={item.value}
   isHeld={item.isHeld}
   />)
//Roll new Dices and set it to state

function diceRoll(){
  setDice(allNewDice())
}

  return(
    <main>
      <div className="dice__container">
        {dices}
      </div>
      <button className="btn" onClick={diceRoll}>Roll</button>
    </main>
  )
}