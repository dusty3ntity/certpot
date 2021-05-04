import React, { useEffect } from "react";

import { APP_TITLE } from "../../constants/app";

interface PageTitleProps {
	title?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
	useEffect(() => {
		const pageTitle = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
		document.title = pageTitle;
	}, [title]);

	return null;
};
