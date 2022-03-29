export default function Dice(props){
   const  styles={backgroundColor: props.isHeld ? "#59E391" : "white"}
    return (
        <div className="dice" onClick={props.holdDice} style={styles} >
        <p className="dice__value" >{props.value} </p>
        </div>
    )
}