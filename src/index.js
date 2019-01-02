import React from "react";
import ReactDOM from "react-dom";

import ListMapper from "./listMapper.js";

import "./styles.css";

export default class App extends React.Component {
	render() {
		// This will be filter provided data.
		// Going to have to find the PK values from relationship,
		// and I think use those as the values.
		const data = {
			targetList: [
				{ label: "One", value: 1, selected: false },
				{ label: "Two", value: 2, selected: false },
				{ label: "L.Three", value: -3, selected: false },
				{ label: "L.Four", value: -4, selected: false },
				{ label: "L.Five", value: -5, selected: false },
				{ label: "L.Six", value: -6, selected: false }
			],
			sourceList: [
				{ label: "Three", value: 3, selected: false },
				{ label: "Four", value: 4, selected: false },
				{ label: "Five", value: 5, selected: false },
				{ label: "Six", value: 6, selected: false },
				{ label: "Seven", value: 7, selected: false },
				{ label: "Eight", value: 8, selected: false },
				{ label: "Nine", value: 9, selected: false },
				{ label: "Ten", value: 10, selected: false },
				{ label: "Eleven", value: 11, selected: false },
				{ label: "Twelve", value: 12, selected: false },
				{ label: "Thirteen", value: 13, selected: false },
				{ label: "Fourteen", value: 14, selected: false },
				{ label: "Fifteen", value: 15, selected: false },
				{ label: "Sixteen", value: 16, selected: false },
				{ label: "Seventeen", value: 17, selected: false },
				{ label: "Eighteen", value: 18, selected: false },
				{ label: "Nineteen", value: 19, selected: false },
				{ label: "Twenty", value: 20, selected: false },
				{ label: "Twenty One", value: 21, selected: false },
				{ label: "Twenty Two", value: 22, selected: false }
			]
		};

		return (
			<div className="App">
				<h1>List Mapping</h1>
				<ListMapper data={data} />
			</div>
		);
	}
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
