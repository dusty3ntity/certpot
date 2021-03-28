import React, { ReactElement } from "react";

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

export interface IConcreteModalProps extends IComponentProps {
	onOk: () => void;
	onCancel: () => void;
	content?: ReactElement;
	okText?: string;
}
