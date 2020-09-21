/* @flow */
/** @jsx h */

import { h, Fragment, type Node } from 'preact';
import { useState } from 'preact/hooks';

import type { InstallmentsData, ContentType } from '../types';

type InstallmentsProps = {|
    cspNonce : string,
    data : InstallmentsData,
    close : () => void,
    content : ContentType
|};

export function Installments({ data, cspNonce, close, content } : InstallmentsProps) : Node {
    const [ selectedOption, setSelectedOption ] = useState(null);
    const [ selectedIndex, setSelectedIndex ] = useState(null);
    
    const selectOption = (event, option, index) => {
        event.preventDefault();
        setSelectedOption(option);
        setSelectedIndex(index);

        return option.onSelect(option);
    };

    const onPay = () => {
        close();
        return data.onPay(selectedOption);
    };
    
    const closeInstallments = () => {
        close();
        return data.onClose();
    };

    const renderContent = (line, dataObj) => {
        return line.replace(/{([^{]+)}/g, (match, key) => {
            return dataObj[key] !== undefined ? dataObj[key] : '';
        });
    };

    return (
        <Fragment>
            <style nonce={ cspNonce }>
                {`
                    .installments {
                        outline-style: none;
                        padding-bottom: 20px;
                        position: relative;
                    }

                    .installments .header {
                        box-shadow: 0 2px 3px 0 rgba(0,0,0,0.2);
                        padding-right: 50px;
                        position: relative;
                    }

                    .installments h3 {
                        padding: 15px 20px;
                        margin:0;
                        font-weight: normal;
                        font-size: 1em;
                    }

                    .installments button {
                        background: #fff;
                        border: none;
                    }

                    .installments ul {
                        margin:0;
                        padding:0;
                    }
                    .installments li {
                        padding: 0 10px;
                    }
                    .installments li .list-wrap {
                        border: 1px solid #fff;
                        border-bottom-color: #ccc;
                        padding: 13px;
                        display: flex;
                        text-decoration: none;
                        color: inherit;
                        width: 100%;
                        text-align: left;
                        align-items: inherit;
                        font-size: 1em;
                        font-family: inherit;
                        cursor: pointer;
                    }
                    .installments li .list-wrap:hover {
                        background: #F6F7FA;
                    }
                    .installments li .list-wrap:active {
                        border:1px solid #000;
                    }
                    .installments li.selected .list-wrap {
                        background: #F6F7FA;
                    }
                    .installments .months {
                        align-items: center;
                        display: flex;
                        width: 50px;
                        position: relative;
                    }
                    .installments .months:after {
                        content: "";
                        width: 1px;
                        top: 0;
                        bottom: 0;
                        background: #ccc;
                        position: absolute;
                        right: 15px;
                    }
                    .installments .details {
                        font-size: 0.9em;
                    }
                    .installments .details .price {
                        display: block;
                        font-weight:bold;
                        margin-bottom:6px;
                    }

                    .installments .agree-info {
                        font-size: 0.9em;
                        text-align: center;
                        padding: 0 10px;
                    }
                    
                    .installments .btn-container {
                        text-align: center;
                        padding: 15px;
                    }
                    .installments .pay-btn{
                        border: 0;
                        background: #2C2E2F;
                        padding: 10px 20px;
                        border-radius: 25px;
                        line-height: 1.5em;
                        color: #fff;
                        font-weight: bold;
                        font-size: 1em;
                        transition: background-color 240ms ease;
                        cursor: pointer;
                    }
                    .installments .pay-btn:hover,
                    .installments .pay-btn:focus {
                        filter: brightness(1.2);
                        outline: 0;
                    }
                    .installments .pay-btn:active,
                    .installments .pay-btn:focus {
                        text-decoration: underline;                    
                    }
                    .installments .pay-btn .amount{
                        margin-left:5px;
                    }

                    .installments .close-btn {
                        position: absolute;
                        right: 11px;
                        top: 11px;
                        width: 26px;
                        height: 26px;
                        opacity: 0.6;
                        z-index: 1;
                        cursor: pointer;
                    }
                    .installments .close-btn:hover {
                        opacity: 1;
                    }
                    .installments .close-btn:before, 
                    .installments .close-btn:after {
                        position: absolute;
                        left: 12px;
                        content: ' ';
                        height: 16px;
                        width: 2px;
                        background-color: #000;
                        transform: rotate(45deg);
                        top: 5px;
                    }
                    .installments .close-btn:after {
                        transform: rotate(-45deg);
                    }
                `}
            </style>

            <div class='installments'>
                <button class="close-btn" onClick={ closeInstallments } aria-label="close" type="button" />
                <div className="header">
                    <h3 className="title">{content.header}</h3>
                </div>
                <ul id="installments-list">
                    {
                        data.options.map((option, i) => {
                            return (
                                <li className={ (selectedIndex === i) ? 'selected' : '' }>
                                    <button type="button" class="list-wrap" onClick={ (event) => { selectOption(event, option, i); } }>
                                        <div className="months">{ renderContent(content.term, option) }</div>
                                        <div className="details">
                                            { option.term === 1 ?
                                                <span className="price">
                                                    { option.percent ?
                                                        renderContent(content.monthly1xWithDiscount, { percent: Number(option.percent) }) :
                                                        content.monthly1x }
                                                </span> :
                                                <span className="price">{ renderContent(content.monthly, option) }</span> }
                                            <span className="total">
                                                { option.term === 1 && option.percent ?
                                                    renderContent(content.totalWithDiscount, option) :
                                                    renderContent(content.totalAmount, option) }
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            );
                        })
                    }
                </ul>
                <div className="btn-container">
                    <button type="button" className="pay-btn" onClick={ onPay }>
                        { renderContent(content.payLabel, { payAmount: selectedOption ? selectedOption.totalAmount : data.cartAmount }) }
                    </button>
                </div>
                <div className="agree-info">{ content.disclaimer }</div>
            </div>
        </Fragment>
    );
}
