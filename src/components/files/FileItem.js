import { useEffect, useState } from "react";
import TimeAgo from 'javascript-time-ago'

import { DropdownButton, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faFolder,
  faFolderOpen,
  faDownload,
  faTrashCan,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const FileItem = (props) => {
  const [modified, setModified] = useState("");

  const handleClick = () => {
    props.handleClick(props.file);
  };

  const handleDelete = () => {
    props.handleDelete(props.file);
  };

  const handleDownload = () => {
    props.handleDownload(props.file);
  };

  let faIcon = faFile;
  if (props.file.Type === "dir") {
    faIcon = faFolder;
  } else if (props.file.Type === "up") {
    faIcon = faChevronUp;
  }

  let action = "cursor-na";
  if (props.file.Type === "dir") {
    action = "cursor-pointer";
  } else if (props.file.Type === "up") {
    action = "cursor-pointer";
  }

  const timeAgo = new TimeAgo('en-US');
  useEffect(() => {
    if(props.file.Type === "up") {
      setModified("");
      return;
    }
    setModified(timeAgo.format(new Date(props.file.Modified * 1000)));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.file.Modified]);

  return (
    <tr>
      <td className="cloud-files-table-2"></td>
      <td onClick={handleClick} className={"cloud-files-table-2 text-center " + action}>
        <FontAwesomeIcon icon={faIcon} fixedWidth />
      </td>
      <td onClick={handleClick} className={"cloud-files-table-60 " + action}>{props.file.Name}</td>
      <td className="cloud-files-table-6 text-end">
        <DropdownButton align="end" size="sm" title="">
          {props.file.Type === "dir" || props.file.Type === "up" ? (
            <Dropdown.Item onClick={handleClick}>
              <FontAwesomeIcon icon={faFolderOpen} fixedWidth /> Open
            </Dropdown.Item>
          ) : null}
          {props.file.Type === "file" || props.file.Type === "dir" ? (
            <Dropdown.Item
              onClick={handleDelete}
              className="cloud-dropdown-danger"
            >
              <FontAwesomeIcon icon={faTrashCan} fixedWidth /> Delete
            </Dropdown.Item>
          ) : null}
          {props.file.Type === "file" ? (
            <Dropdown.Item onClick={handleDownload}>
              <FontAwesomeIcon icon={faDownload} fixedWidth /> Download
            </Dropdown.Item>
          ) : null}
        </DropdownButton>
      </td>
      <td className="cloud-files-table-15 cursor-default">{props.file.Size}</td>
      <td className="cloud-files-table-15 cursor-default cloud-files-not-needed">{modified}</td>
    </tr>
  );
};

export default FileItem;