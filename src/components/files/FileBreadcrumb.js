import { useEffect, useState } from "react";
import path from "path-browserify";

import { Breadcrumb } from "react-bootstrap";

const FileBreadcrumb = (props) => {
  const [breadcrumbs, setBreadcrumbs] = useState(["Home"]);

  useEffect(() => {
    let tmp = path.join("Home", props.filePath).split(path.sep);
    if (tmp[tmp.length - 1] === "") {
      tmp.pop();
    }
    setBreadcrumbs(tmp);
  }, [props.filePath]);

  return (
    <Breadcrumb className="cloud-files-breadcrumb">
      {breadcrumbs.map((item, index) => {
        if (index === breadcrumbs.length - 1) {
          return (
            <Breadcrumb.Item key={index} linkAs="span" active>
              {item}
            </Breadcrumb.Item>
          );
        } else {
          return (
            <Breadcrumb.Item key={index} linkAs="span">
              {item}
            </Breadcrumb.Item>
          );
        }
      })}
    </Breadcrumb>
  );
};

export default FileBreadcrumb;
