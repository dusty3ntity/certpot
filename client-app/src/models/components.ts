import React from "react";

export interface IComponentProps {
	id?: string;
	className?: string;
}

export interface ITabConfig {
	id: number;
	name: string;
	icon: React.ComponentType;
	component: React.ComponentType;
}
