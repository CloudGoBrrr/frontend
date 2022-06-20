import { Spinner } from "react-bootstrap";

const Loader = (props) => {
  return (
    <>
      {!props.isLoading ? (
        props.text
      ) : (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          <span>Loading...</span>
        </>
      )}
    </>
  );
};

export default Loader;
