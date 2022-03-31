import React, { useState } from "react";
import { SecondaryButton } from "../ui-elements/buttons";
import backtestService from "../../services/backtest-service";
import { BasicSelect, Checkbox } from "../ui-elements/forms";
import "./backtest.css";

function Backtest() {

	const [settings, setSettings] = useState({
		"1m": {
			active: false,
			range: 'last24h',
			configs: 'configsHR',
			maxBars: 15,
		},
		"3m": {
			active: false,
			range: 'last48h',
			configs: 'configsHR',
			maxBars: 5,
		},
		"5m": {
			active: false,
			range: 'last72h',
			configs: 'configsMR',
			maxBars: 6,
		},
		"15m": {
			active: false,
			range: 'last1w',
			configs: 'configsMR',
			maxBars: 4,
		},
	});

	const activeIntervals = Object.keys(settings).filter(interval => settings[interval]['active'] === true)
	const getSettigns = () => {
		const currentSettings = []
		if (activeIntervals) {
			activeIntervals.forEach(interval => currentSettings.push([interval, settings[interval]['range'], settings[interval]['configs'], settings[interval]['maxBars']]))
		}
		return currentSettings
	} 

	// useEffect(() => console.log(getSettigns()));

	const intervals = ["1m", "3m", "5m", "15m"];

	const rangeOptions = [
		{ value: "last12h", label: "12 hours" },
		{ value: "last24h", label: "24 hours" },
		{ value: "last48h", label: "48 hours" },
		{ value: "last72h", label: "72 hours" },
		{ value: "last1w", label: "1 week" },
		{ value: "last2w", label: "2 weeks" },
		{ value: "last4w", label: "4 weeks" },
	];

	const configOptions = [
		{ value: 'configsHR', label: "High Risk" },
		{ value: 'configsMR', label: "Medium Risk" },
	];

	const customStyles = {
		container: (provided, state) => ({
			...provided,
			fontSize: "1.8rem",
			fontFamily: "var(--fira)",
			width: "180px",
		}),
		indicatorSeparator: (provided, state) => ({
			display: "none",
		}),
		dropdownIndicator: (provided, state) => ({
			...provided,
			color: state.isSelected ? "var(--ocean-accent)" : "var(--ocean-light)",
		}),
		control: (provided, state) => ({
			...provided,
			backgroundColor: "var(--ocean-semi-dark)",
			border: "none",
		}),
		menu: (provided, state) => ({
			...provided,
			backgroundColor: "var(--ocean-semi-dark)",
		}),
		option: (provided, state) => ({
			...provided,
			color: "var(--ocean-light)",
		}),
		singleValue: (provided, state) => ({
			...provided,
			color: "var(--ocean-light)",
		}),
		placeholder: (provided, state) => ({
			...provided,
			color: "var(--ocean-light)",
		}),
	};

	const settingsForms = intervals.map((interval) => {
		return (
			<form id={interval} key={interval} className="backtest-settings__form">
				<div className="backtest-settings__form-item">
					<Checkbox
						text={interval}
						onClick={() =>
							setSettings((prevState) => ({
								...prevState,
								[interval]: {
									...prevState[interval],
									active: !prevState[interval]["active"],
								},
							}))
						}
					/>
				</div>
				<div className="backtest-settings__form-item">
					<BasicSelect
						options={rangeOptions}
						defaultValue={settings[interval]["range"]}
						minWidth={120}
						onChange={(e) =>
							setSettings((prevState) => ({
								...prevState,
								[interval]: {
									...prevState[interval],
									range: e.value,
								},
							}))
						}
					/>
				</div>
				<div className="backtest-settings__form-item">
					<BasicSelect
						options={configOptions}
						defaultValue={settings[interval]["configs"]}
						minWidth={120}
						onChange={(e) =>
							setSettings((prevState) => ({
								...prevState,
								[interval]: {
									...prevState[interval],
									configs: e.value,
								},
							}))
						}
					/>
				</div>
				{/* <div className="backtest-settings__form-item">
					<Input
						id="max-bars"
						name=""
						type="number"
						defValue={settings[interval]["maxBars"]}
						minValue={0}
						maxValue={1000}
						step={1}
						maxLength={4}
						onChange={(e) =>
							setSettings((prevState) => ({
								...prevState,
								[interval]: {
									...prevState[interval],
									maxBars: +e.target.value,
								},
							}))
						}
					/>
				</div> */}
			</form>
		);
	});

	return (
		<>
			<div className="backtest-settings">
				<div className="backtest-settings__labels">
					<div className="backtest-settings__labels-item">Interval</div>
					<div className="backtest-settings__labels-item">Range</div>
					<div className="backtest-settings__labels-item">Configs</div>
					<div className="backtest-settings__labels-item">Max bars</div>
				</div>
				{settingsForms}
			</div>
			<SecondaryButton
				type="button"
				className="time-settings__button"
				onClick={() => {
					backtestService(
						0,
						getSettigns(),
						["L", "C", "OC"],
						20,
						5,
						50,
						0,
						-10
					);
				}}
				text="startBacktest()"
			/>
		</>
	);
}

export default Backtest;
