import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { Page } from "../../components";
import { PageTitle } from "../../features";

export const NotFoundPage: React.FC = () => {
	useEffect(() => {
		console.log('kek')
	}, [])

	return (
		<>
			<PageTitle title="Not Found" />

			<Page id="not-found-page">
				<div className="error-code">404</div>

				<div className="content">
					<div className="title">Nothing here...</div>

					<Link to="/monitors" className="btn">
						Go to monitors list
					</Link>
				</div>
			</Page>
		</>
	);
};
