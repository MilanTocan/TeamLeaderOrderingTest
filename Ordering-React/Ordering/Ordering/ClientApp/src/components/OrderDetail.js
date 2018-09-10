import React, { Component } from "react";
import { FormControl, FormGroup, Col, ControlLabel } from "react-bootstrap";

// functional component
// NOT a pure component since the shallow comparison doesn't work since we're passing a complex model
export class OrderDetail extends Component {
    render() {
        return (
            <FormGroup controlId={"orderDetail" + this.props.index} validationState={this.props.validateState(this.props.index)}>
                <Col componentClass={ControlLabel} sm={2}>
                    Order nr {this.props.index + 1}
                </Col>
                <Col sm={3}>
                    <FormControl componentClass="select" value={this.props.orderDetail.productId} onChange={this.props.handleProduct} data-index={this.props.index}>
                        {this.props.products.map(p =>
                            <option key={this.props.orderDetail.id + "_" + p.id} value={p.id}>{p.productCode} - {p.description}</option>
                        )}
                    </FormControl>
                </Col>
                <Col componentClass={ControlLabel} sm={1}>
                    Quantity
                </Col>
                <Col sm={2}>
                    <FormControl type="number" min="1" value={this.props.orderDetail.quantity} onChange={this.props.handleQuantity} data-index={this.props.index} />
                </Col>
                <Col componentClass={ControlLabel} sm={2}>
                    Unit Price: € {this.props.orderDetail.product.price}
                </Col>
                <Col sm={1} className="center-block">
                    <button className="btn btn-danger center-block" onClick={this.props.remove} data-index={this.props.index}>
                        Remove
                    </button>
                </Col>
            </FormGroup>
        );
    }
}
