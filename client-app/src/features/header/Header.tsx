import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";

import { Button, LogoIcon, UserIcon } from "../../components";
import { RootStateType } from "../../models/rootReducer";
import { history } from "../../config/history";
import { logout } from "../../models/user/userSlice";

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
	const dispatch = useDispatch();
	const { user } = useSelector((state: RootStateType) => state.user);

	const handleLogout = () => {
		dispatch(logout());
		history.push("/");
	};

	return (
		<div className="header">
			<Link className="logo" to="/">
				<LogoIcon className="logo-icon" />
				<h1 className="logo-text">Certpot</h1>
			</Link>

			{user && (
				<div className="nav">
					{navElements.map((item) => (
						<NavLink to={item.url} key={item.id} exact>
							<span className="nav-item" id={item.id}>
								{item.label}
							</span>
						</NavLink>
					))}
				</div>
			)}

			<div className="user-area">
				{user && (
					<>
						<UserIcon />
						<span className="name">{user.displayName}</span>
						<span className="divider" />
						<Button text="Log out" className="logout-btn" onClick={handleLogout} />
					</>
				)}
				{!user && (
					<>
						<Link to="/login" className="link">
							Log in
						</Link>
						<span className="divider" />
						<Link to="/register" className="link">
							Register
						</Link>
					</>
				)}
			</div>
		</div>
	);
};
