import React from "react";
import useHeaderShow from "@store/app/appLayout";

function MainHeader() {
  const { data } = useHeaderShow();

  return (
    <div className={data ? 'hidden' : ''}>
    </div>
  );
}

export default MainHeader;
