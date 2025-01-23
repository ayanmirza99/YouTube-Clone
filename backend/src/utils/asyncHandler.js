export const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    new Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(err)
    );
  };
};
