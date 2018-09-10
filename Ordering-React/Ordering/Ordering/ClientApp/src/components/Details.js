import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

export class Details extends Component {
    displayName = Details.name;

    constructor(props) {
        super(props);
        this.state = { orderData: null, loading: true };

        this.fetchData = this.fetchData.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);

        this.fetchData();
    }

    fetchData() {
        fetch(`api/Order/${this.props.id}`)
            .then(response => response.json())
            .then(data => {
                this.setState({ orderData: data, loading: false });
            })
            .catch(e => console.error(e));
    }

    deleteOrder(event) {
        event.preventDefault();

        fetch(`api/Order/Delete/${this.props.id}`, {
            method: "DELETE"
        }).then(response => {
            this.props.refreshParent();
            return response;
        }).catch(e => {
            console.error(e);
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.id !== prevProps.id) {
            this.fetchData();
        }
    }

    componentWillUnmount() {
        this.setState({ orderData: null, loading: true });
    }

    renderDetails(orderData) {
        return (
            <Col xs={12}>
                <h2>Order for {orderData.customer.name}</h2>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderData.orderDetails.map(od =>
                            <tr key={od.id}>
                                <td>{od.product.productCode} - {od.product.description}</td>
                                <td>{od.quantity}</td>
                                <td>€ {od.product.price}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <h4>Total: € {orderData.total.toFixed(2)}</h4>
                {this.props.toDelete &&
                    <div className="alert alert-danger text-center">
                        <p>Are you sure you want to delete this order?</p>
                        <button className="btn btn-danger" onClick={this.deleteOrder}>Delete</button>
                    </div>
                }
            </Col>
        );
    }

    render() {
        let contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderDetails(this.state.orderData);

        return (
            <Row>
                 {contents}
            </Row>
        );
    }
}
