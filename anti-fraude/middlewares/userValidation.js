class userValidation {
  static loginValidation = async (req, res, next) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ message: 'Some required fields are missing' });
    }
    return next();
  };
}

export default userValidation;
