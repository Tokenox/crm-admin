import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';

const DynamicLead = () => {
  return (
    <Fragment>
      <Helmet>
        <title> Dynamic Leads | Minimal UI </title>
      </Helmet>
      <div>
        <h1>Dynamic Lead</h1>
      </div>
    </Fragment>
  );
};

export default DynamicLead;
