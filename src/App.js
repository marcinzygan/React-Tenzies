import React, { useEffect } from "react"
import { nanoid } from 'nanoid'
import Dice from "./Dice"
import Confetti from 'react-confetti'

export default function App(){
//Set state for allNewDice

const [dice , setDice] = React.useState(allNewDice())

// Set state for winCheck 

const [winCheck , setWinCheck] = React.useState(false)


//Use effect to keep two states in sync , and everytime dice array is changed 
React.useEffect(()=> {
const firstValue = dice[0].value;
const allTheSame = dice.every(die => firstValue === die.value)
const allHeld = dice.every(die=> die.isHeld)
 if(allHeld && allTheSame){
   setWinCheck(true)
 }

},[dice])


//Function to generate new dice object 
function generateNewDice(){
  return{
     value: Math.floor(Math.random() *6 +1), 
     isHeld: false ,
     id:nanoid()
  }
}
//Generate array with 10 random numbers between 1-6 each number is an oobject 
function allNewDice(){
 let newDice = []
 for( let i=0 ; i<10 ; i++){
   newDice.push( 
     generateNewDice()
    )
 }
 return newDice
}


//Funcion holdDice 

function holdDice(id){
setDice(oldDice => oldDice.map(dice =>{
 return dice.id === id ? 
 {...dice , isHeld: !dice.isHeld} :
 dice
}))

}
const [turn , setTurn] = React.useState(1)

function checkTurn(){
  setTurn(prevTurn => prevTurn +1)
}

// Roll new Dice , if there is win roll all new 
function diceRoll(){
  if(!winCheck){setDice(oldDice => oldDice.map(dice => {
    return dice.isHeld  ?
     dice : 
    generateNewDice()
  }
  ))}else{
    setWinCheck(false);
    setTurn(1);
    setDice(allNewDice())
  }
  
  
  
}
  

// Map over dice array and for each item create new Dice component with item value .
const dices = dice.map(item =>
   <Dice
   key={item.id}
   value={item.value}
   isHeld={item.isHeld}
   holdDice ={()=> holdDice(item.id)}

   />)

  
  return(
    <main>
      {winCheck && 
      <Confetti
      className="confetti"
      />}
      <h1 className="title">{winCheck? "You Won " : "Tenzies"}</h1>
      <p className="instructions">{winCheck? `Number of Turns: ${turn}`  : "Roll until all dice are the same. Click each die to freeze it at its current value between rolls."}</p>
      <div className="dice__container">
        {dices}
      </div>
      <button className="btn" onClick={()=>{checkTurn(); diceRoll();}}>{winCheck ? "New Game": "Roll"}</button>
    </main>
  )
}