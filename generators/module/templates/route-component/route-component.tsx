import React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
interface <%= componentName %>Props {
    test?: string;
}
const <%= componentName %> = ({history}: RouteComponentProps, props: <%= componentName %>Props) => {
    return <h1>Hello, <%= componentName %></h1>;
}


export default withRouter(<%= componentName %>);

