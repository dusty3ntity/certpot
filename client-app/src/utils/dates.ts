import moment from "moment";

const FORMAT_STRING = "MMMM Do, Y";
const FORMAT_STRING_WITH_TIME = "MMMM Do, Y, HH:mm";

export const defaultFormat = (date: Date): string => {
	return moment(date).format(FORMAT_STRING);
};

export const defaultFormatWithTime = (date: Date): string => {
	return moment(date).format(FORMAT_STRING_WITH_TIME);
};

export const getErrorDate = () => {
	return moment().format("dddd, MMMM Do, Y HH:mm Z");
};
