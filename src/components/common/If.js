const If = ({ children, condition }) => {
  return condition ? children : null;
};

export default If;
