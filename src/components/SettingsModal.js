import React from "react"
import {ModalWrapper, NumberInput} from "carbon-components-react"

import "./SettingsModal.scss"

class SettingsModal extends React.Component {
    render() {
        const inputs = this.props.nutrients.map((nutrient) =>
            <div key={nutrient.name} className='input-group'>
            <h3>{nutrient.name}</h3>
            <NumberInput 
                id={`${nutrient.name}-value`} 
                min={0}
                max={500}
                value={nutrient.value}
                label="Value"
                onChange={(e) => this.props.onChange(e, nutrient.name, "value")}
                invalidText="Invalid Number"
            />
            <NumberInput 
                id={`${nutrient.name}-goal`}
                min={0}
                max={500}
                value={nutrient.goal}
                label="Goal"
                onChange={(e) => this.props.onChange(e, nutrient.name, "goal")}
                invalidText="Invalid Number"
            />
        </div>
        )
        return (
            <ModalWrapper
            id="input-modal"
            buttonTriggerText="Settings"
            shouldCloseAfterSubmit={true}
            modalHeading="Settings"
            handleSubmit={()=>true}
        >   
        {inputs}
        </ModalWrapper>
        )
    }
}

export default SettingsModal