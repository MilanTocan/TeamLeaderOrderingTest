import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';

export class Layout extends Component {
  displayName = Layout.name

  render() {
    return (
        <Grid>
            {this.props.children}
        </Grid>
    );
  }
}
