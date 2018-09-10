import React, { PureComponent } from "react";
import { FormControl } from "react-bootstrap";

// functional component
export class CustomerList extends PureComponent {
    render() {
        return (
            <FormControl componentClass="select" value={this.props.customerId} onChange={this.props.handler}>
                {this.props.customers.map(c =>
                    <option key={c.id} value={c.id}>{c.name}</option>    
                )}
            </FormControl>
        );
    }
}