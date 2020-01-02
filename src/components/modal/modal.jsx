import React from 'react';

export default function Modal(props) {
    const { modal, property, player } = props;

    let component;

    switch (modal) {
        case "end":
            
            break;
        case "property":
            
            break;
    
        default:
            break;
    }

    return (
        <div className="modal-background">
            <div className="modal-child" onClick={e => e.stopPropagation()}>
                {component}
            </div>
        </div>
    );
}