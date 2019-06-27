import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';

const currencies = [
    {
        value: 'USD',
        label: '$',
    },
    {
        value: 'CAD',
        label: 'C$',
    },
    {
        value: 'IDR',
        label: 'Rp.',
    },
    {
        value: 'GBP',
        label: '£',
    },  
    {
        value: 'CHF',
        label: 'CHf',
    },  
    {
        value: 'SGD',
        label: 'S$',
    },  
    {
        value: 'INR',
        label: '₹',
    },     
    {
        value: 'MYR',
        label: 'RM',
    },   
    {
        value: 'JPY',
        label: '¥',
    },  
    {
        value: 'KRW',
        label: '₩',
    },  
];

function CardComponent(props) {
    let amountinput = props.money;

    const CalcConv = props.cards.map((card)=> {
        let calccurr = amountinput*card.amount;
        return(
            <React.Fragment key={card.id}>
               <Card style={styles.card}>
                    <CardContent>
                    <Typography variant="h5" component="h2">
                    {card.sym} <NumberFormat value={calccurr} displayType={'text'} thousandSeparator={true}/>
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                    1 USD = {card.amount}
                    </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small" onClick={() => props.delete(card.id)} style={styles.buttonStyle}>Delete (-)</Button>
                    </CardActions>
                </Card>
            </React.Fragment>
        );
    })

    return(
        <React.Fragment>
            {CalcConv}
        </React.Fragment>
    );
}


export default class CurrencyCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            money : '10',
            currency: [],
            cards : [],
            defCurr : 'USD'
        }
        this.AddCards = this.AddCards.bind(this);
        this.HandleInput = this.HandleInput.bind(this);
        this.HandleChange = this.HandleChange.bind(this);
        this.DeleteCards = this.DeleteCards.bind(this);
    }

    componentWillMount() {
        fetch('https://api.exchangeratesapi.io/latest?base=USD')
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
                currency: responseJson.rates
            })     
        })
        .catch(error=>console.log(error))    
    }

    AddCards() {
        var timestamp = (new Date()).getTime();
        const obj = {id: timestamp, sym: this.state.defCurr, amount: this.state.currency[this.state.defCurr]}
        this.setState({
            cards: [...this.state.cards, obj],
            defCurr: ''
        });  
    }

    DeleteCards(id) {
        this.setState(state => {
            const cards = this.state.cards.filter(item => item.id !== id);
            return {
              cards,
            };
        });
    }

    HandleInput(event) {
        this.setState({defCurr: event.target.value});
    }

    HandleChange(event) {
        this.setState({money: event.target.value});
    }

    render() {
        return (
            <div style={styles.container}>
                <TextField
                    style={styles.textfieldStyle}
                    id="outlined-number"
                    label="USD - United States Dollar"
                    defaultValue={this.state.money}
                    onChange={this.HandleChange}
                    type="number"
                    InputLabelProps={{
                    shrink: true,
                    }}
                    margin="normal"
                    variant="outlined"
                />
                <CardComponent cards={this.state.cards} money={this.state.money} delete={this.DeleteCards}/>
                <form>
                    <div>
                        <TextField
                            style={styles.textfieldStyle}
                            id="outlined-select-currency"
                            select
                            label="Select"
                            value={this.state.defCurr}
                            onChange={this.HandleInput}
                            helperText="Please select your currency"
                            margin="normal"
                            variant="outlined"
                        >
                            {currencies.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label} -- {option.value}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                <Button onClick={this.AddCards} style={styles.buttonStyle}>Add</Button>
                </form>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column',
    },
    card: {
        width: 300,
        marginBottom: 10
    },
    textfieldStyle: {
        width: 300
    },
    buttonStyle: {
        width: '100%',
        backgroundColor: '#F5FCFF',
        color: 'gray',
        borderRadius: 10,
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'gray',
    }
}