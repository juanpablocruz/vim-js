import React, { Component } from 'react'
import './style/vim.css'
enum Mode {
    Command,
    Insert
}


interface Props {

}

interface State {
    mode: Mode,
    text: string
    currentLine: number
    currentCol: number
}

export default class Vim extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.handleInput = this.handleInput.bind(this)
        window.addEventListener("keydown", this.handleInput)
        this.state = {
            mode: Mode.Insert,
            text: "",
            currentLine: 0,
            currentCol: 0
        }
    }

    handleInput(event: KeyboardEvent) {
        if (this.state.mode === Mode.Command) {
            console.log(event)
            switch (event.code) {
                case "KeyI":
                    this.setState({ mode: Mode.Insert })
                    break;
            }
        } else if (event.key === "Escape") {
            this.setState({ mode: Mode.Command })
        } else {
            let keycode = event.keyCode;

            let valid =
                (keycode > 47 && keycode < 58) || // number keys
                keycode == 32 || keycode == 13 || // spacebar & return key(s) (if you want to allow carriage returns)
                (keycode > 64 && keycode < 91) || // letter keys
                (keycode > 95 && keycode < 112) || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223);   // [\]' (in order)
            let text = this.state.text
            if (event.key === "Enter") {
                this.setState({ text: text + '\n' })
            } else if (event.code === "Tab") {
                this.setState({ text: text + '\t' })
            } else if (event.code === "Backspace") {
                text = text.slice(0,-1) 
                this.setState({ text: text})
            } else if (event.code ==="ArrowRight") {
                this.setState({currentCol: this.state.currentCol+1})
            } else if (event.code ==="ArrowLeft") {
                this.setState({currentCol: this.state.currentCol-1})
            }
            else if (valid) {
                this.setState({ text: text + event.key })
            } else {
                console.log(event)
            }
        }
        event.preventDefault()
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleInput, false)
    }

    getNumberOfLines() {
        return Math.abs(window.innerHeight / 16)
    }

    render() {
        let numberOfLines = this.getNumberOfLines()
        let board :string[]= []
        let text = this.state.text
        if (text.length > 0) {
            text.split('\n').map((e) => {
                board.push(e)
            })
        }
        
        for (let i = board.length; i < numberOfLines; i++) {
            board.push('~')
        }
        let currentLine = board[this.state.currentLine]
        board[this.state.currentLine] = currentLine.substr(0,this.state.currentCol-1)+"@"+currentLine.substr(this.state.currentCol+1, currentLine.length)
        return <div className="vim">
            <pre>{board.map((e,i) => <p key={i}>{e}</p>)}</pre>
            <div>{this.state.mode === Mode.Insert ? "-- INSERT --" : ""}</div>
        </div>
    }
}