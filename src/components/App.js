import React from "react";
import Counter from "./Counter"
import SettingsModal from "./SettingsModal"
import {Button} from "carbon-components-react"
import Cookies from "universal-cookie"

import "./App.scss"

const COOKIENAME = "macroCounterState"

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nutrients: [
                {name: "protein", value: 0, goal: 170, caPerGram: 4},
                {name: "carbs", value: 0, goal: 175, caPerGram: 4},
                {name: "fat", value: 0, goal: 40, caPerGram: 9}
            ]
        }

        this.cookies = new Cookies()

        this.handleChange = this.handleChange.bind(this)
        this.resetNutrients = this.resetNutrients.bind(this)
        this.handleAddClick = this.handleAddClick.bind(this)
    }

    componentDidMount() {
        this.setState(this.cookies.get(COOKIENAME))
    }

    saveStateToCookies() {
        this.cookies.set(COOKIENAME, this.state)
    }

    resetNutrients() {
        this.setState( { nutrients: this.state.nutrients.map((nutrient) => Object.assign({}, nutrient, {value: 0})) }, () => this.saveStateToCookies() )
    }

    //handle modal setting change
    handleChange(e, name, field) {
        if (e.target && e.target.value) {
            const attr = {}
            attr[field] = parseInt(e.target.value)
            this.setState( {nutrients: this.state.nutrients.map((nutrient) => (nutrient.name === name) ? Object.assign({}, nutrient, attr) : nutrient) }, () => this.saveStateToCookies())
        }
    }

    handleAddClick(name, value) {
        this.setState( {nutrients: this.state.nutrients.map((nutrient) => (nutrient.name === name) ? Object.assign({}, nutrient, {value: nutrient.value + parseInt(value)}) : nutrient) }, () => this.saveStateToCookies())
    }

    render() {
        const calories = this.state.nutrients.reduce((acc, nutrient) => (acc + (nutrient.value * nutrient.caPerGram)), 0)
        const counters = this.state.nutrients.map((nutrient) => <Counter key={nutrient.name} name={nutrient.name} value={nutrient.value} goal={nutrient.goal} onAddClick={this.handleAddClick}/>)

        return (
            <div className="content">
                <h1 className="title">Macronutrient Counter</h1>
                <h3 className="calories">Total Calories: {calories}</h3>
                <div className="counters">
                    {counters}
                </div>
                <div>
                    <div className="init-btn"><SettingsModal nutrients={this.state.nutrients} onChange={this.handleChange} /></div>
                    <Button className="init-btn" onClick={this.resetNutrients}>Reset</Button>
                </div>
                <p class='link'>Hosted on <a href='https://github.com/igullickson/macronutrient-counter'>GitHub</a></p>
            </div>
        )
    }
}

export default App