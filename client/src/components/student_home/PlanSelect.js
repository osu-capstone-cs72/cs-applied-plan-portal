/** @jsx jsx */

import {css, jsx} from "@emotion/core";
import { withRouter } from 'react-router'

function PlanSelect(props) {
    const styles = css`
        position: fixed;
        top: 0px;
        left: 0px;
        background-color: rgba(0,0,0,0.6);
        width: 100%;
        height: 100%;
        z-index: 10;
        visibility: ${props.hidden ? "hidden" : "visible"};
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;

        .option {
            width: 40%;
            height: 5%;
            max-height: 40px;
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
            width: 40%;
            text-align: center;
        }

        .header > span {
            font-size: 20px;
            font-weight: bold;
        }

        @media screen and (max-width: 600px) {
            .option {
                width: 70%;
            }

            .header {
                width: 70%;
            }
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
            
            <button className="option" onClick={() => props.history.push("/createPlan/1")}>
                Artificial Intelligence
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/2")}>
                Bioinformatics
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/3")}>
                Business {"&"} Entrepreneurship
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/4")}>
                Cybersecurity
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/5")}>
                Data Science
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/6")}>
                Human Computer Interaction
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/7")}>
                Robot Intelligence
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/8")}>
                Simulation {"&"} Game Programming
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/9")}>
                Web {"&"} Mobile Application Development
            </button>
            <button className="option" onClick={() => props.history.push("/createPlan/0")}>
                Custom Plan
            </button>
        </div>
    );
}

export default withRouter(PlanSelect);