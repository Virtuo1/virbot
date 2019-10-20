module.exports = {
    nrSep:
        function nrSep(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
    queryResult:
        function queryResult(queryRes, rowName, isString) {
            let result = JSON.stringify(queryRes.rows);
            if (isString == false) {
                return prefix = result.slice(rowName.length + 5, result.length - 2);
            } else {
                return prefix = result.slice(rowName.length + 6, result.length - 3);
            }
        }
}
