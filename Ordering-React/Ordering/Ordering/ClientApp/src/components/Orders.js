import React, { Component } from "react";
import { Row, Col } from 'react-bootstrap';

import { Details } from "./Details";
import { Edit } from "./Edit";

export class Orders extends Component {
    displayName = Orders.name;

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            selectedOrder: null,

            isEdit: false,
            isCreate: false,

            isDetails: false,
            isDelete: false,

            loading: true
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleCreate = this.handleCreate.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.renderOrderList = this.renderOrderList.bind(this);
        this.fetchData = this.fetchData.bind(this);

        this.fetchData();
    }

    fetchData(selectedOrder = null) {
        fetch('api/Order/GetOrders')
            .then(response => response.json())
            .then(data => {
                // use old value for selectedOrder unless a new value is passed to this method
                if (selectedOrder === null) {
                    selectedOrder = this.state.selectedOrder;
                }

                // isDelete, isDetails en isCreate naar false in geval dat een order delete wordt
                // Order aanpassen triggered deze functie ook, maar in dat geval is isDelete en isDetails al false
                // Als een nieuw order wordt aangemaakt voeren we deze functie ook uit, door de state verandering zien we dan de edit page
                this.setState({ orders: data, selectedOrder, loading: false, isDelete: false, isDetails: false, isCreate: false });
            })
            .catch(e => console.error(e));
    }

    // Button event handlers
    handleEdit(id) {
        this.setState({
            isEdit: true,
            isCreate: false,
            isDetails: false,
            isDelete: false,
            selectedOrder: id
        });
    }

    handleCreate() {
        this.setState({
            isEdit: true,
            isCreate: true,
            isDetails: false,
            isDelete: false,
            selectedOrder: 0
        });
    }

    handleDetails(id) {
        this.setState({
            isEdit: false,
            isCreate: false,
            isDetails: true,
            isDelete: false,
            selectedOrder: id
        });
    }

    handleDelete(id) {
        this.setState({
            isEdit: false,
            isCreate: false,
            isDetails: true,
            isDelete: true,
            selectedOrder: id
        });
    }

    // Render table holding Orders
    renderOrderList(orders) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th className="col-md-4">Customer</th>
                        <th className="col-md-4">Total</th>
                        <th className="col-md-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order =>
                        <tr key={order.id}>
                            <td>{order.customer.name}</td>
                            <td>€ {order.total.toFixed(2)}</td>
                            <td>
                                <button className="btn btn-default" onClick={() => this.handleDetails(order.id)}>
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                    <span className="hidden-xs">&nbsp;Details</span>
                                </button>
                                &nbsp;
                                <button className="btn btn-primary" onClick={() => this.handleEdit(order.id)}>
                                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                    <span className="hidden-xs">&nbsp;Edit</span>
                                </button>
                                &nbsp;
                                <button className="btn btn-danger" onClick={() => this.handleDelete(order.id)}>
                                    <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                                    <span className="hidden-xs">&nbsp;Delete</span>
                                </button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
    
    render() {
        const contents = this.state.loading ? <p><em>Loading...</em></p> : this.renderOrderList(this.state.orders);

        return (
            <Row>
                <Col sm={12}>
                    <h1>Orders</h1>
                    <hr />
                </Col>
                <Col sm={12}>
                    {contents}
                    {!this.state.loading &&
                        <button className="btn btn-success" onClick={this.handleCreate}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            <span>&nbsp;Add New Order</span>
                        </button>
                    }
                    {this.state.isDetails &&
                        <Details id={this.state.selectedOrder} toDelete={this.state.isDelete} refreshParent={this.fetchData} />
                    }
                    {this.state.isEdit &&
                        <Edit id={this.state.selectedOrder} refreshParent={this.fetchData} />
                    }
                </Col>
            </Row>
        );
    }
}
