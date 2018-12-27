module.exports = {
    nrSep:
        function nrSep(n) {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
}
