import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import Board from './board/board';
import Game from './game/game';

const App = () => (
    <div>
        <Switch>
            <Game path='/' component={Game}/>
        </Switch>
    </div>
);

export default App