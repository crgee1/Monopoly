import React from 'react';
import End from './end';

export default function Modal(props) {
    const { modal, player, setModal } = props;

    let component;

    switch (modal) {
        case "end":
            component = <End player={player}/>
            break;
        default:
            return null;
    }

    if (modal === 'end') {
        return <div className="modal-background">
            <div className="modal-child" onClick={e => e.stopPropagation()}>
                {component}
            </div>
        </div>
    }
    return <div className="modal-background" onClick={() => setModal(null)}>
                <div className="modal-child" onClick={e => e.stopPropagation()}>
                    {component}
                </div>
           </div>
    
}