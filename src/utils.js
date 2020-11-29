function getIntVersion(version) {
    if (!/^[A-Za-z0-9]/.test(version)) {
        return parseFloat(version.slice(1));
    }
    return parseFloat(version);
}

export {getIntVersion};