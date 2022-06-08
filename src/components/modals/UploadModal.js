import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Card, Modal, Button, ListGroup } from "react-bootstrap";

import { useUpload } from "../context/UploadContext";

const UploadModal = (props) => {
  const upload = useUpload();
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = (acceptedFiles) => {
    for (let file of acceptedFiles) {
      file.uploadPath = props.filePath;
      upload.addToQueue(file);
    }
    props.handleFinish();
  };

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  useEffect(() => {
    if (props.isAlreadyDragging) {
      setIsDragging(true);
    }
  }, [props.isAlreadyDragging]);

  return (
    <>
      <Modal show={props.show} onHide={props.handleClose} backdrop={true}>
        <div className="cloud-files-backzone" {...getRootProps()}></div>
        <Modal.Header closeButton>
          <Modal.Title>Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card {...getRootProps()}>
            <input {...getInputProps()} />
            <Card.Body className="text-center">
              <Card.Text>
                {isDragging
                  ? "Drop the files ..."
                  : "Drag 'n' drop some files here ..."}
              </Card.Text>
              <Button variant="primary" onClick={open}>
                ... or Search for files
              </Button>
            </Card.Body>
          </Card>
          {upload.uploadQueue.current.length > 0 ? (
            <>
              <br />
              <Card>
                <Card.Header>
                  <Card.Title>Queue</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ListGroup as="ol" numbered>
                    {upload.uploadQueue.current.map((file, index) => (
                      <ListGroup.Item as="li" key={index}>
                        {file.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UploadModal;
