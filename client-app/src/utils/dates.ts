import moment from "moment"

const FORMAT_STRING = "MMMM Do, Y";

export const defaultFormat = (date: Date): string => {
	return moment(date).format(FORMAT_STRING);
}