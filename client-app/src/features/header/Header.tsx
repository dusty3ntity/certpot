import React from "react";
import { Link, NavLink } from "react-router-dom";

import { LogoIcon } from "../../components";

interface INavProps {
	id: string;
	label: string;
	url: string;
}

const navElements: INavProps[] = [
	{
		id: "monitors",
		label: "Monitors",
		url: "/monitors",
	},
	{
		id: "settings",
		label: "Settings",
		url: "/settings",
	},
];

export const Header: React.FC = () => {
	return (
		<div className="header">
			<Link className="logo" to="/">
				<LogoIcon className="logo-icon" />
				<h1 className="logo-text">Certpot</h1>
			</Link>

			<div className="nav">
				{navElements.map((item) => (
					<NavLink to={item.url} key={item.id} exact>
						<span className="nav-item" id={item.id}>
							{item.label}
						</span>
					</NavLink>
				))}
			</div>
		</div>
	);
};
