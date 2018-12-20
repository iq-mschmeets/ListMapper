import React from "react";
import ReactDOM from "react-dom";

function compare(a, b) {
	if (a.label < b.label) return -1;
	if (a.label > b.label) return 1;
	return 0;
}

class SelectableList extends React.Component {
	constructor(props) {
		super(props);
		this.toggleSelection = this.toggleSelection.bind(this);
		this.state = { items: this.props.items };
	}
	toggleSelection(evt) {
		let id = evt.target.dataset.value;
		let result = this.state.items.findIndex(function(item) {
			return item.value == id;
		});

		let newItems = this.state.items.slice();
		newItems[result].selected = !newItems[result].selected;

		if (this.props.onSelect) {
			this.props.onSelect(newItems[result]);
		}

		this.setState({ items: newItems });
	}
	componentWillReceiveProps(newProps) {
		this.setState({ items: newProps.items });
	}
	render() {
		const lStyle = {
			height: "100%",
			minHeight: 300,
			width: "38%",
			border: "1px solid rgb(220,220,220)"
		};
		const toggle = this.toggleSelection;
		return (
			<ul className="list-unstyled" style={lStyle}>
				{this.state.items.map(function(item) {
					return (
						<li
							key={item.value}
							data-value={item.value}
							draggable="true"
							onClick={toggle}
							className={item.selected ? "selected-item" : "selectable-item"}
						>
							{item.label}
						</li>
					);
				})}
			</ul>
		);
	}
}

class ButtonBar extends React.Component {
	render() {
		const barStyle = {
			width: "20%",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center"
		};
		return (
			<div style={barStyle} className="list-mapper-button-bar">
				<button
					className="btn btn-lg btn-default"
					onClick={this.props.moveSelectedSourceToTarget}
				>
					<span className="glyphicon glyphicon-chevron-left" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveSelectedTargetToSource}
				>
					<span className="glyphicon glyphicon-chevron-right" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveAllToTarget}
				>
					<span className="glyphicon glyphicon-backward" />{" "}
				</button>
				<button
					className="btn btn-lg  btn-default"
					onClick={this.props.moveAllToSource}
				>
					<span className="glyphicon glyphicon-forward" />{" "}
				</button>
			</div>
		);
	}
}

export default class ListMapper extends React.Component {
	constructor(props) {
		super(props);

		this.selectedSources = [];
		this.selectedTargets = [];

		this.state = {
			selectedItems: props.data.targetList.sort(compare),
			selectableItems: props.data.sourceList.sort(compare)
		};
		this.moveSelectedFromSourceToTarget = this.moveSelectedFromSourceToTarget.bind(
			this
		);
		this.moveSelectedFromTargetToSource = this.moveSelectedFromTargetToSource.bind(
			this
		);
		this.sourceSelect = this.sourceSelect.bind(this);
		this.targetSelect = this.targetSelect.bind(this);
		this.moveAllToTarget = this.moveAllToTarget.bind(this);
		this.moveAllToSource = this.moveAllToSource.bind(this);
	}
	moveAllToTarget() {
		this.setState({
			selectedItems: this.state.selectedItems
				.concat(this.state.selectableItems)
				.sort(compare),
			selectableItems: []
		});
	}
	moveAllToSource() {
		this.setState({
			selectableItems: this.state.selectedItems
				.concat(this.state.selectableItems)
				.sort(compare),
			selectedItems: []
		});
	}
	moveSelectedFromSourceToTarget() {
		let sources = this.selectedSources;
		let newSource = this.state.selectableItems.filter(function(item) {
			return sources.findIndex(function(source) {
				return source.value === item.value;
			}) >= 0
				? false
				: true;
		});

		let newTarget = this.state.selectedItems.concat(this.selectedSources);

		newSource.forEach(function(item) {
			item.selected = false;
		});

		newTarget.forEach(function(item) {
			item.selected = false;
		});

		this.selectedTargets = [];
		this.selectedSources = [];

		this.setState({
			selectedItems: newTarget.sort(compare),
			selectableItems: newSource.sort(compare)
		});
	}
	moveSelectedFromTargetToSource() {
		let targets = this.selectedTargets;
		let newTarget = this.state.selectedItems.filter(function(item) {
			return targets.findIndex(function(target) {
				return target.value === item.value;
			}) >= 0
				? false
				: true;
		});

		let newSource = this.state.selectableItems.concat(this.selectedTargets);

		newSource.forEach(function(item) {
			item.selected = false;
		});

		newTarget.forEach(function(item) {
			item.selected = false;
		});

		this.selectedTargets = [];
		this.selectedSources = [];

		this.setState({
			selectedItems: newTarget.sort(compare),
			selectableItems: newSource.sort(compare)
		});
	}
	sourceSelect(obj) {
		this.selectedSources = this.selectedSources.concat([obj]);
	}
	targetSelect(obj) {
		this.selectedTargets = this.selectedTargets.concat([obj]);
	}
	componentWillReceiveProps(newProps) {}
	render() {
		const containerStyle = {
			width: "100%",
			display: "flex",
			flexWrap: "wrap",
			justifyContent: "space-between",
			alignItems: "stretch"
		};
		return (
			<div style={containerStyle} className="list-mapper">
				<SelectableList
					items={this.state.selectedItems}
					onSelect={this.targetSelect}
				/>
				<ButtonBar
					moveSelectedSourceToTarget={this.moveSelectedFromSourceToTarget}
					moveSelectedTargetToSource={this.moveSelectedFromTargetToSource}
					moveAllToTarget={this.moveAllToTarget}
					moveAllToSource={this.moveAllToSource}
				/>
				<SelectableList
					items={this.state.selectableItems}
					onSelect={this.sourceSelect}
				/>
			</div>
		);
	}
}
