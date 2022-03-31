import React,  {useEffect}  from "react"
import { nanoid } from 'nanoid'
import Dice from "./Dice"
import Confetti from 'react-confetti'

export default function App(){
//Set state for allNewDice

const [dice , setDice] = React.useState(allNewDice())

// Set state for winCheck 

const [winCheck , setWinCheck] = React.useState(false)


//Use effect to keep two states in sync , and everytime dice array is changed 
useEffect(()=> {
const firstValue = dice[0].value;
const allTheSame = dice.every(die => firstValue === die.value)
const allHeld = dice.every(die=> die.isHeld)
 if(allHeld && allTheSame){
   setWinCheck(true)
   setIsTimeActive(false)
   
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


//Check for number of turns
const [turns , setTurns] = React.useState(1)

function checkTurn(){
  setTurns(prevTurn => prevTurn +1)
}

//Time tracker to check how fast you finished the game
const [time ,setTime] = React.useState(0)
const [isTimeActive , setIsTimeActive] = React.useState(true)

useEffect(() => {

  let interval = null;
  if(isTimeActive){
  interval = setInterval(() => {
      setTime(time => time + 1);
    }, 1000);
}else if (!isTimeActive && time !== 0){
  clearInterval(interval)
}
  return () => clearInterval(interval);
}, [isTimeActive ,time]);

//Get Local storage 
const [BestTime , setBestTime] = React.useState(JSON.parse(localStorage.getItem("BestTime")) || 9999)
const [BestTurn , setBestTurn] = React.useState(JSON.parse(localStorage.getItem("BestTurn")) || 9999)
//Set Local Storage
useEffect(() => {
  localStorage.setItem("BestTime", JSON.stringify(BestTime))
}, [BestTime])

useEffect(() => {
  localStorage.setItem("BestTurn", JSON.stringify(BestTurn))
}, [BestTurn])
console.log(BestTime)

// Roll new Dice , if there is win roll all new 
function diceRoll(){
  if(!winCheck){setDice(oldDice => oldDice.map(dice => {
    return dice.isHeld  ?
     dice : 
    generateNewDice()
  }
  ))}else{
    setWinCheck(false);
    setTurns(1);
    setIsTimeActive(true)
    setTime(0)
    setDice(allNewDice())
    setBestTime(prevTime =>  prevTime > time ? time : prevTime)
    setBestTurn(prevTurn =>  prevTurn > turns ? turns : prevTurn)
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
    <div>
      <p className="stats">Fastest Win:<span className="score"> {BestTurn} turns.</span></p>
      <p className="stats">Fastest Time:<span className="score"> {BestTime} seconds.</span></p>
    <main>
      {winCheck && 
      <Confetti
      className="confetti"
      />}
      <h1 className="title">{winCheck? "You Won " : "Tenzies"}</h1>
      <p className="instructions">{winCheck? `Number of Turns: ${turns} `  : "Roll until all numbers are the same. Click each number to freeze it at its current value between rolls."}</p>
      {winCheck && <p className="time">{`Time : ${time} seconds`}</p>}
      <div className="dice__container">
        {dices}
      </div>
      <button className="btn" onClick={()=>{checkTurn(); diceRoll();}}>{winCheck ? "New Game": "Roll"}</button>
    </main>
    </div>
  )
}