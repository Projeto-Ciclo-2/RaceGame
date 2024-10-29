const usernameValid = (name: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]*$/;
    const valid = regex.test(name)
    return valid;
}

export default usernameValid
