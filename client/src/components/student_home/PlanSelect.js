/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import { withRouter } from 'react-router'

function PlanSelect(props) {
    const styles = css`
        position: fixed;
        top: 0px;
        left: 0px;
        background-color: rgba(0,0,0,0.6);
        width: 100vw;
        height: 100vh;
        z-index: 10;
        visibility: ${props.hidden ? "hidden" : "visible"};
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .option {
            width: 40vw;
            height: 5vh;
            border-radius: 10px;
            background-color: white;
            border-style: hidden;
            font-size: 16px;
            font-style: normal;
        }

        .close {
            color: white;
            opacity: 1;
        }

        .close > span {
            font-size: 24px;
        }

        .header {
            color: white;
            width: 40vw;
            text-align: center;
        }

        .header > span {
            font-size: 20px;
            font-weight: bold;
        }
    `;

    return (
        <div css={styles}>
            <div className="header">
                <span>Select an Applied Option</span>
                <button type="button" className="close" aria-label="Close" onClick={props.hidePlan}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            
            <button className="option" onClick={() => props.history.push("/createPlan")}>
                Artificial Intelligence
            </button>
            <button className="option">
                Bioinformatics
            </button>
            <button className="option">
                Business {"&"} Entrepreneurship
            </button>
            <button className="option">
                Cybersecurity
            </button>
            <button className="option">
                Data Science
            </button>
            <button className="option">
                Human Computer Interaction
            </button>
            <button className="option">
                Robot Intelligence
            </button>
            <button className="option">
                Simulation {"&"} Game Programming
            </button>
            <button className="option">
                Web {"&"} Mobile Application Development
            </button>
            <button className="option">
                Custom Plan
            </button>
        </div>
    );
}

export default withRouter(PlanSelect);