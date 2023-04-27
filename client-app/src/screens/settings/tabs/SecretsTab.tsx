import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

import { ITabProps } from "../../../models";
import { Button, createConfirmationModal, DeleteIcon, EditIcon, Empty, LoadingScreen } from "../../../components";
import { createUnknownError, defaultFormatWithTime } from "../../../utils";
import { useAppDispatch } from "../../../store";
import { RootStateType } from "../../../models/rootReducer";
import { deleteSecret, fetchSecrets } from "../../../models/user/userSlice";
import { NewSecretModal } from "./NewSecretModal";
import { EditSecretModal } from "./EditSecretModal";

export const SecretsTab: React.FC<ITabProps> = () => {
	const dispatch = useAppDispatch();
	const [newSecretModalVisible, setNewSecretModalVisible] = useState(false);
	const [editSecretId, setEditSecretId] = useState<string | null>(null);

	const { secrets, loadingSecrets, editingSecret, editingSecretId, deletingSecret, deletingSecretId } = useSelector(
		(state: RootStateType) => state.user
	);

	useEffect(() => {
		dispatch(fetchSecrets())
			.then(unwrapResult)
			.catch((err) => {
				createUnknownError(err, "[secretsTab]~fetchSecrets");
			});
	}, [dispatch]);

	if (loadingSecrets === "idle" || loadingSecrets === "pending") {
		return <LoadingScreen size={2} />;
	}

	const handleDeleteClick = (id: string) => {
		const onOk = () => {
			dispatch(deleteSecret(id))
				.then(unwrapResult)
				.catch((err) => createUnknownError(err, "[secretsTab]~deleteSecret"));
		};

		const modalContent = <span>Are you sure you want to delete this secret?</span>;

		createConfirmationModal(modalContent, "Delete", onOk);
	};

	return (
		<div className="secrets-tab tab-content">
			<div className="secrets-container">
				{secrets!.map((secret) => (
					<div className="secret-container" key={secret.id}>
						<span className="secret-name">{secret.name}</span>
						<span className="updated-on">Updated on {defaultFormatWithTime(secret.lastEditDate)}</span>

						<div className="actions-container">
							<Button
								className="update-btn"
								icon={<EditIcon />}
								onClick={() => setEditSecretId(secret.id)}
								loading={editingSecret && editingSecretId === secret.id}
							/>
							<Button
								className="remove-btn"
								icon={<DeleteIcon />}
								onClick={() => handleDeleteClick(secret.id)}
								loading={deletingSecret && deletingSecretId === secret.id}
							/>
						</div>
					</div>
				))}

				{!secrets!.length && <Empty />}
			</div>

			<div className="new-secret-container">
				<Button className="new-secret-btn" text="New secret" onClick={() => setNewSecretModalVisible(true)} />
			</div>

			{newSecretModalVisible && (
				<NewSecretModal onCancel={() => setNewSecretModalVisible(false)} onOk={() => setNewSecretModalVisible(false)} />
			)}
			{editSecretId && (
				<EditSecretModal onCancel={() => setEditSecretId(null)} onOk={() => setEditSecretId(null)} id={editSecretId} />
			)}
		</div>
	);
};
