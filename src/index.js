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
				{ label: "Two", value: 2, selected: false }
			],
			sourceList: [
				{ label: "Three", value: 3, selected: false },
				{ label: "Four", value: 4, selected: false },
				{ label: "Five", value: 5, selected: false },
				{ label: "Six", value: 6, selected: false },
				{ label: "Seven", value: 7, selected: false }
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
