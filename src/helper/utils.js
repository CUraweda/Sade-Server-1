const formatDateForSQL = (date) => {
	const pad = (num) => (num < 10 ? '0' + num : num);

	return (
		date.getFullYear() +
		'-' +
		pad(date.getMonth() + 1) +
		'-' +
		pad(date.getDate()) +
		' ' +
		pad(date.getHours()) +
		':' +
		pad(date.getMinutes()) +
		':' +
		pad(date.getSeconds())
	);
};

module.exports = {
	formatDateForSQL
}